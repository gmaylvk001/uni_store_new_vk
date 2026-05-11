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
  const sub_slug_one = awaitedParams.sub_slug_one;
  const baseUrl = getBaseUrl();
  const data = await getCategoryBySlug(sub_slug_one);
  const { graphSchema } = buildCategorySchemas({
    data,
    baseUrl,
    segments: [slug, sub_slug, sub_slug_one],
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
