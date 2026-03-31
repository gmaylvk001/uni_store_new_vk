"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from 'react-toastify';
import "../styles/slick-custom.css";
import { motion, useAnimation, useInView } from "framer-motion";
//import { ShoppingCartSimple, CaretDown } from "@phosphor-icons/react";
import { X } from "lucide-react"; 
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiArrowRight } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { Heart, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Addtocart from "@/components/AddToCart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from "swiper/modules";
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts';
import BlogDetailsImagehome from '@/components/blog/BlogDetailsImagehome';
import StatusBar from '@/components/StatusBar';
import DetailsPageFooter from '@/components/DetailsPageFooter';
import CategoryProducts from '@/components/CategoryProducts';
import CategoryProductsUnilets from '@/components/CategoryProductsUnilets';
import CategoryBestofApple from '@/components/CategoryBestofApple';
import CategoryBestofValue from '@/components/CategoryBestofValue';
import { ChevronRight } from "lucide-react";
import 'swiper/css';
import 'swiper/css/navigation';
import DoubleBanner from "@/components/DoubleBanner"; 


export default function HomeComponent() {
    function slugify(text) {
      return text
        ?.toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") 
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
    }
    const features = [
      { image: "/images/delivery-truck.png", title: "Free Delivery", description: "Free delivery for all Products" },
      { image: "/images/reputation.png", title: "100% Satisfaction", description: "Guaranteed satisfaction with every order" },
      { image: "/images/payment-protection.png", title: "Secure Payments", description: "We ensure secure transactions" },
      { image: "/images/support.png", title: "24/7 Support", description: "We're here to help anytime" },
    ];
    const scrollContainerRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const [isFlashSalesLoading, setIsFlashSalesLoading] = useState(true);
    const [navigating, setNavigating] = useState(false);
    const [bannerData, setBannerData] = useState({
      banner: {
        items: []
      }
    });
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flashSalesData, setFlashSalesData] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isBrandsLoading, setIsBrandsLoading] = useState(true);
    const [scrollDirection, setScrollDirection] = useState('down');
    const [categories, setCategories] = useState([]);
    //const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [parentCategories, setParentCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [categoryBanner, setCategoryBanner] = useState([]);
    const [sections, setSections] = useState([]);
    const [homeSectionData, setHomeSectionData] = useState({ sections: [] });
    const [isSectionLoading, setIsSectionLoading] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const categoryScrollRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const scrollRef = useRef(null);
    // const [products, setProducts] = useState([]);




 

    const [index, setIndex] = useState(0);
  const visibleCount = 4;

  
  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? products.length - visibleCount : prev - 1
    );
  };

  const next = () => {
    setIndex((prev) =>
      prev + visibleCount >= products.length ? 0 : prev + 1
    );
  };

    const products = [
  {
    id: 1,
    name: "Blueair Joy S HEPA Silent Technology Air Purifier",
    image: "uploads/products/1741764239334-aa.jpg",
    price: "₹11,721",
    oldPrice: "₹14,999",
    rating: 5,
  },
  {
    id: 2,
    name: "Russell Hobbs DOME1515 1500 Watt Electric Kettle",
    image: "uploads/products/1742274862765-KnYKgfMqmvuhoRW2.jpg",
    price: "₹799",
    oldPrice: "₹1,895",
    rating: 5,
  },
  {
    id: 3,
    name: "PHILIPS 2000 Series 4.2L Digital Air Fryer",
    image: "uploads/products/1744699296499-CcFj5I8CaTP1n3LV.jpg",
    price: "₹8,299",
    oldPrice: "₹9,995",
    rating: 3,
  },
  {
    id: 4,
    name: "WONDERCHEF Regenta 800 Watt Automatic Coffee Maker",
    image: "uploads/products/1760442848361-1760419717626-MZ55MIN-thumbnail.png",
    price: "₹3,999",
    oldPrice: "₹7,000",
    rating: 4,
  },
  {
    id: 5,
    name: "Prestige Induction Cooktop",
    image: "uploads/products/1744782226045-5LMqi3KxCKzfeqQ2.jpg",
    price: "₹2,499",
    oldPrice: "₹3,999",
    rating: 4,
  },
  {
    id: 6,
    name: "PHILIPS 2000 Series 4.2L 1500 Watt Digital Air Fryer",
    image: "uploads/products/1744699296499-CcFj5I8CaTP1n3LV.jpg",
    price: "₹2,499",
    oldPrice: "₹3,999",
    rating: 4,
  },
];

const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const CARD_WIDTH = isMobile ? 230 : 330; // gap include

const CARDS_PER_VIEW = isMobile ? 2 : 4;

