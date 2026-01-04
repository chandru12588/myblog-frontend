import React, { useState } from "react";
import axios from "axios";
import { auth } from "../config/firebase";

function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE PREVIEW ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT PROJECT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("❌ Please login first");
      return;
    }

    if (!title || !description || !techStack) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Firebase token
      const token = await auth.currentUser.getIdToken();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("techStack", techStack); // comma separated
      formData.append("liveLink", liveLink);
      formData.append("githubLink", githubLink);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Project added successfully 🚀");

      // reset form
      setTitle("");
      setDescription("");
      setTechStack("");
      setLiveLink("");
      setGithubLink("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Error adding project ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        ➕ Add New Project
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Project Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="Project Description *"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Tech Stack (React, Node, MongoDB) *"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="url"
          placeholder="Live Project URL (optional)"
          value={liveLink}
          onChange={(e) => setLiveLink(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="url"
          placeholder="GitHub Repository URL (optional)"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="border p-2 rounded"
        />

        <label className="font-semibold mt-2">Project Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-52 object-cover rounded border mt-2"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          {loading ? "Uploading..." : "Publish Project 🚀"}
        </button>
      </form>
    </div>
  );
}

export default AddProject;
