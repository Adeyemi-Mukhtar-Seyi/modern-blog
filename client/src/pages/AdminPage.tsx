import React from "react";

import { useNavigate } from "react-router-dom";

import { Edit3, Trash2 } from "lucide-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Post } from "../types";

import axiosInstance from "../api/axios";
import { useModal } from '../context/ModalContext';

const AdminPage = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { openModal, } = useModal();

  // FETCH POSTS
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["admin-posts"],

    queryFn: async () => {

      const res = await axiosInstance.get(
        "/posts/admin/all"
      );

      return res.data.posts;
    },
  });

  const truncateText = (
    text: string,
    maxLength = 100
  ) =>
    text.length <= maxLength
      ? text
      : text.substr(0, maxLength) + "...";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  // DELETE POST
  const handleDeletePost = async (
    postId: string
  ) => {

    openModal({
      title: 'Delete Post',

      message:
        'Are you sure you want to delete this post?',

      onConfirm: async () => {

          try {

            await axiosInstance.delete(
              `/posts/${postId}`
            );

            // REFRESH POSTS
            await queryClient.invalidateQueries({
              queryKey: ["admin-posts"],
            });

            await queryClient.invalidateQueries({
              queryKey: ["posts"],
            });

            alert("Post deleted successfully");

          } catch (err: any) {

            console.error("Delete failed:", err);

            alert(
              err.response?.data?.message ||
              "Failed to delete post"
            );
          }
      },
    });

    return;
      };

  // LOADING
  if (isLoading) {
    return (
      <p className="text-center py-10">
        Loading posts...
      </p>
    );
  }

  // ERROR
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load admin posts.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-black">
            Manage Posts
          </h3>
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
                    By {post.author?.username || "Unknown"}
                  </span>

                  <span>
                    {formatDate(post.createdAt)}
                  </span>

                  <span className="capitalize bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    {post.mediaType}
                  </span>

                </div>
              </div>

              <div className="flex space-x-2 ml-4">

                {/* EDIT */}
                <button
                  onClick={() =>
                    navigate(`/edit-post/${post._id}`)
                  }
                  className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                >
                  <Edit3 size={18} />
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDeletePost(post._id)
                  }
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