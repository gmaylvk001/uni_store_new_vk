import dbConnect from "@/lib/db";
import Product from "@/models/product";
import ecom_category_info from "@/models/ecom_category_info";
import ecom_brand_infos from "@/models/ecom_brand_info";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req,{params}) {
    try {
        const { token } = params;   // ✅ correct way

        if (token !== process.env.PRODUCT_DATA_TOKEN) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();

        const products = await Product.find({ status: "Active" })
            .select(
                "ean item_code name brand category price special_price images slug quantity sub_category"
            )
            .sort({ createdAt: -1 })
            .lean();

        // ✅ Filter only valid ObjectIds
        const categoryIds = [
            ...new Set(
                products
                    .flatMap(p => [p.category, p.sub_category]) // include both
                    .filter(id => mongoose.Types.ObjectId.isValid(id))
            )
        ];
        const brandIds = [
            ...new Set(
                products
                    .map(p => p.brand)
                    .filter(id => mongoose.Types.ObjectId.isValid(id))
            )
        ];

        // Convert to ObjectIds
        const categoryObjectIds = categoryIds.map(id => new mongoose.Types.ObjectId(id));
        const brandObjectIds = brandIds.map(id => new mongoose.Types.ObjectId(id));

        // Fetch categories & brands
        const [categories, brands] = await Promise.all([
            categoryObjectIds.length
                ? ecom_category_info.find({ _id: { $in: categoryObjectIds } }).lean()
                : [],
            brandObjectIds.length
                ? ecom_brand_infos.find({ _id: { $in: brandObjectIds } }).lean()
                : []
        ]);

        // Create lookup maps
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat._id.toString()] = cat.category_name;
            return acc;
        }, {});
        console.log(categoryMap);
        const brandMap = brands.reduce((acc, br) => {
            acc[br._id.toString()] = br.brand_name;
            return acc;
        }, {});

        // Format output
        const formattedProducts = products.map(product => ({
            ean_id: product.ean || "",
            ean_additional: "",
            item_code: product.item_code || product.ean || "",
            item_mpn: product.item_code || "",
            product_name: product.name || "",
            brand: brandMap[product.brand] || "",
            item_group: categoryMap[product.category] || "",
            // category: `${categoryMap[product.category]} > ${categoryMap[product.sub_category]}` || "",
            // category: product.category || "",
            category: [
                categoryMap[product.category],
                categoryMap[product.sub_category]
            ]
                .filter(Boolean)
                .join(" > "),
            subcategory: categoryMap[product.sub_category] || "",
            price: product.special_price || 0,
            store_price: product.price || 0,
            product_image: `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product?.images?.[0]}` || "",
            product_url: product.slug
                ? `${process.env.NEXT_PUBLIC_API_URL}/product/${product.slug}`
                : "",
            stock: product.quantity
                ? Number(product.quantity).toFixed(6)
                : "0.000000"
        }));

        return NextResponse.json(formattedProducts);

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}