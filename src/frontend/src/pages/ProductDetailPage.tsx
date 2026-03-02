import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductPlaceholder } from "../components/ProductPlaceholder";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useQueries";

const categoryLabel: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  sports: "Sports",
  homeGarden: "Home & Garden",
};

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const productId = BigInt(id);
  const { data: product, isLoading, error } = useProduct(productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!product?.imageUrl) return;
    let url: string | null = null;
    product.imageUrl
      .getBytes()
      .then((bytes) => {
        const blob = new Blob([bytes]);
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      })
      .catch(() => setImageUrl(null));
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [product?.imageUrl]);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      category: product.category,
      imageUrl: imageUrl ?? undefined,
      quantity,
    });
    toast.success(`${quantity}× ${product.name} added to cart`);
  }

  if (error) {
    return (
      <main className="container px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">Product not found.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/products" search={{}}>
            ← Back to Products
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          to="/products"
          search={{}}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full mt-8" />
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="aspect-square rounded-xl overflow-hidden bg-card border border-border shadow-product"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProductPlaceholder
                  category={product.category}
                  className="w-full h-full"
                  size="lg"
                />
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Category + Stock */}
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-xs capitalize">
                  {categoryLabel[product.category] ?? product.category}
                </Badge>
                {product.inStock ? (
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-destructive text-xs font-medium">
                    <XCircle className="w-3.5 h-3.5" />
                    Out of Stock
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              <div className="text-3xl font-display font-bold text-primary mb-6">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-muted-foreground font-body leading-relaxed mb-6 text-base">
                {product.description}
              </p>

              <Separator className="mb-6" />

              {/* Supplier */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-6">
                <Package className="w-4 h-4" />
                <span>
                  Supplied by{" "}
                  <span className="text-foreground font-medium">
                    {product.supplierName}
                  </span>
                </span>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center border-x border-border">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base h-14 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <p className="text-xs text-muted-foreground text-center font-body">
                  Total:{" "}
                  <span className="font-semibold text-foreground">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
