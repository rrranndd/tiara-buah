import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        
        {/* Text */}
        <div className="col-md-6">
          <h1 className="fw-bold text-success mb-3" style={{ fontSize: "3rem" }}>
            Segar, Sehat, <span className="text-warning">Alami</span>
          </h1>
          <p className="text-muted fs-5 mb-4">
            Temukan berbagai buah segar pilihan terbaik untuk keluarga Anda.
            Kualitas premium, harga terjangkau.
          </p>
          
          <Link to="/products" className="btn btn-success btn-lg px-4 me-3">
            Belanja Sekarang
          </Link>
          <Link to="/about" className="btn btn-outline-success btn-lg px-4">
            Tentang Kami
          </Link>
        </div>

        <div className="col-md-6 text-center">
          <img 
            src="/assets/hero-buah.png" 
            alt="Buah Segar"
            className="img-fluid"
            style={{ maxHeight: "380px" }}
          />
        </div>
      </div>
    </div>
  );
}
