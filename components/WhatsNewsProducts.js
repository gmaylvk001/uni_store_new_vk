// components/WhatsNewsProducts.jsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Addtocart from "@/components/AddToCart";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "react-feather";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
const WhatsNewsProducts = () => {
    const [startIndex, setStartIndex] = useState(0);
    const router = useRouter();
    const [navigating, setNavigating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [clickElement, setClickElement] = useState(null);
    const [brandMap, setBrandMap] = useState([]);
    const [products, setProducts] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
        fetch("/api/product/whats-new")
        .then((res) => res.json())
        .then(setProducts)
        .catch(console.error);
    }, []);
  
    useEffect(() => {
        fetchBrand();
    }, []);


    useEffect(() => {
        const fetchRecentProductsWithBrands = async () => {
            setIsLoading(true);
            const storedString = localStorage.getItem('recentlyViewed');
            let stored_new = [];

            try {
                stored_new = JSON.parse(storedString) || [];
            } catch (e) {
                stored_new = [];
            }

            // Step 2: Ensure it's an array
            if (!Array.isArray(stored_new)) {
                stored_new = [];
            }

            // Step 3: Filter quantity > 0
            const stored = stored_new.filter(product => product.quantity > 0);

            // Step 4: Log the result
            //console.log(stored);

            // Step 5: Use stored directly (no JSON.parse here!)
            if (stored.length === 0) {
                setIsLoading(false);
                return;
            }

            // stored is already an array of products
            const products = stored;

            try {
                const response = await fetch("/api/brand");
                const result = await response.json();
                
                if (result.error) {
                    console.error(result.error);
                    setRecentProducts(products); // Use products without brand names if fetch fails
                } else {
                    const brandData = result.data;
                    const brandMap = {};
                    brandData.forEach((b) => {
                        brandMap[b._id] = b.brand_name;
                    });

                    // Map brand names to products before setting state
                    const productsWithBrands = products.map(product => ({
                        ...product,
                        brand: brandMap[product.brand] || product.brand // Use brand name if found, otherwise keep original
                    }));
                    setRecentProducts(productsWithBrands);
                }
            } catch (error) {
                console.error(error.message);
                setRecentProducts(products); // Fallback to products without brand names
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecentProductsWithBrands();
    }, []); // Run only once when the component mounts



    const handleProductClick = (product) => {
        if (navigating) return;
        
        setNavigating(true);
        const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const updated = stored.filter(p => p._id !== product._id);
        updated.unshift(product);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated.slice(0, 10)));
        router.push(`/product/${product.slug || product._id}`);
    };

    const [brands, setBrands] = useState([]);
    const [isBrandsLoading, setIsBrandsLoading] = useState(true);

    useEffect(() => {
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
    fetchBrands();
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {navigating && (
                <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            )}
            
            <section className="bg-white mb-6">
                <div className="container mx-auto px-4">
            
                {/* Title */}
                <div className="mt-6 mb-4">
                    <h1 className="text-2xl font-bold text-[#d72828]">
                    WHAT&apos;S NEW
                    </h1>
                </div>
            
                <div className="relative">
                    <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".whatsnew-next",
                        prevEl: ".whatsnew-prev",
                    }}
                    spaceBetween={40}
                    slidesPerView="auto"
                    >
                    {products.map((product) => {
                        const image = product.images?.[0] || "/placeholder.webp";
            
                        const discount = product.special_price
                        ? Math.round(
                            ((product.price - product.special_price) / product.price) * 100
                            )
                        : null;
            
                        return (
                        <SwiperSlide key={product._id} className="!w-[290px]">
                            {/* CARD */}
                            <div className="relative bg-white border shadow-md rounded-lg overflow-hidden
                                            h-[420px] flex flex-col">
            
                            {/* NEW badge */}
                            <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                New
                            </span>
            
                            {/* Image */}
                            <div className="relative h-[200px] bg-gray-50 flex items-center justify-center">
                                <Link href={`/product/${product.slug}`}>
                                <Image
                                    src={product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`}
                                    alt={product.name}
                                    width={260}
                                    height={200}
                                    className="object-contain transition-transform duration-300 hover:scale-105"
                                />
                                </Link>
                            </div>
            
                            {/* Details */}
                            <div className="p-3 text-sm flex flex-col flex-1">
            
                                {/* Product Name */}
                                <Link
                                href={`/product/${product.slug}`}
                                className="block font-medium text-gray-800 hover:text-blue-600
                                            line-clamp-2 min-h-[40px]"
                                >
                                {product.name}
                                </Link>
            
                                {/* Price Section - pushed to bottom */}
                                <div className="mt-auto flex items-center gap-2 pt-3">
                                <span className="text-lg font-semibold text-gray-900">
                                    ₹{product.special_price || product.price}
                                </span>
            
                                {product.special_price && (
                                    <>
                                    <span className="line-through text-gray-400 text-sm">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-green-600 text-xs font-medium">
                                        {discount}% off
                                    </span>
                                    </>
                                )}
                                </div>
                            </div>
                            </div>
                        </SwiperSlide>
                        );
                    })}
                    </Swiper>
            
                    {/* Navigation */}
                    <div className="whatsnew-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                    ‹
                    </div>
                    <div className="whatsnew-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                    ›
                    </div>
                </div>
                </div>
            </section>
        </>
    );
};

export default WhatsNewsProducts;
