import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { auth } from "../config/firebase";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await api.get(`/api/projects/${id}`);

        setTitle(res.data.title || "");
        setDescription(res.data.description || "");
        setLiveLink(res.data.liveLink || "");
        setGithubLink(res.data.githubLink || "");

        if (Array.isArray(res.data.techStack)) {
          setTechStack(res.data.techStack.join(", "));
        }

      } catch (err) {
        console.error("Failed to load project", err);
      }
    };

    loadProject();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Login required ❌");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("liveLink", liveLink);
      formData.append("githubLink", githubLink);

      // techStack → array → string
      const techStackArray = techStack
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      formData.append("techStack", techStackArray);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/api/projects/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Project updated ✅");
      navigate("/projects");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">✏ Edit Project</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2"
          placeholder="Project title"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          className="border p-2"
          placeholder="Project description"
          required
        />

        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="border p-2"
          placeholder="React, Node, MongoDB"
        />

        {/* ✅ NEW FIELD */}
        <input
          value={liveLink}
          onChange={(e) => setLiveLink(e.target.value)}
          className="border p-2"
          placeholder="Live Project URL"
        />

        {/* ✅ NEW FIELD */}
        <input
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          className="border p-2"
          placeholder="GitHub Repository URL"
        />

        {/* ✅ NEW FIELD */}
        <div>
          <label className="block mb-1 font-medium">Update Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button className="bg-green-600 text-white p-3 rounded">
          Update 🚀
        </button>

      </form>
    </div>
  );
}

export default EditProject;