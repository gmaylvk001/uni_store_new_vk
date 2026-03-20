"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHeaderdetails } from "@/context/HeaderContext";

export const AuthModal = ({ onClose, onSuccess, error, message }) => {
  const [activeTab, setActiveTab] = useState("otp");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [otpPhone, setOtpPhone] = useState("");
  const [otpPhoneStep, setOtpPhoneStep] = useState(1);
  const [otpValue, setOtpValue] = useState("");
  const [otpPhoneError, setOtpPhoneError] = useState("");
  const [otpPhoneMessage, setOtpPhoneMessage] = useState("");
  const { updateCartCount } = useCart();
  const { updateWishlist } = useWishlist();
  const { updateHeaderdetails, setIsLoggedIn, setUserData, setIsAdmin } =
    useHeaderdetails();

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const clearRegisterErrors = () => {
    setFormError("");
    setFieldErrors({
      name: "",
      email: "",
      mobile: "",
      password: "",
    });
  };

  const resetOtpState = () => {
    setOtpPhone("");
    setOtpPhoneStep(1);
    setOtpValue("");
    setOtpPhoneError("");
    setOtpPhoneMessage("");
  };

  const handleAuthSuccess = async (token, user) => {
    if (!token) return;

    localStorage.setItem("token", token);

    let resolvedUser = user;

    if (!resolvedUser) {
      try {
        const authCheckResponse = await fetch("/api/auth/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const authCheckData = await authCheckResponse.json();
        if (authCheckResponse.ok && authCheckData?.loggedIn) {
          resolvedUser = authCheckData.user;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }

    if (resolvedUser) {
      setUserData(resolvedUser);
      updateHeaderdetails({ user: resolvedUser });
      setIsAdmin(resolvedUser.role === "admin");
    }

    setIsLoggedIn(true);

    const [cartResponse, wishlistResponse] = await Promise.all([
      fetch("/api/cart/count", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (cartResponse.ok) {
      const cartData = await cartResponse.json();
      updateCartCount(cartData.count);
    }

    if (wishlistResponse.ok) {
      const wishlistData = await wishlistResponse.json();
      updateWishlist(wishlistData.items, wishlistData.count);
    }

    localStorage.removeItem("guestCartId");
    onSuccess();
    location.reload();
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearRegisterErrors();

    const errors = {
      name: "",
      email: "",
      mobile: "",
      password: "",
    };

    if (!registerData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!registerData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(registerData.email)) {
      errors.email = "Enter a valid email";
    }
    if (!registerData.mobile.trim()) {
      errors.mobile = "Mobile is required";
    } else if (!isValidMobile(registerData.mobile)) {
      errors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!registerData.password.trim()) {
      errors.password = "Password is required";
    } else if (registerData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const guestId = localStorage.getItem("guestCartId");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...registerData, guestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errorType && errors[data.errorType] !== undefined) {
          setFieldErrors((prev) => ({ ...prev, [data.errorType]: data.error }));
          return;
        }
        throw new Error(data.error || data.message || "Registration failed");
      }

      await handleAuthSuccess(data.token, data.user);
    } catch (err) {
      console.error("Registration error:", err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    setOtpPhoneError("");
    setOtpPhoneMessage("");

    if (!isValidMobile(otpPhone)) {
      setOtpPhoneError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/phone-login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: otpPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpPhoneMessage("OTP sent to your mobile number");
      setOtpPhoneStep(2);
    } catch (err) {
      console.error("Send OTP error:", err);
      setOtpPhoneError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    setOtpPhoneError("");

    if (!otpValue || otpValue.length !== 4) {
      setOtpPhoneError("Enter the 4-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const guestId = localStorage.getItem("guestCartId");
      const response = await fetch("/api/auth/phone-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: otpPhone, otp: otpValue, guestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      await handleAuthSuccess(data.token, data.user);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setOtpPhoneError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 max-w-full rounded-lg bg-white p-8">
        <button
          onClick={() => {
            clearRegisterErrors();
            resetOtpState();
            onClose();
          }}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="mb-6 flex gap-4 border-b">
          <button
            className={`px-1 pb-2 ${
              activeTab === "otp"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("otp");
              resetOtpState();
              setFormError("");
            }}
          >
            Login
          </button>
          <button
            className={`px-1 pb-2 ${
              activeTab === "register"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("register");
              clearRegisterErrors();
            }}
          >
            Register
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {activeTab === "otp" ? (
          <div className="space-y-4">
            {otpPhoneStep === 1 ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter your registered mobile number to receive an OTP.
                </p>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={otpPhone}
                  onChange={(e) =>
                    setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpPhoneError ? "border-red-500" : ""
                  }`}
                  maxLength={10}
                  required
                />
                {otpPhoneError && (
                  <p className="text-sm text-red-500">{otpPhoneError}</p>
                )}
                {otpPhoneMessage && (
                  <p className="text-sm text-green-600">{otpPhoneMessage}</p>
                )}
                {(formError || error) && (
                  <div className="text-sm text-red-500">{formError || error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <p className="text-sm text-gray-500">
                  OTP sent to <strong>+91 {otpPhone}</strong>. Enter the 4-digit
                  OTP below.
                </p>
                <input
                  type="text"
                  placeholder="4-digit OTP"
                  value={otpValue}
                  onChange={(e) =>
                    setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={`w-full rounded border px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    otpPhoneError ? "border-red-500" : ""
                  }`}
                  maxLength={4}
                  autoFocus
                  required
                />
                {otpPhoneError && (
                  <p className="text-sm text-red-500">{otpPhoneError}</p>
                )}
                {(formError || error) && (
                  <div className="text-sm text-red-500">{formError || error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpPhoneStep(1);
                      setOtpValue("");
                      setOtpPhoneError("");
                      setOtpPhoneMessage("");
                    }}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Change number / Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.name ? "border-red-500" : ""
                }`}
                required
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.email ? "border-red-500" : ""
                }`}
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Mobile"
                value={registerData.mobile}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.mobile ? "border-red-500" : ""
                }`}
                required
              />
              {fieldErrors.mobile && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.mobile}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.password ? "border-red-500" : ""
                }`}
                required
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {(formError || error) && (
              <div className="text-sm text-red-500">{formError || error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
