import React from "react";

export default function ProductCard({ name, price, image, qty, onIncrease, onDecrease }) {
  return (
    <div className="col-md-4 col-6 mb-4">
      <div className="product-card">

        <img src={image} alt={name} className="product-image" />

        <div className="p-3 text-center">
          <h5 className="product-title">{name}</h5>
          <p className="product-price">Rp {price.toLocaleString()}</p>

          <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
            <button className="qty-btn" onClick={onDecrease}>-</button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={onIncrease}>+</button>
          </div>
        </div>

      </div>
    </div>
  );
}
