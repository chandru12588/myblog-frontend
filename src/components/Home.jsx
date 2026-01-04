import React from "react";
import { useNavigate } from "react-router-dom";

// 🔥 Your Hero Image
import HeroImage from "../assets/chandru-hero.png";

// 🏕 Project 1 Banner
import WrongTurnBanner from "../assets/wrongturn-banner.png";

// 🐟 Project 2 Banner
import SeafoodBanner from "../assets/seafood-banner.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="px-5 md:px-12 select-none">

      {/* ================= HERO ================= */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between py-12">
        <div className="md:w-1/2 mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hi, I'm <span className="text-orange-500">Chandru</span> 👋
          </h1>

          <p className="text-lg text-gray-600 mt-3 leading-relaxed">
            Travel Vlogger • Fullstack Developer • Freelancer. <br />
            I build digital products & document journeys on two wheels.
          </p>

          {/* 🔥 Buttons Row */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => navigate("/blogs")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md shadow-md"
            >
              Read My Blogs →
            </button>

            <a
              href="/Chandru-CV.pdf"
              download
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md"
            >
              Download CV ⬇
            </a>

            <a
              href="/Chandru-CV.pdf"
              target="_blank"
              className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-md shadow-md"
            >
              View My CV 👀
            </a>
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

        {/* 🔥 Project 1 */}
        <div className="rounded-lg shadow-md overflow-hidden border hover:shadow-xl duration-300 bg-white">
          <img
            src={WrongTurnBanner}
            alt="WrongTurn"
            className="w-full h-[250px] md:h-[300px] object-cover rounded-t-lg"
          />

          <div className="p-5">
            <h3 className="text-xl font-semibold">WrongTurn Camping Platform</h3>
            <p className="text-gray-600 text-sm mt-2">
              Discover India through rides & camps. Verified backpack trips & stay booking.
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                Verified Backpack Camping
              </span>
              <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                Ride Trips Approved
              </span>
            </div>

            <button
              className="button-style mt-4 w-full"
              onClick={() => window.open("https://wtc-chandru.vercel.app", "_blank")}
            >
              View Project →
            </button>
          </div>
        </div>

        {/* 🔥 Project 2 */}
        <div className="rounded-lg shadow-md overflow-hidden border hover:shadow-xl duration-300 bg-white">
          <img
            src={SeafoodBanner}
            alt="Seafood Project"
            className="w-full h-[250px] md:h-[300px] object-cover rounded-t-lg"
          />

          <div className="p-5">
            <h3 className="text-xl font-semibold">Rameswaram Seafood Delivery System</h3>
            <p className="text-gray-600 text-sm mt-2">
              Seafood delivery platform with invoice automation & admin dashboard.
            </p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">React</span>
              <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">Node.js</span>
              <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">MongoDB</span>
              <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Express</span>
            </div>

            <button
              className="button-style mt-4 w-full"
              onClick={() => window.open("https://rameswaram-seafoods.vercel.app", "_blank")}
            >
              View Project →
            </button>
          </div>
        </div>
      </div>

      {/* ================= BLOG CTA ================= */}
      <section className="text-center mt-14 md:mt-20 mb-14 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-bold">I Love Writing ✍️</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Sharing tech learning & travel experiences.
        </p>

        <button
          className="button-style mt-5 px-6 py-3"
          onClick={() => navigate("/blogs")}
        >
          Browse Blogs →
        </button>
      </section>

    </div>
  );
}

export default Home;
