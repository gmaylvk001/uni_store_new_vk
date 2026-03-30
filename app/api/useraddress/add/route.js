import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Useraddress from "@/models/ecom_user_address_info";
export async function POST(req) {
  try {
    const formData        = await req.formData();
    const userId = formData.get("userId");
    const addressId = formData.get("addressId");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const firstname       = formData.get("firstname")      ||  undefined;
    const lastName        = formData.get("lastName")       ||  undefined;
    const businessName    = formData.get("businessName")   ||  undefined;
    const country         = formData.get("country")        ||  undefined;
    const email           = formData.get("email")          ||  undefined;
    const address         = formData.get("address")        ||  undefined;
    const postCode        = formData.get("postCode")       ||  undefined;
    const city            = formData.get("city")           ||  undefined;
    const state           = formData.get("state")          ||  undefined;
    const landmark        = formData.get("landmark")       ||  undefined;
    const phonenumber     = formData.get("phonenumber")    ||  undefined;
    const altnumber       = formData.get("altnumber")      ||  undefined;
    const gst_name        = formData.get("gst_name")       ||  undefined;
    const gst_number      = formData.get("gst_number")     ||  undefined;
    const additionalInfo  = formData.get("additionalInfo") ||  undefined;

    await connectDB();
        // Prepare address data
        const addressData = {
          firstName       :  firstname,
          lastName        :  lastName,
          businessName    :  businessName,
          country         :  country,
          email           :  email,
          address         :  address,
          postCode        :  postCode,
          city            :  city,
          state           :  state,
          landmark        :  landmark,
          phonenumber     :  phonenumber,
          altnumber       :  altnumber,
          gst_name        :  gst_name,
          gst_number      :  gst_number,
          additionalInfo  :  additionalInfo,
        };

    let result;
    if (addressId) {
      result = await Useraddress.findOneAndUpdate(
        { _id: addressId, userId },
        { $set: addressData },
        { new: true }
      );

      if (!result) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 }
        );
      }
    } else {
      const existingUser = await Useraddress.findOne({ userId });

      if (existingUser) {
        // Keep current behavior for users who only have one saved address.
        // If multiple records exist, create a new one unless an addressId was supplied.
        const userAddressCount = await Useraddress.countDocuments({ userId });
        if (userAddressCount === 1) {
          result = await Useraddress.findOneAndUpdate(
            { userId },
            { $set: addressData },
            { new: true }
          );
        } else {
          result = await Useraddress.create({
            userId,
            ...addressData
          });
        }
      } else {
        result = await Useraddress.create({
          userId,
          ...addressData
        });
      }
    }

    return NextResponse.json(
      { 
        message: "Address saved successfully", 
        userAddress: result 
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
