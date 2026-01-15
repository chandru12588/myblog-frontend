import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import api from "../utils/api";

import HeroImage from "../assets/chandru-hero.png";
import WrongTurnBanner from "../assets/wrongturn-banner.png";
import SeafoodBanner from "../assets/seafood-banner.png";

const ADMIN_EMAIL = "chandru.balasub12588@gmail.com";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cvUrl, setCvUrl] = useState("/Chandru-CV.pdf"); // default

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsAdmin(u?.email === ADMIN_EMAIL);
    });
    return () => unsub();
  }, []);

  /* ================= UPLOAD / UPDATE CV ================= */
  const handleUploadCV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("cv", file);

      const res = await api.post("/api/cv/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCvUrl(res.data.cvUrl);
      alert("CV updated successfully ✅");
    } catch {
      alert("CV upload failed ❌");
    }
  };

  /* ================= DELETE CV ================= */
  const handleDeleteCV = async () => {
    if (!window.confirm("Delete CV permanently? 🗑")) return;

    try {
      const token = await user.getIdToken();

      await api.delete("/api/cv/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCvUrl("");
      alert("CV deleted ❌");
    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="px-5 md:px-12 select-none">

      {/* ================= HERO ================= */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between py-12">
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hi, I'm <span className="text-orange-500">Chandru</span> 👋
          </h1>

          <p className="text-lg text-gray-600 mt-3 leading-relaxed">
            Travel Vlogger • Fullstack Developer • Freelancer.
          </p>

          {/* ================= BUTTONS ================= */}
          <div className="flex flex-wrap gap-3 mt-6">

            {/* VIEW BLOGS */}
            <button
              onClick={() => navigate("/blogs")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md shadow-md"
            >
              Read My Blogs →
            </button>

            {/* VIEW CV */}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-md shadow-md"
              >
                View CV 👀
              </a>
            )}

            {/* DOWNLOAD CV */}
            {cvUrl && (
              <a
                href={cvUrl}
                download
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md"
              >
                Download CV ⬇
              </a>
            )}

            {/* ================= ADMIN ONLY ================= */}
            {isAdmin && (
              <>
                {/* UPLOAD / UPDATE */}
                <label className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md cursor-pointer">
                  Update CV ⬆
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadCV}
                    hidden
                  />
                </label>

                {/* DELETE */}
                {cvUrl && (
                  <button
                    onClick={handleDeleteCV}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md shadow-md"
                  >
                    Delete CV 🗑
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <img
          src={HeroImage}
          alt="Chandru on Bike"
          className="w-full max-w-[450px] md:max-w-[550px] drop-shadow-xl rounded-lg mx-auto"
        />
      </section>

      {/* ================= PROJECTS ================= */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mt-14 mb-10">
        My Featured Projects 🚀
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Project cards (unchanged) */}
        <img src={WrongTurnBanner} alt="" />
        <img src={SeafoodBanner} alt="" />
      </div>

      {/* ================= BLOG CTA ================= */}
      <section className="text-center mt-20 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold">
          I Love Writing ✍️
        </h2>

        <button
          onClick={() => navigate("/blogs")}
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md"
        >
          Browse Blogs →
        </button>
      </section>
    </div>
  );
}

export default Home;
