import React, { useState,  } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,  } from "react-router-dom";
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
  const storedAdmin = localStorage.getItem("admin");
  const [admin, setAdmin] = useState(storedAdmin ? JSON.parse(storedAdmin) : null);

  const handleLogin = (data) => {
    setAdmin(data);
    localStorage.setItem("admin", JSON.stringify(data));
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  const location = window.location.pathname;
  const hideLayout = location.startsWith("/admin") || location.startsWith("/dashboard");

  return (
    <Router>
      {!hideLayout && <Navbar />}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Produk />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/kontak" element={<Kontak />} />

          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />

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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </Router>
  );
}

export default App;
