import React, { useState } from "react";
import api from "../utils/api";          // ✅ use api.js
import { auth } from "../config/firebase";

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("⚠ Please login first!");
      return;
    }

    try {
      setLoading(true);

      const token = await auth.currentUser.getIdToken(true);

      // ✅ NO res variable, NO localhost, NO axios
      await api.post(
        "/api/blogs",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Blog Added Successfully 🚀");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Add blog error:", err.response?.data || err.message);
      alert("Error adding blog ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-orange-500 mb-5">
        ✍ Add New Blog
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Blog Content"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Blog 🚀"}
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
