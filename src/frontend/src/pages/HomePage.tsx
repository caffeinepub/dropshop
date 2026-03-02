import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Dumbbell,
  Home,
  Shield,
  ShoppingBag,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard";
import { useAllProducts } from "../hooks/useQueries";

const categories = [
  {
    id: "electronics",
    label: "Electronics",
    icon: Zap,
    desc: "Gadgets & tech gear",
    gradient: "from-blue-950 to-indigo-800",
  },
  {
    id: "clothing",
    label: "Clothing",
    icon: ShoppingBag,
    desc: "Fashion & style",
    gradient: "from-rose-900 to-pink-700",
  },
  {
    id: "sports",
    label: "Sports",
    icon: Dumbbell,
    desc: "Fitness & outdoor",
    gradient: "from-emerald-900 to-teal-700",
  },
  {
    id: "homeGarden",
    label: "Home & Garden",
    icon: Home,
    desc: "Living & decor",
    gradient: "from-amber-800 to-orange-600",
  },
];

const perks = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free delivery on orders over $50 worldwide",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Your data is protected with encryption",
  },
  {
    icon: TrendingUp,
    title: "Curated Quality",
    desc: "Hand-picked products from trusted suppliers",
  },
];

export default function HomePage() {
  const { data: products, isLoading } = useAllProducts();
  const navigate = useNavigate();
  const featuredProducts = products?.slice(0, 6) ?? [];

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-primary">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/generated/hero-bg.dim_1600x900.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Grid decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 79px, oklch(0.98 0.006 80 / 0.4) 79px, oklch(0.98 0.006 80 / 0.4) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, oklch(0.98 0.006 80 / 0.4) 79px, oklch(0.98 0.006 80 / 0.4) 80px)",
          }}
        />

        <div className="container relative z-10 px-4 sm:px-6 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6 border border-accent/40 px-4 py-1.5 rounded-full">
                Curated Dropshipping Store
              </span>

              <h1 className="font-display font-bold text-primary-foreground leading-[1.05] text-5xl sm:text-6xl md:text-7xl mb-6">
                Everything
                <br />
                You Need, <span className="text-accent italic">Delivered.</span>
              </h1>

              <p className="text-primary-foreground/75 text-lg sm:text-xl font-body leading-relaxed mb-10 max-w-xl">
                Discover thousands of products across electronics, clothing,
                sports, and home — shipped directly from verified suppliers
                worldwide.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-display font-bold text-base h-14 px-8 gap-2"
                >
                  <Link to="/products" search={{}}>
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-display font-semibold text-base h-14 px-8"
                >
                  <Link to="/products" search={{}}>
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="absolute right-8 bottom-12 hidden lg:flex flex-col gap-3"
          >
            {[
              { num: "10K+", label: "Products" },
              { num: "50+", label: "Countries" },
              { num: "99%", label: "Satisfaction" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-xl px-5 py-3 text-right"
              >
                <div className="font-display font-bold text-2xl text-primary-foreground">
                  {stat.num}
                </div>
                <div className="text-primary-foreground/60 text-xs font-body uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────── */}
      <section className="py-12 border-b border-border bg-card">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <perk.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-base">
                    {perk.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5 font-body">
                    {perk.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-2 font-body">
              Find exactly what you're looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate({
                    to: "/products",
                    search: { category: cat.id, q: undefined },
                  })
                }
                className={`bg-gradient-to-br ${cat.gradient} rounded-xl p-6 text-left group cursor-pointer transition-shadow hover:shadow-elevated`}
              >
                <cat.icon className="w-8 h-8 text-white/80 mb-3" />
                <h3 className="font-display font-bold text-white text-lg leading-tight">
                  {cat.label}
                </h3>
                <p className="text-white/60 text-sm font-body mt-1">
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-white/80 text-xs font-medium">
                  Shop now <ArrowRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="py-20 bg-muted/40">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-2 font-body">
                Our most popular picks right now
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="hidden sm:flex gap-2 font-medium border-primary/30 text-primary hover:bg-primary/5"
            >
              <Link to="/products" search={{}}>
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                <ProductCardSkeleton key={k} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground font-body">
              <p>No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Button
              variant="outline"
              asChild
              className="gap-2 font-medium border-primary/30 text-primary"
            >
              <Link to="/products" search={{}}>
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
