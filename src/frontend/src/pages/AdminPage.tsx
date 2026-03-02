import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Edit2,
  Loader2,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Category, OrderStatus } from "../backend.d";
import type { Product, ProductInput } from "../backend.d";
import {
  useAllOrders,
  useAllProducts,
  useCreateProduct,
  useDeleteProduct,
  useIsAdmin,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const categoryOptions = [
  { value: Category.electronics, label: "Electronics" },
  { value: Category.clothing, label: "Clothing" },
  { value: Category.sports, label: "Sports" },
  { value: Category.homeGarden, label: "Home & Garden" },
];

const orderStatusOptions = [
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.processing, label: "Processing" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  category: Category.electronics,
  inStock: true,
  supplierName: "",
};

export default function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [productModal, setProductModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    product?: Product;
  }>({ open: false, mode: "create" });
  const [formData, setFormData] = useState<ProductInput>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  function openCreate() {
    setFormData(emptyForm);
    setProductModal({ open: true, mode: "create" });
  }

  function openEdit(product: Product) {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
      supplierName: product.supplierName,
    });
    setProductModal({ open: true, mode: "edit", product });
  }

  async function handleProductSubmit() {
    try {
      if (productModal.mode === "create") {
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully");
      } else if (productModal.product) {
        await updateProduct.mutateAsync({
          id: productModal.product.id,
          input: formData,
        });
        toast.success("Product updated successfully");
      }
      setProductModal({ open: false, mode: "create" });
    } catch {
      toast.error("Failed to save product");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete product");
    }
  }

  async function handleStatusChange(orderId: bigint, status: string) {
    try {
      await updateOrderStatus.mutateAsync({
        orderId,
        status: status as OrderStatus,
      });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (adminLoading) {
    return (
      <main className="container px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container px-4 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground font-body">
            You don't have permission to access the admin panel. Please log in
            with an admin account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Manage your store
            </p>
          </div>
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 font-medium">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Admin
          </Badge>
        </motion.div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="font-display font-medium">
              Products {products ? `(${products.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-display font-medium">
              Orders {orders ? `(${orders.length})` : ""}
            </TabsTrigger>
          </TabsList>

          {/* ── Products Tab ── */}
          <TabsContent value="products">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-display font-semibold text-foreground">
                  All Products
                </h2>
                <Button
                  onClick={openCreate}
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              {productsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-display">Name</TableHead>
                        <TableHead className="font-display">Category</TableHead>
                        <TableHead className="font-display">Price</TableHead>
                        <TableHead className="font-display">Stock</TableHead>
                        <TableHead className="font-display">Supplier</TableHead>
                        <TableHead className="font-display text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id.toString()}>
                          <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                            {product.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.inStock ? "default" : "destructive"
                              }
                              className="text-xs"
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                            {product.supplierName}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(product)}
                                className="h-8 w-8"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTarget(product.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!products || products.length === 0) && (
                    <p className="text-center text-muted-foreground py-12 font-body text-sm">
                      No products yet. Add your first product.
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Orders Tab ── */}
          <TabsContent value="orders">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-display font-semibold text-foreground">
                  All Orders
                </h2>
              </div>

              {ordersLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-display">Order ID</TableHead>
                        <TableHead className="font-display">Customer</TableHead>
                        <TableHead className="font-display">Total</TableHead>
                        <TableHead className="font-display">Date</TableHead>
                        <TableHead className="font-display">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id.toString()}>
                          <TableCell className="font-display font-bold text-primary text-xs">
                            #{order.id.toString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.customerEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-primary">
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(
                              Number(order.createdAt) / 1_000_000,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(v) =>
                                handleStatusChange(order.id, v)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {orderStatusOptions.map((opt) => (
                                  <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-xs"
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(!orders || orders.length === 0) && (
                    <p className="text-center text-muted-foreground py-12 font-body text-sm">
                      No orders yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Product Modal ── */}
      <Dialog
        open={productModal.open}
        onOpenChange={(v) =>
          !v && setProductModal({ open: false, mode: "create" })
        }
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {productModal.mode === "create"
                ? "Add New Product"
                : "Edit Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name">Product Name</Label>
              <Input
                id="prod-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prod-price">Price ($)</Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prod-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, category: v as Category }))
                  }
                >
                  <SelectTrigger id="prod-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-supplier">Supplier Name</Label>
              <Input
                id="prod-supplier"
                value={formData.supplierName}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, supplierName: e.target.value }))
                }
                placeholder="e.g. TechCorp International"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="prod-instock"
                checked={formData.inStock}
                onCheckedChange={(v) =>
                  setFormData((f) => ({ ...f, inStock: v }))
                }
              />
              <Label htmlFor="prod-instock" className="cursor-pointer">
                In Stock
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductModal({ open: false, mode: "create" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProductSubmit}
              disabled={createProduct.isPending || updateProduct.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : productModal.mode === "create" ? (
                "Create Product"
              ) : (
                "Update Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This action cannot be undone. The product will be permanently
              removed from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
