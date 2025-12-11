import "server-only";

import { NextRequest, NextResponse } from "next/server";
import Cloudinary from "../../_lib/cloudinary";
import Menu from "./model";
import { connectDB } from "../../_lib/db";

export async function AddMenuItem(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.formData();
    // Logic to add menu item to the database
    const logo = body.get("logo") as File;
    const logoUrl = logo ? [await Cloudinary.uploadMultiple([logo])] : [];

    const images = body.getAll("images") as File[];
    const imagesUrls = images.length
      ? await Cloudinary.uploadMultiple(images)
      : [];

    console.log("Uploaded image URLs:", imagesUrls);
    const menuItem = {
      name: body.get("name") as string,
      logoUrl: logoUrl[0],
      description: body.get("description") as string,
      adresses: body.getAll("adresses") as string[],
      images: imagesUrls,
      tags: body.getAll("tags") as string[],
      // embbeddings: body.getAll("embbeddings") as number[][],
    };

    console.log(menuItem);
    const mongoMenuItem = new Menu(menuItem);
    await mongoMenuItem.save();
    // await menuItem.save();
    console.log("Menu item saved:", mongoMenuItem);

    return NextResponse.json(
      { message: "Menu item added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding menu item:", error);
    return NextResponse.json(
      { message: "Error adding menu item", error: error },
      { status: 500 }
    );
  }
}
