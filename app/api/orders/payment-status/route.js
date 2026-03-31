import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import EcomOrderInfo from "@/models/ecom_order_info";

function extractUserId(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("Authorization token required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.userId;
}

export async function POST(req) {
  try {
    const userId = extractUserId(req);
    const body = await req.json();
    const { order_id, payment_status, order_status, payment_id, api_reason, api_status } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await dbConnect();

    const order = await EcomOrderInfo.findById(order_id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (String(order.user_id) !== String(userId)) {
      return NextResponse.json({ error: "Unauthorized order access" }, { status: 403 });
    }

    if (payment_status) order.payment_status = payment_status;
    if (order_status) order.order_status = order_status;
    if (payment_id) order.payment_id = payment_id;
    if (typeof api_reason === "string") order.api_reason = api_reason;
    if (typeof api_status === "string") order.api_status = api_status;

    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    const message = error.message || "Failed to update payment status";
    const status = message.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
