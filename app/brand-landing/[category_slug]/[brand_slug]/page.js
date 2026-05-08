"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaSortAmountDown, FaSlidersH } from 'react-icons/fa';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "react-feather";
import ProductCard from "@/components/ProductCard";
import Addtocart from "@/components/AddToCart";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from 'react-toastify';
import { Range as ReactRange } from "react-range";

export default function BrandCategoryLandingPage() {
  
  const [categoryData, setCategoryData] = useState({
    category: null,
    brand: null, // Added to store mapped brand info
    brands: [],
    filters: []
  });
  const [products, setProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [], // Will be hard-locked to current brand
    price: { min: 0, max: 100000 },
    filters: []
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const [filterGroups, setFilterGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({}); 
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [wishlist, setWishlist] = useState([]); 
  const [sortOption, setSortOption] = useState('');
  const [showEndMessage, setShowEndMessage] = useState(false);
  
  // NEW: Get mapping slugs from URL
  const { category_slug, brand_slug } = useParams();
  
  const toggleFilters = () => setIsFiltersExpanded(!isFiltersExpanded);
  const toggleBrands = () => setIsBrandsExpanded(!isBrandsExpanded);
  const toggleFilterGroup = (id) => {
    setExpandedFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [currentCategoryBannerIndex, setCurrentCategoryBannerIndex] = useState(0);
  const [nofound, setNofound] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Pagination state (Exactly from your file)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    totalProducts: 0
  });

  const itemsPerPage = 12;
  const productsContainerRef = useRef(null);
  const scrollPositionBeforeFetch = useRef({
    y: 0,
    containerHeight: 0,
    isRestoring: false
  });

  const sentinelRef = useRef(null);
  const router = useRouter(); 

  // Mapping logic: Fetch IDs based on Slugs
  useEffect(() => {
    if (category_slug && brand_slug) {
      fetchInitialData();
      fetchBrand();
    }
  }, [category_slug, brand_slug]);

  const handleProductClick = (product) => {
    const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const alreadyViewed = stored.find((p) => p._id === product._id);
    const updated = alreadyViewed ? stored.filter((p) => p._id !== product._id) : stored;
    updated.unshift(product);
    const limited = updated.slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetches mapping: slugs -> IDs + Category tree
      const res = await fetch(`/api/brand-mapping?category=${category_slug}&brand=${brand_slug}`);
      const data = await res.json();
      
      if (!data.category || !data.brand) {
        router.push('/noproduct');
        return;
      }

      setCategoryData(data);
      
      if (data.products?.length > 0) {
        const prices = data.products.map(p => p.special_price || p.price);
        let minPrice = Math.min(...prices);
        let maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
          minPrice = minPrice - 1;
          maxPrice = maxPrice + 1;
        }

        setPriceRange([minPrice, maxPrice]);
        setSelectedFilters(prev => ({
          ...prev,
          price: { min: minPrice, max: maxPrice },
          brands: [data.brand._id] // Hard-lock current brand
        }));
      }
      
      const groups = {};
      data.filters.forEach(filter => {
        const groupId = filter.filter_group_name;
        if (groupId) {
          if (!groups[groupId]) {
            groups[groupId] = {
              _id: groupId,
              name: filter.filter_group_name,
              slug: filter.filter_group_name.toLowerCase().replace(/\s+/g, '-'),
              filters: []
            };
          }
          groups[groupId].filters.push(filter);
        }
      });
      setFilterGroups(groups);
      
      if (data.products?.length > 0) {
        await fetchFilteredProducts(data, 1, true);
      } else {
        router.push('/noproduct');
      }
    } catch (error) {
      toast.error('Error fetching initial data');
      router.push('/noproduct');
    }
  };

