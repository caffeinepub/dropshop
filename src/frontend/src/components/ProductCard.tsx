import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Package, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import { ProductPlaceholder } from "./ProductPlaceholder";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryLabel: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  sports: "Sports",
  homeGarden: "Home & Garden",
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!product.imageUrl) return;
    let url: string | null = null;
    product.imageUrl
      .getBytes()
      .then((bytes) => {
        const blob = new Blob([bytes]);
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      })
      .catch(() => {
        setImageUrl(null);
      });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [product.imageUrl]);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      category: product.category,
      imageUrl: imageUrl ?? undefined,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group"
    >
      <Link to="/products/$id" params={{ id: product.id.toString() }}>
        <div className="bg-card rounded-lg overflow-hidden shadow-product hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/60">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <ProductPlaceholder
                category={product.category}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                size="md"
              />
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                <span className="text-white font-display font-semibold text-sm tracking-wide uppercase px-3 py-1 bg-foreground/60 rounded">
                  Out of Stock
                </span>
              </div>
            )}
            <Badge
              className="absolute top-2.5 left-2.5 text-xs font-medium capitalize"
              variant="secondary"
            >
              {categoryLabel[product.category] ?? product.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-foreground text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3 font-body leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-bold text-lg text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border/60 shadow-product">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-full" />
        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
          <div className="h-8 bg-muted rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}
