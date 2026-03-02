import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";

actor {
  // Components
  include MixinStorage();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Types
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : ?Storage.ExternalBlob;
    category : Category;
    inStock : Bool;
    supplierName : Text;
    createdAt : Time.Time;
  };

  public type Category = {
    #electronics;
    #clothing;
    #homeGarden;
    #sports;
  };

  // Order Types
  public type Order = {
    id : Nat;
    customerId : Text;
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Address;
    items : [OrderItem];
    totalAmount : Float;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  public type Address = {
    street : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  public type OrderItem = {
    productId : Nat;
    productName : Text;
    quantity : Nat;
    unitPrice : Float;
  };

  public type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  // Store Products and Orders
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();

  // ID Counters
  var nextProductId = 1;
  var nextOrderId = 1;

  // Helper Functions
  module Product {
    public func compareByCreatedAt(a : Product, b : Product) : Order.Order {
      if (a.createdAt < b.createdAt) { #less } else if (a.createdAt > b.createdAt) {
        #greater;
      } else { #equal };
    };
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Float;
    category : Category;
    inStock : Bool;
    supplierName : Text;
  };

  // Initialize Seed Data
  public shared ({ caller }) func initializeSeedData() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (products.size() > 0) {
      Runtime.trap("Seed data already initialized");
    };

    let now = Time.now();

    let seedProducts : [Product] = [
      {
        id = nextProductId;
        name = "Smartphone";
        description = "Latest model with advanced features";
        price = 699.99;
        imageUrl = null;
        category = #electronics;
        inStock = true;
        supplierName = "Tech Supplies Inc.";
        createdAt = now;
      },
      {
        id = nextProductId + 1;
        name = "Laptop";
        description = "High performance laptop for work and play";
        price = 1199.99;
        imageUrl = null;
        category = #electronics;
        inStock = true;
        supplierName = "CompuWorld";
        createdAt = now;
      },
      {
        id = nextProductId + 2;
        name = "Men's Jacket";
        description = "Stylish and warm jacket for winter";
        price = 89.99;
        imageUrl = null;
        category = #clothing;
        inStock = true;
        supplierName = "Fashion Hub";
        createdAt = now;
      },
      {
        id = nextProductId + 3;
        name = "Women's Dress";
        description = "Elegant dress for special occasions";
        price = 59.99;
        imageUrl = null;
        category = #clothing;
        inStock = true;
        supplierName = "Style Boutique";
        createdAt = now;
      },
      {
        id = nextProductId + 4;
        name = "Blender";
        description = "Powerful blender for smoothies and more";
        price = 49.99;
        imageUrl = null;
        category = #homeGarden;
        inStock = true;
        supplierName = "Home Essentials";
        createdAt = now;
      },
      {
        id = nextProductId + 5;
        name = "Coffee Maker";
        description = "Automatic coffee maker with timer";
        price = 79.99;
        imageUrl = null;
        category = #homeGarden;
        inStock = true;
        supplierName = "BrewMaster";
        createdAt = now;
      },
      {
        id = nextProductId + 6;
        name = "Running Shoes";
        description = "Comfortable and durable running shoes";
        price = 59.99;
        imageUrl = null;
        category = #sports;
        inStock = true;
        supplierName = "Sporty";
        createdAt = now;
      },
      {
        id = nextProductId + 7;
        name = "Yoga Mat";
        description = "Non-slip yoga mat for workouts";
        price = 29.99;
        imageUrl = null;
        category = #sports;
        inStock = true;
        supplierName = "FitLife";
        createdAt = now;
      },
    ];

    for (product in seedProducts.values()) {
      products.add(product.id, product);
      nextProductId += 1;
    };
  };

  // Product Management
  public shared ({ caller }) func createProduct(productInput : ProductInput) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let product : Product = {
      id = nextProductId;
      name = productInput.name;
      description = productInput.description;
      price = productInput.price;
      imageUrl = null;
      category = productInput.category;
      inStock = productInput.inStock;
      supplierName = productInput.supplierName;
      createdAt = Time.now();
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func updateProduct(productId : Nat, productInput : ProductInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name = productInput.name;
          description = productInput.description;
          price = productInput.price;
          imageUrl = existingProduct.imageUrl;
          category = productInput.category;
          inStock = productInput.inStock;
          supplierName = productInput.supplierName;
          createdAt = existingProduct.createdAt;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func uploadProductImage(productId : Nat, blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          price = product.price;
          imageUrl = ?blob;
          category = product.category;
          inStock = product.inStock;
          supplierName = product.supplierName;
          createdAt = product.createdAt;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  // Product Queries
  public query ({ caller }) func getProductById(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByCreatedAt);
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text(searchTerm.toLower())) or product.description.toLower().contains(#text(searchTerm.toLower()));
      }
    );
    filtered.sort(Product.compareByCreatedAt);
  };

  public query ({ caller }) func filterProductsByCategory(category : Category) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
    filtered.sort(Product.compareByCreatedAt);
  };

  public query ({ caller }) func getProductsByIds(productIds : [Nat]) : async [Product] {
    let foundProducts = productIds.map(
      func(id) {
        switch (products.get(id)) {
          case (null) { Runtime.trap("Product not found for id: " # id.toText()) };
          case (?product) { product };
        };
      }
    );
    foundProducts;
  };

  // Order Management
  public type OrderInput = {
    customerId : Text;
    customerName : Text;
    customerEmail : Text;
    shippingAddress : Address;
    items : [OrderItemInput];
  };

  public type OrderItemInput = {
    productId : Nat;
    quantity : Nat;
  };

  public shared ({ caller }) func placeOrder(orderInput : OrderInput) : async Nat {
    let now = Time.now();

    // Calculate total amount and validate stock
    var totalAmount : Float = 0.0;

    let processedItems = orderInput.items.map(
      func(itemInput) {
        switch (products.get(itemInput.productId)) {
          case (null) { Runtime.trap("Product not found for id: " # itemInput.productId.toText()) };
          case (?product) {
            if (itemInput.quantity == 0) {
              Runtime.trap("Quantity must be greater than 0");
            };
            totalAmount += product.price * itemInput.quantity.toInt().toFloat();
            {
              productId = product.id;
              productName = product.name;
              quantity = itemInput.quantity;
              unitPrice = product.price;
            };
          };
        };
      }
    );

    let order : Order = {
      id = nextOrderId;
      customerId = orderInput.customerId;
      customerName = orderInput.customerName;
      customerEmail = orderInput.customerEmail;
      shippingAddress = orderInput.shippingAddress;
      items = processedItems;
      totalAmount;
      status = #pending;
      createdAt = now;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrderById(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          customerId = order.customerId;
          customerName = order.customerName;
          customerEmail = order.customerEmail;
          shippingAddress = order.shippingAddress;
          items = order.items;
          totalAmount = order.totalAmount;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray();
  };
};
