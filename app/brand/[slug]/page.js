import BrandComponent from "@/components/brand/BrandComponent";
import { getBaseUrl, toJsonLd } from "@/app/category/schema-utils";

export const dynamic = "force-dynamic";

async function getBrandData(slug) {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/brand/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();
  const data = await getBrandData(slug);
  const pageUrl = `${baseUrl}/brand/${slug}`;
  const brandName = data?.brand?.brand_name || slug;

  const brandSchema = data?.brand
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: brandName,
        description:
          data.brand.meta_description ||
          `Browse products from ${brandName}`,
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

  const breadcrumbSchema = data?.brand
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
            name: brandName,
            item: pageUrl,
          },
        ],
      }
    : null;

  return (
    <>
      {brandSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(brandSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }}
        />
      )}
      <BrandComponent />
    </>
  );
}
