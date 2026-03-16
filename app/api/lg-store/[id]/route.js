import connectDB from "@/lib/db";
import Store from "@/models/LgStoreSchema";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const store = await Store.findById(id);

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: store,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}