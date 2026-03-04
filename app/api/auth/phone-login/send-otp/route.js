import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

async function sendOtpViaSms(mobile, otp) {
  const apiKey = process.env.MSG4_API_KEY;
  const templateId = process.env.MSG4_TEMPLATE_ID;
  const senderId = process.env.MSG4_SENDER_ID || "SATHYA";

  if (!apiKey) throw new Error("SMS service not configured");

  const smsText = encodeURIComponent(`Your OTP ${otp} is your SATHYA verification code.`);
  const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${templateId}&sid=${senderId}&to=${mobile}&msg=${smsText}`;

  //const url = "https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=ecacbce1df124e0fa60115dbc98cf8a12eebdf0a1fe8407fb339d9cd223331bf&tmpid=1607100000000337908&sid=SATHYA&to=+919942705899&msg=Your%20OTP%20${otp}%20is%20your%20SATHYA%20verification%20code.";

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS gateway error: ${text}`);
  }
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

    const user = await User.findOne({ mobile });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this mobile number" },
        { status: 404 }
      );
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this mobile
    await Otp.deleteMany({ mobile });

    // Save new OTP
    await Otp.create({ mobile, otp, expiresAt });

    // Send OTP via msg4.cloud.robeeta.com
    await sendOtpViaSms(mobile, otp);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
