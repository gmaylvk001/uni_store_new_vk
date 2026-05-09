"use client";
import { useState, useEffect } from "react";

import CategoryComponent from "@/components/category/category";


export default async function Page({ params }) {
  const { slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const data = await getCategoryData(slug);

  const categorySchema = data?.main_category
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${baseUrl}/category/${data.main_category.category_slug}`,
        name: data.main_category.category_name,
        description:
          data.main_category.meta_description ||
          data.main_category.category_description ||
          "",
        url: `${baseUrl}/category/${data.main_category.category_slug}`,
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

  const breadcrumbSchema = data?.main_category
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
            name: data.main_category.category_name,
            item: `${baseUrl}/category/${data.main_category.category_slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {categorySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <CategoryClient />
    </>
  );
}