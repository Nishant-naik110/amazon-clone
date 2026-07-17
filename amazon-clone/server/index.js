const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = require("./db");
const cors = require("cors");

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

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
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

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
});