import dbConnect from "@/lib/db";
import EcomOrderInfo from "@/models/ecom_order_info";
import Product from "@/models/product";
import mongoose from "mongoose";
import Coupon from "@/models/ecom_offer_info";
import Usedcoupon from "@/models/ecom_coupon_track_info";
import jwt from "jsonwebtoken";

export async function createOrderFromPayload(body) {
  await dbConnect();

  const {
    user_id,
    order_username,
    order_phonenumber,
    order_item,
    order_amount,
    order_deliveryaddress,
    payment_method,
    payment_type,
    order_status,
    delivery_type,
    payment_id,
    order_number,
    order_details,
    payment_status,
    user_adddeliveryid,
    email_address,
    guest_checkout_token,
  } = body;

  if (!user_id || !email_address || !order_phonenumber || !order_item?.length || !order_amount) {
    throw new Error("Missing required fields");
  }

  const existingOrder = order_number
    ? await EcomOrderInfo.findOne({ order_number })
    : null;

  if (existingOrder) {
    return { order: existingOrder, created: false };
  }

  const isGuestOrder = typeof user_id === "string" && user_id.startsWith("guest:");
  if (isGuestOrder) {
    if (!guest_checkout_token) {
      throw new Error("Guest mobile verification is required");
    }

    const decoded = jwt.verify(guest_checkout_token, process.env.JWT_SECRET);
    if (decoded?.purpose !== "guest_checkout" || decoded?.mobile !== order_phonenumber) {
      throw new Error("Invalid guest checkout verification");
    }
  }

  const newOrder = new EcomOrderInfo({
    user_id,
    order_username,
    order_phonenumber,
    order_item,
    order_amount,
    order_deliveryaddress,
    payment_method,
    payment_type,
    delivery_type,
    payment_id,
    order_number,
    order_details,
    user_adddeliveryid,
    email_address,
    order_status: order_status || "pending",
    payment_status: payment_status || "unpaid",
  });

  await newOrder.save();

  for (const item of order_item) {
    if (!item.productId) continue;

    const product = await Product.findById(item.productId);
    const coupon = item.discount;

    if (coupon > 0 && mongoose.Types.ObjectId.isValid(user_id) && item.coupondetails?.[0]?._id) {
      const userObjectId = new mongoose.Types.ObjectId(user_id);
      const couponid = new mongoose.Types.ObjectId(item.coupondetails[0]._id);
      const couponTrack = new Usedcoupon({ coupon_id: couponid, user_id: userObjectId });
      await couponTrack.save();

      const updatecoupon = await Coupon.findById(couponid);
      if (updatecoupon) {
        updatecoupon.used_by += 1;
        await updatecoupon.save();
      }
    }

    if (product && product.quantity > 0) {
      product.quantity = product.quantity - item.quantity;
      await product.save();
    }
  }

  if (mongoose.Types.ObjectId.isValid(user_id)) {
    try {
      const Notification = require("@/models/Notification.js");
      const notification = new Notification({
        userId: user_id,
        message: `Order #${newOrder.order_number || newOrder._id} placed successfully!`,
        orderId: newOrder._id,
      });
      await notification.save();
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr);
    }
  }

  return { order: newOrder, created: true };
}
