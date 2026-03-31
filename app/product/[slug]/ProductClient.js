'use client';


import ProductDetailsSection from "@/components/ProductDetailsSection";
// import RelatedProducts from "@/components/RelatedProducts";
import {  useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShieldHalf } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaStore } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { FaShoppingCart, FaHeart, FaShareAlt, FaRupeeSign, FaCartPlus, FaBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { IoFastFoodOutline, IoReload, IoCardOutline, IoShieldCheckmark, IoStorefront } from "react-icons/io5";
import Link from "next/link";
import { useCart } from '@/context/CartContext';
import { useModal } from '@/context/ModalContext';
import ProductCard from "@/components/ProductCard";
import ProductAddtoCart from "@/components/ProductAddtoCart"
import Addtocart from "@/components/AddToCart";
import ProductBreadcrumb from "@/components/ProductBreadcrumb";
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts';
import RelatedProducts from "@/components/RelatedProducts";
import PayUOffers from "@/components/PayUOffers";
import { v4 as uuidv4 } from "uuid";

export default function ProductClient() {
  const router = useRouter(); 
  const { slug } = useParams();
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [brand, setBrand] = useState([]);
   const [selectedRelatedProducts, setSelectedRelatedProducts] = useState([]);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productUnavailable, setProductUnavailable] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedWarrantyAmount, setSelectedWarrantyAmount] = useState(0);
  const [showNoWarrantyModal, setShowNoWarrantyModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(true);

const [deliveryInfo, setDeliveryInfo] = useState(null);

const [pincode, setPincode] = useState("");
const [pincodeError, setPincodeError] = useState("");
const [checkingPincode, setCheckingPincode] = useState(false);

const [addOnProducts, setAddOnProducts] = useState([]);
useEffect(() => {
  const saved = localStorage.getItem("deliveryInfo");
  if (saved) {
    setDeliveryInfo(JSON.parse(saved));
  }
}, []);


/* const addOnIds = product?.add_ons
  ? product.add_ons.split(",").map(id => id.trim())
  : []; */
  
  const addOnIds = Array.isArray(product?.add_ons)
  ? product.add_ons.map(id => id.toString())
  : [];


  useEffect(() => {
  console.log("useEffect triggered", product?._id, addOnIds);
}, [product?._id]);


/*   useEffect(() => {
  if (!addOnIds.length) return;

  const fetchAddOnProducts = async () => {
    try {
      const res = await fetch("/api/product/addons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: addOnIds }),
      });

      const data = await res.json();
      alert("dsacds");
      console.log(data);
      setAddOnProducts(data.products || []);
    } catch (err) {
      console.error("Add-on product fetch error", err);
    }
  };

  fetchAddOnProducts();
}, [product?._id]); */



/* useEffect(() => {
  if (!product?.add_ons) return;

  // const ids = product.add_ons.split(",").map(id => id.trim());
  const ids = Array.isArray(product?.add_ons)
  ? product.add_ons.map(id => id.toString())
  : [];
  if (!ids.length) return;

  console.log("Calling add-on API with IDs:", ids);

  const fetchAddOnProducts = async () => {
  try {
    alert("nsdbckja");
    const res = await fetch("/api/product/addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      // console.error("API failed:", res.status);
      setAddOnProducts([]);
      return;
    }

    const text = await res.text(); // 👈 IMPORTANT
    if (!text) {
      console.warn("Empty API response");
      setAddOnProducts([]);
      return;
    }

    const data = JSON.parse(text); // 👈 safe parse
    setAddOnProducts(data.products || []);
  } catch (err) {
    console.error("Add-on fetch failed", err);
    setAddOnProducts([]);
  }
};


  fetchAddOnProducts();
  console.log("dfgkudsfhaiushfdiuds",product);
}, [product]); */


useEffect(() => {
  if (!Array.isArray(product?.add_ons) || product.add_ons.length === 0) return;

  const ids = product.add_ons.map(id => id.toString());

  const fetchAddOnProducts = async () => {
    try {
      const res = await fetch("/api/product/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      setAddOnProducts(data.products || []);
    } catch (e) {
      setAddOnProducts([]);
    }
  };

  fetchAddOnProducts();
}, [product?.add_ons]);



const checkPincode = async () => {
  if (pincode.length !== 6) {
    setPincodeError("Enter valid 6 digit pincode");
    return;
  }

  try {
    setCheckingPincode(true);
    setPincodeError("");

    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await res.json();

    if (data[0]?.Status !== "Success") {
      setPincodeError("Delivery not available to this pincode");
      return;
    }

    const postOffice = data[0].PostOffice[0];

    const info = {
      pincode,
      city: postOffice.District,
      state: postOffice.State,
      days: 2,
    };

    setDeliveryInfo(info);
    localStorage.setItem("deliveryInfo", JSON.stringify(info));
  } catch (err) {
    setPincodeError("Something went wrong");
  } finally {
    setCheckingPincode(false);
  }
};


const handleDecrease = () => {
  setQuantity(Math.max(1, quantity - 1));
  setQuantityWarning(false); // clear warning when decreasing
};
const handleIncrease = () => {
  if (quantity < product.quantity) {
    setQuantity(quantity + 1);
    setQuantityWarning(false); // clear warning if under limit
  } else {
    setQuantityWarning(true); // show warning if exceeding
  }
};




// // Function to fetch category products
//   useEffect(() => {
//     const fetchCategoryProducts = async () => {
//       try {
//         const res = await fetch(`/api/product/category/${categoryId}?limit=5`);
//         const data = await res.json();
//         if (data.success) {
//           setCategoryProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching category products:", error);
//       }
//     };

//     if (categoryId) fetchCategoryProducts();
//   }, [categoryId]);



const { updateCartCount } = useCart();
  const { openAuthModal } = useModal();
const handleBuyNow = async () => {
  //console.log("Buying now with warranty:", selectedWarranty, selectedExtendedWarranty);
  try {
    const token = localStorage.getItem("token");

    let isLoggedIn = false;
    let userData = null;

    /*

    // ✅ Check authentication
    const response = await fetch("/api/auth/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const data = await response.json();
    if (!data.loggedIn) {
      openAuthModal({
        error: "Please log in to continue.",
        onSuccess: () => handleBuyNow(), // retry on success
      });
      return;
    }
      */

    if (token) {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      isLoggedIn = data.loggedIn;
      userData = data.user;

          //updateHeaderdetails({ user: data.user });
          //setIsLoggedIn(true);
          //const role = data.role;
          //if(role == 'admin'){
            //setIsAdmin(true);
          //}
        }

        // ✅ If not logged in → use guestCartId
        let guestCartId = null;
        if (!isLoggedIn) {
          guestCartId = localStorage.getItem("guestCartId") || uuidv4();
          localStorage.setItem("guestCartId", guestCartId);
        }

    // ✅ Add main product

    /*
    const cartResponse = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
        selectedWarranty: selectedWarranty,
        selectedExtendedWarranty: selectedExtendedWarranty,
      }),
    });

    */

     // ✅ Add main product to cart
    const cartResponse = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        productId: product._id,
        quantity,
        selectedWarranty: selectedWarranty,
        selectedExtendedWarranty: selectedExtendedWarranty,
        ...(guestCartId && { guestCartId }), // ✅ include only if guest
      }),
    });

    if (!cartResponse.ok) {
      throw new Error("Failed to add main product to cart");
    }

    // ✅ Add frequent & related products
    const additionalProducts = [
      ...selectedFrequentProducts.map((p) => p._id),
      ...selectedRelatedProducts.map((p) => p._id),
    ];
    
    /*
    if (additionalProducts.length > 0) {
      await Promise.all(
        additionalProducts.map(async (id) => {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: id, quantity: 1 }),
          });
          if (!res.ok) throw new Error("Failed to add extra product");
        })
      );
    } */

    
    // ✅ Add additional products (if any)
    if (additionalProducts.length > 0) {
      await Promise.all(
        additionalProducts.map(async (id) => {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              productId: id,
              quantity: 1,
              ...(guestCartId && { guestCartId }),
            }),
          });
          if (!res.ok) throw new Error("Failed to add additional product");
        })
      );
    }

    const cartData = await cartResponse.json();
    updateCartCount(cartData.cart.totalItems + additionalProducts.length);

    // ✅ Build Buy Now items
    const items = [
  {
    ...product,
    quantity,
    warranty: selectedWarranty || 0,             // ✅ add warranty
    extendedWarranty: selectedExtendedWarranty || 0, // ✅ add extended warranty
  },
  ...selectedFrequentProducts.map((p) => ({ ...p, quantity: 1 })),
  ...selectedRelatedProducts.map((p) => ({ ...p, quantity: 1 })),
];


    const total = items.reduce((sum, item) => {
  const basePrice =
    (item.special_price && item.special_price > 0
      ? item.special_price
      : item.price) * item.quantity;

  const warrantyCost = (item.warranty || 0) * item.quantity;
  const extendedCost = (item.extendedWarranty || 0) * item.quantity;

  return sum + basePrice + warrantyCost + extendedCost;
}, 0);


    // ✅ Save Buy Now state in localStorage
    /*
    localStorage.setItem(
      "buyNowData",
      JSON.stringify({
        cart: { items },
        total,
      })
    );
    */

    // ✅ Redirect
    window.location.href = "/checkout";
  } catch (err) {
    console.error("Buy Now error:", err);
  }
};




