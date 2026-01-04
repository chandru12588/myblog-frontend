import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase";

function Blogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  /* ================= AUTH STATE (IMPORTANT FIX) ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  /* ================= LOAD BLOGS ================= */
  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log("Error fetching blogs");
    }
  };

  /* ================= LIKE BLOG ================= */
  const handleLike = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/blogs/like/${id}`);
      loadBlogs();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE BLOG ================= */
  const handleDelete = async (id) => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    if (!window.confirm("Delete this blog permanently? 🗑")) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadBlogs();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="py-14 text-center">

      {/* ================= HEADING ================= */}
      <h2 className="text-5xl font-bold">
        Latest <span className="text-orange-500">Blogs ✍️</span>
      </h2>

      {/* ================= ADD BLOG ================= */}
      {user && (
        <button
          onClick={() => navigate("/add-blog")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition mt-6"
        >
          ➕ Add Blog
        </button>
      )}

      {/* ================= EMPTY STATE ================= */}
      {blogs.length === 0 && (
        <p className="mt-10 text-gray-500 text-lg">No Blogs Yet 👀</p>
      )}

      {/* ================= BLOG LIST ================= */}
      <div className="grid md:grid-cols-2 gap-8 px-10 mt-12 mb-20">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-lg p-6 rounded-xl text-left border hover:shadow-xl transition"
          >

            {/* BLOG IMAGE */}
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            {/* TITLE */}
            <h3 className="text-2xl font-semibold text-gray-800">
              {blog.title}
            </h3>

            {/* DATE */}
            <p className="text-gray-400 text-sm my-1">
              {blog.date}
            </p>

            {/* CONTENT PREVIEW */}
            <p className="text-gray-600 mt-2 line-clamp-3">
              {blog.content}
            </p>

            {/* ✅ READ MORE (FIXED ROUTE) */}
            <button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="text-blue-600 mt-2 hover:underline block"
            >
              Read More →
            </button>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 mt-4">

              {/* LIKE */}
              <button
                onClick={() => handleLike(blog._id)}
                className="text-pink-600 font-semibold flex items-center gap-1"
              >
                ❤️ Like
              </button>
              <span className="text-gray-700">
                {blog.likes} Likes
              </span>

              {/* EDIT & DELETE */}
              {user && (
                <>
                  <button
                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
                    className="ml-auto text-green-600 hover:underline"
                  >
                    ✏ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
