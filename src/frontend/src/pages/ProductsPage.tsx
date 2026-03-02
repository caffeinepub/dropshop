import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Category } from "../backend.d";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { useAllProducts, useSearchProducts } from "../hooks/useQueries";

const categoryTabs = [
  { id: null, label: "All Products" },
  { id: Category.electronics, label: "Electronics" },
  { id: Category.clothing, label: "Clothing" },
  { id: Category.sports, label: "Sports" },
  { id: Category.homeGarden, label: "Home & Garden" },
];

interface ProductsSearch {
  category?: string;
  q?: string;
}

export default function ProductsPage() {
  const search = useSearch({ from: "/products" }) as ProductsSearch;
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(search.q ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search.q ?? "");

  const activeCategory = (search.category as Category | undefined) ?? null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // When search term is active, use search; otherwise use all + filter
  const { data: searchedProducts, isLoading: searchLoading } =
    useSearchProducts(debouncedSearch);

  const { data: allProducts, isLoading: allLoading } = useAllProducts();

  const isLoading = debouncedSearch ? searchLoading : allLoading;

  // Apply category filter on top of search results
  const rawProducts = debouncedSearch
    ? (searchedProducts ?? [])
    : (allProducts ?? []);
  const products = activeCategory
    ? rawProducts.filter((p) => p.category === activeCategory)
    : rawProducts;

  function selectCategory(catId: Category | null) {
    navigate({
      to: "/products",
      search: {
        category: catId ?? undefined,
        q: debouncedSearch || undefined,
      },
    });
  }

  function clearSearch() {
    setSearchInput("");
    setDebouncedSearch("");
  }

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-primary py-12 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-foreground mb-2">
              All Products
            </h1>
            <p className="text-primary-foreground/70 font-body">
              {products.length > 0
                ? `${products.length} product${products.length !== 1 ? "s" : ""} found`
                : "Discover our full catalog"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-card/95 backdrop-blur border-b border-border shadow-xs">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3 py-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-9 font-body"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {categoryTabs.map((tab) => (
                <button
                  type="button"
                  key={String(tab.id)}
                  onClick={() => selectCategory(tab.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
              <ProductCardSkeleton key={k} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-foreground text-lg">
                No products found
              </p>
              <p className="text-muted-foreground text-sm mt-1 font-body">
                Try adjusting your search or filters
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                clearSearch();
                selectCategory(null);
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
