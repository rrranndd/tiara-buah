import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ Akses file gambar statis dari folder 'uploads' atau 'public/assets'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder penyimpanan gambar
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Setup upload folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Middleware untuk akses gambar
app.use("/uploads", express.static("uploads"));

// Tes server
app.get("/", (req, res) => {
  res.send("✅ Server Tiara Buah berjalan dengan baik!");
});

// =============================
// 📦 ROUTE: Semua Produk
// =============================
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

// =============================
// 👑 LOGIN ADMIN
// =============================
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, admin: rows[0] });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});


// =============================
// 🗂️ CRUD KATEGORI
// =============================
app.get("/kategori", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM kategori");
  res.json(rows);
});

app.post("/kategori", async (req, res) => {
  const { nama_kategori } = req.body;
  await pool.query("INSERT INTO kategori (nama_kategori) VALUES (?)", [nama_kategori]);
  res.json({ success: true });
});

app.put("/kategori/:id", async (req, res) => {
  const { nama_kategori } = req.body;
  const { id } = req.params;
  await pool.query("UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?", [nama_kategori, id]);
  res.json({ success: true });
});

app.delete("/kategori/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM kategori WHERE id_kategori = ?", [id]);
  res.json({ success: true });
});

// =============================
// 📦 CRUD PRODUK
// =============================
app.post("/produk", upload.single("gambar"), async (req, res) => {
  const { nama_produk, harga, id_kategori } = req.body;
  const gambar = req.file ? req.file.filename : null;

  await pool.query(
    "INSERT INTO produk (nama_produk, harga, gambar, id_kategori) VALUES (?, ?, ?, ?)",
    [nama_produk, harga, gambar, id_kategori]
  );
  res.json({ success: true });
});


app.put("/produk/:id", upload.single("gambar"), async (req, res) => {
  const { nama_produk, harga, id_kategori } = req.body;
  const { id } = req.params;
  const gambar = req.file ? req.file.filename : req.body.gambar;

  await pool.query(
    "UPDATE produk SET nama_produk=?, harga=?, gambar=?, id_kategori=? WHERE id_produk=?",
    [nama_produk, harga, gambar, id_kategori, id]
  );
  res.json({ success: true });
});


app.delete("/produk/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM produk WHERE id_produk=?", [id]);
  res.json({ success: true });
});


// =============================
// 📂 ROUTE: Produk per Kategori
// =============================
app.get("/produk/kategori/:id", async (req, res) => {
  const kategoriId = req.params.id;
  try {
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

// =============================
// 🔑 ROUTE: Admin (opsional, dari tabel admin)
// =============================
app.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_admin, username FROM admin");
    res.json(rows);
  } catch (err) {
    console.error("Error ambil admin:", err);
    res.status(500).json({ message: "Gagal mengambil admin" });
  }
});

// =============================
// 🚀 Jalankan server
// =============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server berjalan di http://localhost:${PORT}`)
);
