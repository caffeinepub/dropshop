import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Order,
  OrderInput,
  OrderStatus,
  Product,
  ProductInput,
} from "../backend.d";
import { Category } from "../backend.d";
import { useActor } from "./useActor";

// ── Product Queries ──────────────────────────────────────────────────

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(productId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === undefined) throw new Error("No actor");
      return actor.getProductById(productId);
    },
    enabled: !!actor && !isFetching && productId !== undefined,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return actor.getAllProducts();
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useFilterProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) return actor.getAllProducts();
      return actor.filterProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Product Mutations ────────────────────────────────────────────────

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("No actor");
      return actor.createProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: ProductInput;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUploadProductImage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      file,
    }: {
      id: bigint;
      file: File;
    }) => {
      if (!actor) throw new Error("No actor");
      // Dynamically import ExternalBlob from the backend module (not the .d.ts)
      const backendModule = await import("../backend");
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = backendModule.ExternalBlob.fromBytes(bytes);
      return actor.uploadProductImage(id, blob);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Order Queries ────────────────────────────────────────────────────

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useOrder(orderId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Order>({
    queryKey: ["order", orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === undefined) throw new Error("No actor");
      return actor.getOrderById(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== undefined,
  });
}

// ── Order Mutations ──────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: OrderInput) => {
      if (!actor) throw new Error("No actor");
      return actor.placeOrder(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: OrderStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Admin ────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

// ── Seed Data ────────────────────────────────────────────────────────

export function useInitSeedData() {
  const { actor } = useActor();
  return useQuery({
    queryKey: ["seedData"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        await actor.initializeSeedData();
      } catch {
        // ignore
      }
      return true;
    },
    enabled: !!actor,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}

export { Category };
