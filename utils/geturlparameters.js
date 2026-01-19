// utils/geturlparameters.js
export function getUrlParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "unilet_luckydrop",
    utm_medium: params.get("utm_medium") || "unilet_luckydrop",
    utm_campaign: params.get("utm_campaign") || "unilet_luckydrop",
    Store: params.get("store_id") || "",
    child_id: params.get("child_id"),
  };
}
