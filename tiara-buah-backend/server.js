import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import bcrypt from "bcrypt";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Hanya file gambar yang diperbolehkan"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

app.get("/", (req, res) => {
  res.send("✅ Server Tiara Buah berjalan dengan baik!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows[0].result });
  } catch (err) {
    console.error("Test DB error:", err);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

//produk
app.get("/produk", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, k.nama_kategori 
      FROM produk p 
      LEFT JOIN kategori k ON p.id_kategori = k.id_kategori
      ORDER BY p.id_produk ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error ambil produk:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

// admin
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "username & password diperlukan" });
    }

    const [rows] = await pool.query("SELECT * FROM admin WHERE username = ? LIMIT 1", [username]);
    if (rows.length === 0) {
      console.log(`Login failed: username not found -> ${username}`);
      return res.status(401).json({ success: false, message: "Username atau password salah" });
    }

    const admin = rows[0];
    const stored = admin.password;

    if (typeof stored !== "string") {
      console.error("Stored password invalid for user:", username);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    const match = await bcrypt.compare(password, stored);

    if (!match) {
      console.log(`Login failed: wrong password -> ${username}`);
      return res.status(401).json({ success: false, message: "Username atau password salah" });
    }

    delete admin.password;

    console.log(`Login success -> ${username}`);
    return res.json({ success: true, admin });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});


// kategori
app.get("/kategori", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM kategori");
    res.json(rows);
  } catch (err) {
    console.error("Error ambil kategori:", err);
    res.status(500).json({ message: "Gagal mengambil kategori" });
  }
});

app.post("/kategori", async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    if (!nama_kategori) return res.status(400).json({ success: false, message: "nama_kategori diperlukan" });

    await pool.query("INSERT INTO kategori (nama_kategori) VALUES (?)", [nama_kategori]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error insert kategori:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan kategori" });
  }
});

app.put("/kategori/:id", async (req, res) => {
  try {
    const { nama_kategori } = req.body;
    const { id } = req.params;
    await pool.query("UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?", [nama_kategori, id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error update kategori:", err);
    res.status(500).json({ success: false, message: "Gagal update kategori" });
  }
});

app.delete("/kategori/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM kategori WHERE id_kategori = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error delete kategori:", err);
    res.status(500).json({ success: false, message: "Gagal hapus kategori" });
  }
});

// crud
app.post("/produk", upload.single("gambar"), async (req, res) => {
  try {
    const { nama_produk, harga, id_kategori } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await pool.query(
      "INSERT INTO produk (nama_produk, harga, gambar, id_kategori) VALUES (?, ?, ?, ?)",
      [nama_produk, harga, gambar, id_kategori]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error insert produk:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan produk" });
  }
});

app.put("/produk/:id", upload.single("gambar"), async (req, res) => {
  try {
    const { nama_produk, harga, id_kategori } = req.body;
    const { id } = req.params;
    const gambar = req.file ? req.file.filename : req.body.gambar;

    await pool.query(
      "UPDATE produk SET nama_produk=?, harga=?, gambar=?, id_kategori=? WHERE id_produk=?",
      [nama_produk, harga, gambar, id_kategori, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error update produk:", err);
    res.status(500).json({ success: false, message: "Gagal update produk" });
  }
});

app.delete("/produk/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM produk WHERE id_produk=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error delete produk:", err);
    res.status(500).json({ success: false, message: "Gagal hapus produk" });
  }
});

// kategori
app.get("/produk/kategori/:id", async (req, res) => {
  try {
    const kategoriId = req.params.id;
    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kategori 
       FROM produk p 
       LEFT JOIN kategori k ON p.id_kategori = k.id_kategori 
       WHERE p.id_kategori = ?`,
      [kategoriId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error ambil produk kategori:", err);
    res.status(500).json({ message: "Gagal mengambil produk per kategori" });
  }
});

// admin
app.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_admin, username FROM admin");
    res.json(rows);
  } catch (err) {
    console.error("Error ambil admin:", err);
    res.status(500).json({ message: "Gagal mengambil admin" });
  }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`✅ Server berjalan pada port ${PORT}`)
);

const shutdown = async () => {
  console.log("⚠️  Graceful shutdown...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  try {
    if (pool && pool.end) {
      await pool.end();
      console.log("DB pool closed.");
    }
  } catch (err) {
    console.error("Error closing DB pool:", err);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});
