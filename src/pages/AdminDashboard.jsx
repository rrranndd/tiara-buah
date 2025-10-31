import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "produk":
        return <ProductManager />;
      case "kategori":
        return <CategoryManager />;
      default:
        return (
          <div className="p-4">
            <h2 className="text-success fw-bold mb-3">
              Selamat datang di Dashboard Admin 
            </h2>
            <p>Gunakan menu di samping untuk mengelola data produk dan kategori.</p>
          </div>
        );
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <AdminSidebar
        setActivePage={setActivePage}
        activePage={activePage}
        onLogout={onLogout}
      />

      <div
        className="flex-grow-1"
        style={{
          background: "#f8f9fa",
          overflowY: "auto",
          marginLeft: isMobile ? 0 : "250px",
          padding: "20px",
          paddingTop: isMobile ? "80px" : "20px", 
          transition: "margin-left 0.3s ease",
          boxSizing: "border-box",
          height: "100vh",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
}
