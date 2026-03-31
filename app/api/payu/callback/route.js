import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payment from "@/models/ecom_payment_info";
import EcomOrderInfo from "@/models/ecom_order_info";
import { verifyPayuResponseHash } from "@/lib/payu";
import { createOrderFromPayload } from "@/lib/create-order-from-payload";

export async function POST(req) {
  const appBaseUrl = process.env.NEXT_PUBLIC_API_URL || req.nextUrl.origin;
  const redirectUrl = new URL("/checkout/payu-status", appBaseUrl);

  try {
    const salt = process.env.PAYU_SALT;
    const formData = await req.formData();
    const response = Object.fromEntries(formData.entries());

    const orderNumber = String(response.udf1 || "");
    const txnid = String(response.txnid || "");
    const mihpayid = String(response.mihpayid || "");
    const status = String(response.status || "").toLowerCase();
    const payuMessage = String(
      response.error_Message ||
      response.error ||
      response.unmappedstatus ||
      response.unmappedStatus ||
      response.field9 ||
      response.message ||
      ""
    ).trim();
    const unmappedStatus = String(
      response.unmappedstatus || response.unmappedStatus || ""
    ).trim();
    const hashVerified = salt ? verifyPayuResponseHash(response, salt) : false;
    const isSuccess = hashVerified && status === "success";

    console.info("[PayU callback]", {
      txnid,
      orderNumber,
      mihpayid,
      status,
      unmappedStatus,
      payuMessage,
      hashVerified,
    });

    redirectUrl.searchParams.set("status", isSuccess ? "success" : "failed");
    if (orderNumber) redirectUrl.searchParams.set("order_number", orderNumber);
    if (mihpayid) redirectUrl.searchParams.set("payu_id", mihpayid);
    if (status) redirectUrl.searchParams.set("payu_status", status);
    if (unmappedStatus) redirectUrl.searchParams.set("unmapped_status", unmappedStatus);
    if (payuMessage) redirectUrl.searchParams.set("reason", payuMessage);
    if (!hashVerified) redirectUrl.searchParams.set("reason", "hash_mismatch");

    await connectDB();

    const payment = txnid ? await Payment.findOne({ payment_id: txnid }) : null;
    if (payment) {
      payment.status = isSuccess ? "paid" : "failed";
      payment.payment_mode = "payu";
      payment.payment_Date = new Date().toISOString();
      await payment.save();
    }

    let order = payment
      ? payment.order_id
        ? await EcomOrderInfo.findById(payment.order_id)
        : await EcomOrderInfo.findOne({ payment_id: payment._id.toString() })
      : orderNumber
      ? await EcomOrderInfo.findOne({ order_number: orderNumber })
      : null;

    if (isSuccess && payment?.checkout_payload && !order) {
      const payload = {
        ...payment.checkout_payload,
        payment_id: payment._id.toString(),
        payment_method: "PayU",
        payment_type: "payu",
        payment_status: "paid",
        order_status: "Order Placed",
        order_number: payment.checkout_payload.order_number || orderNumber,
      };

      const result = await createOrderFromPayload(payload);
      order = result.order;
      payment.order_id = order._id.toString();
      await payment.save();
    }

    if (order) {
      order.payment_method = "PayU";
      order.payment_type = "payu";
      order.payment_id = payment?._id?.toString() || order.payment_id;
      order.payment_status = isSuccess ? "paid" : "failed";
      order.order_status = isSuccess ? "Order Placed" : "Payment Failed";
      order.api_status = status || "";
      order.api_reason = isSuccess ? "" : (payuMessage || unmappedStatus || "Payment failed");
      await order.save();
    }

    if (order && isSuccess) {
      try {
        await fetch(`${appBaseUrl}/api/send-order-detail-to-sap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: order.order_number }),
        });
      } catch (sapError) {
        console.error("PayU SAP sync failed:", sapError);
      }
    }

    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set("status", "failed");
    redirectUrl.searchParams.set("reason", error.message || "callback_error");
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
