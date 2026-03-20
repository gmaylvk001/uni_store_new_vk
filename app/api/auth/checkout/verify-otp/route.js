import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";
import Cart from "@/models/ecom_cart_info";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { mobile, otp, guestId } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: "Mobile and OTP are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 4 digits" }, { status: 400 });
    }

    await connectDB();

    const otpRecord = await Otp.findOne({ mobile, otp });
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      const token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      if (guestId) {
        const guestCart = await Cart.findOne({ guestId });
        let userCart = await Cart.findOne({ userId: existingUser._id });

        if (guestCart) {
          if (userCart) {
            for (const guestItem of guestCart.items) {
              const existingItem = userCart.items.find(
                (item) => item.productId.toString() === guestItem.productId.toString()
              );
              if (existingItem) {
                existingItem.quantity += guestItem.quantity;
              } else {
                userCart.items.push(guestItem);
              }
            }
            userCart.totalItems = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
            await userCart.save();
            await Cart.deleteOne({ guestId });
          } else {
            guestCart.userId = existingUser._id;
            guestCart.guestId = null;
            await guestCart.save();
          }
        }
      }

      return NextResponse.json(
        {
          message: "Login successful",
          existingUser: true,
          token,
          user: {
            userId: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            mobile: existingUser.mobile,
            role: existingUser.user_type,
          },
        },
        { status: 200 }
      );
    }

    const verificationToken = jwt.sign(
      {
        purpose: "guest_checkout",
        mobile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return NextResponse.json(
      {
        message: "Mobile verified successfully",
        existingUser: false,
        verificationToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("checkout verify-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