const maxIndex = Math.max(0, products.length - CARDS_PER_VIEW);
    const scrollCategories = (direction) => {
      if (categoryScrollRef.current) {
        categoryScrollRef.current.scrollBy({
          left: direction === "left" ? -200 : 200,
          behavior: "smooth",
        });
      }
    };
    const [brandMap, setBrandMap] = useState([]);
    const priorityCategories = ["air-conditioner", "mobile-phones", "television", "refrigerator", "washing-machine"];
    const categoryStyles = {
      "air-conditioner": {
        backgroundImage: "/uploads/categories/category-darling-img/air-conditoner-one.jpg",
        borderColor: "#060F16" 
      },
      "mobile-phones": {
        backgroundImage: "/uploads/categories/category-darling-img/smartphone.png", 
        borderColor: "#68778B"
      },
      "television": {
        backgroundImage: "/uploads/categories/category-darling-img/television-one.jpg",
        borderColor: "#A9A097" 
      },
      "refrigerator": {
        backgroundImage: "/uploads/categories/category-darling-img/refirgrator-two.jpg",
        borderColor: "#5C8B99" 
      },
      "washing-machine": {
        backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg",
        borderColor: "#69AEA2"
      }
    };
    const fetchBrand = async () => {
      try {
        const response = await fetch("/api/brand");
        const result = await response.json();
        if (result.error) {
          console.error(result.error);
        } else {
          const data = result.data;
    
          // Store as map for quick access
          const map = {};
          data.forEach((b) => {
            map[b._id] = b.brand_name;
          });
          setBrandMap(map);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

      useEffect(() => {
  const fetchData = async () => {
    try {
      // 🔹 1. Fetch products (unchanged)
      const res = await fetch("/api/product/whats-new");
      const products = await res.json();

      // 🔹 2. Fetch brands
      const brandRes = await fetch("/api/brand");
      const brandResult = await brandRes.json();

      const brandData = brandResult?.data || [];

      // 🔹 3. brandId → brandName map
      const brandMap = {};
      brandData.forEach(b => {
        brandMap[b._id] = b.brand_name;
      });

      // 🔹 4. ONLY add brand name (nothing else touched)
      const updatedProducts = products.map(p => ({
        ...p,
        brand_name: brandMap[p.brand] || p.brand
      }));

      // 🔹 5. setProducts (same state)
      // setProducts(updatedProducts);

    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  fetchData();
}, []);


    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
      fetchBrand();
    }, []);
    useEffect(() => {
      const fetchVideos = async () => {
        try {
          const res = await fetch("/api/videocard");
          const data = await res.json();
          if (data.success) setVideos(data.videoCards);
        } catch (err) {
          console.error("Error fetching videos:", err);
        }
      };
      fetchVideos();
    }, []);
    const scroll = (direction) => {
      if (scrollRef.current) {
        const scrollAmount = 350;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };
    const getYoutubeId = (url) => {
      try {
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : null;
      } catch {
        return null;
      }
    };
    useEffect(() => {
        // const fetchBannerData = async () => {
        //     setIsBannerLoading(true);
        //     try {
        //         const response = await fetch('/api/topbanner');
        //         const data = await response.json();
        //         // console.log("Banner data:", data);
        //         if (data.success && data.banners?.length > 0) {
        //             const bannerItems = data.banners
        //                 .filter(banner => banner.status === "Active") // ✅ only Active
        //                 .map(banner => ({
        //                     id: banner._id,
        //                     buttonLink: banner.redirect_url || "/shop",
        //                     bgImageUrl: banner.banner_image,
        //                     bannerImageUrl: banner.banner_image,
        //                     redirectUrl: banner.redirect_url
        //                 }));

        //             setBannerData({
        //                 banner: { items: bannerItems }
        //             });
        //         }
        //     } catch (error) {
        //         console.error("Error fetching banner data:", error);
        //         setBannerData({
        //             banner: {
        //                 items: [{
        //                     id: 1,
        //                     buttonLink: "/shop",
        //                     bgImageUrl: "/images/banner-img1.png",
        //                     bannerImageUrl: "/images/banner-product.png"
        //                 }]
        //             }
        //         });
        //     } finally {
        //         setIsBannerLoading(false);
        //     }
        // };
        
        const fetchBannerData = async () => {
    setIsBannerLoading(true);
    try {
        
        // const response = await fetch('/api/topbanner'); 
        
        const manualItems = [
            {
                id: 1,
                bannerImageUrl: "/uploads/aboutus/Hero-1.jpeg", 
                redirectUrl: "/category/home-appliances",
                bgImageUrl: "/uploads/aboutus/Hero-1.jpeg",
                alt: "Mega Sale - Up to 50% Off on Electronics and Home Appliances"
            },
            {
                id: 2,
                bannerImageUrl: "/uploads/aboutus/Hero-2.jpeg",
                redirectUrl: "/category/laptops",
                bgImageUrl: "/uploads/aboutus/Hero-2.jpeg",
                alt: "Apple Store - Latest Laptops, MacBooks, and Accessories at Unbeatable Prices"
            },
            {
                id: 3,
                bannerImageUrl: "/uploads/aboutus/Hero-3.jpeg", 
                redirectUrl: "/category/home-appliances/air-conditioner",
                bgImageUrl: "/uploads/aboutus/Hero-3.jpeg",
                alt: "AC Season Sale - Best Deals on Air Conditioners, Fans, and Cooling Appliances"
            },
               {
                id: 4,
                bannerImageUrl: "/uploads/aboutus/Hero-4.jpeg", 
                redirectUrl: "/category/kitchen-appliances",
                bgImageUrl: "/uploads/aboutus/Hero-4.jpeg",
                alt: "Kitchen Essentials Sale - Up to 40% Off on Mixers, Juicers, and More"
            },
               {
                id: 5,
                bannerImageUrl: "/uploads/aboutus/Hero-5.jpeg", 
                redirectUrl: "/uploads/accessories",
                bgImageUrl: "/uploads/aboutus/Hero-5.jpeg",
                alt: "Accessories Galore - Exclusive Discounts on Phone Cases, Chargers, and More"
            },
               {
                id: 6,
                bannerImageUrl: "/uploads/aboutus/Hero-6.jpeg", 
                redirectUrl: "/category/tv-entertainment",
                bgImageUrl: "/uploads/aboutus/Hero-6.jpeg",
                alt: "TV & Entertainment Sale - Best Prices on Televisions, Sound Systems, and Streaming Devices"
            }
        ];

        setBannerData({
            banner: { items: manualItems }
        });
    } catch (error) {
        console.error("Error setting manual banners:", error);
    } finally {
        setIsBannerLoading(false);
    }
};
        const fetchFlashSales = async () => {
          setIsFlashSalesLoading(true);
          try {
            const response = await fetch("/api/flashsale");
            const data = await response.json();

            if (data.success && data.flashSales.length > 0) {
              const salesItems = data.flashSales
                .filter(item => item.status === "Active")   // ✅ only active
                .map((item) => ({
                  id: item._id,
                  title: item.title,
                  productImage: item.banner_image,
                  bgImage: item.background_image,
                  redirectUrl: item.redirect_url || "/shop",
                }));
              setFlashSalesData(salesItems);
            }
          } catch (error) {
            console.error("Error fetching flash sales:", error);
            setFlashSalesData([
              {
                id: "fs1",
                title: "Summer Fruits Special",
                productImage: "/images/summer-fruits.png",
                bgImage: "/images/sale-bg1.jpg",
                redirectUrl: "/summer-sale",
              },
              {
                id: "fs2",
                title: "Organic Vegetables",
                productImage: "/images/veggies.png",
                bgImage: "/images/sale-bg2.jpg",
                redirectUrl: "/vegetables",
              },
            ]);
          } finally {
            setIsFlashSalesLoading(false);
          }
        };
        const fetchHomeSections = async () => {
          setIsSectionLoading(true);
          try {
            const response = await fetch("/api/home-sections");
            const data = await response.json();

            if (data.success && data.data?.length > 0) {
              const sectionItems = data.data
                .filter(section => section.status === "active") // ✅ only active
                .map(section => ({
                  id: section._id,
                  name: section.name,
                  position: section.position
                }));

              setHomeSectionData({
                sections: sectionItems
              });
            }
          } catch (error) {
            console.error("Error fetching home sections:", error);
            setHomeSectionData({
              sections: []
            });
          } finally {
            setIsSectionLoading(false);
          }
        };
        const fetchBrands = async () => {
            setIsBrandsLoading(true);
            try {
                const response = await fetch('/api/brand/get');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.success) {
                    setBrands(data.brands || []);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
                setBrands([]);
            } finally {
                setIsBrandsLoading(false);
            }
        };
        const fetchCategories = async () => {
          try {
            const response = await fetch("/api/categories/get");
            const data    = await response.json();
            //setCategories(data);
            const rootIds = data
            .filter(cat => cat.parentid === "none" && cat.status === "Active")
            .map(cat => cat._id);
          //  console.log(rootIds);
            // 2. Get only categories whose parentid is in rootIds → second level
            const secondLevelCategories = data.filter(
              cat => rootIds.includes(cat.parentid) && cat.status === "Active"
            );
          //  console.log(secondLevelCategories);
            setParentCategories(secondLevelCategories);
            setSelectedCategory(secondLevelCategories[0]);
          } catch (error) {
              console.error("Error fetching categories:", error);
          }
        };
        {/* 
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/product/get");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }; */}
        const fetchCategoryBanners = async () => {
          try {
            const response = await fetch("/api/categorybanner"); 
            const res = await response.json();

            if (res.success && res.categoryBanners && res.categoryBanners.banners) {
              const formatted = res.categoryBanners.banners
                .filter(banner => res.categoryBanners.status === "Active") // 👈 only if whole doc is Active
                .map((banner, index) => {
                let obj = {
                  imageUrl: banner.banner_image,
                  redirectUrl: banner.redirect_url,
                };

                // ✅ add extra field only for 1st (index 0) and 3rd (index 2)
                if (index === 0) {
                  obj.categoryname = "SMART PHONE";
                }else if(index === 1){
                  obj.categoryname="AIR CONDITIONER";
                }else if(index === 2){
                  obj.categoryname="REFRIGERATOR";
                }else if(index === 3){
                  obj.categoryname="WASHING MACHINE";
                }

                return obj;
              });

              setCategoryBanner(formatted);
             // console.log("formatted",formatted);
            }
          } catch (error) {
            console.error("Error fetching category banners:", error);
          }
        };
        const fetchSingleBannerData = async () => {
          setIsSingleBannerLoading(true);
          try {
            const response = await fetch("/api/singlebanner");
            const data = await response.json();

            if (data.success && data.banners?.length > 0) {
              const singleBannerItems = data.banners
                .filter((banner) => banner.status === "Active") // ✅ only Active
                .map((banner) => ({
                  id: banner._id,
                redirect_url: banner.redirect_url || "/shop",
                  bgImageUrl: banner.banner_image,
                  singleBannerImageUrl: banner.banner_image,
                }));

              setSingleBannerData({
                singlebanner: { items: singleBannerItems },
              });
            } else {
              // if no data, fallback default
              setSingleBannerData({
                singlebanner: {
                  items: [
                    {
                      id: 1,
                      buttonLink: "/shop",
                      bgImageUrl: "/images/singlebanner-img1.png",
                      singleBannerImageUrl: "/images/singlebanner-product.png",
                    },
                  ],
                },
              });
            }
          } catch (error) {
            console.error("Error fetching single banner data:", error);
            setSingleBannerData({
              singlebanner: {
                items: [
                  {
                    id: 1,
                    buttonLink: "/shop",
                    bgImageUrl: "/images/singlebanner-img1.png",
                    singleBannerImageUrl: "/images/singlebanner-product.png",
                  },
                ],
              },
            });
          } finally {
            setIsSingleBannerLoading(false);
          }
        };
        const fetchSingleBannerDatatwo = async () => {
          setIsSingleBannerLoading(true);
          try {
            const response = await fetch("/api/singlebanner-two");
            const data = await response.json();

            if (data.success && data.banners?.length > 0) {
              const singleBannerItems = data.banners
                .filter((banner) => banner.status === "Active")
                .map((banner) => ({
                  id: banner._id,
                  redirect_url: banner.redirect_url || "/shop",
                  bgImageUrl: banner.banner_image,
                  singleBannerImageUrl: banner.banner_image,
                }));

              setSingleBannerData((prev) => ({
                ...prev,
                singlebannerTwo: { items: singleBannerItems },
              }));
            } else {
              setSingleBannerData((prev) => ({
                ...prev,
                singlebannerTwo: {
                  items: [
                    {
                      id: 1,
                      redirect_url: "/shop",
                      bgImageUrl: "/images/singlebanner-img1.png",
                      singleBannerImageUrl: "/images/singlebanner-product.png",
                    },
                  ],
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching single banner-two data:", error);
            setSingleBannerData((prev) => ({
              ...prev,
              singlebannerTwo: {
                items: [
                  {
                    id: 1,
                    redirect_url: "/shop",
                    bgImageUrl: "/images/singlebanner-img1.png",
                    singleBannerImageUrl: "/images/singlebanner-product.png",
                  },
                ],
              },
            }));
          } finally {
            setIsSingleBannerLoading(false);
          }
        };
        fetchCategoryBanners();
        fetchBannerData();
        fetchFlashSales();
        fetchBrands();
        fetchCategories();
        //fetchProducts();
        fetchSingleBannerData();
        fetchSingleBannerDatatwo();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
      }, []);
    const fetchHomeSections = async () => {
      setIsSectionLoading(true);
      try {
        const response = await fetch("/api/home-sections");
        const data = await response.json();

        if (data.success && data.data?.length > 0) {
          const sectionItems = data.data
            .filter((section) => section.status === "active") // only active
            .map((section) => ({
              id: section._id,
              name: section.name,
              position: section.position,
            }));

          setHomeSectionData({ sections: sectionItems });
        } else {
          setHomeSectionData({ sections: [] });
        }
      } catch (error) {
        console.error("Error fetching home sections:", error);
        setHomeSectionData({ sections: [] });
      } finally {
        setIsSectionLoading(false);
      }
    };
    useEffect(() => {
      fetchHomeSections();
    }, []);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    useEffect(() => {
      if (!hasMounted) return;
      
      // Safe read from localStorage (guard against corrupted JSON)
      try {
        const savedCategories = localStorage.getItem('headerCategories');
        if (savedCategories) {
          try {
            const parsed = JSON.parse(savedCategories);
            if (Array.isArray(parsed)) {
              setCategories(parsed);
            }
          } catch (parseErr) {
            console.warn('Could not parse saved headerCategories from localStorage, ignoring cached value.', parseErr);
          }
        }
      } catch (lsErr) {
        // localStorage may be unavailable in some environments
        console.warn('Unable to read headerCategories from localStorage', lsErr);
      }

      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories/get');
          if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
          }
          const data = await response.json();

          if (!Array.isArray(data)) {
            console.warn('Unexpected categories payload, expected array:', data);
            return;
          }

          // Keep only top-level active categories for header
          const parentCategories = data.filter(
            (category) => category.parentid === "none" && category.status === "Active"
          );

          // Maintain existing UI state update
          setCategories(parentCategories);

          // Trim stored data to minimal fields
          const trimmedForStorage = parentCategories.map((cat) => ({
            _id: cat._id,
            category_name: cat.category_name || cat.name || '',
            slug: cat.category_slug || cat.slug || ''
          }));

          // Prepare JSON and measure size
          const json = JSON.stringify(trimmedForStorage);
          const maxBytes = 4.5 * 1024 * 1024; // 4.5 MB

          try {
            const sizeBytes = (typeof Blob !== 'undefined') ? new Blob([json]).size : json.length;

            if (sizeBytes > maxBytes) {
              console.warn(
                `headerCategories JSON size ${Math.round(sizeBytes / 1024)}KB exceeds ${Math.round(maxBytes / 1024)}KB. ` +
                'Skipping localStorage save and attempting sessionStorage fallback.'
              );
              try {
                sessionStorage.setItem('headerCategories', json);
              } catch (sessErr) {
                console.warn('sessionStorage fallback also failed. Consider using IndexedDB/localforage for caching.', sessErr);
                // TODO: fallback to IndexedDB/localforage (e.g., localForage) for larger datasets
              }
            } else {
              // Try saving to localStorage
              try {
                localStorage.setItem('headerCategories', json);
              } catch (storageErr) {
                // Handle QuotaExceededError and other storage errors
                const isQuotaError = storageErr && (
                  storageErr.name === 'QuotaExceededError' ||
                  storageErr.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
                  storageErr.code === 22 ||
                  storageErr.code === 1014
                );

                if (isQuotaError) {
                  console.warn('localStorage quota exceeded when saving headerCategories, attempting sessionStorage fallback.', storageErr);
                  try {
                    sessionStorage.setItem('headerCategories', json);
                  } catch (sessErr) {
                    console.warn('sessionStorage fallback failed as well. Consider IndexedDB/localforage caching.', sessErr);
                    // TODO: fall back to IndexedDB/localforage
                  }
                } else {
                  console.warn('Failed to save headerCategories to localStorage', storageErr);
                }
              }
            }
          } catch (measureErr) {
            console.warn('Could not measure headerCategories size, attempting best-effort save to localStorage.', measureErr);
            try {
              localStorage.setItem('headerCategories', json);
            } catch (err) {
              console.warn('Saving headerCategories failed.', err);
            }
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories();
      checkAuthStatus();
    }, [hasMounted]);
    const controls = useAnimation();
    const refs = {
      banner: useRef(null),
      flashSales: useRef(null),
      delivery: useRef(null),
    };
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserData(data.user);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    const isInView = {
      banner: useInView(refs.banner, { once: true, amount: 0.1 }),
      flashSales: useInView(refs.flashSales, { once: true, amount: 0.1 }),
      delivery: useInView(refs.delivery, { once: true, amount: 0.1 }),
    };
    useEffect(() => {
      if (isInView.banner) {
        controls.start("visible");
      }
    }, [isInView.banner, controls]);
    const CustomPrevArrow = ({ onClick }) => (
      <button onClick={onClick} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"> ◀ </button>
    );
    const CustomNextArrow = ({ onClick }) => (
      <button onClick={onClick} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"> ▶ </button>
    );
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />,
    };
    const flashSalesSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [
          { 
              breakpoint: 1024,
              settings: {
              slidesToShow: 2,
              }
          },
          {
              breakpoint: 768,
              settings: {
              slidesToShow: 1,
              }
          }
      ]
    };
    const brandSettings = {
      infinite: true,
      speed: 3000, // Continuous effect
      slidesToShow: 8, // Default for large screens
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 0,
      cssEase: "linear",
      arrows: false,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024, // Tablets
          settings: {
            slidesToShow: 6,
          },
        },
        {
          breakpoint: 768, // Mobile
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 480, // Extra-small devices
          settings: {
            slidesToShow: 3,
          },
        },
      ],
    };
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
        when: "beforeChildren",
          staggerChildren: 0.2
        }
      }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
            duration: 0.5,
            ease: "easeOut"
            }
        }
    };
    const sectionVariants = {
    hiddenDown: { y: 50, opacity: 0 },
    hiddenUp: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
      duration: 0.6,
        ease: "easeOut"
      }
    }
    };
    const categoryRef = useRef(null);
    const [singleBannerData, setSingleBannerData] = useState({
      singlebanner: { items: [] }
    });
    const [isSingleBannerLoading, setIsSingleBannerLoading] = useState(false);
    const categoryScrollRefs = useRef({});
    const scrollLeft = (categoryId) => {
      if (categoryScrollRefs.current[categoryId]) {
        categoryScrollRefs.current[categoryId].scrollBy({ left: -300, behavior: "smooth" });
      }
    };
    const scrollRight = (categoryId) => {
      if (categoryScrollRefs.current[categoryId]) {
        categoryScrollRefs.current[categoryId].scrollBy({ left: 300, behavior: "smooth" });
      }
    }; 

