import React from "react";
import { FaWhatsapp, FaMapMarkerAlt, FaClock,} from "react-icons/fa";

export default function Contact() {
  return (
    <section className="contact-section py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <h2 className="text-center fw-bold text-success mb-4">Hubungi Tiara Buah </h2>
        <p className="text-center mb-5 text-muted">
          Kami siap melayani pesanan buah segar setiap hari. Silakan hubungi kami melalui WhatsApp, email, atau kunjungi toko kami langsung!
        </p>

        <div className="row justify-content-center g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <FaMapMarkerAlt size={40} className="text-success mb-3" />
                <h5 className="fw-bold">Alamat</h5>
                <p className="text-muted mb-0">Kp. Pondokkaso RT 13 RW 04, Sukabumi, Jawa Barat</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <FaClock size={40} className="text-warning mb-3" />
                <h5 className="fw-bold">Jam Buka</h5>
                <p className="text-muted mb-0">
                  Setiap Hari<br />08.00 – 20.00 WIB
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <FaWhatsapp size={40} className="text-success mb-3" />
                <h5 className="fw-bold">WhatsApp</h5>
                <p className="text-muted mb-2">+62 851-5924-4835</p>
                <a
                  href="https://wa.me/6285159244835"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm"
                >
                  Chat Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="ratio ratio-16x9 shadow-sm rounded-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d495.22125137298923!2d106.75762228599244!3d-6.797812261142022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1752258218804!5m2!1sen!2sid"
                allowFullScreen=""
                loading="lazy"
                title="Lokasi Tiara Buah"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
