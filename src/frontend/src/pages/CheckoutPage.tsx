import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductPlaceholder } from "../components/ProductPlaceholder";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";

interface FormData {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const placeOrder = usePlaceOrder();
  const { identity } = useInternetIdentity();
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.street.trim()) newErrors.street = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.state.trim()) newErrors.state = "Required";
    if (!form.zip.trim()) newErrors.zip = "Required";
    if (!form.country.trim()) newErrors.country = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors above");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderId = await placeOrder.mutateAsync({
        customerId: identity?.getPrincipal().toString() ?? "guest",
        customerName: form.fullName,
        customerEmail: form.email,
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: BigInt(item.quantity),
        })),
      });

      clearCart();
      navigate({
        to: "/order-confirmation/$id",
        params: { id: orderId.toString() },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  }

  function field(
    name: keyof FormData,
    label: string,
    type = "text",
    placeholder?: string,
  ) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          id={name}
          type={type}
          value={form[name]}
          onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          className={errors[name] ? "border-destructive" : ""}
          autoComplete={name}
        />
        {errors[name] && (
          <p className="text-destructive text-xs font-body">{errors[name]}</p>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl mb-2">Cart is empty</h2>
        <p className="text-muted-foreground font-body mb-6">
          Add some items before checking out
        </p>
        <Button asChild>
          <Link to="/products" search={{}}>
            Browse Products
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container px-4 sm:px-6 py-8 max-w-5xl">
        <Link
          to="/products"
          search={{}}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display font-bold text-3xl text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Contact */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Contact Information
                </h2>
                {field("fullName", "Full Name", "text", "Jane Smith")}
                {field("email", "Email Address", "email", "jane@example.com")}
              </div>

              {/* Shipping */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-display font-semibold text-lg text-foreground">
                  Shipping Address
                </h2>
                {field(
                  "street",
                  "Street Address",
                  "text",
                  "123 Main St, Apt 4B",
                )}
                <div className="grid grid-cols-2 gap-4">
                  {field("city", "City", "text", "New York")}
                  {field("state", "State / Province", "text", "NY")}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field("zip", "ZIP / Postal Code", "text", "10001")}
                  {field("country", "Country", "text", "United States")}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base h-14 gap-2"
                disabled={placeOrder.isPending}
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Place Order · ${subtotal.toFixed(2)}
                  </>
                )}
              </Button>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.productId.toString()}
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ProductPlaceholder
                            category={item.category}
                            className="w-full h-full"
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                </div>
                <Separator className="mb-4" />
                <div className="flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-body bg-muted/50 rounded-lg px-3 py-2">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  );
}