const showArrows = categories.length > 10;
/*     const scrollLeftArrow = () => {
  if (containerRef.current) {
    containerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  }
};

const scrollRightArrow = () => {
  if (containerRef.current) {
    containerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  }
}; */

const scrollLeftArrow = () => {
  containerRef.current?.scrollBy({
    left: -260,
    behavior: "smooth",
  });
};

const scrollRightArrow = () => {
  containerRef.current?.scrollBy({
    left: 260,
    behavior: "smooth",
  });
};



    const getSubcategorySlugs = (parentId) => {
      return categories
        .filter(cat => cat.parentid === parentId)
        .map(sub => sub.category_slug);
    };
    const handleProductClick = (product) => {
      if (navigating) return;
      setNavigating(true);
      const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const alreadyViewed = stored.find((p) => p._id === product._id);
      const updated = alreadyViewed  ? stored.filter((p) => p._id !== product._id) : stored;
        updated.unshift(product);
        const limited = updated.slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    };
    const handleCategoryClick = useCallback((category) => (e) => {
      if (navigating) {
          e.preventDefault();
          return;
      }
      setNavigating(true);
      router.push(`/category/${category.category_slug}`);
    }, [navigating, router]);
    useEffect(() => {
      const handleRouteChange = () => setNavigating(false);

      if (!router?.events?.on) return;

      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('routeChangeError', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        router.events.off('routeChangeError', handleRouteChange);
      };
    }, [router]);
    const featuredCategory = parentCategories[0];
    const dealCategories = parentCategories.slice(1, 4);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const [offers, setOffers] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const bgClasses = ["bg-purple-50", "bg-green-50", "bg-amber-50", "bg-pink-50"];
    useEffect(() => {
      const fetchOfferProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const res = await fetch('api/offers/offer-products', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          const data = await res.json();
  
          if (data.success) {
            setOfferProducts(data.data);
          }
        } catch (err) {
          console.error("Error loading offer products", err);
        }
      };
  
      fetchOfferProducts();
    }, []);
    const [singleBannerNewData, setSingleBannerNewData] = useState({
      singlebanner_new: { items: [] }
    });
    const [isSingleBannerNewLoading, setIsSingleBannerNewLoading] = useState(false);
    const fetchSingleBannerNewData = async () => {
      setIsSingleBannerNewLoading(true);
      try {
        const response = await fetch("/api/singlebanner");
        const data = await response.json();

        if (data.success && data.banners?.length > 0) {
          const bannerItems = data.banners
            .filter((banner) => banner.status === "Active")
            .map((banner) => ({
              id: banner._id,
              redirect_url: banner.redirect_url || "/shop",
              bgImageUrl: banner.banner_image,
            }));

          setSingleBannerNewData({
            singlebanner_new: { items: bannerItems },
          });
        } else {
          setSingleBannerNewData({
            singlebanner_new: {
              items: [
                {
                  id: 1,
                  redirect_url: "/shop",
                  bgImageUrl: "/images/default-singlebanner.png",
                },
              ],
            },
          });
        }
      } catch (error) {
        console.error("Error fetching singlebanner_new:", error);
      } finally {
        setIsSingleBannerNewLoading(false);
      }
    };
    useEffect(() => {
      fetchSingleBannerNewData();
    }, []);
    const [singleBannerTwoData, setSingleBannerTwoData] = useState({
      singlebanner_two: { items: [] },
    });
    const [isSingleBannerTwoLoading, setIsSingleBannerTwoLoading] = useState(false);
    const fetchSingleBannerTwoData = async () => {
      setIsSingleBannerTwoLoading(true);
      try {
        const response = await fetch("/api/singlebanner-two");
        const data = await response.json();

        if (data.success && data.banners?.length > 0) {
          const bannerItems = data.banners
            .filter((banner) => banner.status === "Active")
            .map((banner) => ({
              id: banner._id,
              redirect_url: banner.redirect_url || "/shop",
              bgImageUrl: banner.banner_image,
            }));

          setSingleBannerTwoData({
            singlebanner_two: { items: bannerItems },
          });
        } else {
          setSingleBannerTwoData({
            singlebanner_two: {
              items: [
                {
                  id: 1,
                  redirect_url: "/shop",
                  bgImageUrl: "/images/default-singlebanner.png",
                },
              ],
            },
          });
        }
      } catch (error) {
        console.error("Error fetching singlebanner_two:", error);
      } finally {
        setIsSingleBannerTwoLoading(false);
      }
    };
    useEffect(() => {
      fetchSingleBannerTwoData();
    }, []);
    

    const [TwoBannerTwoData, setTwoBannerTwoData] = useState({
  twobanner: { items: [] },
});
const [isTwoBannerTwoLoading, setIsTwoBannerTwoLoading] = useState(false);

