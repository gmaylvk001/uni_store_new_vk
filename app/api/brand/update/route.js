import dbConnect from "@/lib/db";
import Brand from "@/models/ecom_brand_info";
import { NextResponse } from "next/server";
import path from "path";
import { mkdir, unlink } from "fs/promises";
import sharp from "sharp";
// app/api/brand/route.js
export async function PUT(req) {
  try {
    await dbConnect();
    
    const formData = await req.formData();
    const id = formData.get("id");
    const brand_name = formData.get("brand_name");
    const status = formData.get("status");
    const image = formData.get("image");
    const existingImage = formData.get("existingImage");

    // Validate required fields
    if (!id || !brand_name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the existing brand
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    // Handle image upload
    let imagePath = existingBrand.image;
    if (image && image.name) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "Brands");

      // Delete old image if it exists
      if (existingImage) {
        try {
          const normalizedExistingImage = existingImage
            .replace(/^\/+/, "")
            .replace(/^uploads[\\/]+Brands[\\/]+/i, "")
            .replace(/^uploads[\\/]+brands[\\/]+/i, "");
          const oldImagePath = path.join(uploadDir, normalizedExistingImage);
          await unlink(oldImagePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error("Error deleting old image:", err);
          }
        }
      }

      // Save new image in the same location/format used by the add route
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `brand-${Date.now()}.webp`;
      const filePath = path.join(uploadDir, fileName);

      await sharp(buffer)
        .resize({
          width: 140,
          height: 60,
          fit: "cover",
          position: "center",
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFormat("webp")
        .toFile(filePath);

      imagePath = fileName;
    }

    // Update the brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        brand_name,
        brand_slug: brand_name.toLowerCase().replace(/\s+/g, "-"),
        status,
        image: imagePath
      },
      { new: true }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Brand updated successfully",
        data: updatedBrand 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
