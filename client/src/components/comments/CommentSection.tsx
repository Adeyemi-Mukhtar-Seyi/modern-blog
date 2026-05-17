import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';

import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import CommentPagination from './CommentPagination';

import type { Comment } from '../../types/comment';

interface Props {
  postId: string;
  user: any;
}

const CommentSection: React.FC<Props> = ({
  postId,
  user,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [quotedComment, setQuotedComment] =
    useState<Comment | null>(null);

  const fetchComments = async (pageNumber = 1) => {
    try {
      const { data } = await axiosInstance.get(
        `/comments/${postId}?page=${pageNumber}`
      );

      setComments(data.comments);

      setTotalPages(data.totalPages);

      setPage(data.currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const submitComment = async (content: string) => {
    try {
      setLoading(true);

      await axiosInstance.post('/comments', {
        postId,
        content,
        quotedComment: quotedComment?._id || null,
      });

      setQuotedComment(null);

      fetchComments(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (commentId: string) => {
    try {
      const { data } = await axiosInstance.put(
        `/comments/${commentId}/like`
      );

      setComments(prev =>
        prev.map(comment =>
          comment._id === commentId ? data : comment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDislike = async (commentId: string) => {
    try {
      const { data } = await axiosInstance.put(
        `/comments/${commentId}/dislike`
      );

      setComments(prev =>
        prev.map(comment =>
          comment._id === commentId ? data : comment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Comments
      </h2>

      {user && (
        <CommentForm
          onSubmit={submitComment}
          loading={loading}
          quotedText={
            quotedComment
              ? `@${quotedComment.user.username}: ${quotedComment.content}`
              : ''
          }
          clearQuote={() => setQuotedComment(null)}
        />
      )}

      {!comments.length ? (
        <p>No comments yet.</p>
      ) : (
        <>
          {comments.map(comment => (
            <CommentCard
              key={comment._id}
              comment={comment}
              userId={user?._id}
              onLike={toggleLike}
              onDislike={toggleDislike}
              onQuote={setQuotedComment}
            />
          ))}

          <CommentPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default CommentSection;