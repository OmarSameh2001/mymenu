import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from './model';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface JWTPayload {
  id: string;
  type: 'user' | 'admin';
}

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id.toString() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
// Generate JWT Token
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id.toString(),
      type: user.type,
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};
export const refreshAccessToken = async (req: NextRequest) => {
  try {
    await connectDB();

    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const decoded = jwt.verify(
      refreshToken,
      JWT_SECRET
    ) as { id: string };

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
    }

    const newAccessToken = generateAccessToken(user);

    return NextResponse.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Refresh token expired' },
      { status: 403 }
    );
  }
};


// Register User
export const registerUser = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email, password, name, type } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      type: 'user',
    });
    await user.save();

    // Generate token
    const token = generateAccessToken(user);

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Login User
export const loginUser = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and select password + refreshToken
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Response
    const res = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
        accessToken,
      },
      { status: 200 }
    );

    // Set refresh token as httpOnly cookie ✅
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Get All Users (Admin only)
export const getAllUsers = async (req: NextRequest) => {
  try {
    await connectDB();

    const users = await User.find().select('-password');

    return NextResponse.json(
      {
        message: 'Users fetched successfully',
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Get User by ID
export const getUserById = async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User fetched successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Update User
export const updateUser = async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const { name, email } = await req.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Change User Type (Admin only)
export const changeUserType = async (
  req: NextRequest,
  userId: string
) => {
  try {
    await connectDB();

    const { type } = await req.json();

    if (!['user', 'admin'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { type },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User type updated successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change user type error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Delete User (Admin only)
export const deleteUser = async (req: NextRequest, userId: string) => {
  try {
    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// Get Current User
export const getCurrentUser = async (req: NextRequest) => {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Current user fetched successfully',
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
