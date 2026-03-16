
import connectDB from "@/lib/db";
import Store from "@/models/LgStoreSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const stores = await Store.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: stores,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}