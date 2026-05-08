import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1 className="sr-only">Search Products</h1>
      <SearchPage />
    </Suspense>
  );
}
