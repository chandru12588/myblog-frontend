import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";          // ✅ use api.js
import { auth } from "../config/firebase";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await api.get(`/api/projects/${id}`); // ✅ no localhost
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTechStack(res.data.techStack.join(","));
      } catch (err) {
        console.error("Failed to load project", err.message);
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

      await api.put(
        `/api/projects/${id}`,              // ✅ no localhost
        {
          title,
          description,
          techStack: techStack
            .split(",")
            .map((t) => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project updated ✅");
      navigate("/projects");
    } catch (err) {
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

        <button className="bg-green-600 text-white p-3 rounded">
          Update 🚀
        </button>
      </form>
    </div>
  );
}

export default EditProject;
