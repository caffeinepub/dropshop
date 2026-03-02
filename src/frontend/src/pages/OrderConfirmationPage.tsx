import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import { motion } from "motion/react";
import { ProductPlaceholder } from "../components/ProductPlaceholder";
import { useOrder } from "../hooks/useQueries";

const statusColors: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50",
  processing: "text-blue-600 bg-blue-50",
  shipped: "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

export default function OrderConfirmationPage() {
  const { id } = useParams({ from: "/order-confirmation/$id" });
  const orderId = BigInt(id);
  const { data: order, isLoading } = useOrder(orderId);

  const statusColor = order
    ? (statusColors[order.status] ?? "text-muted-foreground bg-muted")
    : "";

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container px-4 sm:px-6 py-12 max-w-3xl">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : order ? (
          <>
            {/* Success Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary rounded-xl p-8 text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-9 h-9 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-foreground mb-2">
                Order Confirmed! 🎉
              </h1>
              <p className="text-primary-foreground/75 font-body">
                Thank you, {order.customerName}! Your order has been received
                and is being processed.
              </p>
              <div className="mt-4 inline-block bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-2">
                <span className="text-primary-foreground/70 text-xs font-body">
                  Order ID:{" "}
                </span>
                <span className="text-primary-foreground font-display font-bold text-sm">
                  #{order.id.toString()}
                </span>
              </div>
            </motion.div>

            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card rounded-xl border border-border p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order Items
                </h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColor}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId.toString()}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <ProductPlaceholder className="w-full h-full" size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity.toString()} × $
                        {item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      ${(item.unitPrice * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-display font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card rounded-xl border border-border p-6 mb-8"
            >
              <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm font-body text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">
                  {order.customerName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </motion.div>

            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold gap-2 h-12 px-8"
              >
                <Link to="/products" search={{}}>
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground font-body">Loading order...</p>
          </div>
        )}
      </div>
    </main>
  );
}
