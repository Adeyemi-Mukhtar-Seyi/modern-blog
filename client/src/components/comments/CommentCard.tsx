import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import type { Comment } from '../../types/comment';

interface Props {
  comment: Comment;
  userId?: string;

  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onQuote: (comment: Comment) => void;
}

const CommentCard: React.FC<Props> = ({
  comment,
  userId,
  onLike,
  onDislike,
  onQuote,
}) => {
  const liked = comment.likes.includes(userId || '');

  const disliked = comment.dislikes.includes(userId || '');

  const shareComment = async () => {
    const url = `${window.location.href}#comment-${comment._id}`;

    await navigator.clipboard.writeText(url);

    alert('Comment link copied!');
  };

  return (
    <div
      id={`comment-${comment._id}`}
      className="border rounded-xl p-4 bg-white mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">
          {comment.user.username}
        </h4>

        <span className="text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {comment.quotedComment && (
        <div className="bg-gray-100 border-l-4 border-gray-400 p-3 mb-3">
          <p className="text-sm font-semibold">
            @{comment.quotedComment.user.username}
          </p>

          <p className="text-sm text-gray-700">
            {comment.quotedComment.content}
          </p>
        </div>
      )}

      <p className="mb-4 whitespace-pre-wrap">
        {comment.content}
      </p>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => onLike(comment._id)}
          className={`flex items-center gap-1 ${
            liked ? 'text-green-600' : ''
          }`}
        >
          <FaThumbsUp />

          {comment.likes.length}
        </button>

        <button
          onClick={() => onDislike(comment._id)}
          className={`flex items-center gap-1 ${
            disliked ? 'text-red-600' : ''
          }`}
        >
          <FaThumbsDown />

          {comment.dislikes.length}
        </button>

        <button
          onClick={() => onQuote(comment)}
          className="text-blue-600"
        >
          Quote
        </button>

        <button
          onClick={shareComment}
          className="text-gray-600"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CommentCard;