const fetcTwoBannerTwoData = async () => {
  setIsTwoBannerTwoLoading(true);
  try {
    const response = await fetch("/api/twobanner");
    const data = await response.json();

    if (data.success && Array.isArray(data.banners)) {
      const bannerItems = data.banners
        .filter(b => b.status === "Active")
        .sort((a, b) => a.order - b.order)
        .slice(0, 2) // ✅ ONLY 2 images
        .map(banner => ({
          id: banner._id,
          redirect_url: banner.redirect_url,
          bgImageUrl: banner.banner_image,
        }));

      setTwoBannerTwoData({
        twobanner: { items: bannerItems },
      });
    }
  } catch (error) {
    console.error("Two banner fetch error:", error);
  } finally {
    setIsTwoBannerTwoLoading(false);
  }
};

useEffect(() => {
  fetcTwoBannerTwoData();
}, []);

const renderSection = (sectionName) => {
      switch(sectionName) {
case 'brands':
              return (
              <motion.section id="brands"
                      ref={refs.delivery} 
                      initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'} 
                      animate= 'visible' 
                      variants={sectionVariants} 
                      className="px-4 sm:px-6 md:px-6 pt-7"
                  >
                      <div>
                          <motion.div variants={containerVariants} className="  rounded-[23px] mx-2">
                              <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
                                 
                                  <h2 className="text-xl md:text-2xl font-semibold mb-2">Shop by Brands</h2>
                              </motion.div>
                              <hr className="border-t-2 border-gray-300 mb-4" />

                              {isBrandsLoading ? (
                                  <div className="flex justify-center items-center h-32">
                                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                  </div>
                              ) : (
                                  <motion.div variants={itemVariants}>
                                      <Slider {...brandSettings} className="brand-slider px-0 relative">
                                          {brands
                                        .filter(
                                          (brand) =>
                                            brand.brand_name &&
                                            brand.brand_name.toLowerCase() !== "no brand"
                                        ).map((brand) => (
                                              <motion.div
                                                  key={brand.id}
                                                  className="p-1 flex justify-center items-center"
                                                  whileHover={{ scale: 1.1 }}
                                              >
                                              <div className="w-32 h-24 flex items-center justify-center overflow-hidden">
                                                <Link href={`/brand/${slugify(brand.brand_name)}`}>
                                                  <Image
                                                    src={`/uploads/Brands/${brand.image}`}
                                                    alt={brand.brand_name || "Brand Logo"}
                                                    width={128}
                                                    height={128}
                                                    className="object-contain w-full h-full cursor-pointer"
                                                    unoptimized
                                                  />
                                                </Link>
                                              </div>
                                              </motion.div>
                                          ))}
                                      </Slider>
                                  </motion.div>
                              )}
                          </motion.div>
                           <hr className="border-t-2 border-gray-300 mb-4" />
                      </div>
                  </motion.section>
              );
              default:
              return null;
      }
      
    }

