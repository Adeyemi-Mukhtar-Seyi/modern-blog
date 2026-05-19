import React, { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import type { Post } from '../types';
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';


type UserData = {
  username: string;
  password: string;
  email?: string;
  role: string;
};

type AdminPageProps = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const AdminPage: React.FC<AdminPageProps> = ({ posts, setPosts }) => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    mediaType: "image" as "image" | "video" | "audio" | "none",
    mediaUrl: "",
    mediaFile: null as File | null,
  });

  const truncateText = (text: string, maxLength = 100) =>
    text.length <= maxLength ? text : text.substr(0, maxLength) + "...";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  // CREATE
  const handleCreatePost = async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      formData.append("mediaType", postForm.mediaType);

      if (postForm.mediaFile) {
        formData.append("media", postForm.mediaFile);
      }

      try {
        const response = await axiosInstance.post(
          "/posts",
          formData
        );

        const data = response.data;

        setPosts([data.post, ...posts]);

        setPostForm({
          title: "",
          content: "",
          mediaType: "image",
          mediaUrl: "",
          mediaFile: null,
        });

        setShowCreateForm(false);

      } catch (err: any) {
        console.error("Create failed:", err);

        alert(
          err.response?.data?.message ||
          "Failed to create post"
        );
      }
    };

  // UPDATE
  const handleUpdatePost = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingPost) return;

  const formData = new FormData();

  formData.append("title", postForm.title);
  formData.append("content", postForm.content);
  formData.append("mediaType", postForm.mediaType);

  if (postForm.mediaFile) {
    formData.append("media", postForm.mediaFile);
  }

  try {
    const response = await axiosInstance.put(
      `/posts/${editingPost._id}`,
      formData
    );

    const data = response.data;

    setPosts(
      posts.map((p) =>
        p._id === data.post._id
          ? data.post
          : p
      )
    );

    setEditingPost(null);

    setPostForm({
      title: "",
      content: "",
      mediaType: "image",
      mediaUrl: "",
      mediaFile: null,
    });

  } catch (err: any) {
    console.error("Update failed:", err);

    alert(
      err.response?.data?.message ||
      "Failed to update post"
    );
  }
};
  // DELETE
    const handleDeletePost = async (
    postId: string
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post?"
      )
    ) return;

    try {
      await axiosInstance.delete(
        `/posts/${postId}`
      );

      setPosts(
        posts.filter((p) => p._id !== postId)
      );

    } catch (err: any) {
      console.error("Delete failed:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete post"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

    <form
      onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <input
        type="text"
        placeholder="Post title"
        value={postForm.title}
        onChange={(e) =>
        setPostForm({ ...postForm, title: e.target.value })
        }
        className="w-full border p-3 rounded-lg"
        required
      />

      <textarea
        placeholder="Post content"
        value={postForm.content}
        onChange={(e) =>
          setPostForm({ ...postForm, content: e.target.value })
        }
        className="w-full border p-3 rounded-lg h-40"
        required
      />

      <select
        value={postForm.mediaType}
        onChange={(e) =>
          setPostForm({
            ...postForm,
            mediaType: e.target.value as "image" | "video" | "audio" | "none",
          })
        }
        className="w-full border p-3 rounded-lg"
      >
        <option value="">Select media type</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
      </select>

      <input
        type="text"
        placeholder="Media URL"
        value={postForm.mediaUrl}
        onChange={(e) =>
          setPostForm({ ...postForm, mediaUrl: e.target.value })
        }
        className="w-full border p-3 rounded-lg"
      />

      <input
        type="file"
        accept={
          postForm.mediaType === "image"
            ? "image/*"
            : postForm.mediaType === "video"
            ? "video/*"
            : "audio/*"
        }
        onChange={(e) =>
          setPostForm({
            ...postForm,
            mediaFile: e.target.files?.[0] || null,
          })
        }
        className="w-full border p-3 rounded-lg"
      />

      <button
        type="submit"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
      >
       {editingPost ? "Update Post" : "Create Post"}
      </button>
    </form>
    <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black">Manage Posts</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-6 flex justify-between items-start"
          >
            <div className="flex-1">
              <h4 className="text-lg font-medium text-black mb-2">
                {post.title}
              </h4>

              <p className="text-gray-600 mb-2">
                {truncateText(post.content)}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  By {post.author?.username || 'Unknown'}
                </span>

                <span>{formatDate(post.createdAt)}</span>

                <span className="capitalize bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {post.mediaType}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => {
                  setEditingPost(post);

                  setPostForm({
                    title: post.title,
                    content: post.content,
                    mediaType: (post.mediaType as "image" | "video" | "audio" | "none") || "image",
                    mediaUrl: post.mediaUrl || '',
                    mediaFile: null,
                  });

                  setShowCreateForm(true);
                }}
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
              >
                <Edit3 size={18} />
              </button>

              <button
                onClick={() => handleDeletePost(post._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default AdminPage;
