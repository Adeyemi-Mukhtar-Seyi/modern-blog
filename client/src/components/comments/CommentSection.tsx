import React, { useState } from 'react';

import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import CommentPagination from './CommentPagination';

import type { Comment } from '../../types/comment';

import { useQuery } from '@tanstack/react-query';

import { getComments } from '../../services/commentService';

interface Props {
  postId: string;
  user: any;
}

const CommentSection: React.FC<Props> = ({
  postId,
  user,
}) => {
  const [page, setPage] = useState(1);

  const [quotedComment, setQuotedComment] =
    useState<Comment | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comments', postId, page],
    queryFn: () => getComments(postId, page),
  });

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  if (isError) {
    return <p>Failed to load comments.</p>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">
        Comments
      </h2>

      {user && (
        <CommentForm
          postId={postId}
          page={page}
          quotedText={
            quotedComment
              ? `@${quotedComment.user.username}: ${quotedComment.content}`
              : ''
          }
          quotedCommentId={quotedComment?._id}
          clearQuote={() => setQuotedComment(null)}
        />
      )}

      {!data?.comments?.length ? (
        <p>No comments yet.</p>
      ) : (
        <>
          {data?.comments.map((comment: Comment) => (
            <CommentCard
            key={comment._id}
            comment={comment}
            userId={user?._id}
            postId={postId}
            page={page}
            onQuote={setQuotedComment}
            />
          ))}

          <CommentPagination
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default CommentSection;