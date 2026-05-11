import ProductClient from "./ProductClient";
import { getBaseUrl, toJsonLd } from "@/app/category/schema-utils";

async function getProductData(slug) {
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/product/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const baseUrl = getBaseUrl();

  try {
    const product = await getProductData(slug);
    if (!product) {
      return {
        title: "Product not found",
        description: "This product is unavailable",
      };
    }

    const title = product.meta_title || product.name;
    const description =
      product.meta_description ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      "Buy products online at best price";

    const image =
      product.images?.length > 0
        ? `${baseUrl}/uploads/products/${product.images[0]}`
        : `${baseUrl}/no-image.jpg`;

    return {
      title,
      description,
      keywords: product.search_keywords || "",

      openGraph: {
        title,
        description,
        url: `${baseUrl}/product/${slug}`,
        images: [image],
        type: "website", // ✅ FIXED
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "Product",
      description: "Buy products online",
    };
  }
}

export default async function ProductNew({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const baseUrl = getBaseUrl();
  const product = await getProductData(slug);

  const cleanDescription = (
    product?.meta_description ||
    product?.description?.replace(/<[^>]*>/g, "").trim() ||
    `Buy ${product?.name || "products"} online at best price`
  ).slice(0, 5000);

  const productUrl = `${baseUrl}/product/${slug}`;
  const productImages =
    product?.images?.length > 0
      ? product.images.map((image) => `${baseUrl}/uploads/products/${image}`)
      : [];
  const productPrice = product?.special_price || product?.price || 0;

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": productUrl,
        name: product.name,
        description: cleanDescription,
        url: productUrl,
        image: productImages,
        sku: product.item_code || undefined,
        mpn: product.model_number || undefined,
        brand:
          product.brand_code || product.brand
            ? {
                "@type": "Brand",
                name: product.brand_code || product.brand,
              }
            : undefined,
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: productPrice,
          availability:
            product.stock_status === "Out of Stock"
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;

  const breadcrumbSchema = product
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
            name: product.name,
            item: productUrl,
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }}
        />
      )}
      <ProductClient />
    </>
  );
}
