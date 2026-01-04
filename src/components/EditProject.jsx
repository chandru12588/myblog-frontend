import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${id}`).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description);
      setTechStack(res.data.techStack.join(","));
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = await auth.currentUser.getIdToken();

    await axios.put(
      `http://localhost:5000/api/projects/${id}`,
      { title, description, techStack },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Project updated ✅");
    navigate("/projects");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">✏ Edit Project</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" className="border p-2" />
        <input value={techStack} onChange={(e) => setTechStack(e.target.value)} className="border p-2" />
        <button className="bg-green-600 text-white p-3 rounded">Update 🚀</button>
      </form>
    </div>
  );
}

export default EditProject;
