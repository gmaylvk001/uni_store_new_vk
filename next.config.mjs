/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ FIX 1: Combined remotePatterns into a single array
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/categories/**",
      },
      {
        protocol: "https",
        hostname: "uniletstores.divinfosys.com",
        pathname: "/uploads/categories/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/product-category/home-appliances/:slug*",
        destination: "/category/home-appliances/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/mobile-phones/:slug*",
        destination: "/category/mobiles-tablets/smart-phone/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/home-electronics/televisions/:slug*",
        destination: "/category/tv-entertainment/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/phones-and-wearables/mobile-phones/:slug*",
        destination: "/category/accessories/gadgets/wearables/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/home-appliances/refrigerator/:slug*",
        destination: "/category/home-appliances/refrigerator/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/home-appliances/washing-machine/:slug*",
        destination: "/category/home-appliances/washing-machine/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/home-appliances/air-conditioners/:slug*",
        destination: "/category/home-appliances/air-conditioner/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/home-appliances/air-cooler/:slug*",
        destination: "/category/kitchen-appliances/small-appliance/air-coolers/:slug*",
        permanent: true,
      },
      {
        source: "/product-category/kitchen-appliances/:slug*",
        destination: "/category/kitchen-appliances/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;