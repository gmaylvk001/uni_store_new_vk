import CategoryClient from "@/components/category/[slug]/[sub_slug]/page";
import {
  buildCategorySchemas,
  getBaseUrl,
  getCategoryBySlug,
  toJsonLd,
} from "@/app/category/schema-utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug; // ✅ ADDED THIS
  const sub_slug = awaitedParams.sub_slug;
  const baseUrl = getBaseUrl();

  try {
    const data = await getCategoryBySlug(sub_slug);

    if (!data?.main_category) {
      return {
        title: "Category Not Found",
        description: "This category does not exist",
      };
    }

    const category = data.main_category;
    
    // Logic for Title and Description
    const finalTitle = category.meta_title && category.meta_title !== "none"
      ? category.meta_title
      : category.category_name;
      
    const finalDesc = category.meta_description && category.meta_description !== "none"
      ? category.meta_description
      : `Browse products in ${category.category_name}`;

    return {
      title: finalTitle,
      description: finalDesc,
      keywords: category.meta_keyword || "",
      alternates: {
        // ✅ FIXED: Now uses 'slug' correctly
        canonical: `${baseUrl}/category/${slug}/${sub_slug}`,
      },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        url: `${baseUrl}/category/${slug}/${sub_slug}`,
        images: category.image ? [`${baseUrl}${category.image}`] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: finalTitle,
        description: finalDesc,
      },
    };
  } catch (error) {
    return {
      title: "Category",
      description: "Browse products by category",
    };
  }
}

export default async function Page({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const sub_slug = awaitedParams.sub_slug;
  const baseUrl = getBaseUrl();
  const data = await getCategoryBySlug(sub_slug);
  
  const { categorySchema, breadcrumbSchema } = buildCategorySchemas({
    data,
    baseUrl,
    segments: [slug, sub_slug],
  });

  return (
    <>
      {categorySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd({
              "@context": "https://schema.org",
              ...categorySchema,
            }),
          }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd({
              "@context": "https://schema.org",
              ...breadcrumbSchema,
            }),
          }}
        />
      )}
      
      {/* ✅ ADDING SERVER-SIDE H1: This ensures the H1 is Cleared in the SEO sheet */}
      <main className="container mx-auto px-4 pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {data?.main_category?.category_name || "Refrigerator"}
          </h1>
          
          {/* ✅ ADDING CONTENT BLOCK: This ensures Content Length is Cleared */}
          {data?.main_category?.content && (
            <div 
              className="mb-8 text-gray-700 text-sm prose max-w-none border-b pb-6"
              dangerouslySetInnerHTML={{ __html: data.main_category.content }} 
            />
          )}
      </main>

      <CategoryClient />
    </>
  );
}