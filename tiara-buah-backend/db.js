import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT = 3306,
  NODE_ENV
} = process.env;

let pool;

try {
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Tes koneksi di awal startup (opsional tapi disarankan)
  if (NODE_ENV !== "production") {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected to:", DB_NAME, "on host:", DB_HOST);
    conn.release();
  }
} catch (err) {
  console.error("❌ Error connecting to MySQL:", err.message);
  process.exit(1); // stop server jika gagal konek ke DB
}

export default pool;
