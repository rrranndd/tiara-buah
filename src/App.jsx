import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import "./App.css";
import Produk from "./pages/product";
import Tentang from "./pages/about";
import Kontak from "./pages/contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // ✅ Ambil admin langsung dari localStorage di awal
  const storedAdmin = localStorage.getItem("admin");
  const [admin, setAdmin] = useState(storedAdmin ? JSON.parse(storedAdmin) : null);

  // 🔹 Simpan ke localStorage setiap kali admin login
  const handleLogin = (data) => {
    setAdmin(data);
    localStorage.setItem("admin", JSON.stringify(data));
  };

  // 🔹 Hapus session admin
  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  // 🔹 Sembunyikan Navbar/Footer di halaman admin
  const location = window.location.pathname;
  const hideLayout = location.startsWith("/admin") || location.startsWith("/dashboard");

  return (
    <Router>
      {!hideLayout && <Navbar />}
      <main className="flex-grow-1">
        <Routes>
          {/* Halaman utama */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Produk />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />

          {/* Login Admin */}
          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />

          {/* Dashboard Admin */}
          <Route
            path="/dashboard"
            element={
              admin ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />

          {/* Redirect tidak dikenal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </Router>
  );
}

export default App;
