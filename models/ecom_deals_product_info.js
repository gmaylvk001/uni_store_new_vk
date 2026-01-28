import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    fest_offer_status: {
      type: String,
      enum: ['active', 'inactive'], // Only allow 'active' or 'inactive'
      required: true,
    },
    fest_offer_status2: {
      type: String,
      enum: ['active', 'inactive'], // Only allow 'active' or 'inactive'
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },

    offer_product_category: {
      type: String,
      enum: ['product', 'category'], // Only allow 'product' or 'category'
      required: true, // ✅ Added required: true
    },
    offer_product: {
      type: [String],
      required: function () {
        return this.offer_product_category === 'product'; // Required only if offer_product_category is 'product'
      },
    },
    offer_category: {
      type: [String],
      required: function () {
        return this.offer_product_category === 'category'; // Required only if offer_product_category is 'category'
      },
    },
    
    
    used_by: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true, collection: 'ecom_product_deals_info' } // Explicit collection name
);

export default mongoose.models.ecom_product_deals_info || mongoose.model('ecom_product_deals_info', dealSchema);
