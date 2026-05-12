import CategoryClient from "@/components/category/CategoryComponent";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        title: "Category Not Found",
        description: "This category does not exist",
      };
    }

    const data = await res.json();
    const category = data.main_category;

    // TL ISSUE FIX: Prioritize Meta Title & Description from DB
    const title = category.meta_title || category.category_name;
    const description = category.meta_description || `Browse products in ${category.category_name}`;

    return {
      title,
      description,
      keywords: category.meta_keyword || "",

      // ✅ SEO FIX: Added Missing Canonical Tag
      alternates: {
        canonical: `${baseUrl}/category/${slug}`,
      },

      openGraph: {
        title,
        description,
        url: `${baseUrl}/category/${slug}`,
        images: category.image ? [`${baseUrl}${category.image}`] : [],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Category",
      description: "Browse products by category",
    };
  }
}

async function getCategoryData(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const data = await getCategoryData(slug);

  if (!data) return <div>Category not found</div>;

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/category/${data.main_category.category_slug}`,
    name: data.main_category.category_name,
    description: data.main_category.meta_description || "",
    url: `${baseUrl}/category/${data.main_category.category_slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (data.products || []).slice(0, 50).map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/product/${p.slug}`,
        name: p.name,
        image: p.images?.length > 0 ? `${baseUrl}/uploads/products/${p.images[0]}` : undefined,
      })),
    },
  };

  return (
    <>
      {categorySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />
      )}

      {/* ✅ SEO FIX: Server-rendered H1 and Long Content Section */}
      <main className="container mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {data.main_category.category_name}
        </h1>

        {/* ✅ SEO FIX: "Content is very less" Issue 
            Renders the full SEO text from DB if available */}
        {data.main_category.content && (
          <div 
            className="mb-8 text-gray-700 text-sm prose max-w-none border-b pb-6"
            dangerouslySetInnerHTML={{ __html: data.main_category.content }} 
          />
        )}
      </main>

      <CategoryClient initialData={data} />
    </>
  );
}