import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

interface ProductsSearch {
  category?: string;
  q?: string;
}
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { useInitSeedData } from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

// ── Layout wrapper ────────────────────────────────────────────────────
function RootLayout() {
  // Silently seed data on app load
  useInitSeedData();

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </CartProvider>
  );
}

// ── Routes ────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: (search.category as string) || undefined,
    q: (search.q as string) || undefined,
  }),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$id",
  component: OrderConfirmationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  productsRoute,
  productDetailRoute,
  checkoutRoute,
  orderConfirmationRoute,
  adminRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
