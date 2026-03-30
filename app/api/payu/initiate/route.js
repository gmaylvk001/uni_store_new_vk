import { NextResponse } from "next/server";
import { formatPayuAmount, generatePayuRequestHash } from "@/lib/payu";

function sanitizeEnvUrl(value, fallback = "") {
  return String(value || fallback)
    .split(/\s+#/)[0]
    .trim()
    .replace(/\/+$/, "");
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function maskValue(value) {
  const text = String(value || "");
  if (text.length <= 4) return text;
  return `${text.slice(0, 2)}***${text.slice(-2)}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const key = process.env.NEXT_PUBLIC_PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const baseUrl = sanitizeEnvUrl(
      process.env.PAYU_BASE_URL,
      "https://test.payu.in"
    );
        const appBaseUrl = sanitizeEnvUrl(
      process.env.NEXT_PUBLIC_API_URL,
      req.nextUrl.origin
    );

    console.info("[PayU initiate]", {
      key: maskValue(key),
      baseUrl,
      appBaseUrl,
    });

    if (!key || !salt) {
      return NextResponse.json(
        { error: "PayU credentials are not configured" },
        { status: 500 }
      );
    }

    const { amount, firstname, lastname, email, phone, txnid, orderNumber, productinfo } = body;

    if (!amount || !firstname || !email || !phone || !txnid || !orderNumber) {
      return NextResponse.json(
        { error: "Missing required PayU request fields" },
        { status: 400 }
      );
    }

    const callbackUrl = new URL(appBaseUrl);
    const isLocalhost =
      callbackUrl.hostname === "localhost" ||
      callbackUrl.hostname === "127.0.0.1";

    if (callbackUrl.protocol !== "https:" || isLocalhost) {
      return NextResponse.json(
        {
          error: `PayU requires a public HTTPS callback URL. Current callback base: ${appBaseUrl}`,
        },
        { status: 400 }
      );
    }

    const normalizedAmount = formatPayuAmount(amount);
    const normalizedFirstname = sanitizeText(firstname, 60);
    const normalizedLastname = sanitizeText(lastname, 20);
    const normalizedEmail = sanitizeText(email, 50);
    const normalizedPhone = String(phone || "").replace(/\D/g, "").slice(0, 10);
    const normalizedProductInfo = sanitizeText(productinfo || `Order ${orderNumber}`, 100);

    const fields = {
      key,
      txnid,
      amount: normalizedAmount,
      productinfo: normalizedProductInfo,
      firstname: normalizedFirstname,
      lastname: normalizedLastname,
      email: normalizedEmail,
      phone: normalizedPhone,
      surl: `${appBaseUrl}/api/payu/callback`,
      furl: `${appBaseUrl}/api/payu/callback`,
      udf1: orderNumber,
      udf2: "",
      udf3: "",
      udf4: "",
      udf5: "",
    };

    const hash = generatePayuRequestHash({
      ...fields,
      salt,
    });

    return NextResponse.json({
      payuUrl: `${baseUrl}/_payment`,
      fields: {
        ...fields,
        hash,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to initialize PayU payment" },
      { status: 500 }
    );
  }
}

