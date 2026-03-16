import mongoose from "mongoose";

const LgStoreSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    state: String,
    city: String,
    pincode: String,
    google_location: String,
    contact: String,
    email: String,
    work_hours: String,
  },
  { timestamps: true }
);

export default mongoose.models["lg-Store"] ||
  mongoose.model("lg-Store", LgStoreSchema);