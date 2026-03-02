import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import CartDrawer from "./CartDrawer";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: isAdmin } = useIsAdmin();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <img
                  src="/assets/generated/dropshop-logo-transparent.dim_200x200.png"
                  alt="DropShop"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                Drop<span className="text-primary">Shop</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                search={{}}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/products")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCartOpen(true)}
                aria-label={`Cart with ${totalItems} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs font-bold bg-primary text-primary-foreground border-0 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </Button>

              {/* Auth */}
              {identity ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-body truncate max-w-[100px]">
                    {identity.getPrincipal().toString().slice(0, 8)}...
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clear()}
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-2 font-medium"
                  onClick={() => login()}
                  disabled={loginStatus === "logging-in"}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav className="container px-4 py-3 flex flex-col gap-1">
                <Link
                  to="/"
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  search={{}}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive("/products")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="pt-2 border-t border-border mt-1">
                  {identity ? (
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5" />
                        {identity.getPrincipal().toString().slice(0, 12)}...
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clear();
                          setMenuOpen(false);
                        }}
                        className="gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full gap-2 font-medium"
                      onClick={() => {
                        login();
                        setMenuOpen(false);
                      }}
                      disabled={loginStatus === "logging-in"}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
