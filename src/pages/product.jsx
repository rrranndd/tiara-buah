import React, { useEffect, useState } from "react";
import ProductCard from "../components/productCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState({});
  const [totalQty, setTotalQty] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const total = Object.values(qty).reduce((a, b) => a + b, 0);
    setTotalQty(total);
  }, [qty]);

  const fetchProducts = async (kategoriId = null) => {
    setLoading(true);

    const url = kategoriId
      ? `http://localhost:4000/produk/kategori/${kategoriId}`
      : `http://localhost:4000/produk`;

    const res = await fetch(url);
    const data = await res.json();

    setProducts(data);

    // 💡 Jangan reset semua qty, cukup tambahkan produk baru bila belum ada
    setQty(prevQty => {
      const updatedQty = { ...prevQty };
      data.forEach(item => {
        if (updatedQty[item.id_produk] === undefined) {
          updatedQty[item.id_produk] = 0;
        }
      });
      return updatedQty;
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const increaseQty = (id) => {
    setQty(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQty = (id) => {
    setQty(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  };

  const handleSendOrder = () => {
    const selected = products
      .filter(p => qty[p.id_produk] > 0)
      .map(p => `${p.nama_produk} x ${qty[p.id_produk]}`)
      .join("\n");

    if (!selected) {
      alert("Belum ada pesanan");
      return;
    }

    const phone = "6285159244835"; // ✅ GANTI nomor WhatsApp toko kamu

    const message = `Halo Tiara Buah, saya ingin memesan:\n\n${selected}\n\nTerima kasih `;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <div className="container py-5">
        <h2 className="fw-bold text-success mb-4 text-center">Produk Tiara Buah</h2>

        {/* ✅ Tombol kategori */}
        <div className="text-center mb-4 d-flex gap-2 justify-content-center flex-wrap">
          <button
            className={`category-chips ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => { setSelectedCategory("all"); fetchProducts(); }}
          >
            Semua
          </button>

          <button
            className={`category-chips ${selectedCategory === "1" ? "active" : ""}`}
            onClick={() => { setSelectedCategory("1"); fetchProducts(1); }}
          >
            Buah Potong
          </button>

          <button
            className={`category-chips ${selectedCategory === "2" ? "active" : ""}`}
            onClick={() => { setSelectedCategory("2"); fetchProducts(2); }}
          >
            Buah Per Kilo
          </button>

          <button
            className={`category-chips ${selectedCategory === "4" ? "active" : ""}`}
            onClick={() => { setSelectedCategory("4"); fetchProducts(4); }}
          >
            Salad Buah
          </button>
        </div>

        {/* ✅ Grid Produk */}
        <div className="row">
          {loading && <p className="text-center">Loading...</p>}
          {!loading && products.map((item) => (
            <ProductCard
              key={item.id_produk}
              name={item.nama_produk}
              price={Number(item.harga)}
              image={`http://localhost:4000/uploads/${item.gambar}`}
              qty={qty[item.id_produk]}
              onIncrease={() => increaseQty(item.id_produk)}
              onDecrease={() => decreaseQty(item.id_produk)}
            />
          ))}
        </div>
      </div>

      {/* ✅ Floating Button Kirim Pesanan */}
      <button
        className="btn btn-warning floating-order-btn"
        onClick={handleSendOrder}
      >
        Kirim Pesanan 
      </button>
      {/* 🔘 Bubble total pesanan */}
      {totalQty > 0 && (
        <div
          className="bubble-total"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "25px",
            backgroundColor: "#dc3545",
            color: "white",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        >
          {totalQty}
        </div>
      )}

    </>
  );
}
