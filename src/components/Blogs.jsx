import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";              // ✅ USE api.js
import { auth } from "../config/firebase";

function Blogs() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  /* ================= AUTH STATE ================= */
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
      const res = await api.get("/api/blogs");   // ✅ NO localhost
      setBlogs(res.data);
    } catch (err) {
      console.log("Error fetching blogs", err.message);
    }
  };

  /* ================= LIKE BLOG ================= */
  const handleLike = async (id) => {
    try {
      await api.patch(`/api/blogs/like/${id}`);  // ✅ NO localhost
      loadBlogs();
    } catch (err) {
      console.log(err.message);
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

      await api.delete(`/api/blogs/${id}`, {     // ✅ NO localhost
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
      <h2 className="text-5xl font-bold">
        Latest <span className="text-orange-500">Blogs ✍️</span>
      </h2>

      {user && (
        <button
          onClick={() => navigate("/add-blog")}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition mt-6"
        >
          ➕ Add Blog
        </button>
      )}

      {blogs.length === 0 && (
        <p className="mt-10 text-gray-500 text-lg">No Blogs Yet 👀</p>
      )}

      <div className="grid md:grid-cols-2 gap-8 px-10 mt-12 mb-20">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-lg p-6 rounded-xl text-left border hover:shadow-xl transition"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-2xl font-semibold text-gray-800">
              {blog.title}
            </h3>

            <p className="text-gray-400 text-sm my-1">{blog.date}</p>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {blog.content}
            </p>

            <button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="text-blue-600 mt-2 hover:underline block"
            >
              Read More →
            </button>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleLike(blog._id)}
                className="text-pink-600 font-semibold flex items-center gap-1"
              >
                ❤️ Like
              </button>

              <span className="text-gray-700">
                {blog.likes} Likes
              </span>

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
