"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { IoReload, IoStorefront, IoCardOutline, IoShieldCheckmark } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import Image from "next/image";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const Footer = () => {
  const [years, setYears] = useState("");
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(`${currentYear}`);
  }, []);
  const [categories, setCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState({ main: [], subs: {} });
  const [stores, setStores] = useState([]);
  const [lgstores, setLgStores] = useState([]);
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  const getCached = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.__ts) return null;
      if (Date.now() - parsed.__ts > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch (e) {
      return null;
    }
  };

  const setCached = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ __ts: Date.now(), data }));
    } catch (e) {
      // ignore
    }
  };

  const makeGrouped = (data) => {
    const activeCategories = Array.isArray(data) ? data.filter(cat => cat.status === 'Active') : [];
    const main = activeCategories.filter(cat => cat.parentid === 'none');
    const subs = {};
    activeCategories.forEach(cat => {
      if (cat.parentid !== 'none') {
        if (!subs[cat.parentid]) subs[cat.parentid] = [];
        subs[cat.parentid].push(cat);
      }
    });
    return { main, subs };
  };

  const fetchCategories = async () => {
    const key = 'cache_footer_categories_v1';
    const cached = getCached(key);
    if (cached) {
      setGroupedCategories(makeGrouped(cached));
      return;
    }

    try {
      const res = await fetch('/api/categories/get');
      const data = await res.json();
      if (data) {
        setGroupedCategories(makeGrouped(data));
        setCached(key, data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/lg-store/get');
      const data = await res.json();
      console.log("LG Stores API response:", data);
      if (data ) {
        setLgStores(data.data);
        //setCached(key, data.data);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    }

    const key = 'cache_footer_stores_v1';
    const cached = getCached(key);
    if (cached) {
      setStores(cached);
      return;
    }

    try {
      const res = await fetch('/api/store/get');
      const data = await res.json();
      if (data && data.success) {
        setStores(data.data);
        setCached(key, data.data);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
    
    
  };

  fetchCategories();
  fetchStores();
}, []);


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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError('');
    setLoadingAuth(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setUserData(data.user);
      setShowAuthModal(false);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };
  const groupedStores = stores.reduce((acc, store) => {
    const city = store.slug; // or store.store_city based on your API
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(store.organisation_name);
    return acc;
  }, {});

  //console.log("lg stores : ",lgstores);

  const groupedlgStores = (lgstores || []).reduce((acc, store) => {
  const city = store.google_location || "Unknown"; // use correct field

  if (!acc[city]) {
    acc[city] = [];
  }

  acc[city].push(store.name);
  return acc;
}, {});

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
  // Case-insensitive membership helper
  const inSetCI = (name, arr) => arr.includes(String(name || '').toLowerCase());

  const groupCategories = (categories) => {
    const grouped = { main: [], subs: {} };
    
    const mainCats = categories.filter(cat => cat.parentid === "none");
    
    mainCats.forEach(mainCat => {
      const subs = categories.filter(cat => cat.parentid === mainCat._id.toString());
      grouped.main.push(mainCat);
      grouped.subs[mainCat._id] = subs;
    });
    
    return grouped;
  };

  const prepareFooterSections = (grouped) => {
    const sections = [];
    if (!grouped || !Array.isArray(grouped.main)) return sections;

    // Helper to filter out "No Brand" from any brand array
    const cleanBrands = (brandArray) => {
      return (brandArray || []).filter(b => 
        b.brand_name && b.brand_name.toLowerCase() !== "no brand"
      );
    };

    const LARGE_SET = new Set([
      "dishwasher",
      "air conditioner",
      "washing machine",
      "refrigerator",
    ]);

    grouped.main.forEach((mainCat) => {
      const subs = grouped.subs[mainCat._id] || [];
      if (mainCat.category_name?.toLowerCase() === "large appliances") {
        subs.forEach((subcat) => {
          const subName = subcat.category_name?.toLowerCase();
          if (LARGE_SET.has(subName)) {
            const children = grouped.subs[subcat._id] || [];
            
            // Get raw brands
            const rawBrands = (Array.isArray(subcat.brands) && subcat.brands.length
                ? subcat.brands
                : mainCat.brands) || [];
            
            // ✅ FIX 1: Clean brands for Large Appliances
            sections.push({
              type: "la",
              key: `la-${subcat._id}`,
              main: mainCat,
              la: subcat,
              children,
              brands: cleanBrands(rawBrands),
            });
          }
        });
      } else {
        // ✅ FIX 2: Clean brands for Default categories
        sections.push({
          type: "default",
          key: `def-${mainCat._id}`,
          main: mainCat,
          subs,
          brands: cleanBrands(mainCat.brands || []),
        });
      }
    });

    return sections;
  };

  const preparedSections = useMemo(
    () => prepareFooterSections(groupedCategories),
    [groupedCategories]
  );

  return (
    <>
      <footer className="bg-[#2e2a2a] text-gray-300 text-sm py-5 md:px-4 p-6">
        <div className="bg-[#2e2a2a] text-gray-400  border-white ">
          <div className="w-full flex justify-center">
            <div className="w-full container mx-auto px-3  grid grid-cols-1 md:grid-cols-3 gap-16 justify-between">
              {/* Corporate Office */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg mb-4">Our Address</h3>
                <p>
                  #60, 1st Floor, Near ICICI Bank, Sahakar Nagar, Bangaluru, Karnataka 560092
                </p>
                <hr className="border-gray-600 my-3" />
                <h3 className="text-white font-semibold text-lg mb-4">Contact Information</h3>
                <div className="flex items-center gap-2">
                  <FiPhone />
                  <a href="tel:9243585858" className="text-blue-600 hover:underline">
                    +91 9243585858
                  </a>
                </div>
                <hr className="border-gray-600 my-3" />
                <div className="flex items-center gap-2">
                  <FiMail />
                  <a
                    href="mailto:info@uniletstores.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@uniletstores.com
                  </a>
                </div>
                <hr className="border-gray-600 my-3" />
                <p>
                  <strong>Business Hours:</strong> 10:30AM - 09:30 PM (Mon to Sun)
                </p>
              </div>
              {/* My Account & Policy */}
              <div className="flex flex-col space-y-6 md:mx-auto">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">My Account</h3>
                  <ul className="space-y-2">
                    {isLoggedIn ? (
                      <>
                        <li>
                          <Link href="/order" className="hover:underline hover:text-white flex items-center gap-2">
                            <FaShoppingBag /> My Orders
                          </Link>
                        </li>
                        {/* <li>
                          <button 
                            onClick={handleLogout}
                            className="hover:underline hover:text-white flex items-center gap-2"
                          >
                            <IoLogOut /> Logout
                          </button>
                        </li> */}
                      </>
                    ) : (
                      <li>
                        <button 
                          onClick={() => setShowAuthModal(true)}
                          className="hover:underline hover:text-white"
                        >
                          Sign In / Register
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">Policy</h3>
                  <ul className="space-y-2">
                    <li><Link href="/privacypolicy" className="hover:underline hover:text-white">Privacy Policy</Link></li>
                     <li><Link href="/return-cancellation" className="hover:underline hover:text-white">Return and Cancellation</Link></li>
                     <li><Link href="/terms-and-condition" className="hover:underline hover:text-white">Terms and Conditions</Link></li>
                    {/* <li><Link href="/shipping" className="hover:underline hover:text-white">Shipping Policy</Link></li> */}
                    
                    {/* <li><Link href="/cancellation-refund-policy" className="hover:underline hover:text-white">Cancellation and Refund Policy</Link></li> */}
                  </ul>
                </div>
              </div>
              {/* Company & Social Media */}
              <div className="md:ml-12">
                <div className="mb-8">
                  <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><Link href="/aboutus" className="hover:underline hover:text-white">About Us</Link></li>
                    <li><Link href="/contact" className="hover:underline hover:text-white">Contact Us</Link></li>
                    <li><Link href="/blog" className="hover:underline hover:text-white">Blogs</Link></li>
                    
                  </ul>
                </div>
              <div>
                  <h3 className="text-white font-semibold text-lg mb-4">Connect With Us</h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <Link href="https://web.whatsapp.com/send?phone=919243585858&amp;text=Hi" target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp className="text-xl text-green-500" />
                    </Link>
                    <Link href="https://www.facebook.com/uniletappliances/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF className="text-xl text-customBlue" />
                    </Link>
                    <Link href="https://www.instagram.com/uniletstores/" target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-xl text-pink-500" />
                    </Link>
                    <Link href="https://www.youtube.com/channel/UC4haxoyc5LXJjGqdHdA3zrA/videos" target="_blank" rel="noopener noreferrer">
                      <FaYoutube className="text-xl text-red-500" />
                    </Link>
                    <Link href="https://x.com/StoresUnil99523" target="_blank" rel="noopener noreferrer">
                      <FaXTwitter className="text-xl text-black" />
                    </Link>
                    {/* <Link href="https://in.linkedin.com/company/bharath-electronics-and-appliances">
                      <FaLinkedinIn className="text-xl text-customBlue" />
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* Bottom Section */}
      <div className="bg-[#2e2a2a] text-gray-400 mt-10 pt-5 border-t border-white">
        <div className="container mx-auto px-2 grid grid-cols-1 md:grid-cols-[70%_30%] gap-8">
          {/* LEFT SECTION (Categories + Brands) */}
          <div>
            <div className="mb-2  flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left ml-1 mb-1">
                <p>
                  <a href="#" className="hover:underline text-white">
                    Unilet Appliances Pvt Ltd &copy;
                  </a>{" "}
                  {years} All rights reserved.
                </p>
              </div>
            </div>

          <div className="space-y-4 mt-4 ml-1 mb-1">
              {preparedSections.map((section) => {
                if (section.type === "la") {
                  const { main, la, children, brands } = section;
                  return (
                    <div key={section.key}>
                      <span className="text-gray-400">
                        <Link
                          href={`/category/${main.category_slug}/${la.category_slug}`}
                          className="text-white hover:underline"
                        >
                          {capitalizeFirstLetter(la.category_name)} :
                        </Link>
                          {children.length > 0 && (
                            <span className="ml-2 text-gray-500">
                              {children.map((child, j) => {
                                return (
                                  <span key={child._id}>
                                    <Link
                                      href={`/category/${main.category_slug}/${la.category_slug}/${child.category_slug}`}
                                      className="hover:text-white hover:underline"
                                    >
                                      {capitalizeFirstLetter(child.category_name)}
                                    </Link>
                                    {j < children.length - 1 && " / "}
                                  </span>
                                );
                              })}
                            </span>
                          )}
                        {brands.length > 0 && (
                          <>
                            <br />
                            <span className="font-semibold text-white">Brands :</span>
                            <span className="ml-2 text-gray-500">
                              
{brands.map((brand, i) => (
  <span key={brand._id || `${la._id}-brand-${i}`}>
    <Link
      href={`/brand-landing/${main.category_slug}/${brand.brand_slug}`}
      className="hover:text-white hover:underline"
    >
      {brand.brand_name.charAt(0).toUpperCase() +
        brand.brand_name.slice(1).toLowerCase()}
    </Link>
    {i < brands.length - 1 && " / "}
  </span>
))}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  );
                }

                // Default (non-Large Appliances) block: keep existing behavior
                const { main, subs, brands } = section;
                return (
                  <div key={section.key}>
                    <span className="text-gray-400">
                      {subs.map((subcat, i) => (
                        <span key={subcat._id}>
                          {/* MAIN CATEGORY : SUB CATEGORY */}
                          <div className="mb-1">
                            <Link href={`/category/${main.category_slug}`} className="text-white hover:text-white hover:underline font-semibold">{capitalizeFirstLetter(main.category_name)}</Link> :{" "}
                            <Link href={`/category/${main.category_slug}/${subcat.category_slug}`}className="hover:text-white hover:underline font-semibold">{capitalizeFirstLetter(subcat.category_name)}</Link>
                          </div>

                          {/* SECOND LINE ONLY IF CHILD EXISTS */}
                          {(groupedCategories.subs[subcat._id] || []).length > 0 && (
                            <div className="mb-1 text-gray-400 text-sm">
                              <Link href={`/category/${main.category_slug}/${subcat.category_slug}`}className="text-white hover:text-white hover:underline font-medium">
                              {capitalizeFirstLetter(subcat.category_name)} 
                              </Link> : {" "}
                              {groupedCategories.subs[subcat._id].map((child, j, arr) => (
                                <span key={child._id}>
                                  <Link
                                    href={`/category/${main.category_slug}/${subcat.category_slug}/${child.category_slug}`}
                                    className="hover:text-white hover:underline"
                                  >
                                    {capitalizeFirstLetter(child.category_name)}
                                  </Link>
                                  {j < arr.length - 1 && " / "}
                                </span>
                              ))}
                            </div>
                          )}


                          {inSetCI(
                            subcat.category_name,
                            ["kitchen appliance","air conditioner", "kitchen appliances", "small appliance", "small appliances", "dishwasher","washing machine","refrigerator"]
                          ) &&
                            brands.length > 0 && (
                              <span>
                                <span className="font-semibold text-white">Brands :</span>
                                <span className="ml-2 text-gray-500">
                                  {/* ✅ FIXED BRAND LINK FOR DEFAULT CATEGORIES (Subcategory level) */}
{brands.map((brand, bi) => (
  <span key={brand._id || `${main._id}-brand-${bi}`}>
    <Link
      href={`/brand-landing/${subcat.category_slug}/${brand.brand_slug}`}
      className="hover:text-white hover:underline"
    >
      {brand.brand_name.charAt(0).toUpperCase() +
        brand.brand_name.slice(1).toLowerCase()}
    </Link>
    {bi < brands.length - 1 && " / "}
  </span>
))}
                                </span>
                              </span>
                            )}

                          {i < subs.length - 1 && <span className="block mb-1"></span>}
                        </span>
                      ))}

                      {brands.length > 0 &&
                        !subs.some((s) =>
                          inSetCI(
                            s.category_name,
                            [
                              
                              "small appliance", "small appliances",
                              // also exclude these to avoid duplicate brand sections
                               "air conditioners",
                               "washing machines","refrigerators","refrigerator"
                            ]
                          )
                        ) && (
                          <>
                           
                            <span className="font-semibold text-white">Brands :</span>
                            <span className="ml-2 text-gray-500">
                             {/* ✅ FIXED FALLBACK BRAND LINK */}
                      {brands.map((brand, i) => (
                        <span key={brand._id || `${main._id}-brand-${i}`}>
                          <Link
                            href={`/brand-landing/${main.category_slug}/${brand.brand_slug}`}
                            className="hover:text-white hover:underline"
                          >
                            {brand.brand_name.charAt(0).toUpperCase() +
                              brand.brand_name.slice(1).toLowerCase()}
                          </Link>
                          {i < brands.length - 1 && " / "}
                        </span>
                      ))}
                            </span>
                          </>
                        )}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
          {/* RIGHT SECTION (Our Location) */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">Our Location</h3>
            <p className="text-sm text-gray-400">
              {Object.entries(groupedStores).map(([city, orgs], index, arr) => (
                <span key={index}>
                  <Link href={`/store/${city}`} className="hover:text-white hover:underline transition-colors duration-200">
                    {orgs.join(", ")}
                  </Link>
                  {index < arr.length - 1 && ", "}
                </span>
              ))}
            </p>

            <h3 className="text-white font-semibold text-lg mb-4">LG Electronics Stores</h3>
           <p className="text-sm text-gray-400">
              {Object.entries(groupedlgStores).map(([city, orgs], index, arr) => (
                <span key={city}>
                  <Link
                    href={city}
                    className="hover:text-white hover:underline transition-colors duration-200"
                  >
                    {orgs.join(", ")}
                  </Link>
                  {index < arr.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
         
        </div>

        <section className="py-10 md:px-2">
  <div className="max-w-7xl mx-auto space-y-8 text-sm leading-7">

    <div>
      <h2 className="font-semibold text-lg mb-3">
        Buy Electronics Online at Unilet Stores – Karnataka’s Trusted Electronics Retailer
      </h2>
      <div>
        Transform your home with the latest electronics and appliances from Unilet Stores. Discover a wide range of home appliances, televisions, laptops, smartphones, and smart gadgets designed to simplify modern living.  
        Shop from top global brands with the assurance of genuine products, competitive pricing, and reliable after-sales service.  
        Whether you shop online or visit our physical outlets across Karnataka, Unilet Stores ensures a convenient and trusted electronics shopping experience.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/large-appliance" className="hover:underline text-primary">
          Large Appliances – Upgrade Your Home Comfort
        </a>
      </h3>
      <div>
        Discover high-performance large appliances designed to make everyday household tasks easier and more efficient. From refrigerators and washing machines to air conditioners and dishwashers, Unilet Stores offers a wide selection of trusted appliances.  
        Choose from advanced energy-efficient models with smart features, spacious designs, and modern technology that enhance convenience and performance.  
        Enjoy reliable warranties, attractive deals, and professional installation support when purchasing large appliances from Unilet Stores.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/small-appliances" className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
          Small Appliances – Smart Solutions for Everyday Living
        </a>
      </h3>
      <div>
        Explore a versatile range of small appliances designed to simplify your daily routine and improve productivity in the kitchen and home. From mixer grinders and microwaves to electric kettles, juicers, and coffee makers, Unilet Stores offers reliable appliances for modern lifestyles.  
        These compact yet powerful devices combine efficiency with convenience, helping you prepare meals faster and manage household tasks with ease.  
        Shop quality small appliances with modern designs, energy-efficient performance, and affordable pricing at Unilet Stores.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/televisions" className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
          Televisions – Experience Next-Level Entertainment
        </a>
      </h3>
      <div>
        Upgrade your home entertainment setup with the latest televisions featuring stunning picture clarity and immersive sound technology. Choose from LED, QLED, and Ultra HD smart TVs equipped with advanced display technology and built-in streaming platforms.  
        Enjoy seamless access to popular entertainment apps, voice control features, and high-definition visuals designed to enhance your viewing experience.  
        At Unilet Stores, find televisions in multiple screen sizes with competitive pricing and reliable brand warranties.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/computers-laptops" className="hover:underline text-primary" target="_blank" rel="noopener noreferrer">
          Computers & Laptops – Power Your Productivity
        </a>
      </h3>
      <div>
        Discover a wide selection of computers and laptops designed for work, study, gaming, and everyday computing. From lightweight ultrabooks to powerful gaming laptops and desktop systems, Unilet Stores provides solutions for every user requirement.  
        Explore devices equipped with the latest processors, fast SSD storage, high RAM capacity, and advanced graphics capabilities for seamless multitasking.  
        With trusted brands, warranty protection, and flexible purchase options, Unilet Stores makes it easy to find the perfect computing device.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/mobiles-tablets" className="hover:underline text-primary">
          Mobiles & Tablets – Stay Connected Anywhere
        </a>
      </h3>
      <div>
        Browse the latest smartphones and tablets designed to keep you connected, productive, and entertained wherever you go. Choose from feature-rich devices with powerful processors, advanced camera systems, and long-lasting battery performance.  
        Tablets provide a perfect balance between portability and functionality, making them ideal for learning, entertainment, and professional tasks.  
        Unilet Stores offers a wide variety of mobile and tablet models from leading brands with competitive pricing and genuine warranty support.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/sound-systems" className="hover:underline text-primary">
          Sound Systems – Immersive Audio Experience
        </a>
      </h3>
      <div>
        Enhance your entertainment experience with powerful sound systems designed for crystal-clear audio and deep bass performance. From home theatre systems to wireless speakers and soundbars, Unilet Stores offers audio solutions for every space.  
        Enjoy music, movies, and gaming with immersive surround sound technology and modern connectivity features such as Bluetooth and Wi-Fi streaming.  
        Discover premium sound systems from trusted brands and transform your home into an entertainment hub.
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">
        <a href="/category/gadgets" className="hover:underline text-primary">
          Gadgets – Smart Technology for Everyday Use
        </a>
      </h3>
      <div>
        Explore innovative gadgets that enhance convenience, productivity, and entertainment in everyday life. From smartwatches and fitness trackers to wireless earbuds and portable electronics, Unilet Stores offers the latest tech accessories.  
        These gadgets combine stylish design with advanced technology, helping you stay connected and organized throughout the day.  
        Find the perfect gadget that complements your lifestyle and enjoy competitive prices with reliable warranty support.
      </div>
    </div>

    

  </div>
</section>
      </div>
      </footer>
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-w-full relative">
            <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setFormError('');
                  setError('');
                }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
            <div className="flex gap-4 mb-6 border-b">
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'login' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {activeTab === 'register' && (
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
              
              {(formError || error) && (
                <div className="text-red-500 text-sm">
                  {formError || error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingAuth}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
              >
                {loadingAuth ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default Footer;