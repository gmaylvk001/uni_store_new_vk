import { NextResponse } from "next/server";

const getBaseUrl = (request) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || request.nextUrl.origin;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export async function GET(request) {
  const baseUrl = getBaseUrl(request);

  const robotsText = `# Robots policy adapted from darlingretail.com/robots.txt
# Checkout, cart, account, and order flows are not intended for search indexing.
# Automated scraping or fully automated purchase completion without human review is not permitted.
User-agent: *
Disallow: /a/downloads/-/*
Disallow: /admin
Disallow: /api
Disallow: /apis
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /44767674533/checkouts
Disallow: /44767674533/orders
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Disallow: /sf_private_access_tokens
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Disallow: /cdn/wpm/*.js
Disallow: /recommendations/products
Disallow: /*/recommendations/products
Disallow: /products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Sitemap: ${baseUrl}/sitemap.xml

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
Disallow: /44767674533/checkouts
Disallow: /44767674533/orders
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /cdn/wpm/*.js
Disallow: /products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /sf_private_access_tokens

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
Disallow: /a/downloads/-/*
Disallow: /admin
Disallow: /api
Disallow: /apis
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /44767674533/checkouts
Disallow: /44767674533/orders
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Disallow: /sf_private_access_tokens
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Disallow: /cdn/wpm/*.js
Disallow: /recommendations/products
Disallow: /*/recommendations/products
Disallow: /products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Sitemap: ${baseUrl}/sitemap.xml

User-agent: AhrefsSiteAudit
Crawl-delay: 10
Disallow: /a/downloads/-/*
Disallow: /admin
Disallow: /api
Disallow: /apis
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /44767674533/checkouts
Disallow: /44767674533/orders
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Disallow: /sf_private_access_tokens
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Disallow: /cdn/wpm/*.js
Disallow: /recommendations/products
Disallow: /*/recommendations/products
Disallow: /products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Disallow: /*/collections/*/products/*-[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9]-remote
Sitemap: ${baseUrl}/sitemap.xml

User-agent: MJ12bot
Crawl-delay: 10

User-agent: Pinterest
Crawl-delay: 1
`;

  return new NextResponse(robotsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
