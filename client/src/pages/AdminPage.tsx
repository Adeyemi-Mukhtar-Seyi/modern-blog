import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import type { Post } from '../types';
import axiosInstance from "../api/axios";



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
  const navigate = useNavigate();

  const truncateText = (text: string, maxLength = 100) =>
    text.length <= maxLength ? text : text.substr(0, maxLength) + "...";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

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
                  <button
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                  >
                    <Edit3 size={18} />
                  </button>
                }}
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
              >
                <Edit3 size={18} />
              </button>

              <button
                onClick={() =>
                  navigate(`/edit-post/${post._id}`)
                }
                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
              >
                <Edit3 size={18} />
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
