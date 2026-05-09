import {
  buildCategorySchemas,
  getBaseUrl,
  getCategoryBySlug,
  toJsonLd,
} from "@/app/category/schema-utils";

export default async function Head({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const sub_slug = awaitedParams.sub_slug;
  const baseUrl = getBaseUrl();
  const data = await getCategoryBySlug(sub_slug);
  const { graphSchema } = buildCategorySchemas({
    data,
    baseUrl,
    segments: [slug, sub_slug],
  });

  return (
    <>
      {graphSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(graphSchema) }}
        />
      )}
    </>
  );
}
