import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Otp from "@/models/Otp";

async function sendOtpViaSms(mobile, otp) {
  const authKey = process.env.SMS_BASIC_AUTH;
  const templateId = process.env.MSG4_TEMPLATE_ID;
  const senderId = process.env.MSG4_SENDER_ID || "UNILET";

  if (!authKey) throw new Error("SMS service not configured");

  const payload = {
    smstosend: [
      {
        to: mobile,
        from: senderId,
        smstext: `Unilet Login Verification Your OTP is: ${otp} This code is valid for 10 minutes. Happy Shopping! Security Note: Do not share this code with anyone.`,
        templateid: templateId,
      },
    ],
  };

  const res = await fetch("https://sms.sendmsg.in/datasend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.text();

  if (!res.ok) {
    throw new Error(`SMS gateway error: ${data}`);
  }

  return data;
}

export async function POST(req) {
  try {
    const { mobile } = await req.json();

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    await connectDB();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ mobile });
    await Otp.create({ mobile, otp, expiresAt });
    await sendOtpViaSms(mobile, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("checkout send-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}