// Map section names from API to our component names
        const getSectionComponentName = (sectionName) => {
            const mapping = {
                'categorybanner': 'category_banner',
                'flashsale': 'flash_sales',
                'Brands': 'brands',
                'topbanner' : 'topbanner',
                'features' : 'features',
                'product'  :'product',
                // Add more mappings as needed
            };
            
            return mapping[sectionName] || sectionName.toLowerCase();
        };


    return (
        <>
          {navigating && (
            <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
              <div className="p-4 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </div>
          )}
            {isLoading && (
              <div className="preloader fixed inset-0 z-[9999] flex justify-center items-center bg-white">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            )}
            {/* main div start */}
            <div className={`relative transition-opacity duration-300 overflow-hidden ${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`} ref={containerRef} >
                
                {/* Banner Section start */}

                <motion.section  id="topbanner" ref={refs.banner} initial="hidden" animate="visible" variants={containerVariants} className="overflow-hidden pt-0 m-0">
                  <div className="relative">
                    {isBannerLoading ? (
                      <div className="p-6 flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    ) : bannerData.banner.items.length > 0 ? (
                      bannerData.banner.items.length > 1 ? (
                        <Slider {...settings} className="relative">
                          {bannerData.banner.items.map((banner) => (
                            <motion.div
                              key={banner.id}
                              className="relative w-full aspect-[2000/867] max-h-auto"
                              variants={itemVariants}
                            >
                              <div className="absolute inset-0 overflow-hidden">
                                <Image
                                  src={banner.bgImageUrl}
                                  alt="Banner"
                                  fill
                                  quality={100}
                                  className="object-fill w-full h-full"
                                  style={{ objectPosition: "center 30%" }}
                                  priority
                                />
                              </div>
                              {/* Clickable accessible banner - REMOVED HOVER EFFECT */}
                              <div
                                className="absolute inset-0 overflow-hidden cursor-pointer"
                                role="link"
                                tabIndex={0}
                                aria-label={banner?.alt || banner?.redirectUrl || "Banner"}
                                onClick={() => {
                                  const href = banner?.redirectUrl;
                                  if (!href) return;
                                  if (href.startsWith("/")) {
                                    router.push(href);
                                  } else {
                                    window.location.href = href;
                                  }
                                }}
                                onKeyDown={(e) => {
                                  const href = banner?.redirectUrl;
                                  if (!href) return;
                                  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                    e.preventDefault();
                                    if (href.startsWith("/")) {
                                      router.push(href);
                                    } else {
                                      window.location.href = href;
                                    }
                                  }
                                }}
                              >
                                <Image
                                  src={banner.bgImageUrl}
                                  alt={banner?.alt || "Banner"}
                                  fill
                                  quality={100}
                                  className="object-fill w-full h-full"
                                  style={{ objectPosition: "center 30%" }}
                                  priority
                                />
                              </div>
                            </motion.div>
                          ))}
                        </Slider>
                      ) : (
                        <motion.div
                          className="p-4 md:p-6 relative aspect-[2000/667] max-h-auto"
                          variants={itemVariants}
                        >
                          <div className="absolute inset-0 flex justify-center items-center bg-white">
                            <Image
                              src={bannerData.banner.items[0].bgImageUrl}
                              alt="Banner"
                              fill
                              className="object-fill w-full h-full"
                              priority
                            />
                          </div>
                        </motion.div>
                      )
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {/* ================= ROUND CATEGORY ICONS ================= */}
                  <div className="relative bg-white py-2">
                    {/* LEFT ARROW */}
                    {(showArrows || true) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollLeft -= 300;
                          }
                        }}
                        className="absolute left-1 top-1/2 -translate-y-1/2
                                  bg-white p-2 rounded-full shadow"
                      >
                        <FiChevronLeft size={22} />
                      </button>
                    )}
                    {/* RIGHT ARROW */}
                    {(showArrows || true) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollLeft += 300;
                          }
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2
                                  bg-white p-2 rounded-full shadow"
                      >
                        <FiChevronRight size={22} />
                      </button>
                    )}
                    {/* <div ref={scrollContainerRef} className="flex items-start lg:justify-center justify-start gap-8 overflow-x-hidden no-scrollbar px-4 md:px-10">  */}
                    <div ref={scrollContainerRef} className="flex items-start lg:justify-center justify-start overflow-x-hidden no-scrollbar px-4 md:px-10" style={{ columnGap: "5%" }}>
                      {categories.map((cat) => (
                        <Link key={cat._id} href={`/category/${cat.category_slug}`}>
                          <div className="flex flex-col items-center min-w-[70px] sm:min-w-[100px] cursor-pointer">
                            {/* ICON TILE */}
                            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.category_name}
                                  className="h-9 w-11 sm:h-12 sm:w-14 object-contain [filter:invert(1)_drop-shadow(0_0_2px_rgba(255,255,255,0.9))_drop-shadow(0_0_1px_rgba(255,255,255,0.9))]"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/30 rounded-full" />
                              )}
                            </div>

                            {/* TEXT */}
                            <span
                              className="mt-2 text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 group-hover:text-black text-center break-words w-[70px] sm:w-[100px] leading-tight">
                              {cat.category_name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.section>
                {/* <div className="home-container bg-gradient-to-r from-[#1688C8] to-[#33a7b5]"> */}
                <div className="home-container bg-gradient-to-br from-[#B0D7EE] via-[#ffffff] to-[#E4F1F9]">

                  {/* Best of Apple */}
                  <div className="py-2 px-2 lg:px-6 relative">
                    <CategoryBestofApple/>
                  </div>

                  {/* LATEST @ UNILET STORES */}
{/*
                  <section className="px-4 md:px-6 py-8">
                    <h2 className="text-xl md:text-2xl font-bold mb-6">Latest @Unilet</h2>
                    <div className="relative max-w-12xl mx-auto">
                      
                      <button className="unilet-prev absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/70">‹</button>
                      
                      <button className="unilet-next absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/70">›</button>
                      <Swiper modules={[Autoplay, Navigation]} autoplay={{ delay: 3000, disableOnInteraction: false }}
                        navigation={{
                          prevEl: ".unilet-prev",
                          nextEl: ".unilet-next",
                        }} loop slidesPerView={1} className="rounded-xl overflow-hidden">
                        
                        <SwiperSlide>
                          <Link href="/category/mobiles-tablets/smart-phone">
                            <img src="uploads/flashsale/Banner-1.png" alt="Unilet" className="w-full h-[260px] md:h-[380px] lg:h-[420px]"/>
                          </Link>
                        </SwiperSlide>

                       
                        <SwiperSlide>
                          <Link href="/category/mobiles-tablets/mobile-phones">
                            <img src="uploads/flashsale/Banner-2.png" alt="Unilet" className="w-full h-[260px] md:h-[380px] lg:h-[420px]"/>
                          </Link>
                        </SwiperSlide>

                        
                      </Swiper>
                    </div>
                  </section>

                */}

                   {/* Unilet Brands */}
                  {/* <section className="px-4 md:px-8 py-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Brand Spotlight</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
                       */}
                      {/* Image 1 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/brand/preethi`}>
                        <img
                          src="uploads/aboutus/whats-hot-unilet-mg.png"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                        
                      </div> */}

                      {/* Image 2 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/brand/voltas`}>
                        <img
                          src="uploads/aboutus/whats-hot-unilet-ac.png"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 3 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/brand/lg`}>
                        
                        <img
                          src="uploads/aboutus/whats-hot-unilet.png"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 4 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/brand/apple`}>
                       
                        <img
                          src="uploads/aboutus/whats-hot-unilet-mb.png"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                         </Link>
                      </div>

                    </div>
                  </section> */}

            {/* Google Pixel 9 Banner Section */}
<section className="px-4 md:px-8 py-8"> {/* Increased vertical padding (py-8) for breathing room */}
  <Link 
    href="/product/google-pixel-mobile-pixel-xl-9-pro-256gb" 
    className="block overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="relative w-full h-[180px] sm:h-[250px] md:h-[320px] lg:h-[385px]"> 
      {/* Height logic:
         - Mobile: 180px (keeps it from looking like a thin line)
         - Tablet: 250px
         - Desktop: 380px (large and impactful)
      */}
      <img
        src="/uploads/aboutus/G-Pixel-9.jpeg" 
        alt="Google Pixel 9 Pro XL"
        className="w-full h-full object-fill rounded-2xl" 
        /* 'object-cover' ensures the image fills the space without stretching the faces/phones */
      />
    </div>
  </Link>
</section>
           {/* --- Section 1: Brand Spotlight --- */}
<section className="px-4 md:px-8 py-10">
  <h2 className="text-xl md:text-2xl font-semibold mb-8 text-black">Brand Spotlight</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">  
    {[
      { href: "/brand/preethi", src: "uploads/aboutus/whats-hot-unilet-mg.png" },
      { href: "/brand/voltas", src: "uploads/aboutus/whats-hot-unilet-ac.png" },
      { href: "/brand/lg", src: "uploads/aboutus/whats-hot-unilet.png" },
      { href: "/brand/apple", src: "uploads/aboutus/whats-hot-unilet-mb.png" },
      { href: "/brand/zebronics", src: "uploads/aboutus/zebronics.jpeg" }
    ].map((item, i) => (
       <div
        key={i}
        className={`hover:scale-[1.03] transition-transform duration-300 ${
          i === 4 ? "hidden lg:block" : ""
        }`}
      >
        <Link href={item.href}>
         <div className="w-full aspect-[4/5] rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={item.src} 
              alt="Brand Spotlight" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
            />       
          </div>    
        </Link>
      </div>
    ))}
    
    <div className="hidden lg:block"></div>
  </div>
</section>


                  {/* Best Value for you */}
                  <section className="px-4 md:px-8 py-4">
                    <h2 className="text-xl md:text-2xl font-bold mb-2">Best Value for you</h2>
                    {/* Best of Apple */}
                    <div className="mt-1">
                      <CategoryBestofValue/>
                    </div>
                    <div className="w-full py-4 px-0"> {/* Removed the extra px-4 md:px-8 to fix the squeeze */}
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
    
    {/* Image 1: Helping You Get More Value */}
    <Link 
      href="/category/home-appliances" 
      className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[180px]">
        <img
          src="uploads/aboutus/Banner-Image-1.jpeg" /* Make sure this matches your filename */
          alt="Get More Value"
          className="w-full h-full object-stretch object-center"
        />
      </div>
    </Link>

    {/* Image 2: Deals Corner */}
    <Link 
      href="/category/offers" 
      className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[180px]">
        <img
          src="uploads/aboutus/Banner-Image-2.jpeg" /* Make sure this matches your filename */
          alt="Deals Corner"
          className="w-full h-full object-fill object-center"
        />
      </div>
    </Link>

  </div>
</div>
                  </section>



                  




                  {/* Best for the season */}
                  {/* <div className=" py-5 px-6 relative">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                      <CategoryProducts/>
                    </div>
                   
                  </div> */}

                 

                  <div className="py-2 px-2 lg:px-6 relative">
                      <CategoryProducts/>
                  </div>

                  {/* What's Hot */}
                  {/* <section className="px-4 md:px-8 py-2">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">What's Hot</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5"> */}
                      
                      {/* Image 1 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/brand/realme`}>
                        <img
                          src="uploads/aboutus/HP_What'sHot_RealmeP4x_02Jan2026_ZNy77FWpt.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                        
                      </div> */}

                      {/* Image 2 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/televisions`}>
                        <img
                          src="uploads/aboutus/HP_What'sHot_TVs_02Jan2026_8MouoeMk4B.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 3 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/home-appliances`}>
                        
                        <img
                          src="uploads/aboutus/HP_What'sHot_WM_02Jan2026_Yt-KWCCDR.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 4 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/mobiles-accessories/mobile-phones/iphone`}>
                       
                        <img
                          src="uploads/aboutus/HP_What'sHot_iPad11_02Jan2026_PhoUjE9mF.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                         </Link>
                      </div>

                    </div>
                  </section> */}

          <DoubleBanner/>
     {/* --- Section 2: What's Hot --- */}
<section className="px-4 md:px-8 py-10">
  <h2 className="text-xl md:text-2xl font-semibold mb-8 text-black">What's Hot</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {[
      { href: "/brand/realme", src: "uploads/aboutus/HP_What'sHot_RealmeP4x_02Jan2026_ZNy77FWpt.webp" },
      { href: "/category/tv-entertainment", src: "uploads/aboutus/HP_What'sHot_TVs_02Jan2026_8MouoeMk4B.webp" },
      { href: "/category/home-appliances", src: "uploads/aboutus/HP_What'sHot_WM_02Jan2026_Yt-KWCCDR.webp" },
      { href: "/category/mobiles-tablets/iphone", src: "uploads/aboutus/HP_What'sHot_iPad11_02Jan2026_PhoUjE9mF.webp" },
       { href: "/category/accessories/stabilizer", src: "uploads/aboutus/Stabilizer.png" }

    ].map((item, i) => (
     <div
        key={i}
        className={`hover:scale-[1.03] transition-transform duration-300 ${
          i === 4 ? "hidden lg:block" : ""
        }`}
      >
        <Link href={item.href}>
          
         <div className="w-full aspect-[4/5] rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={item.src} 
              alt="What's Hot" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
            />
          </div>
          
        </Link>
      </div>
    ))}
    
    <div className="hidden lg:block"></div>
  </div>
