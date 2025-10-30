import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // jika mau styling tambahan

export default function About() {
  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <section className="container py-5 d-flex flex-column flex-md-row align-items-center gap-4">
        <div className="col-md-6">
          <h1 className="fw-bold text-success mb-3">Tentang Tiara Buah</h1>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>
            Tiara Buah adalah toko buah segar dan premium yang menyediakan 
            berbagai pilihan buah pilihan terbaik, potong segar, salad buah, 
            dan paket hampers elegan. Kami berkomitmen menghadirkan kualitas 
            terbaik untuk kesehatan keluarga Anda.
          </p>

          <Link to="/product" className="btn btn-success rounded-pill px-4 mt-3 shadow-sm">
            Lihat Produk Kami 
          </Link>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="/assets/logo.png"
            alt="About"
            className="img-fluid"
            style={{ width: "400px", height: "auto", borderRadius: "10px" }}
          />
        </div>
      </section>
    </div>
  );
}
