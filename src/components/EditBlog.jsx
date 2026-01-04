import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";              // ✅ use api.js
import { auth } from "../config/firebase";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BLOG ================= */
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/${id}`); // ✅ no localhost
        setTitle(res.data.title);
        setContent(res.data.content);
        setPreview(res.data.image || "");
      } catch (err) {
        alert("Failed to load blog ❌");
      }
    };

    loadBlog();
  }, [id]);

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE BLOG ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Please login again ❌");
      return;
    }

    try {
      setLoading(true);

      const token = await auth.currentUser.getIdToken(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.put(
        `/api/blogs/${id}`,                  // ✅ no localhost
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Blog Updated Successfully ✅");
      navigate("/blogs");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-orange-500 mb-6">
        ✏ Edit Blog
      </h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog Title"
          className="border p-3 rounded"
          required
        />

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          placeholder="Blog Content"
          className="border p-3 rounded"
          required
        />

        {/* Image */}
        <label className="font-semibold">Blog Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Blog preview"
            className="h-52 w-full object-cover rounded border mt-2"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`text-white p-3 rounded transition ${
            loading
              ? "bg-orange-300"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Updating..." : "Update Blog 🚀"}
        </button>
      </form>
    </div>
  );
}
