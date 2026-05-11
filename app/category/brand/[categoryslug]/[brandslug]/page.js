import BrandComponent from "@/components/category/brand/BrandComponent";
import { getBaseUrl, toJsonLd } from "@/app/category/schema-utils";

export const dynamic = "force-dynamic";

async function getBrandCategoryData(categoryslug, brandslug) {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/brand/categories/${categoryslug}/brand/${brandslug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const { categoryslug, brandslug } = await params;
  const baseUrl = getBaseUrl();
  const data = await getBrandCategoryData(categoryslug, brandslug);
  const pageUrl = `${baseUrl}/category/brand/${categoryslug}/${brandslug}`;

  const categoryName = data?.category?.category_name || categoryslug;
  const brandName = data?.brand?.brand_name || brandslug;

  const categorySchema =
    data?.category && data?.brand
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": pageUrl,
          name: `${categoryName} by ${brandName}`,
          description:
            data.category.meta_description ||
            `Browse ${brandName} products in ${categoryName}`,
          url: pageUrl,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: (data.products || []).slice(0, 50).map((p, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${baseUrl}/product/${p.slug}`,
              name: p.name,
              image:
                p.images?.length > 0
                  ? `${baseUrl}/uploads/products/${p.images[0]}`
                  : undefined,
            })),
          },
        }
      : null;

  const breadcrumbSchema =
    data?.category && data?.brand
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: `${baseUrl}/category/${categoryslug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: brandName,
              item: pageUrl,
            },
          ],
        }
      : null;

  return (
    <>
      {categorySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(categorySchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }}
        />
      )}
      <BrandComponent categorySlug={categoryslug} brandSlug={brandslug} />
    </>
  );
}
