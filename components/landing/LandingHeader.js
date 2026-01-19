import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="/images/user/logo-mobile-view-res.png"
            alt="Unilet" width="100" height="80"
            className="h-auto"
          />
        </div>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-8 font-semibold text-sm">
          <li>
            <Link href="#how-it-work" className="text-lg hover:text-blue-400">
              How It Work
            </Link>
          </li>

          <li>
            <Link href="#how-to-participate" className="text-lg hover:text-blue-400">
              How To Participate
            </Link>
          </li>

          <li>
            <Link href="#rewards" className="text-lg hover:text-blue-400">
              Rewards
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