</section>

                  {/* UNILET Only */}
                {/*  <div className=" py-10 px-2 lg:px-6 relative">
                     <h2 className="text-white text-2xl font-semibold mb-6">UNILET Only</h2> */}
                    {/* //Left Arrow
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white"
                    >
                      <FiChevronLeft size={28} />
                    </button>

                    //Right Arrow
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white"
                    >
                      <FiChevronRight size={28} />
                    </button>

                    //Products
                    <div className="overflow-hidden">
                      <div
                        className="flex gap-6 transition-transform duration-500"
                        style={{
                          transform: `translateX(-${index * 260}px)`,
                        }}
                      >
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="min-w-[240px] bg-[#1a1a1a] rounded-xl p-4 text-white relative"
                          >
                            <Heart className="absolute top-4 right-4 text-white" size={18} />

                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-40 mx-auto object-contain mb-4"
                            />

                            <h3 className="text-sm font-medium line-clamp-2 mb-2">
                              {product.name}
                            </h3>

                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-semibold">{product.price}</span>
                              <span className="text-gray-400 line-through text-sm">
                                {product.oldPrice}
                              </span>
                            </div>

                            //Rating
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < product.rating
                                      ? "text-green-400"
                                      : "text-gray-500"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div> 
                    <CategoryProductsUnilets/>
                  </div>
*/}
                  {/* Special Deals for you */}
                  {/* <section className="px-4 md:px-8 py-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6">Special Deals for you</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-5">
                       */}
                      {/* Image 1 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/kitchen-appliances/kitchen-appliance/air-fryer`}>
                        
                       
                        <img
                          src="uploads/aboutus/HP_DOTD_AirFryers_02Jan2026_iSrQ_kbJl.jpg"
                          alt="Special Deals for you"
                          className="w-full h-full object-cover"
                        />
                         </Link>
                      </div> */}

                      {/* Image 2 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/sound-systems/speaker`}>
                        <img
                          src="uploads/aboutus/HP_DOTD_BTSpeakers_02Jan2026_-VhhZiYFRG.jpg"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 3 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/accessories`}>
                        <img
                          src="uploads/aboutus/HP_DOTD_Chargers_02Jan2026_i5NEs4ycP.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div> */}

                      {/* Image 4 */}
                      {/* <div className="rounded-xl overflow-hidden bg-[#111] hover:scale-[1.02] transition">
                        <Link href={`/category/gadgets/smart-watches`}>
                        <img
                          src="uploads/aboutus/HP_DOTD_SW_02Jan2026_bvnroJbzi.webp"
                          alt="What's Hot"
                          className="w-full h-full object-cover"
                        />
                        </Link>
                      </div>

                    </div>
                  </section> */}

          {/* --- Section 3: Special Deals for you --- */}