const warranties = product?.extend_warranty || [];



  // In your ProductPage component, add these state variables near the top:
const [selectedFrequentProducts, setSelectedFrequentProducts] = useState([]);
const [cartTotal, setCartTotal] = useState(0);
const [selectedWarranty, setSelectedWarranty] = useState(null);
const [selectedExtendedWarranty, setSelectedExtendedWarranty] = useState(null);

  const [quantityWarning, setQuantityWarning] = useState(false);

// Add this function to handle frequent product selection
const toggleFrequentProduct = (product) => {
  setSelectedFrequentProducts(prev => {
    const existingIndex = prev.findIndex(p => p._id === product._id);
    if (existingIndex >= 0) {
      return prev.filter(p => p._id !== product._id);
    } else {
      return [...prev, product];
    }
  });
};

 // Fetch related products
  // // Fetch related products
  // const fetchRelatedProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`/api/product/related?productId=${product._id}`);
  //     const data = await res.json();
      
  //     if (!res.ok) {
  //       throw new Error(`API error: ${res.status} ${res.statusText}`);
  //     }

  //     if (res.ok && data.success) {
  //       setRelatedProducts(data.products || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching related products:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (product?._id) {
  //     fetchRelatedProducts(product._id);
  //   }
  // }, [product]);

  


  const categoryId = product?.category;
  const currentProductId = product?._id;
  const brandId = product?.brand;
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `/api/product/relatedpro?category=${categoryId}&brand=${brandId}&exclude=${currentProductId}&limit=5`
        );
        const data = await res.json();
       // console.log("current related products is:", data);

        if (res.ok) {
          if (data.success && data.products) {
            setRelatedProducts(data.products);
          } else if (data.relatedProducts) {
            setRelatedProducts(data.relatedProducts);
          } else {
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (categoryId && brandId) fetchRelatedProducts();
  }, [categoryId, brandId, currentProductId]);


  const toggleRelatedProduct = (product) => {
    setSelectedRelatedProducts(prev => {
      const existingIndex = prev.findIndex(p => p._id === product._id);
      if (existingIndex >= 0) {
        return prev.filter(p => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

//  Add this useEffect to calculate the cart total whenever selected products change
 // Calculate cart total
  useEffect(() => {
    let total = product ? (product.special_price || product.price) * quantity : 0;

    selectedFrequentProducts.forEach(item => {
      total += (item.special_price || item.price);
    });
    
    // NEW: Add selected related products to total
    selectedRelatedProducts.forEach(item => {
      total += (item.special_price || item.price);
    });

    if (selectedWarranty) total += selectedWarranty;
    if (selectedExtendedWarranty) total += selectedExtendedWarranty;

    setCartTotal(total);
  }, [selectedFrequentProducts, selectedRelatedProducts, product, quantity, selectedWarranty, selectedExtendedWarranty]);

useEffect(() => {
  const fetchFeaturedProducts = async () => {
    if (!product?.featured_products?.length) return;

    const res = await fetch('/api/product/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: product.featured_products }),
    });

    const data = await res.json();
    setFeaturedProducts(data);
  };
  

  fetchFeaturedProducts();
}, [product]);

useEffect(() => {
  const savedIds = JSON.parse(localStorage.getItem("selectedFrequentProductIds") || "[]");
  if (savedIds.length && featuredProducts.length > 0) {
    const matchedProducts = featuredProducts.filter(p => savedIds.includes(p._id));
    setSelectedFrequentProducts(matchedProducts);
  }
}, [featuredProducts]);
// derived main image
const mainImage = product?.images?.[selectedImageIndex] || "/no-image.jpg";

// helper to resolve full path
const resolveImagePath = (image) => {
  if (!image) return "/no-image.jpg";
  if (
    image.startsWith("http") ||
    image.startsWith("blob:") ||
    image.startsWith("data:") ||
    image.startsWith("/")
  ) return image;
  return `/uploads/products/${image}`;
};


  const [selectedImage, setSelectedImage] = useState(null);

      useEffect(() => {
        if (product?.images?.[0]) {
          // setSelectedImage(`/uploads/products/${product.images[0]}`);
           setSelectedImage(product.images[0]);
        }
      }, [product]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomContainerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");     // <-- declare this
  const [showGoHome, setShowGoHome] = useState(false);
  const [showZoomLens, setShowZoomLens] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
   const zoomLensRef = useRef(null);
   const zoomResultRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [showWarrantyModal, setshowWarrantyModal] = useState(false);
  const [showGstInvoiceModal, setshowGstInvoiceModal] = useState(false);

  // ###### Show Customer Reviews ###### //
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${slug}`);
        
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        if (!response.ok) {
    // Instead of throwing an error, handle it gracefully
    setErrorMessage("Content not loading. Please try again later.");
    setShowGoHome(true);
    return;
  }
        
        const data = await response.json();
         // ✅ Final client-side check
        if (data.status !== "Active") {
          setProductUnavailable(true);
          setLoading(false);
          return;
        }
        // console.log(data);
        
        // If API returns an array, find the product with matching slug
        if (Array.isArray(data)) {
          const foundProduct = data.find(p => p.slug === slug);
          if (!foundProduct) {
            throw new Error("Product not found");
          }
          setProduct(foundProduct);
        } 
        // If API returns a single product object
        else if (data && data.slug) {
          setProduct(data);
          // ###### Fetch Customer Reviews ###### //
          try {
            // fetch reviews
            const reviewsRes = await fetch(`/api/reviews/${data._id}`);
            const reviewsData = await reviewsRes.json();
 
            if (reviewsData.success) {
              setReviews(reviewsData.reviews);
              setAvgRating(reviewsData.avgRating);
              setReviewCount(reviewsData.count);
            }
          } catch (error) {
            console.error("Error fetching product or reviews:", error);
          }
 
        }
        else {
          throw new Error("Invalid product data");
        }
  
        if (product?.images?.length > 0) {
          setSelectedImage(`/uploads/products/${product.images[0]}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
  if (selectedFrequentProducts.length > 0) {
    localStorage.setItem("selectedFrequentProducts", JSON.stringify(selectedFrequentProducts));
  } else {
    localStorage.removeItem("selectedFrequentProducts");
  }
}, [selectedFrequentProducts]);


  
  useEffect(() => {
  if (featuredProducts?.length > 0) {
    const stored = localStorage.getItem("selectedFrequentProducts");
    if (stored) {
      const storedProducts = JSON.parse(stored);
      // Match only products still in the featured list
      const validSelected = featuredProducts.filter(fp =>
        storedProducts.some(sp => sp._id === fp._id)
      );
      setSelectedFrequentProducts(validSelected);
    }
  }
}, [featuredProducts]);


const fetchBrand = async () => {
    try {
      const response = await fetch("/api/brand");
      const result = await response.json();
      if (result.error) {
     // console.error(result.error);
      } else {
        const data = result.data;
  
        // Format for react-select
        const brandOptions = data.map((b) => ({
          value: b._id,
          label: b.brand_name,
        }));
  
        setBrand(brandOptions);
        // 👉 If you already have the ID and want to get the label (e.g., when editing)
        if (product?.brand) {
  const matched = brandOptions.find((b) => b.value === product.brand);
  // if (matched) console.log("Selected Brand Name:", matched.label);
}

      }
    } catch (error) {
  console.error(error.message);
    }
  };

  useEffect(() => {
      fetchBrand();
    }, []);



  const handleThumbnailClick = (index) => {
  const imagePath = product.images?.[index];

  if (imagePath) {
    // Use same logic as main image src
    const finalSrc =
      imagePath.startsWith("http") ||
      imagePath.startsWith("blob:") ||
      imagePath.startsWith("data:")
        ? imagePath
        : `/uploads/products/${imagePath}`;

    setSelectedImage(finalSrc);
  }
};

  // Handle mouse movement for zoom lens
  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomLensRef.current || !zoomResultRef.current) return;
    
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    // Keep position within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    setZoomPosition({ x: boundedX, y: boundedY });
    
    // Position the lens
    zoomLensRef.current.style.left = `calc(${boundedX}% - 75px)`;
    zoomLensRef.current.style.top = `calc(${boundedY}% - 75px)`;
    
    // Update the zoom result
    zoomResultRef.current.style.backgroundPosition = `${boundedX}% ${boundedY}%`;
  };

  const handleMouseEnter = () => {
    setShowZoomLens(true);
  };

  const handleMouseLeave = () => {
    setShowZoomLens(false);
  };

  const openLightbox = (index = 0) => {
  if (product?.images && product.images.length > 0) {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setSelectedImage(product.images[index]);
  }
};


  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
  if (!product?.images || product.images.length === 0) return;

  let newIndex;
  if (direction === "prev") {
    newIndex =
      (selectedImageIndex - 1 + product.images.length) % product.images.length;
  } else {
    newIndex = (selectedImageIndex + 1) % product.images.length;
  }

  setSelectedImageIndex(newIndex);
};

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'ArrowRight') navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);





  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-500">{error}</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (productUnavailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-6 py-12">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Product Unavailable</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">This product is currently not available. Please check back later or explore other products.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.name ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.images) {
    return null; // or return a skeleton/loading spinner
  }
  

  return (
    <>
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* 🟠 Wishlist Header Bar */}
      {/* <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Shop Details</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-blue-600 font-semibold">Shop Details</span>
        </div>
      </div> */}

      {errorMessage && (
  <div className="text-center mt-10">
    <p className="text-red-600 text-lg mb-3">{errorMessage}</p>
    {showGoHome && (
      <a
        href="/"
        className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        Go to Home Page
      </a>
    )}
  </div>
)}


      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-8">
         {/* Breadcrumb - moved outside the grid but inside container */}
         <ProductBreadcrumb product={product} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Section - Product Image with Zoom */}
          <div className="md:col-span-4 relative sticky top-20">
           <div className="border border-gray-400 rounded-lg">
              {/* Main Image with fixed aspect ratio */}
              <div 
                className="relative aspect-square w-full px-7"
                onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openLightbox(0)}
            ref={zoomContainerRef}
              >
                <img
                  src={resolveImagePath(mainImage) || "/no-image.jpg"}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-contain rounded-xl"
                  ref={imgRef}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.jpg";
                  }}
                />

                {/* 🔹 Lens Overlay */}
           {/* Zoom lens (shown on hover) */}
            {showZoomLens && (
              <div 
                className="absolute border-2 border-white bg-white bg-opacity-30 pointer-events-none"
                style={{
                  width: '150px',
                  height: '150px',
                  left: 0,
                  top: 0,
                  borderRadius: '50%',
                  transform: 'translateZ(0)',
                  zIndex: 10,
                  display: 'block'
                }}
                ref={zoomLensRef}
              />
            )}
            


              </div>

              {/* Zoom Box */}
              {/* Zoom Box */}
{/* Zoom result (shown on hover) */}
           {showZoomLens && (
  <div 
    className="absolute hidden md:block left-full ml-4 top-0 w-full bg-no-repeat bg-white border rounded-lg overflow-hidden"
    style={{
      backgroundImage: `url("${resolveImagePath(product.images[selectedImageIndex])}")`,
      backgroundSize: '200%',
      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      zIndex: 20,
      height: '400px',
      width: '525px'
    }}
    ref={zoomResultRef}
  />
)}




{/* {showZoomLens && (
  <div 
    className="absolute hidden md:block left-full ml-4 top-0 w-full h-3/4 bg-no-repeat bg-white border rounded-lg overflow-hidden"
    style={{
      backgroundImage: `url(${selectedImage})`,
      backgroundSize: '200%',
      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      zIndex: 20,
      maxHeight: '300px' // Added max height limit
    }}
    ref={zoomResultRef}
  />
)} */}
            {/* {showZoomLens && (
              <div 
                className="absolute hidden md:block left-full ml-4 top-0 w-full h-full bg-no-repeat bg-white  rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: '200%',
                  backgroundPosition: '0% 0%',
                  zIndex: 20
                }}
                ref={zoomResultRef}
              />
            )} */}
            </div>

            
           
        

        {/* Thumbnails */}
       {/* Thumbnails */}
<div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mt-1">
  {product.images && product.images.filter(img => img && img.trim() !== "").length > 0 && (
  <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mt-1">
    {product.images
      .filter(img => img && img.trim() !== "") // remove empty or invalid entries
      .map((image, index) => (
        <div key={index} className="flex-shrink-0">
          <img
            src={resolveImagePath(image)}
            alt={`Thumbnail ${index + 1}`}
            className="w-20 h-20 border border-gray-400 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 object-cover"
            onClick={() => setSelectedImageIndex(index)}
            onError={(e) => {
              e.currentTarget.style.display = "none"; // hide if broken
            }}
          />
        </div>
      ))}
  </div>
)}