const fetchFilteredProducts = useCallback(async (data, pageNum = 1, initialLoad = false) => {
    try {
      if (!initialLoad) setLoading(true);
      const query = new URLSearchParams();

      // HARD-LOCKED: Uses Category tree MD5 and current Brand ID from mapping
      query.set('sub_category_new', data.category.md5_cat_name);
      query.set('page', pageNum);
      query.set('limit', itemsPerPage);

      // Lock to the mapped brand ID
      if (data.brand?._id) {
        query.set('brands', data.brand._id);
      }

      query.set('minPrice', selectedFilters.price.min);
      query.set('maxPrice', selectedFilters.price.max);
      
      if (selectedFilters.filters.length > 0) {
        query.set('filters', selectedFilters.filters.join(','));
      }

      const res = await fetch(`/api/product/filter?${query}`);
      const { products, pagination: paginationData } = await res.json();

      setProducts(products);
      
      setPagination({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalProducts: paginationData.totalProducts,
        hasNext: paginationData.currentPage < paginationData.totalPages,
        hasPrev: paginationData.currentPage > 1
      });
      
      if (products.length === 0 && pageNum === 1) {
        setNofound(true);
      } else {
        setNofound(false);
      }
      
    } catch (error) {
      console.error("❌ fetchFilteredProducts ERROR:", error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  }, [selectedFilters]);

  const getSortedProducts = () => {
    const sortedProducts = [...products];
    switch(sortOption) {
      case 'price-low-high':
        return sortedProducts.sort((a, b) => a.special_price - b.special_price);
      case 'price-high-low':
        return sortedProducts.sort((a, b) => b.special_price - a.special_price);
      case 'name-a-z':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedProducts;
    }
  };

  const [brandMap, setBrandMap] = useState({});
 
  const fetchBrand = async () => {
    try {
      const response = await fetch("/api/brand");
      const result = await response.json();
      if (!result.error) {
        const data = result.data;
        const map = {};
        data.forEach((b) => { map[b._id] = b.brand_name; });
        setBrandMap(map);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
 
  useEffect(() => {
    fetchBrand();
  }, []);

  const handlePriceChange = (values) => {
    let min = Math.max(1, values[0]);
    let max = Math.max(1, values[1]);
    if (min > max) min = max;
    setSelectedFilters((prev) => ({ ...prev, price: { min, max } }));
  };

  const STEP = 100;
  const MIN = priceRange[0];
  const MAX = priceRange[1];

  const [values, setValues] = useState([
    selectedFilters.price.min,
    selectedFilters.price.max,
  ]);

  useEffect(() => {
    setValues([selectedFilters.price.min, selectedFilters.price.max]);
  }, [selectedFilters.price.min, selectedFilters.price.max]);

  useEffect(() => {
    if (categoryData.category?._id) {
      setPage(1);
      fetchFilteredProducts(categoryData, 1);
    }
  }, [selectedFilters, categoryData.category]);

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [categoryData.brand?._id], // Reset but keep current brand locked
      price: { min: priceRange[0], max: priceRange[1] },
      filters: []
    });
  };
  const handleFilterChange = (type, value) => {
  setSelectedFilters((prev) => {
    const currentFilters = [...prev.filters];
    const index = currentFilters.indexOf(value);

    if (index > -1) {
      // If already selected, remove it
      currentFilters.splice(index, 1);
    } else {
      // If not selected, add it
      currentFilters.push(value);
    }

    return {
      ...prev,
      filters: currentFilters,
    };
  });
};

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchFilteredProducts(categoryData, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if ((loading || !categoryData.category) && page == 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if(values[0] < MIN || values[1] > MAX){
     values[0] = MIN;
     values[1] = MAX;
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    const hasPrev = pagination.currentPage > 1;
    const hasNext = pagination.currentPage < pagination.totalPages;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            pagination.currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!hasPrev}
          className={`p-2 rounded-md ${!hasPrev ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
        >
          <ChevronLeft size={16} />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 border"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 border"
            >
              {pagination.totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!hasNext}
          className={`p-2 rounded-md ${!hasNext ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };
 
  return(
    <div className="container mx-auto px-4 py-2 pb-3 max-w-7xl">
      <h1 className="sr-only">Brand Category Products</h1>
      {/* Banner System */}
      {categoryData.category.banners && categoryData.category.banners.length > 0 && (
        <div className="relative w-full mb-8 rounded-lg overflow-hidden shadow-md">
          <div className="relative w-full aspect-[16/6] sm:aspect-[16/7] lg:aspect-[16/5] cursor-pointer"
            onClick={() => {
              const redirectUrl = categoryData.category.banners[currentCategoryBannerIndex].redirect_url;
              if (redirectUrl) window.location.href = redirectUrl;
            }}
          >
            <Image
              src={categoryData.category.banners[currentCategoryBannerIndex].banner_image}
              alt={categoryData.category.banners[currentCategoryBannerIndex].banner_name || "Banner"}
              fill className="object-cover w-full h-full" unoptimized
            />
            {categoryData.category.banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {categoryData.category.banners.map((_, index) => (
                  <label key={index} className="flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentCategoryBannerIndex(index); }}>
                    <input type="radio" name="banner-indicator" checked={index === currentCategoryBannerIndex} readOnly className="sr-only" />
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${index === currentCategoryBannerIndex ? "bg-white border-white" : "bg-transparent border-white/70"}`}>
                      {index === currentCategoryBannerIndex && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Title with Brand Logo Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-8 items-center mb-6">
        <div className="lg:col-span-1 flex items-center gap-4">
           {categoryData.brand?.image && (
             <div className="w-24 h-12 relative">
                <Image 
                  src={categoryData.brand.image.startsWith('http') ? categoryData.brand.image : `/uploads/Brands/${categoryData.brand.image}`} 
                  alt={categoryData.brand.brand_name} fill className="object-contain" unoptimized 
                />
             </div>
           )}
           <h1 className="text-2xl font-bold text-gray-600 pl-1">
            {categoryData.category.category_name}
           </h1>
        </div>
        <div className="lg:col-span-3 flex justify-between items-center">
          <div className="sm:hidden"><p className="text-sm text-gray-600">{pagination.totalProducts} products found</p></div>
          <div className="hidden sm:flex justify-between items-center w-full">
            <p className="text-sm text-gray-600">{pagination.totalProducts} products found</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-4 py-2 border rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A-Z</option>
                <option value="name-z-a">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Sort + Filter Buttons */}
        <div className="flex border-b border-gray-300 bg-gray-100 sticky top-0 z-30 lg:hidden mb-3">
          <button
            className="flex items-center justify-center gap-2 py-4 flex-1 text-sm font-medium text-gray-800 border-r border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setIsSortPanelOpen(true)}
          >
            <FaSortAmountDown className="text-gray-500 text-xs" /> SORT
          </button>
          <button
            className="flex items-center justify-center gap-2 py-4 flex-1 text-sm font-medium text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setIsFilterPanelOpen(true)}
          >
            <FaSlidersH className="text-gray-500 text-xs" /> FILTER
          </button>
        </div>

        {/* Mobile Sort Modal */}
        {isSortPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 lg:hidden">
            <div className="bg-white w-full rounded-t-2xl p-5">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold">Sort By</h2>
                <button onClick={() => setIsSortPanelOpen(false)}>✕</button>
              </div>
              <ul className="divide-y divide-gray-200 text-sm">
                <li className={`py-3 cursor-pointer ${sortOption === '' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`} onClick={() => { setSortOption(''); setIsSortPanelOpen(false); }}>Featured</li>
                <li className={`py-3 cursor-pointer ${sortOption === 'price-low-high' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`} onClick={() => { setSortOption('price-low-high'); setIsSortPanelOpen(false); }}>Price: Low to High</li>
                <li className={`py-3 cursor-pointer ${sortOption === 'price-high-low' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`} onClick={() => { setSortOption('price-high-low'); setIsSortPanelOpen(false); }}>Price: High to Low</li>
                <li className={`py-3 cursor-pointer ${sortOption === 'name-a-z' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`} onClick={() => { setSortOption('name-a-z'); setIsSortPanelOpen(false); }}>Name: A-Z</li>
                <li className={`py-3 cursor-pointer ${sortOption === 'name-z-a' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`} onClick={() => { setSortOption('name-z-a'); setIsSortPanelOpen(false); }}>Name: Z-A</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-full md:w-[250px] shrink-0">
            {/* Active Filters Display */}
            {(selectedFilters.filters.length > 0 || selectedFilters.price.min !== priceRange[0] || selectedFilters.price.max !== priceRange[1]) && (
              <div className="bg-white p-4 rounded shadow mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Active Filters</h3>
                  <button onClick={clearAllFilters} className="text-blue-600 text-sm hover:underline">Clear all</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.filters.map(filterId => {
                    const filter = Object.values(filterGroups).flatMap(g => g.filters).find(f => f._id === filterId);
                    return filter ? (
                      <span key={filterId} className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center">
                        {filter.filter_name}
                        <button onClick={() => handleFilterChange('filters', filterId)} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                      </span>
                    ) : null;
                  })}
                  {(selectedFilters.price.min !== priceRange[0] || selectedFilters.price.max !== priceRange[1]) && (
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center">
                      ₹{selectedFilters.price.min} - ₹{selectedFilters.price.max}
                      <button onClick={() => setSelectedFilters(prev => ({ ...prev, price: { min: priceRange[0], max: priceRange[1] } }))} className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Price Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-3">
              <h3 className="text-base font-semibold mb-4 text-gray-700">Price Range</h3>
              <ReactRange
                values={values} step={STEP} min={MIN} max={MAX}
                onChange={(newValues) => setValues(newValues)}
                onFinalChange={(newValues) => handlePriceChange(newValues)}
                renderTrack={({ props, children }) => (
                  <div {...props} className="w-full h-2 rounded-lg bg-gray-200 relative">
                    <div className="absolute h-2 bg-gray-500 rounded-lg" style={{ left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`, width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%` }} />
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => {
                  const { key, ...rest } = props;
                  return (
                    <div key={key} {...rest} className={`w-4 h-4 rounded-full border-2 border-black shadow cursor-pointer relative ${index === 0 ? "bg-blue-500 z-10" : "bg-green-500 z-20"}`}></div>
                  );
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-6">
                <span>₹{values[0].toLocaleString("en-IN")}</span>
                <span>₹{values[1].toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Desktop Dynamic Product Filters */}
            {isFiltersExpanded && Object.values(filterGroups).length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-3 border-gray-100">
                <div className="pb-2 mb-2"><h3 className="text-base font-semibold text-gray-700">Product Filters</h3></div>
                <div className="space-y-4">
                  {Object.values(filterGroups).map(group => (
                    <div key={group._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <button onClick={() => toggleFilterGroup(group._id)} className="flex justify-between items-center w-full group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{group.name}</span>
                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${expandedFilters[group._id] ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFilters[group._id] && (
                        <ul className="mt-2 max-h-48 overflow-y-auto pr-2">
                          {group.filters.map(filter => (
                            <li key={filter._id} className="flex items-center">
                              <label className="flex items-center space-x-2 w-full cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors">
                                <input type="checkbox" checked={selectedFilters.filters.includes(filter._id)} onChange={() => handleFilterChange('filters', filter._id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span className="text-sm text-gray-600">{filter.filter_name}</span>
                                {filter.count && <span className="text-xs text-gray-400 ml-auto">({filter.count})</span>}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Mobile Filter Modal */}
        {isFilterPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed left-0 top-0 w-4/5 h-full bg-white shadow-lg flex flex-col">
              <div className="flex justify-between items-center p-4 border-b flex-shrink-0 bg-white">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setIsFilterPanelOpen(false)} className="text-gray-500 hover:text-gray-700 text-lg">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Active Filters inside Mobile Modal */}
                {(selectedFilters.filters.length > 0 || selectedFilters.price.min !== priceRange[0] || selectedFilters.price.max !== priceRange[1]) && (
                  <div className="bg-white p-4 rounded shadow mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-sm">Active Filters</h3>
                      <button onClick={clearAllFilters} className="text-blue-600 text-xs hover:underline">Clear all</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                     {/* Add this inside the mobile Active Filters flex container */}
{(selectedFilters.price.min !== priceRange[0] || selectedFilters.price.max !== priceRange[1]) && (
  <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
    ₹{selectedFilters.price.min.toLocaleString("en-IN")} - ₹{selectedFilters.price.max.toLocaleString("en-IN")}
    <button 
      onClick={() => setSelectedFilters(prev => ({
        ...prev,
        price: { min: priceRange[0], max: priceRange[1] }
      }))}
      className="ml-1 text-gray-500"
    >
      ×
    </button>
  </span>
)}
                    </div>
                  </div>
                )}
               
                {/* Mobile Price Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-3">
                  <h3 className="text-sm font-semibold mb-4">Price Range</h3>
                  <ReactRange
                    values={values} step={STEP} min={MIN} max={MAX}
                    onChange={(newValues) => setValues(newValues)}
                    onFinalChange={(newValues) => handlePriceChange(newValues)}
                    renderTrack={({ props, children }) => (
                      <div {...props} className="w-full h-2 rounded-lg bg-gray-200 relative">
                        <div className="absolute h-2 bg-gray-500 rounded-lg" style={{ left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`, width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%` }} />
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => {
                      const { key, ...rest } = props;
                      return <div key={key} {...rest} className={`w-4 h-4 rounded-full border-2 border-black shadow cursor-pointer relative ${index === 0 ? "bg-blue-500 z-10" : "bg-green-500 z-20"}`}></div>;
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-6">
                    <span>₹{values[0].toLocaleString("en-IN")}</span>
                    <span>₹{values[1].toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Mobile Dynamic Filters */}
                {Object.values(filterGroups).map(group => (
                  <div key={group._id} className="bg-white p-4 rounded-lg shadow-sm border mb-3 border-gray-100">
                    <button onClick={() => toggleFilterGroup(group._id)} className="flex justify-between items-center w-full">
                      <span className="text-sm font-medium text-gray-700">{group.name}</span>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedFilters[group._id] ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFilters[group._id] && (
                      <ul className="mt-2 space-y-2">
                        {group.filters.map(filter => (
                          <li key={filter._id} className="flex items-center">
                            <label className="flex items-center space-x-2 w-full cursor-pointer hover:bg-gray-50 rounded p-2">
                              <input type="checkbox" checked={selectedFilters.filters.includes(filter._id)} onChange={() => handleFilterChange('filters', filter._id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                              <span className="text-sm text-gray-600">{filter.filter_name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex-shrink-0 bg-white">
                <button onClick={() => setIsFilterPanelOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-md">Apply Filters</button>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div ref={productsContainerRef} className="products-container flex-1">
          {!nofound && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {getSortedProducts().map(product => (
                  <div key={product._id} className="group relative bg-white rounded-lg border hover:border-blue-200 transition-all shadow-sm hover:shadow-md flex flex-col h-full">
                    <div className="relative aspect-square bg-white">
                      <Link href={`/product/${product.slug}`} className="block mb-2" onClick={() => handleProductClick(product)}>
                      {product.images?.[0] && (
                        <Image src={product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`} alt={product.name} fill className="object-contain p-2 md:p-4 transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 33vw, 25vw" unoptimized />
                      )}
                      </Link>
                      {Number(product.special_price) > 0 && Number(product.special_price) < Number(product.price) && (
                        <span className="absolute top-3 left-2 bg-orange-500 tracking-wider text-white text-xs font-bold px-2 py-0.5 rounded z-10">-{Math.round(100 - (Number(product.special_price) / Number(product.price)) * 100)}%</span>
                      )}
                      <div className="absolute top-2 right-2">
                        <ProductCard productId={product._id} isOutOfStock={product.quantity === 0} />
                      </div>
                    </div>

                    <div className="p-2 md:p-4 flex flex-col h-full">
                      <h4 className="text-xs text-gray-500 mb-2 uppercase">
                        <span className="text-black-600 font-semibold">{brandMap[product.brand] || categoryData.brand?.brand_name}</span>
                      </h4>
                      <Link href={`/product/${product.slug}`} className="block mb-2 flex-1" onClick={() => handleProductClick(product)}>
                        <h3 className="text-xs sm:text-sm font-medium text-black hover:text-gray-700 min-h-[32px] sm:min-h-[40px]">
                          {(() => {
                            const model = product.model_number ? `(${product.model_number.trim()})` : "";
                            const name = product.name ? product.name.trim() : "";
                            const maxLen = 40;
                            if (model) {
                              const remaining = maxLen - model.length - 1;
                              const truncatedName = name.length > remaining ? name.slice(0, remaining - 3) + `${model}...` : name;
                              return `${truncatedName} `;
                            } else {
                              return name.length > maxLen ? name.slice(0, maxLen - 3) + "..." : name;
                            }
                          })()}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-semibold text-red-600">₹ {(product.special_price && product.special_price > 0 && product.special_price < product.price ? Math.round(product.special_price) : Math.round(product.price)).toLocaleString("en-IN")}</span>
                        {product.special_price > 0 && product.special_price < product.price && (
                          <span className="text-xs text-gray-500 line-through">MRP ₹ {Math.round(product.price).toLocaleString("en-IN")}</span>
                        )}
                      </div>
                      
                      <h4 className={`text-[10px] sm:text-xs mb-2 ${product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                        {product.stock_status}{product.stock_status === "In Stock" && product.quantity ? `, ${product.quantity} units` : ""}
                      </h4>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <Addtocart productId={product._id} stockQuantity={product.quantity} special_price={product.special_price} className="w-full text-xs sm:text-sm py-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-10">
              <img src="/images/no-productbox.png" alt="No Products" className="mx-auto mb-4 w-32 h-32 md:w-40 md:h-40 object-contain" />
            </div>
          )}
          {loading && page === 1 && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}
          {showEndMessage && <p className="text-center text-gray-500 py-4">You've reached the end of products</p>}
          {products.length > 0 && <div ref={sentinelRef} className="h-px" />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}