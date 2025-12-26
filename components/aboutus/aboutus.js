'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillAwardFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { GiNetworkBars } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa";
import { FiHeadphones,  FiSettings,FiTag, FiTarget, FiMapPin, FiAward, FiUsers,FiUser,  FiMonitor, FiSpeaker, FiShoppingCart, FiStar,FiSun,FiSend,FiCrosshair  } from 'react-icons/fi';
import StatusBarFullAbout from '@/components/StatusBarFullAbout';



const AboutUs = () => {


  return (
    <div className="text-[#1d1d1f]">

         {/* 🟠 About us Header Bar */}
              <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">About us</h2>
                <div className="flex items-center space-x-2">
                  <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                  <span className="text-gray-500">›</span>
                  <span className="text-blue-600 font-semibold">About us</span>
                </div>
              </div>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-200 blur-3xl"></div>
            </div>
    
            {/* Floating electronics icons */}
            <FiMonitor className="absolute top-20 left-10 text-blue-100 text-6xl animate-float-slow" />
            <FiSpeaker className="absolute bottom-20 right-10 text-indigo-100 text-5xl animate-float-slow-delay" />
    
            <div className="relative z-10 max-w-5xl mx-auto px-6">
                {/* Animated title */}
                <h1 className="text-1xl md:text-2xl lg:text-2xl font-bold mb-6 text-gray-800 animate-fade-in-up text-center">
                    <span className="relative inline-block">
                        Unilet Appliances Pvt Ltd 
                    </span>
                    <br />
                    <span className="text-customBlue inline-block mt-2">
                        Revolutionizing Consumer Electronics Retail in Karnataka
                    </span>
                </h1>
                <div className="w-full bg-white py-12">
                    <div className="max-w-7xl mx-auto px-1 grid grid-cols-1 md:grid-cols-2 gap-1 items-center">


                    {/* RIGHT SIDE TEXT */}
                        <div>
                        <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed animate-fade-in-up delay-100">
                            <span className="font-semibold text-gray-700">
                            Instituted in 2005, Unilet Appliances Pvt Ltd is a multi-brand consumer electronic retail chain in Karnataka. 
                            Headquartered in Bangalore, the retail chain is a one-stop shop focusing on lifestyle technology products with 
                            a continuous and innovative multi-brand product range.
                            </span>
                        </p>

                        <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed animate-fade-in-up delay-150">
                            <span className="font-semibold text-gray-700">
                            We aim to offer a unique retailing experience to help customers “Live Product Experience”. With over 15 years 
                            since its inception, Unilet has established its reputation on precise, dependable and consistent customer experience.
                            </span>
                        </p>

                        <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed animate-fade-in-up delay-200">
                            <span className="font-semibold text-gray-700">
                            Mr. Humayun gave wings to his dreams by earning customer trust and loyalty through high quality products and 
                            dedicated service. The Brand “Unilet” quickly became a household name in Bengaluru city. Enthused by the 
                            positive customer response, the company expanded its footprint across Karnataka.
                            </span>
                        </p>
                        </div>

                        {/* LEFT SIDE IMAGE */}
                        <div className="w-full flex justify-center">
                        <img
                            src="uploads/aboutus/aboutus-img.webp"   // change your image here
                            alt="Unilet"
                            className="rounded-xl shadow-lg w-full h-auto object-cover"
                        />
                        </div>

                        

                    </div>
                </div>
            </div>
            <StatusBarFullAbout /> 
        </section>

        {/* Youtube Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Animated Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                <h2 className="text-2xl md:text-2xl font-bold text-customBlue mb-6 relative">
                    <span className="relative z-10">Watch Us On Youtube </span>
                    <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-blue-200 animate-underline-expand"></span>
                </h2>
                
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                    Discover the latest in consumer electronics, lifestyle technology, and more on our official YouTube channel! From product demonstrations and reviews to behind-the-scenes looks at our retail outlets, stay connected with Unilet Appliances Pvt Ltd for informative and engaging content.
                </p>
                </div>

                {/* YouTube Video */}
                <div className="flex justify-center">
                    <iframe
                    className="rounded-lg shadow-lg"
                    width="800"
                    height="450"
                    src="https://www.youtube.com/embed/d9jmzht0_2c"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    ></iframe>
                </div>
            
            </div>
        </section>


      {/* Our Key to Success Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

            {/* Success Pillars - Animated Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
                {
                icon: <FiSun className="text-3xl text-blue-600" />,
                title: "Our Vision",
                desc: "To create a value and become a leader in the consumer durable industry whilst focusing on customer satisfaction by offering a wide variety of products from the best brands."
                },
                {
                icon: <FiSend className="text-3xl text-blue-600" />,
                title: "Our Mission",
                desc: "Strive to make UNILET a one stop shop with the best brands through efficient, effective and responsive customer experience that goes beyond satisfaction"
                },
                {
                icon: <FiCrosshair  className="text-3xl text-blue-600" />,
                title: "Our Values",
                desc: "Unilet offers exciting deals on all your favourite products based on the customer flexibility."
                }
            ].map((item, index) => (
                <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-blue-100 animate-card-enter"
                style={{ animationDelay: `${index * 0.1}s` }}
                >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                </div>
            ))}
            </div>

        
        </div>
      </section>




        <section className="relative py-5 overflow-hidden bg-gradient-to-r from-[#7fd5f3] to-[#63c6e9]">
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* LEFT SIDE IMAGE */}
                    <div className="w-full flex justify-center">
                        <img src="uploads/aboutus/banashankari-lg-600x450.png.webp" alt="Unilet" className="rounded-lg shadow-md w-full h-auto object-cover" />
                    </div>

                    {/* RIGHT SIDE TEXT */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0077b6] mb-4">LG Shoppe's</h2>
                        <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                        Recognising the contribution of Unilet for the growth of its brand in Karnataka, LG India offered Unilet to establish Exclusive Brand Shops (EBS). In 2006, we opened our first LG Brand Shop at Indira Nagar. With the success of the store, the company decided to establish a chain of Shoppe’s for LG.
                        </p>

                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                        Today, it has eight EBS across Bengaluru. The Brand Shops of LG display entire gamut of exclusive products allowing the loyal customers of LG to visit our shoppe’s.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-1 bg-gradient-to-r from-[#7fd5f3] to-[#63c6e9]">
            <div className="max-w-7xl mx-auto px-1 text-center">
                {/* HEADING */}
                <h2 className="text-3xl md:text-2xl font-bold text-gray-800 mb-4">Our Partners</h2>
                {/* DESCRIPTION */}
                <p className="text-gray-800 text-lg md:text-xl max-w-4xl mx-auto mb-12 leading-relaxed">
                Unilet not only sells brands that are popular in the market but also only those that are of the highest quality.
                It deals with India’s top leading lifestyle brands such as 
                <span className="font-semibold"> LG, Samsung, Sony, Panasonic, Whirlpool, IFB, Bosch and Haier</span>, 
                among many others.
                </p>

                {/* LOGO GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">

                {/* LG */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/lg.webp" alt="LG" className="h-12 object-contain" />
                </div>

                {/* Samsung */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/samsung.webp" alt="Samsung" className="h-12 object-contain" />
                </div>

                {/* Whirlpool */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/whirlpool.webp" alt="Whirlpool" className="h-12 object-contain" />
                </div>

                {/* IFB */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/ifb-300x203.webp" alt="IFB" className="h-12 object-contain" />
                </div>

                {/* Bosch */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/bosch2.webp" alt="Bosch" className="h-12 object-contain" />
                </div>

                {/* Sony */}
                <div className="bg-white rounded-xl shadow-md p-6 w-32 h-32 flex items-center justify-center">
                    <img src="/uploads/aboutus/sony-300x203.webp" alt="Sony" className="h-12 object-contain" />
                </div>

                </div>
            </div>
        </section>
        <section className="w-full py-1 bg-gradient-to-r from-[#7fd5f3] to-[#63c6e9]">
            <div className="max-w-7xl mx-auto px-1 text-center">
                {/* HEADING */}
                <div className="max-w-7xl mx-auto px-6 text-center">
                    {/* HEADING */}
                    <h2 className="text-3xl md:text-2xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                    {/* DESCRIPTION */}
                    <p className="text-gray-800 text-lg md:text-xl max-w-4xl mx-auto mb-12 leading-relaxed">
                    At Unilet Appliances Pvt Ltd, our team is the backbone of our success. With a dedicated and passionate workforce, we strive to provide exceptional service and expertise to our customers.
                    </p>
                </div>
            </div>
        </section>





      
</div>
  );
};

export default AboutUs;
