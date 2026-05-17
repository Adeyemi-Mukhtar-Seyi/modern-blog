import React, { useState } from 'react';

interface Props {
  onSubmit: (content: string) => void;
  loading: boolean;
  quotedText?: string;
  clearQuote?: () => void;
}

const CommentForm: React.FC<Props> = ({
  onSubmit,
  loading,
  quotedText,
  clearQuote,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit(content);

    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl p-4 mb-6"
    >
      {quotedText && (
        <div className="bg-gray-100 p-3 rounded mb-3 relative">
          <p className="text-sm text-gray-600">
            {quotedText}
          </p>

          <button
            type="button"
            onClick={clearQuote}
            className="absolute top-2 right-2 text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full border rounded-lg p-3 min-h-[120px]"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-black text-white px-5 py-2 rounded-lg"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm;