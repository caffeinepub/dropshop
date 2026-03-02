import { Link } from "@tanstack/react-router";
import { Heart, Instagram, Mail, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-2xl mb-3">
              Drop<span className="text-accent">Shop</span>
            </h2>
            <p className="text-primary-foreground/70 font-body text-sm leading-relaxed max-w-xs">
              Curated products from verified global suppliers, delivered
              directly to your door. Quality you can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground/60 mb-4">
              Shop
            </h3>
            <nav className="space-y-2">
              <Link
                to="/products"
                search={{}}
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
              >
                All Products
              </Link>
              <Link
                to="/products"
                search={{ category: "electronics" }}
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
              >
                Electronics
              </Link>
              <Link
                to="/products"
                search={{ category: "clothing" }}
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
              >
                Clothing
              </Link>
              <Link
                to="/products"
                search={{ category: "sports" }}
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
              >
                Sports
              </Link>
              <Link
                to="/products"
                search={{ category: "homeGarden" }}
                className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
              >
                Home &amp; Garden
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-primary-foreground/60 mb-4">
              Support
            </h3>
            <div className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <p>Free shipping on orders over $50</p>
              <p>30-day return policy</p>
              <p>24/7 customer support</p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@dropshop.com"
                  className="hover:text-primary-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/50 font-body">
            © {year} DropShop. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors font-body flex items-center gap-1"
          >
            Built with <Heart className="w-3 h-3 inline text-accent" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