</div>

{/* Lightbox Modal */}
{lightboxOpen && (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto"
    onClick={closeLightbox}
  >
    <div
      className="relative bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-2xl mx-auto flex flex-col items-center max-h-[80vh] sm:max-h-[70vh] p-3 sm:p-6 mt-[10rem] sm:mt-32"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200 z-50"
        onClick={closeLightbox}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Image */}
     <div className="relative w-full flex items-center justify-center"> 
    <img 
    src={resolveImagePath(product.images[selectedImageIndex])} alt={product?.name || "Product"} 
    className="object-contain max-h-[60vh] sm:max-h-[50vh] w-full  rounded-md" /> 
</div>

      {/* Divider line */}
      <div className="w-full border-t border-gray-300 my-3"></div>

      {/* Thumbnails */}
      {product.images &&
        product.images.filter(
          (img) => img && img.trim() !== '' && img.trim().toLowerCase() !== 'null'
        ).length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
            {product.images
              .filter(
                (img) => img && img.trim() !== '' && img.trim().toLowerCase() !== 'null'
              )
              .map((image, index) => {
                const imgPath =
                  image.startsWith('http') ||
                  image.startsWith('blob:') ||
                  image.startsWith('data:')
                    ? image
                    : `/uploads/products/${image}`;

                return (
                  <img
                    key={index}
                    src={imgPath}
                    alt={`Thumbnail ${index + 1}`}
                    className={`object-cover w-14 h-14 sm:w-16 sm:h-16 rounded-sm cursor-pointer transition-transform duration-300 hover:scale-105 ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    onError={(e) => e.currentTarget.remove()}
                  />
                );
              })}
          </div>
        )}
    </div>
  </div>
)}















          </div>


          {/* Middle Section */}
          <div className="md:col-span-5">
            <h1 className="text-1xl font-semibold">{product.name}</h1>
           <div className="mt-2 pb-3 border-b border-gray-400">
                 {/* Top Row - Item Code and Quantity Label */}
                <div className="flex items-center space-x-2 text-sm mb-1">
                  <span className="text-gray-500 text-xs">{product.item_code}</span>
                </div>

                {/* Bottom Row - All elements in one line */}
                <div className="flex items-center gap-2">
                  {/* Price Section */}
                  <div className="flex items-baseline gap-2">
                    {(Number(product.special_price) > 0 || Number(product.price) > 0) && (
                      <>
                        <span className="text-2xl font-bold text-blue-800">
                          ₹{Math.round(Number(product.special_price) || Number(product.price)).toLocaleString("en-IN")}
                        </span>

                        {Number(product.special_price) > 0 && Number(product.price) > 0 && (
                          <span className="text-gray-800 line-through text-sm">
                           MRP ₹ {Math.round(Number(product.price)).toLocaleString("en-IN")}
                          </span>
                        )}
                      </>
                    )}
                  </div>


                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-full h-8 w-max">
                    <button 
                      onClick={handleDecrease} 
                      className="px-2 py-1 border-r text-xs"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 text-xs w-6 text-center">{quantity}</span>
                    <button 
                      onClick={handleIncrease} 
                      className="px-2 py-1 border-l text-xs"
                    >
                      +
                    </button>
                  </div>

      
                  {/* Add to Cart Button */}
                  <div className="flex gap-4 flex-wrap items-start">
                    {/* <div className="flex-shrink-0">
                      <Addtocart
                        productId={product._id}
                        stockQuantity={product.quantity}
                        quantity={quantity}
                        additionalProducts={selectedFrequentProducts.map(p => p._id)}
                        warranty={selectedWarranty}
                        extendedWarranty={selectedExtendedWarranty}
                        selectedFrequentProducts={selectedFrequentProducts}
                      />
                    </div> */}

                    {product.quantity > 0 && (
                    <div className="flex-grow mt-2">
                      <ProductCard productId={product._id} />
                    </div>
                  )}

                  </div>

                
                </div>
                {quantityWarning && (
                <p className="text-red-600 text-xs font-medium"> 
                  ⚠ You can't order more than {product.quantity} item{product.quantity > 1 ? "s" : ""}.(Stock only {product.quantity} items)
                </p>
                )} 
            </div>
            {/* <p className="text-gray-700 text-sm mt-3 font-medium">
              {product.sku || "N/A"}
            </p> */}
            
            {/* Color Variant Section */}
            {/* <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
              <div className="flex gap-[10px] mt-1">
              {product.variants && product.variants.length > 0 ? (
                  product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img 
                        src={variant.image} 
                        alt={`Variant ${index + 1}`} 
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                        
                      />
                    </div>
                  ))
                ) : (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="w-[80px] h-[80px] bg-gray-200 rounded-md" />
                  ))
                )}
              </div>
            </div> */}

            {product.variants && product.variants.length > 0 && (
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
                <div className="flex gap-[10px] mt-1">
                  {product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img 
                        src={variant.image} 
                        alt={`Variant ${index + 1}`} 
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Stock Alert */}
            <div className="mt-4">
              {/* <p className="font-semibold">⚠ Products are almost sold out</p> */}

              {product.quantity < 5 ? (
                <p className="font-semibold text-red-600">⚠ Products are almost sold out</p>
              ) : (
                <p className="font-semibold text-green-600">✅ In stock. Order anytime.</p>
              )}
              <p className="text-gray-600 text-sm mt-1">
  {product.quantity && product.quantity > 0 ? (
    <>Available only: <span className="font-bold">{product.quantity}</span></>
  ) : (
    <span className="text-red-600 font-bold">No stock</span>
  )}
</p>

            </div>



{/* <div className="flex gap-3 w-full py-2">
 {product.stock_status === "In Stock" && product.quantity > 0 && (
  <button onClick={handleBuyNow} className="w-full bg-white hover:bg-customBlue hover:text-white text-customBlue border border-blue-200 font-semibold py-3 rounded-md shadow-md flex items-center justify-center gap-3">
    <FaStore className="h-5 w-5" />
    <span>Buy Now</span>
  </button>
)}
  <ProductAddtoCart productId={product._id} stockQuantity={product.quantity} quantity={quantity}
    additionalProducts={[
      ...selectedFrequentProducts.map((p) => p._id),
      ...selectedRelatedProducts.map((p) => p._id),
    ]} selectedRelatedProducts={selectedRelatedProducts} extendedWarranty={selectedWarrantyAmount} selectedFrequentProducts={selectedFrequentProducts} className="w-full bg-customBlue hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-md text-center" />
</div> */}


            {/* Add this code right after the Stock Alert section */}
              {/* <div className="border-2 border-customBlue rounded-lg overflow-hidden bg-blue-50 shadow-md mt-4">
              
                <div className="bg-customBlue px-4 py-3 rounded-t-lg">
                  <h3 className="text-base font-semibold text-white">
                    EMI OPTIONS AVAILABLE
                  </h3>
                </div>

               
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/emi-bank-logos.png" 
                        alt="Bank Logos" 
                        className="h-6 w-auto"
                      />
                      <span className="text-sm text-blue-700">
                        From <span className="font-bold">₹{Math.floor((product.special_price || product.price) / 6)}</span>/month
                      </span>
                    </div>
                    <button className="text-sm font-semibold text-blue-700 hover:underline">
                      View Plans
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    Credit Card EMI available on orders above ₹5,000
                  </p>
                </div>
              </div> */}

{/* <h4><b>Available offers</b></h4> */}
                  
                           
                           <PayUOffers
                             amount={product.special_price}
                             skuId={product._id || product.id || product.product_id}
                             skuAmount={product.special_price}
                           />
 
 {/* 🚚 Delivery Check */}
<div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
  <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
    <TbTruckDelivery className="text-lg" />
    Delivery Options
  </h3>

  {!deliveryInfo ? (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode"
          className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
        />
        <button
          onClick={checkPincode}
          disabled={checkingPincode}
          className="px-4 py-2 bg-customBlue text-white text-sm rounded-md"
        >
          {checkingPincode ? "Checking..." : "Check"}
        </button>
      </div>

      {pincodeError && (
        <p className="text-red-600 text-xs mt-1">{pincodeError}</p>
      )}
    </>
  ) : (
    <div className="text-sm space-y-1">
      <p className="text-green-600 font-semibold">
        ✔ Delivery available
      </p>
      <p>
        Deliver to{" "}
        <span className="font-semibold">
          {deliveryInfo.city}, {deliveryInfo.pincode}
        </span>
      </p>
      <p className="text-gray-600">
        Delivery in {deliveryInfo.days} days
      </p>

      <button
        onClick={() => {
          setDeliveryInfo(null);
          localStorage.removeItem("deliveryInfo");
        }}
        className="text-xs text-blue-600 underline mt-2"
      >
        Change pincode
      </button>
    </div>
  )}
</div>



{/* EMI Modal */}
{showEMIModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">EMI Options</h3>
        <button 
          onClick={() => setShowEMIModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Credit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'HDFC Bank', tenure: '3 Months', emi: Math.floor((product.special_price || product.price) / 3) },
              { bank: 'ICICI Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'SBI Card', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
              { bank: 'Axis Bank', tenure: '12 Months', emi: Math.floor((product.special_price || product.price) / 12) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Debit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'Kotak Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'IndusInd Bank', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t text-sm">
        <p className="text-gray-600 mb-2">* Interest rates may vary based on your bank's policies</p>
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          onClick={() => setShowEMIModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}







            {/* Product More Info */}

            {/* <div className="mt-4 bg-gray-50 p-4 rounded-md">
              Static Title
              <h3 className="text-sm font-semibold text-gray-900 mb-3">MORE INFO</h3>

              <div className="flex flex-row gap-4">
                // Image Section (Left)
                <div className="w-[30%] flex-shrink-0">
                  <img
                    src={resolveImagePath(mainImage) || "/no-image.jpg"}
                    alt={product?.name || "Product"}
                    className="w-full h-auto max-w-[150px] max-h-[150px] object-contain rounded-md border border-gray-200 mx-auto"
                  />
                </div>
                
                // Content Section (Right)
                <div className="w-[70%] flex flex-col">
                  Brand Information
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Brand</h4>
                    <p className="text-gray-700 text-sm">
                      {brand.find((b) => b.value === product.brand)?.label || "No Brand Info Available"}
                    </p>
                  </div>

                  // Quantity Information
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Available Quantity</h4>
                    <p className="text-gray-700 text-sm">
                      {product.quantity ? `${product.quantity} units available` : "Out of stock"}
                    </p>
                    {product.quantity && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, product.quantity)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div className="border-b border-gray-400 mt-2"></div> */}
            {/* Product feature section */}
           {/*  <div className="mt-4 bg-gray-50 p-4 rounded-md">
              // Static Title
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT FEATURES</h3>

              <div className="mt-3">
                {(() => {
                  let features = [];

                  if (product?.key_specifications) {
                    if (Array.isArray(product.key_specifications)) {
                      features = product.key_specifications.flatMap(item =>
                        // 🔥 Smart split: split by comma NOT inside parentheses
                        item.split(/,(?![^(]*\))/)
                      );
                    } else if (typeof product.key_specifications === "string") {
                      features = product.key_specifications.split(/,(?![^(]*\))/);
                    }
                  }

                  // 🔥 Clean & filter
                  const cleanedFeatures = features
                    .map(f => String(f).replace(/[{}\[\]"]/g, "").trim())
                    .filter(f => f.length > 0);

                  return cleanedFeatures.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {cleanedFeatures.map((feature, index) => (
                        <li key={index}>
                          {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-500">No features available.</span>
                  );
                })()}
              </div>
            </div> */}
            {/* <div className="border-b border-gray-400 mt-2"></div> */}
            {/* <div className="mt-4 bg-gray-50 p-4 rounded-md">
              Static Title
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT HIGHLIGHTS</h3>

              <div className="mt-3 overflow-auto">
                {Array.isArray(product.product_highlights) &&
                product.product_highlights
                  .flatMap(item => item.split(/[\n,]+/).map(i => i.trim()))
                  .filter(item => item.length > 0).length > 0 ? (
                  <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2">Key</th>
                        <th className="border px-3 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.product_highlights
                        .flatMap(item => item.split(/[\n,]+/).map(i => i.trim()))
                        .filter(item => item.length > 0)
                        .map((item, index) => {
                          const cleanedItem = item
                            .replace(/[\[\]{}"]/g, '') // remove braces, brackets, quotes
                            .replace(/\s+/g, ' ')
                            .trim();
                          const [key, ...rest] = cleanedItem.split(':');
                          const value = rest.join(':').trim();
                          return (
                            <tr key={index} className="bg-white even:bg-gray-50">
                              <td className="border px-3 py-2 font-medium">{key?.trim()}</td>
                              <td className="border px-3 py-2">{value || '-'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-xs">No highlights available.</p>
                )}
              </div>
            </div>
          <div className="border-b border-gray-400 mt-2"></div> */}

          <div className="mt-4">
	   
            {/* Responsive 3 Boxes Section */}
            <div className="mt-3 flex flex-col md:flex-row md:justify-between gap-2 space-y-2 md:space-y-0">
              {/* Replacement Box 
              <div
                className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
                onClick={() => setShowReplacementModal(true)}
              >
              <span className="text-3xl mr-3 mt-1">
            <Icon icon="mdi:refresh" className="text-blue-600" />
          </span>
                <div>
                  <div className="text-sm font-semibold text-blue-800">Replacement</div>
                  <div className="text-xs text-blue-600">in 7 days</div>
                </div>
              </div>
            
            */}

              {/* Warranty Box 
              <div
                className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
                onClick={() => setshowWarrantyModal(true)}
              >
                <span className="text-3xl mr-3 mt-1">
            <Icon icon="mdi:shield" className="text-blue-500" />
          </span>
                <div>
                  <div className="text-sm font-semibold text-blue-800">Warranty</div>
                  <div className="text-xs text-blue-600">in 1 Year</div>
                </div>
              </div>
            
            */}

              {/* GST Invoice Box 
              <div
                className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
                onClick={() => setshowGstInvoiceModal(true)}
              >
                <span className="text-yellow-500 text-xl mr-3 mt-1">📄</span>
                <div>
                  <div className="text-sm font-semibold text-blue-800">GST Invoice</div>
                  <div className="text-xs text-blue-600">Available</div>
                </div>
              
              
              </div>
            */}
            
            </div>

            {/* Modal */}
            {showReplacementModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">Replacement</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setShowReplacementModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>Please go through the mentioned Replacement policy before placing an order.</p>
                    <p>
                      Should you receive an item with physical damages, please note that you should
                      contact us within 48 hours, (In the case of Brands like Apple, 24 hours), without
                      using the product and without breaching Poorvika's Online Replacement Policy. If
                      you fail to follow these, the replacement claim will become void.
                    </p>
                    <p>
                      Products you purchased from Poorvika Online are only eligible for Replacement, under
                      the following conditions during delivery:
                    </p>
                    <ul className="list-disc pl-6">
                      <li>Physical Damage to the Product</li>
                      <li>Defective Product</li>
                      <li>Wrong product received</li>
                      <li>Broken Seal</li>
                    </ul>
                    <p className="font-semibold">Replacement of Mobile Phone:</p>
                    <p>
                      In case you receive an item that is not in perfect condition, please contact us
                      immediately. Important - DO NOT INSERT THE SIM and DO NOT CONNECT TO WIFI (Adhering
                      to Poorvika's Online Replacement Policy).
                    </p>
                    <p className="font-semibold">Void Claim:</p>
                    <p>
                      Please note that if you do not abide by Poorvika Online's Replacement Policy and/or
                      on ignoring your duties as stated above, you agree that your claim for replacement
                      will become a VOID CLAIM.
                    </p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/cancellation-refund-policy"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            {showWarrantyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">Warranty</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setshowWarrantyModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>1 Year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories.</p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/privacypolicy"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            {showGstInvoiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">GST Invoice</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setshowGstInvoiceModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>Click here to know more about our T & C</p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/shipping"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* Modals - Keep your existing code for modals */}
          </div>








          </div>

          {/* Right Section - Seller Info */}
          <div className="md:col-span-3 w-full max-w-sm flex flex-col space-y-4">
 
  {/* ================= Box: Featured + Warranty + Related ================= */}
 {featuredProducts?.filter(item => item.stock_status === "In Stock").length > 0 && (
  <div className="border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
    <div className="px-4 py-4 border-b border-gray-300">
      <h3 className="font-semibold text-sm text-gray-800 underline mb-4">
        Frequently Bought Together:
      </h3>

      {featuredProducts.map((item) => (
        <div key={item._id} className="flex items-start mb-4">
          <input
            type="checkbox"
            className="mt-2 mr-3"
            checked={selectedFrequentProducts.some(p => p._id === item._id)}
            onChange={() => toggleFrequentProduct(item)}
          />
          <div className="flex items-start gap-3">
            {item.images?.[0] && (
              <img
                src={'/uploads/products/' + item.images[0]}
                alt={item.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <div className="text-sm">
              <Link
                href={`/product/${item.slug}`}
                className="block mb-1"
                onClick={() => handleProductClick(item)}
              >
                <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
                  {item.name}
                </h3>
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-red-600">
                  ₹ {(
                    item.special_price &&
                    item.special_price > 0 &&
                    item.special_price !== "0" &&
                    item.special_price < item.price
                      ? item.special_price
                      : item.price
                  ).toLocaleString("en-IN")}
                </span>

                {item.special_price &&
                  item.special_price > 0 &&
                  item.special_price !== "0" &&
                  item.special_price < item.price && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹ {item.price.toLocaleString("en-IN")}
                    </span>
                  )}
              </div>

              <h4
                className={`text-xs ${
                  item.stock_status === "In Stock"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.stock_status}
                {item.stock_status === "In Stock" && item.quantity
                  ? `, ${item.quantity} units`
                  : ""}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

  
  {/* Warranty Section
  {(product?.warranty || product?.extended_warranty) && (
    <div className="px-4 py-4 border-b border-gray-300">
      <h4 className="text-sm font-semibold text-blue-600 mb-2">
        Want to protect your product?
      </h4>

      {product?.warranty && (
        <>
          <p className="text-sm font-bold text-gray-800 underline mb-2">
            Accidental and Liquid Damage Protection Plan
          </p>
          <div className="text-sm text-gray-800 space-y-2 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="protection"
                className="mr-2"
                checked={selectedWarranty === product.warranty}
                onClick={() =>
                  setSelectedWarranty(prev =>
                    prev === product.warranty ? null : product.warranty
                  )
                }
                readOnly
              />
              <label>
                1 Year Accidental And Liquid Damage
                <span className="text-green-600 font-bold ml-2">
                  ₹ {product.warranty}
                </span>
              </label>
            </div>
          </div>
        </>
      )}

      {product?.extended_warranty && (
        <>
          <p className="text-sm font-bold text-gray-800 underline mb-2">
            Extended Warranty
          </p>
          <div className="text-sm text-gray-800">
            <div className="flex items-center">
              <input
                type="radio"
                name="extended"
                className="mr-2"
                checked={selectedExtendedWarranty === product.extended_warranty}
                onClick={() =>
                  setSelectedExtendedWarranty(prev =>
                    prev === product.extended_warranty ? null : product.extended_warranty
                  )
                }
                readOnly
              />
              <label>
                1 Year Extended Warranty Protection
                <span className="text-green-600 font-bold ml-2">
                  ₹ {product.extended_warranty}
                </span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  )} Similar Products*/}
{addOnProducts.filter(
  (item) => item.quantity > 0 && item.status === "Active"
).length > 0 && (
<div className="border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
    <div className="px-4 py-4">
      <h2 className="text-sm font-bold text-customBlue underline mb-2">
        Add Ons
      </h2>
  {addOnProducts.filter((item) => item.quantity > 0 && item.status === "Active").slice(0, 5).map((item) => (
    <div key={item._id} className="flex items-start mb-4 ">
      {item.quantity > 0 && (
        <input
          type="checkbox"
          className="mt-2 mr-3"
          checked={selectedRelatedProducts.some(p => p._id === item._id)}
          onChange={() => toggleRelatedProduct(item)}
        />
      )}

      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Link
          href={`/product/${item.slug}`}
          onClick={() => handleProductClick(item)}
        >
          {item.images?.[0] && (
            <img
              src={`/uploads/products/${item.images[0]}`}
              alt={item.name}
              className="w-16 h-16 object-contain"
            />
          )}
        </Link>

        <div className="text-sm flex-1 min-w-0">
          <Link
            href={`/product/${item.slug}`}
            onClick={() => handleProductClick(item)}
          >
            <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
              {item.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-red-600">
              ₹ {(item.special_price > 0 ? item.special_price : item.price).toLocaleString("en-IN")}
            </span>
          </div>

          <h4 className={`text-xs ${item.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            {item.stock_status}
          </h4>
        </div>
      </div>
    </div>
  ))}
  </div>
  </div>
  )}
  


{/* {relatedProducts.filter((item) => item.quantity > 0 && item.status === "Active" && addOnIds.includes(item._id.toString())).length > 0 && (
  <div className="border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
    <div className="px-4 py-4">
      <h2 className="text-sm font-bold text-customBlue underline mb-2">
        Add Ons
      </h2>

      {relatedProducts
        .filter((item) => item.quantity > 0 && item.status === "Active" &&
      addOnIds.includes(item._id.toString()))
        .slice(0, 3)
        .map((item) => (
          <div key={item._id} className="flex items-start mb-4">
            {item.quantity > 0 && (
              <input
                type="checkbox"
                className="mt-2 mr-3"
                checked={selectedRelatedProducts.some(p => p._id === item._id)}
                onChange={() => toggleRelatedProduct(item)}
              />
            )}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Link
                  href={`/product/${item.slug}`}
                  className="block mb-1"
                  onClick={() => handleProductClick(item)}
                >
              {item.images?.[0] && (
                <img
                  src={'/uploads/products/' + item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 object-contain flex-shrink-0"
                />
              )}
              </Link>
              <div className="text-sm flex-1 min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="block mb-1"
                  onClick={() => handleProductClick(item)}
                >
                  <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-red-600">
                    ₹ {(
                      item.special_price &&
                      item.special_price > 0 &&
                      item.special_price !== "0" &&
                      item.special_price < item.price
                        ? item.special_price
                        : item.price
                    ).toLocaleString("en-IN")}
                  </span>

                  {item.special_price &&
                    item.special_price > 0 &&
                    item.special_price !== "0" &&
                    item.special_price < item.price && (
                      <span className="text-xs text-gray-500 line-through">
                        MRP ₹ {item.price.toLocaleString("en-IN")}
                      </span>
                    )}
                </div>

                <h4
                  className={`text-xs ${
                    item.stock_status === "In Stock"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.stock_status}
                  {item.stock_status === "In Stock" && item.quantity
                    ? `, ${item.quantity} units`
                    : ""}
                </h4>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)} */}
{/*
{relatedProducts?.filter(item => item.stock_status === "In Stock").length > 0 && (
<div className="px-4 py-4 border border-gray-300 rounded-lg shadow-md bg-white max-h-[500px] overflow-y-scroll scrollbar-hide">
        <h2 className="text-sm font-bold text-black underline mb-2">
          Add-ons
        </h2>
        {relatedProducts
          .filter(item => item.stock_status === "In Stock")
          .slice(0, 3)
          .map((item) => (
            <div key={item._id} className="flex items-start mb-4">
              {product?.quantity > 0 && (
              <input
                type="checkbox"
                className="mt-2 mr-3"
                checked={selectedRelatedProducts.some(p => p._id === item._id)}
                onChange={() => toggleRelatedProduct(item)}
              />
            )}
              <div className="flex items-start gap-3">
                {item.images?.[0] && (
                  <img
                    src={'/uploads/products/' + item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="text-sm">
                  <Link
                    href={`/product/${item.slug}`}
                    className="block mb-1"
                    onClick={() => handleProductClick(item)}
                  >
                    <h3 className="text-xs sm:text-sm font-medium text-black hover:text-gray-700 line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>
                  </Link>
  
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-red-600">
                      ₹ {(
                        item.special_price &&
                        item.special_price > 0 &&
                        item.special_price !== "0" &&
                        item.special_price < item.price
                          ? item.special_price
                          : item.price
                      ).toLocaleString("en-IN")}
                    </span>
  
                    {item.special_price &&
                      item.special_price > 0 &&
                      item.special_price !== "0" &&
                      item.special_price < item.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹ {item.price.toLocaleString("en-IN")}
                        </span>
                      )}
                  </div>
  
                  <h4
                    className={`text-xs ${
                      item.stock_status === "In Stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.stock_status}
                    {item.stock_status === "In Stock" && item.quantity
                      ? `, ${item.quantity} units`
                      : ""}
                  </h4>
                </div>
              </div>
            </div>
          ))}
      </div>
  )}
  */}
   {/* <div className="px-4 py-4">
        <h2 className="text-sm font-bold text-customBlue underline mb-2">
          Similar Products
        </h2>
        {relatedProducts
          .filter(item => item.stock_status === "In Stock")
          .slice(0, 3)
          .map((item) => (
            <div key={item._id} className="flex items-start mb-4">
              {product?.quantity > 0 && (
              <input
                type="checkbox"
                className="mt-2 mr-3"
                checked={selectedRelatedProducts.some(p => p._id === item._id)}
                onChange={() => toggleRelatedProduct(item)}
              />
            )}
              <div className="flex items-start gap-3">
                {item.images?.[0] && (
                  <img
                    src={'/uploads/products/' + item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                )}
                <div className="text-sm">
                  <Link
                    href={`/product/${item.slug}`}
                    className="block mb-1"
                    onClick={() => handleProductClick(item)}
                  >
                    <h3 className="text-xs sm:text-sm font-medium text-[#0069c6] hover:text-[#00badb] line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h3>
                  </Link>
  
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-red-600">
                      ₹ {(
                        item.special_price &&
                        item.special_price > 0 &&
                        item.special_price !== "0" &&
                        item.special_price < item.price
                          ? item.special_price
                          : item.price
                      ).toLocaleString("en-IN")}
                    </span>
  
                    {item.special_price &&
                      item.special_price > 0 &&
                      item.special_price !== "0" &&
                      item.special_price < item.price && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹ {item.price.toLocaleString("en-IN")}
                        </span>
                      )}
                  </div>
  
                  <h4
                    className={`text-xs ${
                      item.stock_status === "In Stock"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.stock_status}
                    {item.stock_status === "In Stock" && item.quantity
                      ? `, ${item.quantity} units`
                      : ""}
                  </h4>
                </div>
              </div>
            </div>
          ))}
      </div> */}

{/* </div> */}

 
  {/* ================= Buttons Block (Below Box) ================= */}
  <div className="w-full space-y-3">
    {/* Cart total */}

    {(selectedRelatedProducts.length > 0 ||
    selectedFrequentProducts.length > 0 ||
    selectedWarranty ||
    selectedExtendedWarranty) && (
    <div className="w-full bg-customBlue text-white border border-gray-400 font-semibold py-2 rounded-md shadow-md flex items-center justify-between px-4">
      {/* Left - Icon + Label */}
      <div className="flex items-center gap-2">
        <FaCartPlus className="text-white w-5 h-5" />
        <span className="text-md font-semibold">Cart Total</span>
      </div>

      {/* Right - Price + View Cart */}
      <div className="flex flex-col items-end leading-tight">
        <span className="text-md font-semibold">₹{cartTotal.toLocaleString("en-IN")}</span>
        <Link
          href="/cart"
          className="text-[12px] text-white hover:underline mt-0.5"
        >
          View Cart
        </Link>
      </div>
    </div>
  )}
  
</div>

          </div>
        </div>
        
       
      </div>
     {/* changed code for 3 boxes 13-12-25 */}
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-0 w-full grid grid-cols-1 md:grid-cols-3 gap-3 -mt-7">
        <div className="bg-gray-50 p-4 rounded-md shadow-md h-full">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">MORE INFO</h3>

          <div className="flex flex-row gap-4">
            <div className="w-[30%] flex-shrink-0">
              <img
                src={resolveImagePath(mainImage) || "/no-image.jpg"}
                alt={product?.name || "Product"}
                className="w-full h-auto max-w-[150px] max-h-[150px] object-contain rounded-md border border-gray-200 mx-auto"
              />
            </div>

            <div className="w-[70%] flex flex-col">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Brand</h4>
                <p className="text-gray-700 text-sm">
                  {brand.find((b) => b.value === product.brand)?.label || "No Brand Info Available"}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Available Quantity</h4>
                <p className="text-gray-700 text-sm">
                  {product.quantity ? `${product.quantity} units available` : "Out of stock"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-gray-50 p-4 rounded-md shadow-md h-full">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT FEATURES</h3>

          <div className="mt-2">
            {(() => {
              let features = [];

              if (product?.key_specifications) {
                if (Array.isArray(product.key_specifications)) {
                  features = product.key_specifications.flatMap(item =>
                    item.split(/,(?![^(]*\))/)
                  );
                } else if (typeof product.key_specifications === "string") {
                  features = product.key_specifications.split(/,(?![^(]*\))/);
                }
              }

              const cleanedFeatures = features
                .map(f => String(f).replace(/[{}\[\]"]/g, "").trim())
                .filter(f => f.length > 0);

              return cleanedFeatures.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {cleanedFeatures.map((feature, index) => (
                    <li key={index}>{feature.charAt(0).toUpperCase() + feature.slice(1)}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-500">No features available.</span>
              );
            })()}
          </div>
        </div> */}

        <div className="bg-gray-50 p-4 rounded-md shadow-md h-full">
  <h3 className="text-sm font-semibold text-gray-900 mb-3">
    PRODUCT FEATURES
  </h3>

  <div className="mt-2">
    {(() => {
      let features = [];

      if (product?.key_specifications) {
        const data = product.key_specifications;

        // ✅ CASE 1: HTML UL / LI
        if (typeof data === "string" && data.includes("<li")) {
          features = data
            .replace(/<\/?ul>/gi, "")
            .split(/<\/li>/gi)
            .map(item =>
              item
                .replace(/<li>/gi, "")
                .replace(/<[^>]+>/g, "")
                .trim()
            )
            .filter(Boolean);
        }

        // ✅ CASE 2: Array
        else if (Array.isArray(data)) {
          features = data.flatMap(item =>
            item
              .replace(/<[^>]+>/g, "")
              .split(/,(?![^(]*\))/)
              .map(f => f.trim())
          );
        }

        // ✅ CASE 3: Normal string
        else if (typeof data === "string") {
          features = data
            .replace(/<[^>]+>/g, "")
            .split(/,(?![^(]*\))/)
            .map(f => f.trim());
        }
      }

      return features.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {features.map((feature, index) => (
            <li key={index}>
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-xs text-gray-500">
          No features available.
        </span>
      );
    })()}
  </div>
</div>


        <div className="bg-gray-50 p-4 rounded-md shadow-md h-full">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">PRODUCT HIGHLIGHTS</h3>

          {/* <div className="mt-3 overflow-auto">
            {Array.isArray(product.product_highlights) &&
            product.product_highlights.flatMap(item => item.split(/[\n,]+/)).length > 0 ? (
              <table className="w-full text-xs text-left text-gray-700 border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Key</th>
                    <th className="border px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.product_highlights
                    .flatMap(item => item.split(/[\n,]+/))
                    .map((item, index) => {
                      const [key, ...rest] = item.split(':');
                      const value = rest.join(':').trim();
                      return (
                        <tr key={index} className="bg-white even:bg-gray-50">
                          <td className="border px-3 py-2 font-medium">{key?.trim()}</td>
                          <td className="border px-3 py-2">{value || '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-xs">No highlights available.</p>
            )}
          </div> */}


          <div className="mt-3">
  {(() => {
    let highlights = [];

    if (product?.product_highlights) {
      const data = product.product_highlights;

      // ✅ CASE 1: HTML UL / LI
      if (typeof data === "string" && data.includes("<li")) {
        highlights = data
          .replace(/<\/?ul>/gi, "")
          .split(/<\/li>/gi)
          .map(item =>
            item
              .replace(/<li>/gi, "")
              .replace(/<[^>]+>/g, "")
              .trim()
          )
          .filter(Boolean);
      }

      // ✅ CASE 2: Array
      else if (Array.isArray(data)) {
        highlights = data.flatMap(item =>
          item
            .replace(/<[^>]+>/g, "")
            .split(/[\n,]+/)
            .map(h => h.trim())
        );
      }

      // ✅ CASE 3: Normal string
      else if (typeof data === "string") {
        highlights = data
          .replace(/<[^>]+>/g, "")
          .split(/[\n,]+/)
          .map(h => h.trim());
      }
    }

    return highlights.length > 0 ? (
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {highlights.map((highlight, index) => (
          <li key={index}>
            {highlight.charAt(0).toUpperCase() + highlight.slice(1)}
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-xs text-gray-500">
        No highlights available.
      </span>
    );
  })()}
</div>

        </div>
      </div>


        <div className="space-y-8">
          <ProductDetailsSection 
            product={product} 
            reviews={reviews}
            avgRating={avgRating}
            reviewCount={reviewCount}
          />
           {/* <RecentlyViewedProducts className="w-full" /> */}
         
          
           {/* <RelatedProducts
             className="w-full"
             categoryId={product.category}
             currentProductId={product._id}
           /> */}
         
         
         
         
         
         </div>

    </div>

    {showStickyBar && typeof document !== 'undefined' && createPortal(
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* LEFT: Product name + price */}
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[420px]">
                {product.name}
              </h1>
              {(Number(product.special_price) > 0 || Number(product.price) > 0) && (
                <span className="text-base font-bold text-blue-800">
                  Rs.{Math.round(
                    Number(product.special_price) || Number(product.price)
                  ).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {/* RIGHT: Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {product.stock_status === "In Stock" && product.quantity > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="h-11 px-6 py-3 rounded-md shadow-md bg-[#1689C8] hover:bg-[#1689C8] hover:text-white text-white border border-blue-200 font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <FaStore />
                  Buy Now
                </button>
              )}
              <ProductAddtoCart
                productId={product._id}
                stockQuantity={product.quantity}
                quantity={quantity}
                additionalProducts={[
                  ...selectedFrequentProducts.map(p => p._id),
                  ...selectedRelatedProducts.map(p => p._id),
                ]}
                selectedRelatedProducts={selectedRelatedProducts}
                extendedWarranty={selectedWarrantyAmount}
                selectedFrequentProducts={selectedFrequentProducts}
                className="h-11 px-6 bg-customBlue text-white hover:bg-blue-700 font-semibold py-2 rounded-md shadow-md flex items-center justify-center whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
</>
  );
}


