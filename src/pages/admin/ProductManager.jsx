import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductManager() {
  const [produk, setProduk] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    id_produk: null,
    nama_produk: "",
    harga: "",
    gambar: null,
    id_kategori: "",
  });

  // Ambil produk & kategori
  const fetchProduk = async (kategoriId = "all") => {
    const url =
      kategoriId === "all"
        ? "http://localhost:4000/produk"
        : `http://localhost:4000/produk/kategori/${kategoriId}`;
    const res = await fetch(url);
    setProduk(await res.json());
  };

  const fetchKategori = async () => {
    const res = await fetch("http://localhost:4000/kategori");
    setKategori(await res.json());
  };

  useEffect(() => {
    fetchProduk();
    fetchKategori();
  }, []);

  // Tambah atau edit produk
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("nama_produk", formData.nama_produk);
    form.append("harga", formData.harga);
    form.append("id_kategori", formData.id_kategori);
    if (formData.gambar instanceof File) form.append("gambar", formData.gambar);

    const url = editMode
      ? `http://localhost:4000/produk/${formData.id_produk}`
      : "http://localhost:4000/produk";

    await fetch(url, {
      method: editMode ? "PUT" : "POST",
      body: form,
    });

    alert(editMode ? "✅ Produk diperbarui!" : "✅ Produk ditambahkan!");
    setShowModal(false);
    setEditMode(false);
    fetchProduk(selectedKategori);
  };

  // Hapus produk
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus produk ini?")) return;
    await fetch(`http://localhost:4000/produk/${id}`, { method: "DELETE" });
    fetchProduk(selectedKategori);
  };

  // Edit produk
  const handleEdit = (item) => {
    setFormData({
      id_produk: item.id_produk,
      nama_produk: item.nama_produk,
      harga: item.harga,
      gambar: item.gambar,
      id_kategori: item.id_kategori,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Input file handler
  const handleFileChange = (e) => {
    setFormData({ ...formData, gambar: e.target.files[0] });
  };

  // Buka modal tambah produk
  const openAddModal = () => {
    setFormData({
      id_produk: null,
      nama_produk: "",
      harga: "",
      gambar: null,
      id_kategori: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">Kelola Produk</h3>
        <button className="btn btn-success" onClick={openAddModal}>
          + Tambah Produk
        </button>
      </div>

      {/* Filter kategori */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <button
          className={`btn ${selectedKategori === "all" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => {
            setSelectedKategori("all");
            fetchProduk();
          }}
        >
          Semua
        </button>
        {kategori.map((k) => (
          <button
            key={k.id_kategori}
            className={`btn ${
              selectedKategori === k.id_kategori ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => {
              setSelectedKategori(k.id_kategori);
              fetchProduk(k.id_kategori);
            }}
          >
            {k.nama_kategori}
          </button>
        ))}
      </div>

      {/* GRID PRODUK */}
      <div className="row">
        {produk.map((item) => (
            <div
            key={item.id_produk}
            className="col-6 col-md-3 mb-4 d-flex justify-content-center"
            >
            <div
                className="card shadow-sm border-0"
                style={{
                width: "100%",
                maxWidth: "250px", // ✅ batas ukuran card biar seragam
                height: "370px",   // ✅ tinggi seragam
                display: "flex",
                flexDirection: "column",
                }}
            >
                <div
                style={{
                    width: "100%",
                    height: "250px", // ✅ ukuran gambar tetap
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f8f9fa",
                }}
                >
                <img
                    src={`http://localhost:4000/uploads/${item.gambar}`}
                    alt={item.nama_produk}
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // ✅ isi penuh tanpa distorsi
                    }}
                />
                </div>

                <div className="card-body d-flex flex-column justify-content-between">
                <div>
                    <h6 className="fw-bold text-truncate">{item.nama_produk}</h6>
                    <p className="text-muted mb-2">
                    Rp {Number(item.harga).toLocaleString()}
                    </p>
                </div>

                <div className="d-flex justify-content-between">
                    <button
                    className="btn btn-sm btn-warning text-white"
                    onClick={() => handleEdit(item)}
                    >
                    Edit
                    </button>
                    <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id_produk)}
                    >
                    Hapus
                    </button>
                </div>
                </div>
            </div>
            </div>
        ))}
        </div>

      {/* MODAL TAMBAH / EDIT */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success">
                  {editMode ? "Edit Produk" : "Tambah Produk"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nama Produk</label>
                    <input
                      className="form-control"
                      value={formData.nama_produk}
                      onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Harga</label>
                    <input
                      className="form-control"
                      type="number"
                      value={formData.harga}
                      onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Gambar</label>
                    <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
                    {editMode && formData.gambar && (
                      <img
                        src={`http://localhost:4000/uploads/${formData.gambar}`}
                        alt="preview"
                        className="mt-2 rounded"
                        style={{ width: "100%", height: "150px", objectFit: "cover" }}
                      />
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Kategori</label>
                    <select
                      className="form-select"
                      value={formData.id_kategori}
                      onChange={(e) => setFormData({ ...formData, id_kategori: e.target.value })}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {kategori.map((k) => (
                        <option key={k.id_kategori} value={k.id_kategori}>
                          {k.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editMode ? "Simpan Perubahan" : "Tambah Produk"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
