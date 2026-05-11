export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
}

export function toJsonLd(schema) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export async function getCategoryBySlug(slug) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/categories/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export function buildCategorySchemas({ data, baseUrl, segments = [] }) {
  if (!data?.main_category) {
    return {
      organizationSchema: null,
      storeSchema: null,
      categorySchema: null,
      breadcrumbSchema: null,
      graphSchema: null,
    };
  }

  const categoryPath = [...segments, data.main_category.category_slug].join("/");
  const categoryUrl = `${baseUrl}/category/${categoryPath}`;
  const organizationId = `${baseUrl}/#org`;
  const storeId = `${baseUrl}/#store`;

  const organizationSchema = {
    "@type": "Organization",
    "@id": organizationId,
    name: "Unilet Stores",
    alternateName: "Unilet",
    legalName: "Unilet Appliances Pvt Ltd",
    url: `${baseUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/user/unilet-logo.webp`,
    },
    description:
      "Unilet Appliances Pvt Ltd is a multi-brand consumer electronics retail chain in Karnataka, offering home appliances, televisions, laptops, smartphones, and smart gadgets through online and physical stores.",
    email: "info@uniletstores.com",
    telephone: "+91-9243585858",
    address: {
      "@type": "PostalAddress",
      streetAddress: "#60, 1st Floor, Near ICICI Bank, Sahakar Nagar",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560092",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.facebook.com/uniletappliances/",
      "https://www.instagram.com/uniletstores/",
      "https://www.youtube.com/channel/UC4haxoyc5LXJjGqdHdA3zrA/videos",
      "https://x.com/StoresUnil99523",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+91-9243585858",
        email: "info@uniletstores.com",
        availableLanguage: ["en", "kn"],
        areaServed: ["IN-KA"],
      },
    ],
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/ReturnShippingFees",
    },
  };

  const storeSchema = {
    "@type": "ElectronicsStore",
    "@id": storeId,
    name: "Unilet Stores",
    url: `${baseUrl}/`,
    parentOrganization: { "@id": organizationId },
    description:
      "Electronics retail store offering mobiles, laptops, TVs, refrigerators, washing machines, air conditioners, kitchen appliances, home appliances, and lifestyle technology products across Karnataka.",
    priceRange: "INR",
    currenciesAccepted: "INR",
    paymentAccepted: [
      "Cash",
      "UPI",
      "Credit Card",
      "Debit Card",
      "NetBanking",
      "Wallet",
    ],
    areaServed: ["Karnataka"],
    address: organizationSchema.address,
    telephone: "+91-9243585858",
    email: "info@uniletstores.com",
  };

  const categorySchema = {
    "@type": "CollectionPage",
    "@id": categoryUrl,
    name: data.main_category.category_name,
    description:
      data.main_category.meta_description ||
      data.main_category.category_description ||
      "",
    url: categoryUrl,
    isPartOf: { "@id": `${baseUrl}/` },
    about: { "@id": storeId },
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
  };

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    ...segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      item: `${baseUrl}/category/${segments.slice(0, index + 1).join("/")}`,
    })),
    {
      "@type": "ListItem",
      position: segments.length + 2,
      name: data.main_category.category_name,
      item: categoryUrl,
    },
  ];

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      storeSchema,
      categorySchema,
      breadcrumbSchema,
    ],
  };

  return {
    organizationSchema,
    storeSchema,
    categorySchema,
    breadcrumbSchema,
    graphSchema,
  };
}
