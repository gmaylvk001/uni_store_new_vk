
import connectDB from "@/lib/db";
import Store from "@/models/LgStoreSchema";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    const { id } = await req.json();

    await Store.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Store deleted",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}