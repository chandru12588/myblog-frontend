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

  // CV state
  const [cv, setCv] = useState(null); // { viewUrl, downloadUrl }
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
        // res.data will be { viewUrl, downloadUrl } or null
        setCv(res.data); 
      } catch (err) {
        console.error("Error loading CV:", err);
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

    // Optional: Basic frontend validation
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
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

      // Update state with the new URLs from the fixed backend
      setCv(res.data); 

      alert("CV uploaded successfully ✅");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("CV upload failed ❌");
    }
  };

  /* ================= DELETE CV ================= */
  const handleDeleteCV = async () => {
    if (!window.confirm("Delete CV permanently? 🗑")) return;
    if (!user) return;

    try {
      const token = await user.getIdToken();

      await api.delete("/api/cv/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCv(null);
      alert("CV deleted successfully ❌");
    } catch (err) {
      console.error("Delete failed:", err);
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
            Travel Vlogger • Full-Stack Developer • Freelancer
          </p>

          {/* ================= ACTION BUTTONS ================= */}
          <div className="flex flex-wrap gap-3 mt-6">

            {/* BLOGS */}
            <button
              onClick={() => navigate("/blogs")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md shadow-md"
            >
              Read My Blogs →
            </button>

            {/* CV VIEW / DOWNLOAD */}
            {!loadingCV && cv && (
              <>
                {/* VIEW LINK: rel="noopener noreferrer" is important for 
                   security when opening external Cloudinary links.
                */}
                <a
                  href={cv.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-md shadow-md"
                >
                  View CV 👀
                </a>

                {/* DOWNLOAD LINK: The backend 'fl_attachment' flag does the work,
                   but the 'download' attribute is a good browser hint.
                */}
                <a
                  href={cv.downloadUrl}
                  download="Chandru_CV.pdf"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md"
                >
                  Download CV ⬇
                </a>
              </>
            )}

            {/* ================= ADMIN ONLY ================= */}
            {isAdmin && (
              <>
                <label className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md cursor-pointer">
                  Upload CV ⬆
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleUploadCV}
                  />
                </label>

                {cv && (
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
          alt="Chandru"
          className="w-full max-w-[450px] md:max-w-[550px] drop-shadow-xl rounded-lg mx-auto"
        />
      </section>

      {/* ================= PROJECTS ================= */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mt-14 mb-10">
        My Featured Projects 🚀
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        <img src={WrongTurnBanner} alt="WrongTurn Project" className="rounded-lg shadow-lg" />
        <img src={SeafoodBanner} alt="Seafood Project" className="rounded-lg shadow-lg" />
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