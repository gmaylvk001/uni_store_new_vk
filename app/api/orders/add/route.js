import { createOrderFromPayload } from "@/lib/create-order-from-payload";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createOrderFromPayload(body);

    return Response.json(
      {
        success: true,
        message: result.created ? "Order added successfully" : "Order already exists",
        order: result.order,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    const message = error.message || "Server error";
    const status =
      message.includes("Guest") || message.includes("Invalid") || message.includes("Missing")
        ? 400
        : message.includes("expired")
        ? 401
        : 500;

    return Response.json(
      { success: false, message, error: message },
      { status }
    );
  }
}
