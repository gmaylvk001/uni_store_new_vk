// components/CategoryProducts.jsx
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Addtocart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
const CategoryProducts = () => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const categoryScrollRefs = useRef({});
  const [categoryStyless, setCategories] = useState(null);

  const priorityCategories = ["air-conditioner", "mobile-phones", "television", "refrigerator", "washing-machine"];
    const getSanitizedImage = (img) => {
      if (!img || img.trim() === "") return null;

      // If multiple images separated by commas, pick the last one
      const parts = img.split(",");
      const lastImg = parts[parts.length - 1].trim();

      // Replace spaces with underscores
      return lastImg.replace(/\s+/g, "_");
    };

   useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories/styles");
      const data = await res.json();
      setCategories(data);
    }

    fetchCategories();
  }, []);
  
    const categoryStyles = {
      "air-conditioner": {
        backgroundImage: "/uploads/categories/category-darling-img/air-conditoner-one.jpg",
        borderColor: "#060F16",
        showallCategoryLink : "/category/large-appliance/air-conditioner",
        subcategoryList: [
          { categoryname: "Cassette AC", category_slug: "/category/large-appliance/air-conditioner/cassette-ac" },
          { categoryname: "Inverter AC", category_slug: "/category/large-appliance/air-conditioner/inverter-ac" },
          { categoryname: "Split AC", category_slug: "/category/large-appliance/air-conditioner/split-ac" },
          { categoryname: "Window AC", category_slug: "/category/large-appliance/air-conditioner/window-ac" },
        ],
      },
      "mobile-phones": {
        backgroundImage: "/uploads/categories/category-darling-img/smartphone.png",
        borderColor: "#68778B",
        showallCategoryLink : "/category/mobiles-accessories/mobile-phones",
        subcategoryList: [
          { categoryname: "Smart Phone", category_slug: "/category/mobiles-accessories/mobile-phones/smart-phone" },
          { categoryname: "Tablet", category_slug: "/category/mobiles-accessories/mobile-phones/tablet" },
        ],
      },
      "television": {
        backgroundImage: "/uploads/categories/category-darling-img/television-one.jpg",
        borderColor: "#A9A097",
        showallCategoryLink : "/category/televisions/television",
        subcategoryList: [
          { categoryname: "FULL HD", category_slug: "/category/televisions/television/full-hd" },
          { categoryname: "HD Ready", category_slug: "/category/televisions/television/hd-ready" },
          { categoryname: "ULTRA HD", category_slug: "/category/televisions/television/ultra-hd" },
        ],
      },
      "refrigerator": {
        backgroundImage: "/uploads/categories/category-darling-img/refirgrator-two.jpg",
        borderColor: "#5C8B99",
        showallCategoryLink : "/category/large-appliance/refrigerator",
        subcategoryList: [
          { categoryname: "Bottom Mount", category_slug: "/category/large-appliance/refrigerator/bottom-mount" },
          { categoryname: "Deep Freezer", category_slug: "/category/large-appliance/refrigerator/deep-freezer" },
          { categoryname: "Double Door", category_slug: "/category/large-appliance/refrigerator/double-door" },
          { categoryname: "Mini Fridge", category_slug: "/category/large-appliance/refrigerator/mini-fridge" },
          { categoryname: "Side by Side", category_slug: "/category/large-appliance/refrigerator/side-by-side" },
          { categoryname: "Single Door", category_slug: "/category/large-appliance/refrigerator/single-door" },
          { categoryname: "Triple Door", category_slug: "/category/large-appliance/refrigerator/triple-door" },
        ],
      },
      "washing-machine": {
        backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg",
        borderColor: "#69AEA2",
        showallCategoryLink : "/category/large-appliance/washing-machine",
        subcategoryList: [
          { categoryname: "Front Loading", category_slug: "/category/large-appliance/washing-machine/front-loading" },
          { categoryname: "Top Loading", category_slug:  "/category/large-appliance/washing-machine/top-loading"},
          { categoryname: "Semi Automatic", category_slug:  "/category/large-appliance/washing-machine/semi-automatic"},
        ],
      },
      "dishwasher": {
        backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg",
        borderColor: "#69AEA2",
        showallCategoryLink : "/category/large-appliance/dishwasher",
        subcategoryList: [
          { categoryname: "12 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/12-place-setting" },
          { categoryname: "13 PLACE SETTING", category_slug:  "/category/large-appliance/dishwasher/13-place-setting"},
          { categoryname: "14 PLACE SETTING", category_slug:  "/category/large-appliance/dishwasher/14-place-setting"},
          { categoryname: "15 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/15-place-setting" },
          { categoryname: "16 PLACE SETTING", category_slug:  "/category/large-appliance/dishwasher/16-place-setting"}
        ],
      },
    };


  /* const scrollLeft = (categoryId) => {
    if (categoryScrollRefs.current[categoryId]) {
      categoryScrollRefs.current[categoryId].scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryId) => {
    if (categoryScrollRefs.current[categoryId]) {
      categoryScrollRefs.current[categoryId].scrollBy({ left: 250, behavior: 'smooth' });
    }
  }; */

      const scrollLeft = (categoryId) => {
  const el = categoryScrollRefs.current[categoryId];
  if (!el) return;

  const scrollAmount = el.clientWidth; // 👈 move exactly visible items
  el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
};

