import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CategoryManager() {
  const [kategori, setKategori] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id_kategori: null,
    nama_kategori: "",
  });

  const fetchKategori = async () => {
    const res = await fetch("http://localhost:4000/kategori");
    const data = await res.json();
    setKategori(data);
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await fetch(`http://localhost:4000/kategori/${formData.id_kategori}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kategori: formData.nama_kategori }),
      });
      alert("✅ Kategori berhasil diperbarui!");
    } else {
      await fetch("http://localhost:4000/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kategori: formData.nama_kategori }),
      });
      alert("✅ Kategori baru berhasil ditambahkan!");
    }

    setShowModal(false);
    setEditMode(false);
    setFormData({ id_kategori: null, nama_kategori: "" });
    fetchKategori();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    await fetch(`http://localhost:4000/kategori/${id}`, {
      method: "DELETE",
    });
    fetchKategori();
  };

  const handleEdit = (item) => {
    setFormData({
      id_kategori: item.id_kategori,
      nama_kategori: item.nama_kategori,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const openAddModal = () => {
    setFormData({ id_kategori: null, nama_kategori: "" });
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">Kelola Kategori</h3>
        <button className="btn btn-success" onClick={openAddModal}>
          + Tambah Kategori
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table align-middle">
            <thead className="table-success">
              <tr>
                <th style={{ width: "10%" }}>No</th>
                <th>Nama Kategori</th>
                <th style={{ width: "25%" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kategori.map((item, index) => (
                <tr key={item.id_kategori}>
                  <td>{index + 1}</td>
                  <td>{item.nama_kategori}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning text-white me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id_kategori)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {kategori.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success">
                  {editMode ? "Edit Kategori" : "Tambah Kategori"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Kategori
                    </label>
                    <input
                      className="form-control"
                      value={formData.nama_kategori}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama_kategori: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editMode ? "Simpan Perubahan" : "Tambah Kategori"}
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
