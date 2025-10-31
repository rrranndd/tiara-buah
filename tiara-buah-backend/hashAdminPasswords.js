// hashAdminPasswords.js
import bcrypt from "bcrypt";
import pool from "./db.js";

const SALT_ROUNDS = 10;

(async () => {
  try {
    console.log("🔍 Memeriksa password admin...");

    // Ambil semua admin
    const [admins] = await pool.query("SELECT id_admin, username, password FROM admin");

    if (!admins.length) {
      console.log("⚠️ Tidak ada data admin ditemukan.");
      process.exit(0);
    }

    let updatedCount = 0;

    for (const admin of admins) {
      const { id_admin, username, password } = admin;

      // Jika password sudah bcrypt hash, lewati
      if (typeof password === "string" && password.startsWith("$2")) {
        console.log(`➡️  Admin '${username}' sudah hashed, skip.`);
        continue;
      }

      // Hash password lama
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);

      // Update DB
      await pool.query("UPDATE admin SET password = ? WHERE id_admin = ?", [hashed, id_admin]);
      console.log(`✅ Password admin '${username}' berhasil di-hash.`);

      updatedCount++;
    }

    if (updatedCount === 0) {
      console.log("✅ Semua password admin sudah hashed, tidak ada perubahan.");
    } else {
      console.log(`🎉 Total password di-hash: ${updatedCount}`);
    }

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Terjadi error saat hashing:", err);
    process.exit(1);
  }
})();
