import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductPlaceholder } from "./ProductPlaceholder";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="font-display text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-1">
                ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-lg">
                Your cart is empty
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Add some products to get started
              </p>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              asChild
              className="mt-2"
            >
              <Link to="/products" search={{}}>
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Item List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId.toString()} className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border border-border">
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-foreground truncate">
                      {item.productName}
                    </p>
                    <p className="text-primary font-bold text-sm mt-0.5">
                      ${item.unitPrice.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-bold text-foreground flex-shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-display font-bold text-lg text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <Separator />
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 font-display text-base"
                asChild
                onClick={onClose}
              >
                <Link to="/checkout">Proceed to Checkout →</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
