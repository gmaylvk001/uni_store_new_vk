"use client";

import { useEffect, useState } from "react";

const SCRIPT_ID = "payu-affordability-widget";
const SCRIPT_SRC = "https://jssdk.payu.in/widget/affordability-widget.min.js";
const WIDGET_ID = "payuWidget";

const PayUOffers = ({ amount }) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const merchantKey = process.env.NEXT_PUBLIC_PAYU_KEY;
    const numericAmount = Number(amount);

    if (!merchantKey || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setShowFallback(true);
      return;
    }

    const loadWidget = () => {
      const widgetEl = document.getElementById(WIDGET_ID);

      if (!widgetEl || !window.payuAffordability) {
        setShowFallback(true);
        return;
      }

      widgetEl.innerHTML = "";
      setShowFallback(false);

      try {
        window.payuAffordability.init({
          key: merchantKey,
          amount: numericAmount,
        });

        window.setTimeout(() => {
          const hasContent =
            widgetEl.childElementCount > 0 || widgetEl.innerHTML.trim().length > 0;
          setShowFallback(!hasContent);
        }, 1200);
      } catch (error) {
        console.error("PayU affordability widget failed to initialize", error);
        setShowFallback(true);
      }
    };

    let script = document.getElementById(SCRIPT_ID);
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("src", SCRIPT_SRC);
      script.id = SCRIPT_ID;
      document.body.appendChild(script);
    }

    script.addEventListener("load", loadWidget, true);

    if (window.payuAffordability) {
      loadWidget();
    }

    return () => {
      script.removeEventListener("load", loadWidget, true);
    };
  }, [amount]);

  if (!process.env.NEXT_PUBLIC_PAYU_KEY) {
    return null;
  }

  return (
    <div>
      <h4 className="py-3">AVAILABLE OFFERS</h4>
      <div id={WIDGET_ID} />
      {showFallback ? (
        <p className="text-sm text-slate-500">
          No PayU affordability offers are available for this product amount or merchant configuration right now.
        </p>
      ) : null}
    </div>
  );
};

export default PayUOffers;
