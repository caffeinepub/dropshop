import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface CartItem {
  productId: bigint;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  category: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === newItem.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === newItem.productId
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i,
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: bigint) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
