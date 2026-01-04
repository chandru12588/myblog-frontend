import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ================= TITLE ================= */}
        <h1 className="text-5xl font-extrabold mb-12">
          About <span className="text-orange-500">Me</span>
        </h1>

        {/* ================= INTRO ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-14">
          <p className="text-xl text-gray-700 leading-relaxed">
            Hi 👋 I’m{" "}
            <span className="font-bold text-orange-500">Chandru</span> — a{" "}
            <strong>Travel Vlogger</strong>,{" "}
            <strong>Full-Stack Developer</strong>, and{" "}
            <strong>Freelancer</strong>.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            I build real-world digital products and document journeys on two wheels.
            From BPO floors to building full-stack platforms — this is my story.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Blogs Written", value: "25+" },
            { label: "Projects Built", value: "10+" },
            { label: "KM Traveled", value: "30,000+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transition"
            >
              <h2 className="text-4xl font-extrabold text-orange-500">
                {stat.value}
              </h2>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8">🧠 My Journey</h2>

          <div className="relative border-l-4 border-orange-400 pl-6 space-y-8">
            {[
              "Started career in BPO industry",
              "Discovered passion for technology",
              "Self-learned MERN stack",
              "Built real booking & blog platforms",
              "Travel vlogging + freelancing",
            ].map((step, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[38px] top-1 w-5 h-5 bg-orange-500 rounded-full"></span>
                <p className="text-gray-700 text-lg">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= TECH STACK ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">💻 Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Firebase Auth",
              "Cloudinary",
              "Tailwind CSS",
              "REST APIs",
            ].map((tech, i) => (
              <span
                key={i}
                className="bg-gray-100 px-4 py-2 rounded-lg text-center font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ================= SOCIAL CARDS ================= */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@RiderChandru88"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white rounded-2xl shadow-lg p-8 hover:scale-105 transition text-center"
          >
            <h2 className="text-3xl font-bold mb-3">🎥 YouTube</h2>
            <p className="text-lg">@RiderChandru88</p>
            <p className="mt-4 underline">Visit Channel →</p>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/riderchandru88/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg p-8 hover:scale-105 transition text-center"
          >
            <h2 className="text-3xl font-bold mb-3">📸 Instagram</h2>
            <p className="text-lg">@riderchandru88</p>
            <p className="mt-4 underline">View Profile →</p>
          </a>
        </div>

        {/* ================= CTA ================= */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/blogs")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Read My Blogs →
          </button>

          <button
            onClick={() => navigate("/projects")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            View Projects 🚀
          </button>

          <a
            href="/resume.pdf"
            download
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Download CV ⬇️
          </a>
        </div>

      </div>
    </div>
  );
}

export default About;
