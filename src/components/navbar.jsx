import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom shadow-sm sticky-top">
      <div className="container d-flex align-items-center">
        
        {/* LOGO + Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-success" to="/">
          <img 
            src="/assets/logo.png" 
            alt="Logo" 
            style={{ width: "120px", height: "40px", marginRight: "5px", objectFit: "cover" }}
          />
          Tiara Buah
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/product ">Produk</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/tentang">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/kontak">
                Contact
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
