import { Dumbbell, Home, Package, ShoppingBag, Zap } from "lucide-react";
import { Category } from "../backend.d";

interface ProductPlaceholderProps {
  category?: Category | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const categoryConfig = {
  [Category.electronics]: {
    gradient: "product-placeholder-electronics",
    icon: Zap,
    label: "Electronics",
  },
  [Category.clothing]: {
    gradient: "product-placeholder-clothing",
    icon: ShoppingBag,
    label: "Clothing",
  },
  [Category.sports]: {
    gradient: "product-placeholder-sports",
    icon: Dumbbell,
    label: "Sports",
  },
  [Category.homeGarden]: {
    gradient: "product-placeholder-home",
    icon: Home,
    label: "Home & Garden",
  },
};

const iconSizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export function ProductPlaceholder({
  category,
  className = "",
  size = "md",
}: ProductPlaceholderProps) {
  const config =
    category && category in categoryConfig
      ? categoryConfig[category as Category]
      : {
          gradient: "product-placeholder-default",
          icon: Package,
          label: "Product",
        };

  const Icon = config.icon;

  return (
    <div
      className={`${config.gradient} ${className} flex items-center justify-center`}
    >
      <Icon className={`${iconSizeMap[size]} text-white/70`} />
    </div>
  );
}
