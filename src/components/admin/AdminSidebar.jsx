import React, { useState, useEffect } from "react";
import { FaAppleAlt, FaBars } from "react-icons/fa";

export default function AdminSidebar({ setActivePage, activePage, onLogout }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile); // buka di desktop, tutup di mobile

  // 🔹 Deteksi perubahan ukuran layar (responsif)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyle = (page) => ({
    backgroundColor: activePage === page ? "#157347" : "transparent",
    color: "white",
    border: "none",
    textAlign: "left",
    padding: "12px 16px",
    fontWeight: activePage === page ? "bold" : "normal",
    transition: "0.2s",
    width: "100%",
  });

  const buttonHover = {
    backgroundColor: "#146c43",
    color: "white",
  };

  return (
    <>
      {/* 🔹 Tombol toggle di mobile */}
      {isMobile && (
        <div
            id="admin-header"
            className="p-2 bg-success text-white d-flex align-items-center shadow-sm"
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1100,
            width: "100%",
            height: "60px",
            }}
        >
            <button
            className="btn btn-sm btn-light me-2"
            onClick={() => setIsOpen(!isOpen)}
            >
            <FaBars />
            </button>
            <span className="fw-bold">Tiara Buah Admin</span>
        </div>
        )}

      {/* 🔹 Sidebar */}
      <div
        className="d-flex flex-column justify-content-between"
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-260px",
          height: "100vh",
          width: "250px",
          backgroundColor: "#198754",
          color: "white",
          zIndex: 1000,
          transition: "left 0.3s ease-in-out",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <div className="p-3 border-bottom text-center">
            <h5 className="fw-bold mb-0 text-white">
              <FaAppleAlt className="me-2 text-danger" />
              Tiara Buah
            </h5>
            <small className="text-light">Admin Panel</small>
          </div>

          <div className="d-flex flex-column mt-2">
            {["dashboard", "produk", "kategori"].map((page) => (
              <button
                key={page}
                style={buttonStyle(page)}
                onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
                onMouseOut={(e) =>
                  Object.assign(e.target.style, buttonStyle(page))
                }
                onClick={() => {
                  setActivePage(page);
                  if (isMobile) setIsOpen(false); // tutup sidebar otomatis di mobile
                }}
              >
                {page === "dashboard"
                  ? "Dashboard"
                  : page === "produk"
                  ? "Kelola Produk"
                  : "Kelola Kategori"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-top">
          <button className="btn btn-light w-100" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