<section className="px-4 md:px-8 py-10">
  <h2 className="text-xl md:text-2xl font-semibold mb-8 text-black">Special Deals for you</h2>
  
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {[
      { href: "/category/kitchen-appliances/kitchen-appliance/air-fryer", src: "uploads/aboutus/HP_DOTD_AirFryers_02Jan2026_iSrQ_kbJl.jpg" },
      { href: "/category/sound-systems/speaker", src: "uploads/aboutus/HP_DOTD_BTSpeakers_02Jan2026_-VhhZiYFRG.jpg" },
      { href: "/category/accessories", src: "uploads/aboutus/HP_DOTD_Chargers_02Jan2026_i5NEs4ycP.webp" },
      { href: "/category/gadgets/smart-watches", src: "uploads/aboutus/HP_DOTD_SW_02Jan2026_bvnroJbzi.webp" },
       { href: "/category/home-appliances/dishwasher", src: "uploads/aboutus/Dishwasher.jpg" },
      
    ].map((item, i) => (
        <div
        key={i}
        className={`hover:scale-[1.03] transition-transform duration-300 ${
          i === 4 ? "hidden lg:block" : ""
        }`}
      >
        <Link href={item.href}>
   <div className="w-full aspect-[4/5] rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={item.src} 
              alt="Special Deals" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-sm"
            />
          </div>
          
        </Link>
      </div>
    ))}
    
    <div className="hidden lg:block"></div>
  </div>
