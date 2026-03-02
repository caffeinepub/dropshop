# DropShop - Dropshipping E-Commerce Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public product catalog with categories, search, and filtering
- Product detail page with images, description, price, and "Add to Cart"
- Shopping cart (add/remove items, update quantities)
- Checkout flow with order form (name, email, shipping address)
- Order confirmation page
- Admin panel (protected by authorization) to manage products (add, edit, delete), view/manage orders
- Product data: name, description, price, image URL, category, stock status, supplier info
- Order data: order ID, customer info, items, total, status (pending, processing, shipped, delivered)
- Sample products pre-seeded for demo purposes

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Define product, order, and cart data models in Motoko
2. Backend: CRUD endpoints for products (admin-only write, public read)
3. Backend: Order placement and order management endpoints
4. Backend: Authorization for admin role
5. Frontend: Landing/home page with featured products and categories
6. Frontend: Product listing page with search and category filter
7. Frontend: Product detail page
8. Frontend: Shopping cart (sidebar or page)
9. Frontend: Checkout form and order confirmation
10. Frontend: Admin dashboard (products management + orders list)
11. Seed sample products for demo
