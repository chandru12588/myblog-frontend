import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [cv, setCv] = useState(null);
  const [loadingCV, setLoadingCV] = useState(true);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsAdmin(u?.email === ADMIN_EMAIL);
    });
    return () => unsub();
  }, []);

  /* ================= LOAD CV ================= */
  useEffect(() => {
    const loadCV = async () => {
      try {
        const res = await api.get("/api/cv");
        setCv(res.data);
      } catch {
        setCv(null);
      } finally {
        setLoadingCV(false);
      }
    };
    loadCV();
  }, []);

  /* ================= UPLOAD CV ================= */
  const handleUploadCV = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      alert("Please upload PDF only");
      return;
    }

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("cv", file);

      const res = await api.post("/api/cv/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCv(res.data);
      alert("CV uploaded successfully ✅");
    } catch {
      alert("Upload failed ❌");
    }
  };

  /* ================= DELETE CV ================= */
  const handleDeleteCV = async () => {
    if (!window.confirm("Delete CV permanently?")) return;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await api.delete("/api/cv/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCv(null);
      alert("CV deleted ❌");
    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="px-6 md:px-14">

      {/* ================= HERO ================= */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between py-14">

        <div className="md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hi, I'm <span className="text-orange-500">Chandru</span> 👋
          </h1>

          <p className="text-lg text-gray-600 mt-4">
            Travel Vlogger • Full-Stack Developer • Freelancer
          </p>

          <div className="flex flex-wrap gap-4 mt-6">

            <button
              onClick={() => navigate("/blogs")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow-md transition"
            >
              Read My Blogs →
            </button>

            {!loadingCV && cv && (
              <>
                <a
                  href={cv.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-md shadow-md"
                >
                  View CV 👀
                </a>

                <a
                  href={cv.downloadUrl}
                  download="Chandru_CV.pdf"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow-md"
                >
                  Download CV ⬇
                </a>
              </>
            )}

            {isAdmin && (
              <>
                <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md cursor-pointer">
                  Upload CV ⬆
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={handleUploadCV}
                  />
                </label>

                {cv && (
                  <button
                    onClick={handleDeleteCV}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md"
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
          alt="Chandru"
          className="w-full max-w-[500px] drop-shadow-2xl rounded-xl"
        />
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="mt-16">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          My Featured Projects 🚀
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          {/* PROJECT 1 */}
          <Link
            to="/projects"
            className="group relative rounded-2xl overflow-hidden shadow-xl block"
          >
            <img
              src={WrongTurnBanner}
              alt="Trippolama"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
            />

            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">
                Trippolama Camping Platform
              </h3>
              <p className="text-gray-200 text-sm mt-1">
                Verified backpack trips & stay booking
              </p>
            </div>
          </Link>

          {/* PROJECT 2 */}
          <Link
            to="/projects"
            className="group relative rounded-2xl overflow-hidden shadow-xl block"
          >
            <img
              src={SeafoodBanner}
              alt="Seafood"
              className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
            />

            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition">
              <h3 className="text-white text-xl font-bold">
                Rameswaram Seafood Delivery
              </h3>
              <p className="text-gray-200 text-sm mt-1">
                Full-stack delivery system
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* ================= BLOG CTA ================= */}
      <section className="text-center mt-20 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold">
          I Love Writing ✍️
        </h2>

        <button
          onClick={() => navigate("/blogs")}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg shadow-md"
        >
          Browse Blogs →
        </button>
      </section>

    </div>
  );
}

export default Home;