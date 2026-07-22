const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("./db");
const cors = require("cors");
const { computeDeliveryEstimate } = require("./utils/delivery");
const { PAYMENT_OPTIONS } = require("./config/paymentOptions");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from my Amazon clone server!");
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash the password — 10 is the "cost factor" (how slow/secure the hash is)
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    // Immediately log them in after registering by issuing a token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token,message:"User created successfully!!!!!!!", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Deliberately vague — don't reveal whether the email exists (security best practice)
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});


app.post("/api/products/filter", async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 20,
    } = req.body;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const where = {
      ...(category && category !== "All" && { category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
      stock: true,
      description: true,

      // createdAt, updatedAt omitted — won't be in the response
    },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products/related", async (req, res) => {
  try {
    const { productId, category } = req.body;

    if (!productId || !category) {
      return res.status(400).json({ error: "productId and category are required" });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category,
        id: { not: productId },
      },
      take: 8,
      select: { id: true, name: true, price: true, imageUrl: true, category: true },
    });

    res.json({ products: relatedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
});

app.post("/api/products/details", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Product id is required" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        mrp: true,
        imageUrl: true,
        category: true,
        stock: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = Number(product.price);
    const mrp = Number(product.mrp);
    const discountPercent = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
    const emiPerMonth = Math.ceil(price / 12);

    res.json({
      ...product,
      discountPercent,
      inStock: product.stock > 0,
      emiPerMonth,
      deliveryEstimate: computeDeliveryEstimate(product.stock),
      paymentOptions: PAYMENT_OPTIONS,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});


const { requireAuth } = require("./middleware/auth");

// Add item to cart (or increment quantity if already there)
app.post("/api/cart/add", requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId; // set by requireAuth middleware

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    });

    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Get the logged-in user's full cart
app.get("/api/cart", requireAuth, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true }, // pull full product details for each cart line
    });

    res.json({ cartItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Update quantity of a specific cart item
app.patch("/api/cart/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "quantity must be at least 1" });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id, userId: req.userId }, // userId check prevents editing someone else's cart
      data: { quantity },
    });

    res.json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// Remove item from cart
app.delete("/api/cart/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.delete({
      where: { id, userId: req.userId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
});