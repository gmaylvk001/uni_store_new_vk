import dbConnect from "@/lib/db";
import Brand from "@/models/ecom_brand_info";
import Product from "@/models/product";
import ProductFilter from "@/models/ecom_productfilter_info";
import Filter from "@/models/ecom_filter_infos";
import FilterGroup from "@/models/ecom_filter_group_infos";
import ecom_category_info from "@/models/ecom_category_info";

// Helper function to get all subcategory IDs for a category tree
async function getAllSubCategoryIds(categoryId) {
  const subCategories = await ecom_category_info.find({ parentid: categoryId }).select('_id').lean();
  let allIds = [categoryId.toString()];
  
  for (const subCat of subCategories) {
    const childIds = await getAllSubCategoryIds(subCat._id);
    allIds = [...allIds, ...childIds];
  }
  return allIds;
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryslug = searchParams.get("category");
    const brandslug = searchParams.get("brand");

    if (!categoryslug || !brandslug) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Fetch category
    const category = await ecom_category_info.findOne({ category_slug: categoryslug });
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    // 2. Fetch brand
    const brand = await Brand.findOne({ brand_slug: brandslug });
    if (!brand) {
      return Response.json({ error: "Brand not found" }, { status: 404 });
    }

    // 3. Get ALL category IDs in the tree to ensure we find all products
    const allCategoryIdsInTree = await getAllSubCategoryIds(category._id);

    // 4. Fetch Products locked to this Brand and Category Tree
    const products = await Product.find({
      brand: brand._id.toString(),
      $or: [
        { category: { $in: allCategoryIdsInTree } },
        { sub_category: { $in: allCategoryIdsInTree } }
      ],
      status: "Active"
    }).populate('brand', 'brand_name brand_slug');

    // 5. Fetch relevant filters for these specific products
    const productIds = products.map(p => p._id);
    const productFilters = await ProductFilter.find({ product_id: { $in: productIds } });
    const filterIds = [...new Set(productFilters.map(pf => pf.filter_id))];
    
    const filters = await Filter.find({ _id: { $in: filterIds } })
      .populate({
        path: 'filter_group',
        model: FilterGroup
      }).lean();

    return Response.json({
      category,
      brand,
      products,
      filters: filters.map(f => ({
        ...f,
        filter_group_name: f.filter_group?.filtergroup_name || 'General'
      })),
      allCategoryIds: allCategoryIdsInTree
    });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}