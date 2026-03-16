import connectDB from "@/lib/db";
import Store from "@/models/LgStoreSchema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await Store.findByIdAndUpdate(
      body.id,
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}