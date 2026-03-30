import crypto from "crypto";

export function formatPayuAmount(amount) {
  return Number(amount || 0).toFixed(2);
}

export function generatePayuRequestHash({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
  salt,
}) {
  const hashString = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    "",
    "",
    "",
    "",
    "",
    salt,
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex");
}

export function generatePayuResponseHash(response, salt) {
  const additionalCharges = response.additionalCharges || response.additional_charges || "";

  const hashParts = [
    salt,
    response.status || "",
    "",
    "",
    "",
    "",
    "",
    response.udf5 || "",
    response.udf4 || "",
    response.udf3 || "",
    response.udf2 || "",
    response.udf1 || "",
    response.email || "",
    response.firstname || "",
    response.productinfo || "",
    response.amount || "",
    response.txnid || "",
    response.key || "",
  ];

  if (additionalCharges) {
    hashParts.unshift(additionalCharges);
  }

  const hashString = hashParts.join("|");
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

export function verifyPayuResponseHash(response, salt) {
  const receivedHash = String(response.hash || "").toLowerCase();
  if (!receivedHash) return false;

  return generatePayuResponseHash(response, salt).toLowerCase() === receivedHash;
}
