import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Offer from "@/models/ecom_offer_info";
import Cart from "@/models/ecom_cart_info";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const mergeGuestCart = async (guestId, userId) => {
  if (!guestId) return;

  const guestCart = await Cart.findOne({ guestId });
  let userCart = await Cart.findOne({ userId });

  if (!guestCart) return;

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
    return;
  }

  guestCart.userId = userId;
  guestCart.guestId = null;
  await guestCart.save();
};

export async function POST(req) {
  try {
    const { name, email, mobile, guestId } = await req.json();

    if (!name || !email || !mobile) {
      return NextResponse.json(
        { error: "Name, email and mobile are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOne({ mobile });
    if (!user) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists with another account" },
          { status: 400 }
        );
      }

      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name,
        email,
        mobile,
        password: hashedPassword,
      });

      await Offer.updateMany(
        { selected_user_type: "all" },
        {
          $addToSet: { selected_users: user._id },
          $set: { updated_at: new Date() },
        }
      );
    }

    await mergeGuestCart(guestId, user._id);

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return NextResponse.json(
      {
        message: "User ready for checkout",
        token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.user_type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("checkout ensure-user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to prepare checkout user" },
      { status: 500 }
    );
  }
}