</section>

{/* Banner Section start */} 
              
                  <div className="home-container">
                    {isSectionLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    ) : homeSectionData.sections.length > 0 ? (
                        // Render sections in the order specified by homeSectionData
                        homeSectionData.sections
                            .sort((a, b) => a.position - b.position)
                            .map(section => (
                                <div key={section.id}>
                                    {renderSection(getSectionComponentName(section.name))}
                                </div>
                            ))
                    ) : (
                        // Fallback order if no sections are configured
                        <>
                            {renderSection('brands')}
                        </>
                    )}
                  </div>
                  
                  <section className="px-4 md:px-8 py-6">
                    {/* <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
                     Onsite Service Options: UniShield, Unisure, UniCare, UniGuard, UniProtect, UniSafe
                    </h2> */}
                    {/* <h2 className="text-xl md:text-2xl font-semibold mb-6">
                    UniCare
                    </h2> */}

                    {/* <div className="overflow-hidden pt-0 m-0 bg-transparent">
                      
                      Image 1
                      <div className="rounded-xl overflow-hidden  bg-transparent hover:scale-[1.01] transition">
                        <img
                          src="uploads/unicare-banner-appliances-uni-care.png"
                          alt="Special Deals for you"
                          className="w-full h-auto block"
                        />
                      </div>
                    </div> */}
                  </section>
                  <BlogDetailsImagehome /> 
                </div>


                

                {/* <ToastContainer /> */}
                {/* <RecentlyViewedProducts />  */}

           </div>
            <StatusBar /> 
            <DetailsPageFooter /> 
        </>
    ); 
}
