import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from "@/lib/db";
import ecom_brand_info from "@/models/ecom_brand_info";
import Product from "@/models/product";


export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Safely cast to ObjectId if it's a valid hex string
    const isObjectId = mongoose.isValidObjectId(categoryId);
    const safeObjectId = isObjectId ? new mongoose.Types.ObjectId(categoryId) : null;

    // Flexible query to catch the category ID no matter how it's stored
    const queryConditions = [
      { sub_category_new: { $regex: categoryId, $options: 'i' } },
      { category_new: { $regex: categoryId, $options: 'i' } }
    ];

    if (safeObjectId) {
      queryConditions.push({ sub_category: safeObjectId });
      queryConditions.push({ category: safeObjectId });
    } else {
      queryConditions.push({ sub_category: categoryId });
      queryConditions.push({ category: categoryId });
    }

    // Fetch the distinct brand IDs attached to these products
    const distinctBrandIds = await Product.distinct('brand', { $or: queryConditions });

    if (!distinctBrandIds || distinctBrandIds.length === 0) {
      return NextResponse.json({ brands: [] });
    }

    // Fetch the actual Brand details using your exact model name
    const brands = await ecom_brand_info.find({ 
      _id: { $in: distinctBrandIds }
    }).select('_id brand_name');

    return NextResponse.json({ brands });

  } catch (error) {
    console.error("Error fetching brands by category:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}