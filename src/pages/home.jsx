import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="hero-section d-flex align-items-center text-center text-white">
        <div className="container">
          <h1 className="fw-bold display-4">Buah Segar & Premium</h1>
          <p className="lead mt-3">
            Pesan buah berkualitas terbaik untuk keluarga & acara spesial
          </p>

          <div className="mt-4 d-flex gap-3 justify-content-center">
            <Link className="btn btn-success px-4 py-2 rounded-pill" to="/product">
              Lihat Produk
            </Link>

            <a
              className="btn btn-light px-4 py-2 rounded-pill"
              href="https://wa.me/628xxx"
              target="_blank"
              rel="noreferrer"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BENEFIT ICON SECTION */}
      <section className="py-5 text-center">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              ["🥝", "Buah Segar Setiap Hari"],
              ["💰", "Harga Terjangkau"],
              ["🎁", "Paket Buah & Hampers"],
            ].map(([icon, text], i) => (
              <div className="col-6 col-md-4" key={i}>
                <div className="p-3 rounded shadow-sm bg-white">
                  <div style={{ fontSize: "2rem" }}>{icon}</div>
                  <p className="fw-bold mt-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO / BEST SELLER PLACEHOLDER */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold text-success mb-3">Produk Unggulan</h2>
          <p className="text-muted mb-4">Pilihan buah terbaik dan paling disukai pelanggan</p>

          <div className="row justify-content-center">

            {/* Product 1 */}
            <div className="col-6 col-md-4 mb-3">
              <div className="featured-card">
                <img src="/assets/salad.png" alt="Salad Buah" className="featured-img" />
                <div className="p-3">
                  <h5 className="text-success fw-bold">Salad Buah Premium</h5>
                  <p className="text-muted">Fresh & Creamy</p>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="col-6 col-md-4 mb-3">
              <div className="featured-card">
                <img src="/assets/mangga.jpg" alt="Buah Potong" className="featured-img" />
                <div className="p-3">
                  <h5 className="text-success fw-bold">Buah Potong Segar</h5>
                  <p className="text-muted">Siap Santap & Higienis</p>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="col-6 col-md-4 mb-3">
              <div className="featured-card">
                <img src="/assets/jeruk.jpg" alt="Hampers Buah" className="featured-img" />
                <div className="p-3">
                  <h5 className="text-success fw-bold">Paket Hampers Buah</h5>
                  <p className="text-muted">Elegan & Cocok Gift</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
