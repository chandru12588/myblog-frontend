import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* Like Blog */
  const handleLike = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/blogs/like/${id}`
      );
      setBlog(res.data);
    } catch (err) {
      console.log("Like failed");
    }
  };

  if (loading)
    return <p className="text-center mt-16 text-lg">Loading blog...</p>;

  if (!blog)
    return <p className="text-center mt-16 text-red-500">Blog not found ❌</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">

      {/* Back Button */}
      <button
        onClick={() => navigate("/blogs")}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to Blogs
      </button>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="rounded-xl w-full max-h-[400px] object-cover mb-6"
        />
      )}

      {/* Blog Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
        {blog.title}
      </h1>

      {/* Meta Info */}
      <p className="text-gray-500 mt-2">
        📅 {blog.date} &nbsp; • &nbsp; ✍ {blog.author || "Admin"}
      </p>

      {/* Content */}
      <p className="mt-6 text-lg leading-relaxed text-gray-700 whitespace-pre-line">
        {blog.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handleLike}
          className="bg-pink-100 text-pink-600 px-4 py-2 rounded hover:bg-pink-200"
        >
          ❤️ Like
        </button>
        <span className="font-semibold text-gray-700">
          {blog.likes} Likes
        </span>
      </div>
    </div>
  );
}
