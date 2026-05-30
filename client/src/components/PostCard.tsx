import React from 'react';
import {
  Eye,
  Calendar,
  Clock,
  UserCircle,
  Heart,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import type { Post } from '../types';

import { useDeletePost } from '../hooks/mutations/useDeletePost';
import { useLikePost } from '../hooks/mutations/useLikePost';
import { showSuccess, showError, } from '../utils/toast';
import ConfirmModal from './modals/ConfirmModal';

type PostCardProps = {
  post: Post;
};

const PostCard = ({
  post,
}: PostCardProps) => {

  const navigate = useNavigate();
  const deletePostMutation =
  useDeletePost();

  const likePostMutation =
    useLikePost();

  const { user } = useAuth();


  const [showDeleteModal, setShowDeleteModal] =
  React.useState(false);

  console.log(
  'POSTCARD RENDER',
  post._id,
  post.likesCount
);


  // OWNER CHECK


const isOwner =
  user?.id ===
  post.author?._id;

  // ADMIN CHECK
  const isAdmin =
    user?.role === 'admin';

  // CAN MODIFY
  const canModify =
    isOwner || isAdmin;

  // DELETE POST
const handleDelete = async (
  id: string
) => {

  try {

    await deletePostMutation.mutateAsync(
      id
    );

    showSuccess(
      'Post deleted successfully'
    );

    setShowDeleteModal(false);

  } catch (error) {
    console.log(error);
  }
};

  // FORMAT DATE
  const formatDate = (
    dateString: string
  ) =>
    new Date(dateString).toLocaleDateString();

  // FORMAT TIME
  const formatTime = (
    dateString: string
  ) =>
    new Date(dateString).toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  // TRUNCATE TEXT
  const truncateText = (
    text: string,
    maxLength: number = 150
  ) =>
    text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + '...';

  // CHECK IF USER LIKED

 const hasLiked =
  post.likes?.includes(
    user?.id || ''
  );

  // LIKE / UNLIKE

  const handleLike = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {

    e.preventDefault();

    if (!user) return;

    likePostMutation.mutate(
      post._id
    );
  };

  // SHARE POST
  const sharePost = async () => {

    const url =
      `${window.location.origin}/post/${post.slug}`;

    await navigator.clipboard.writeText(
      url
    );

      showSuccess(
      'Post link copied!'
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">

      <div className="p-6">

        <h3 className="text-xl font-semibold text-black mb-3">
          {post.title}
        </h3>

        <p className="text-gray-700 mb-4 leading-relaxed">
          {truncateText(post.content)}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">

          <div className="flex items-center space-x-4">

            <div className="flex items-center space-x-1">
              <UserCircle size={16} />

              <span>
                {post.author?.username || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Calendar size={16} />

              <span>
                {formatDate(post.createdAt)}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock size={16} />

              <span>
                {formatTime(post.createdAt)}
              </span>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-between">

          {/* READ MORE */}
          <button
            type="button"
            onClick={() =>
              navigate(`/post/${post.slug}`)
            }
            className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-medium"
          >
            <Eye size={16} />

            <span>
              Read More
            </span>
          </button>

          {/* LIKE */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-2 transition-colors"
          >
            <Heart
              size={20}
              className={
                hasLiked
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }
            />

            <span>
              {post.likesCount}
            </span>
          </button>

          {/* SHARE */}
          <button
            onClick={sharePost}
          >
            Share
          </button>

        </div>

        {/* EDIT / DELETE */}
        {canModify && (

          <div className="flex gap-2 mt-4">

            <button
              onClick={() =>
                navigate(`/edit-post/${post._id}`)
              }
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>

            <button
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>

          </div>
        )}

      </div>

      <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Post"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={
            deletePostMutation.isPending
          }
          onCancel={() =>
            setShowDeleteModal(false)
          }
          onConfirm={() =>
            handleDelete(post._id)
          }
        />
    </div>
  );
};

export default PostCard;