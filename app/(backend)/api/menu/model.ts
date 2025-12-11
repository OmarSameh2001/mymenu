import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenu extends Document {
  name: string;
  logoUrl?: string;
  description?: string;
  adresses?: string[];
  images?: string[];
  tags?: string[];
  embbeddings?: number[][];
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    logoUrl: { type: String },
    description: { type: String },
    adresses: { type: [String], default: [] },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    embbeddings: { type: [[Number]], default: [] },
  },
  { timestamps: true }
);

const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>('Menu', menuSchema);

export default Menu;