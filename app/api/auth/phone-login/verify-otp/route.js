import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
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
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        { error: "OTP must be 4 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    const otpRecord = await Otp.findOne({ mobile, otp });
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // Delete OTP after successful verification (prevent reuse)
    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ mobile });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Issue JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Merge guest cart → user cart
    let cartCount = 0;
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      let userCart = await Cart.findOne({ userId: user._id });

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
          userCart.totalItems = userCart.items.reduce((sum, i) => sum + i.quantity, 0);
          await userCart.save();
          cartCount = userCart.totalItems;
          await Cart.deleteOne({ guestId });
        } else {
          guestCart.userId = user._id;
          guestCart.guestId = null;
          await guestCart.save();
          cartCount = guestCart.totalItems;
        }
      } else if (userCart) {
        cartCount = userCart.totalItems;
      }
    } else {
      const userCart = await Cart.findOne({ userId: user._id });
      cartCount = userCart?.totalItems || 0;
    }

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          name: user.name,
          email: user.email,
          userId: user._id,
          role: user.user_type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
