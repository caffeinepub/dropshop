import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProductInput {
    inStock: boolean;
    supplierName: string;
    name: string;
    description: string;
    category: Category;
    price: number;
}
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    state: string;
}
export type Time = bigint;
export interface OrderItem {
    productId: bigint;
    productName: string;
    quantity: bigint;
    unitPrice: number;
}
export interface OrderInput {
    customerName: string;
    shippingAddress: Address;
    customerId: string;
    items: Array<OrderItemInput>;
    customerEmail: string;
}
export interface OrderItemInput {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    createdAt: Time;
    totalAmount: number;
    shippingAddress: Address;
    customerId: string;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    supplierName: string;
    name: string;
    createdAt: Time;
    description: string;
    imageUrl?: ExternalBlob;
    category: Category;
    price: number;
}
export enum Category {
    clothing = "clothing",
    sports = "sports",
    homeGarden = "homeGarden",
    electronics = "electronics"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(productInput: ProductInput): Promise<bigint>;
    deleteProduct(productId: bigint): Promise<void>;
    filterProductsByCategory(category: Category): Promise<Array<Product>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getOrderById(orderId: bigint): Promise<Order>;
    getProductById(productId: bigint): Promise<Product>;
    getProductsByIds(productIds: Array<bigint>): Promise<Array<Product>>;
    initializeSeedData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderInput: OrderInput): Promise<bigint>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateProduct(productId: bigint, productInput: ProductInput): Promise<void>;
    uploadProductImage(productId: bigint, blob: ExternalBlob): Promise<void>;
}
