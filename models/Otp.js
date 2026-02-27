import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String },
  mobile: { type: String },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
