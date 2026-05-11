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
    return {
      title:
  category.meta_title && category.meta_title !== "none"
    ? category.meta_title
    : category.category_name,
     description:
        category.meta_description && category.meta_description !== "none"
    ? category.meta_description
    : `Browse products in ${category.category_name}`,

      keywords: category.meta_keyword || "",

      openGraph: {
        title:
  category.meta_title && category.meta_title !== "none"
    ? category.meta_title
    : category.category_name,
     description:
        category.meta_description && category.meta_description !== "none"
    ? category.meta_description
    : `Browse products in ${category.category_name}`,

        url: `${baseUrl}/category/${sub_slug}`,
        images: category.image ? [`${baseUrl}${category.image}`] : [],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title:
  category.meta_title && category.meta_title !== "none"
    ? category.meta_title
    : category.category_name,
     description:
        category.meta_description && category.meta_description !== "none"
    ? category.meta_description
    : `Browse products in ${category.category_name}`,
      },
    };
  } catch {
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
      <CategoryClient />
    </>
  );
}
