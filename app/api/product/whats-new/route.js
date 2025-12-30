import { NextResponse } from "next/server";
import Product from '@/models/product';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({ status: "Active" })
      .sort({ createdAt: -1 })
      .limit(12)
      .select({
        name: 1,
        slug: 1,
        price: 1,
        special_price: 1,
        images: 1,
        createdAt: 1,
        brand: 1,
        stock_status: 1,
        quantity: 1,
      })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("WHAT'S NEW API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
