import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { auth } from "../config/firebase";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  /* ================= LOAD BLOG ================= */
  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error loading blog", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-16">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <p className="text-center mt-16 text-red-500">
        Blog not found ❌
      </p>
    );
  }

  const likedByUser =
    user && blog.likedBy?.some((u) => u.uid === user.uid);

  /* ================= LIKE / UNLIKE ================= */
  const handleLikeToggle = async () => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    try {
      const token = await user.getIdToken();

      const endpoint = likedByUser
        ? `/api/blogs/unlike/${blog._id}`
        : `/api/blogs/like/${blog._id}`;

      const res = await api.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed ❌");
    }
  };

  /* ================= ADD COMMENT ================= */
  const handleComment = async () => {
    if (!user) {
      alert("Login required ❌");
      return;
    }

    if (!comment.trim()) return;

    try {
      const token = await user.getIdToken();

      const res = await api.post(
        `/api/blogs/comment/${blog._id}`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog(res.data);
      setComment("");
    } catch (err) {
      alert("Comment failed ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10">

      {/* BACK */}
      <button
        onClick={() => navigate("/blogs")}
        className="text-blue-600 mb-4 hover:underline"
      >
        ← Back to Blogs
      </button>

      {/* IMAGE */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="rounded-xl w-full max-h-[400px] object-cover mb-6"
        />
      )}

      {/* TITLE */}
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-500 mt-1">✍ {blog.authorEmail}</p>

      {/* CONTENT */}
      <p className="mt-6 text-gray-700 whitespace-pre-line">
        {blog.content}
      </p>

      {/* LIKE */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handleLikeToggle}
          className={`px-4 py-2 rounded font-semibold ${
            likedByUser
              ? "bg-gray-300 text-gray-700"
              : "bg-pink-100 text-pink-600 hover:bg-pink-200"
          }`}
        >
          ❤️ {likedByUser ? "Unlike" : "Like"}
        </button>

        <span className="font-semibold">
          {blog.likes} Likes
        </span>
      </div>

      {/* COMMENTS */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">💬 Comments</h3>

        {blog.comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        <div className="space-y-3">
          {blog.comments.map((c, i) => (
            <div key={i} className="bg-gray-100 p-3 rounded">
              <p className="text-sm font-semibold">{c.email}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>

        {/* ADD COMMENT */}
        {user && (
          <div className="mt-4 flex gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              onClick={handleComment}
              className="bg-orange-500 text-white px-4 rounded"
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
