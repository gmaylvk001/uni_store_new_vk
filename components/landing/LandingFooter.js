import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
        {/* Logo */}
        <div className="mb-8 md:mb-0 md:self-start flex justify-center md:justify-start w-full md:w-auto">
          <Link href="/" aria-label="Unilet Home">
            <img
              src="/images/user/logo-mobile-view-res.png"
              alt="Unilet"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h3 className="font-bold text-lg mb-2">Contact Info</h3>
          <p>
            <strong>Contact No :</strong>{" "}
            <Link href="tel:+919243585858" className="underline hover:text-blue-400">
              +91 9243585858
            </Link>
          </p>
          <p>
            <strong>Mail Us At :</strong>{" "}
            <Link
              href="mailto:info@uniletstores.com"
              className="underline hover:text-blue-400"
            >
              info@uniletstores.com
            </Link>
          </p>
        </div>

        {/* Follow Us */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex space-x-4 justify-center md:justify-start text-xl">
            <Link
              href="https://www.facebook.com/uniletappliances/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600"
            >
              <FaFacebookF />
            </Link>

            <Link
              href="https://x.com/StoresUnil99523"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400"
            >
              <FaXTwitter />
            </Link>

            <Link
              href="https://www.instagram.com/uniletstores/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500"
            >
              <FaInstagram />
            </Link>

            <Link
              href="https://wa.me/919243585858"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Whatsapp"
              className="hover:text-green-500"
            >
              <FaWhatsapp />
            </Link>

            <Link
              href="https://www.youtube.com/channel/UC4haxoyc5LXJjGqdHdA3zrA/videos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-red-600"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
