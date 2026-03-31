import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import EcomOrderInfo from "@/models/ecom_order_info";
import Payment from "@/models/ecom_payment_info";
import { formatPayuAmount, generatePayuRequestHash } from "@/lib/payu";

function sanitizeEnvUrl(value, fallback = "") {
  return String(value || fallback)
    .split(/\s+#/)[0]
    .trim()
    .replace(/\/+$/, "");
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function maskValue(value) {
  const text = String(value || "");
  if (text.length <= 4) return text;
  return `${text.slice(0, 2)}***${text.slice(-2)}`;
}

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
    const orderId = body.order_id;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await EcomOrderInfo.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (String(order.user_id) !== String(userId)) {
      return NextResponse.json({ error: "Unauthorized order access" }, { status: 403 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
    }

    const key = process.env.NEXT_PUBLIC_PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const baseUrl = sanitizeEnvUrl(process.env.PAYU_BASE_URL, "https://test.payu.in");
    const appBaseUrl = sanitizeEnvUrl(process.env.NEXT_PUBLIC_API_URL, req.nextUrl.origin);

    console.info("[PayU order session]", {
      orderId,
      orderNumber: order.order_number,
      key: maskValue(key),
      baseUrl,
      appBaseUrl,
    });

    if (!key || !salt) {
      return NextResponse.json(
        { error: "PayU credentials are not configured" },
        { status: 500 }
      );
    }

    const callbackUrl = new URL(appBaseUrl);
    const isLocalhost =
      callbackUrl.hostname === "localhost" ||
      callbackUrl.hostname === "127.0.0.1";

    if (callbackUrl.protocol !== "https:" || isLocalhost) {
      return NextResponse.json(
        {
          error: `PayU requires a public HTTPS callback URL. Current callback base: ${appBaseUrl}`,
        },
        { status: 400 }
      );
    }

    const transactionId = `PAYU_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const productinfo =
      order.order_item?.length === 1
        ? order.order_item[0]?.name || order.order_item[0]?.product_name || `Order ${order.order_number}`
        : `Order ${order.order_number} (${order.order_item?.length || 0} items)`;

    const payment = new Payment({
      userId: order.user_id,
      modevalue: String(order.order_amount),
      payment_id: transactionId,
      payment_Date: new Date().toISOString(),
      payment_mode: "payu",
      status: "pending",
      order_id: order._id.toString(),
      checkout_payload: {
        order_number: order.order_number,
        email_address: order.email_address,
        order_username: order.order_username,
      },
    });

    await payment.save();

    order.payment_id = payment._id.toString();
    order.payment_method = "PayU";
    order.payment_type = "payu";
    order.payment_status = "pending";
    if (order.order_status !== "cancelled" && order.order_status !== "shipped") {
      order.order_status = "Order Placed";
    }
    order.api_status = "pending";
    order.api_reason = "";
    await order.save();

    const [firstname, ...restName] = String(order.order_username || "").split(" ");
    const lastname = restName.join(" ");
    const normalizedAmount = formatPayuAmount(order.order_amount);
    const normalizedFirstname = sanitizeText(firstname || order.order_username || "Customer", 60);
    const normalizedLastname = sanitizeText(lastname, 20);
    const normalizedEmail = sanitizeText(order.email_address, 50);
    const normalizedPhone = String(order.order_phonenumber || "").replace(/\D/g, "").slice(0, 10);
    const normalizedProductInfo = sanitizeText(productinfo, 100);

    const fields = {
      key,
      txnid: transactionId,
      amount: normalizedAmount,
      productinfo: normalizedProductInfo,
      firstname: normalizedFirstname,
      lastname: normalizedLastname,
      email: normalizedEmail,
      phone: normalizedPhone,
      surl: `${appBaseUrl}/api/payu/callback`,
      furl: `${appBaseUrl}/api/payu/callback`,
      udf1: order.order_number,
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
    };

    const hash = generatePayuRequestHash({
      ...fields,
      salt,
    });

    return NextResponse.json({
      payuUrl: `${baseUrl}/_payment`,
      fields: {
        ...fields,
        hash,
      },
      order: {
        _id: order._id,
        order_number: order.order_number,
      },
    });
  } catch (error) {
    const message = error.message || "Failed to initialize payment session";
    const status = message.includes("Authorization") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
