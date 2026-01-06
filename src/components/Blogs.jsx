import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
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
      const res = await api.get("/api/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log("Error fetching blogs", err.message);
    }
  };

  /* ================= LIKE BLOG (SECURE) ================= */
  const handleLike = async (blog) => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    // UI-level double-like prevention
    const alreadyLiked = blog.likedBy?.some(
      (u) => u.uid === user.uid
    );

    if (alreadyLiked) {
      alert("You already liked this ❤️");
      return;
    }

    try {
      const token = await user.getIdToken();

      await api.patch(
        `/api/blogs/like/${blog._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Like failed ❌");
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

      await api.delete(`/api/blogs/${id}`, {
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
        {blogs.map((blog) => {
          const likedByUser =
            user && blog.likedBy?.some((u) => u.uid === user.uid);

          return (
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

              <p className="text-gray-400 text-sm my-1">
                {blog.authorEmail}
              </p>

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
                  onClick={() => handleLike(blog)}
                  disabled={likedByUser}
                  className={`font-semibold flex items-center gap-1 ${
                    likedByUser
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-pink-600"
                  }`}
                >
                  ❤️ {likedByUser ? "Liked" : "Like"}
                </button>

                <span className="text-gray-700">
                  {blog.likes} Likes
                </span>

                {/* 🔐 OWNER-ONLY ACTIONS */}
                {user && blog.authorId === user.uid && (
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

              {/* 👀 WHO LIKED (OPTIONAL PREVIEW) */}
              {blog.likedBy?.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Liked by{" "}
                  {blog.likedBy
                    .slice(0, 3)
                    .map((u) => u.email.split("@")[0])
                    .join(", ")}
                  {blog.likedBy.length > 3 && " & others"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blogs;