const scrollRight = (categoryId) => {
  const el = categoryScrollRefs.current[categoryId];
  if (!el) return;

  const scrollAmount = el.clientWidth;
  el.scrollBy({ left: scrollAmount, behavior: "smooth" });
};


  const handleProductClick = (product) => {
    setNavigating(true);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const BanneritemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categoryproduct/settings");
        const result = await response.json();
        if (result.ok) setCategoryProducts(result.data);

        const brandResponse = await fetch("/api/brand");
        const brandResult = await brandResponse.json();
        if (!brandResult.error) {
          const map = {};
          brandResult.data.forEach((b) => { map[b._id] = b.brand_name; });
          setBrandMap(map);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (categoryProducts.length === 0) return null;

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      <motion.section id="category-products" initial="hidden" animate="visible" className="category-products px-3 sm:px-1 pt-1">
        <div className="rounded-[23px] py-1">
          <div className="space-y-6 max-w-12xl mx-auto">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-3 sm:mb-5">
              <h5 className="text-lg sm:text-2xl font-bold"> Best of Apple</h5>
            </div>
              {categoryProducts.map((categoryProduct) => {
                const category = categoryProduct.subcategoryId;
                const slug = category?.category_slug?.toLowerCase() || "";
                const keywords = ["iphone", "Iphones", "iphones", "iphone"];
                const isAllowed = keywords.some((key) => slug.includes(key));
        
                if (!isAllowed) return null;

                const products = categoryProduct.products || [];
                const alignment = categoryProduct.alignment || "left";
                
                if (!category || products.length === 0) return null;
                const categoryStyle = categoryStyless[category.category_slug] || {
                  backgroundImage: '/uploads/small-appliance-banner.webp',
                  borderColor: '#1F3A8C'
                };
                const sanitizedCategoryImage = getSanitizedImage(categoryProduct.categoryImage);
                const sanitizedBackgroundImage = getSanitizedImage(categoryStyle.backgroundImage);
                const finalBgUrl = sanitizedCategoryImage || sanitizedBackgroundImage || "/default-image.jpg"; 
                const styleObj = { backgroundImage: `url("${finalBgUrl}")` };
                const visibleDesktopCount = 5;
                const fewProducts = products.length > 0 && products.length < visibleDesktopCount;

                return (
                  <div key={categoryProduct._id} className="mb-10">
  <div className="flex flex-col md:flex-row gap-4">

    {/* ================= LEFT SIDE TEXT ================= */}
    <div className="w-full md:w-[25%] bg-gradient-to-br from-[#6d8b99] via-[#82dcf7] to-[#618de5] flex flex-col justify-center items-center px-4 py-6 text-center rounded">

    {/* HEADING */}
    <h2 className="flex items-center justify-center gap-2 text-lg sm:text-2xl font-bold mb-3">
        <span className="globalnav-image-regular globalnav-link-image">
        <svg
            height="44"
            viewBox="0 0 14 44"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-black"
        >
            <path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6919 2.5924.6919.63 0 1.6112-.7333 2.8092-.7333a3.7579 3.7579 0 0 1 3.1604 1.5802z"></path>
        </svg>
        </span>
        <span>Best of Apple</span>
    </h2>

    {/* DESCRIPTION */}
    <p className="text-sm text-gray-600 mb-6 max-w-xs">
        Discover the best of Apple’s iconic innovation and performance.
        Powerful technology designed for speed, style, and reliability.
        Upgrade your everyday experience with Apple essentials.
    </p>

    {/* VIEW ALL BUTTON */}
    <Link
        href="/category/mobiles-tablets/iphone"
        className="bg-black text-white text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition"
    >
        View All
    </Link>

    </div>

    {/* ================= RIGHT SIDE SLIDER ================= */}
    <div className="w-full md:w-[75%] relative overflow-hidden">

      {/* Scroll Arrows */}
      <button
  onClick={() => scrollLeft(categoryProduct._id)}
  className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border shadow"
>
  <FiChevronLeft size={18} />
</button>

<button
  onClick={() => scrollRight(categoryProduct._id)}
  className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border shadow"
>
  <FiChevronRight size={18} />
</button>
      <div
  ref={(el) => (categoryScrollRefs.current[categoryProduct._id] = el)}
  className="
    flex scroll-smooth
    overflow-x-auto scrollbar-hide
    snap-x snap-mandatory
    space-x-4
    px-0
  "
>

        {products.slice(0, 15).map((product) => (
          /* 🔥 KEEP YOUR EXISTING PRODUCT CARD EXACTLY AS IS 🔥 */

          <div
  key={product._id}
  className="
    snap-start flex-none
    flex flex-col justify-between
    p-1 rounded-lg border border-gray-200
    hover:border-[#0069c1] hover:shadow-md transition
    cursor-pointer

    w-[calc(80%-0.5rem)]
    md:w-[calc(33.333%-0.75rem)]
  " style={{ background: "linear-gradient(90deg, rgb(180, 223, 255) 0%, rgb(193 218 255) 50%, rgb(212 212 212) 100%)" }}
>


             {/* Image */}
                                      <div className="relative aspect-square bg-white overflow-hidden">
                                        <Link href={`/product/${product.slug}`} onClick={() => handleProductClick(product)} className="block mb-1">
                                        {product.images?.[0] && (
                                          <>
                                            <Image
                                              src={product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`}
                                              alt={product.name} 
                                              fill
                                              // ensure the image fits without stretching
                                              className="object-contain p-2 sm:p-3"
                                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 18vw"
                                              unoptimized
                                            />
                                            {Number(product.special_price) > 0 && Number(product.special_price) < Number(product.price) && (
                                              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
                                                -{Math.round(100 - (Number(product.special_price) / Number(product.price)) * 100)}%
                                              </span>
                                            )}
                                            <div className="absolute top-2 right-2">
                                              <ProductCard productId={product._id} />
                                            </div>
                                          </>
                                        )}
                                        </Link>
                                      </div>
 
                                       {/* Info */}
                                       <div className="p-2 flex flex-col h-auto">
                                         <h4 className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase">
                                           <Link href={`/brand/${brandMap[product.brand]?.toLowerCase().replace(/\s+/g, "-") || ""}`} className="hover:text-blue-600">
                                             {brandMap[product.brand] || ""}
                                           </Link>
                                         </h4>
                                         
                                        <Link
                                          href={`/product/${product.slug}`}
                                          onClick={() => handleProductClick(product)}
                                          className="block mb-1"
                                        >
                                          {/* 0069c6 */}
                                          <h3 className="text-xs sm:text-sm font-medium text-black hover:text-gray-700 min-h-[32px] sm:min-h-[40px]">
                                            {(() => {
                                              const model = product.model_number ? `(${product.model_number.trim()})` : "";
                                              const name = product.name ? product.name.trim() : "";
                                              const maxLen = 40;

                                              if (model) {
                                                const remaining = maxLen - model.length - 1; // 1 for space before model
                                                const truncatedName =
                                                  name.length > remaining ? name.slice(0, remaining - 3) + `${model}...` : name;
                                                return `${truncatedName} `;
                                              } else {
                                                return name.length > maxLen ? name.slice(0, maxLen - 3) + "..." : name;
                                              }
                                            })()}
                                          </h3>
                                        


                                         <div className="flex flex-col sm:flex-row items-center md:gap-2 mb-2 sm:mb-3">
                                          <div>
                                            <span className="text-sm sm:text-base font-semibold text-red-600">
                                             ₹ {(product.special_price > 0 && product.special_price < product.price
                                               ? Math.round(product.special_price)
                                               : Math.round(product.price)
                                             ).toLocaleString("en-IN")}
                                           </span>
                                          </div>
                                           <div>
                                            {product.special_price > 0 && product.special_price < product.price && (
                                             <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                               MRP ₹ {Math.round(product.price).toLocaleString("en-IN")}
                                             </span>
                                           )}
                                           </div>
                                         </div>
                                           {/* 
                                         <h4 className={`text-[10px] sm:text-xs mb-2 ${product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                                           {product.stock_status}{product.stock_status === "In Stock" && product.quantity ? `, ${product.quantity} units` : ""}
                                         </h4> 
                                         <h4 className={`text-[10px] sm:text-xs mb-2 ${product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                                           {product.stock_status}{product.stock_status === "In Stock" }
                                         </h4>
                                         */}
                                         </Link>
                                       </div>
                                 </div>
        ))}
      </div>
    </div>
  </div>
</div>

                );
              })}
          </div>
        </div>
      </motion.section>
    </>
  );
};
export default CategoryProducts;