"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie_consent_accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(COOKIE_KEY);
      if (!accepted) setVisible(true);
    } catch {
      // localStorage unavailable (e.g. private browsing strict mode)
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "true");
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-4 pb-4 pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-3xl select-none" aria-hidden="true">
          🍪
        </div>

        {/* Text */}
        <div className="flex-1 text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">We use cookies</span> to
          enhance your browsing experience, serve personalised content, and
          analyse our traffic. By clicking{" "}
          <span className="font-medium text-gray-800">"Accept All"</span>, you
          consent to our use of cookies. Read our{" "}
          <Link
            href="/privacypolicy"
            className="underline text-blue-600 hover:text-blue-800 transition-colors"
          >
            Privacy Policy
          </Link>{" "}
          for more details.
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
