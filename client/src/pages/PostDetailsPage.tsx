import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MediaRenderer from '../components/MediaRenderer';
import type { Post } from '../types';
import axiosInstance from "../api/axios";
import CommentSection from '../components/comments/CommentSection';
import { useAuth } from '../context/AuthContext';

const PostDetailsPage = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] =
    useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(
            `/posts/${slug}`
        );


        const data = response.data;

        setPost(data);

      } catch (error) {
        console.log(error);
      }
  };

    fetchPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto bg-white mt-10 p-6 rounded-lg shadow">

        {post.mediaUrl && (
          <div className="mb-6">
            <MediaRenderer
              mediaType={post.mediaType}
              mediaUrl={post.mediaUrl}
              title={post.title}
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex gap-4 text-gray-500 mb-8">
          <span>
            By {post.author?.username}
          </span>

          <span>
            {new Date(
              post.createdAt
            ).toLocaleDateString()}
          </span>
        </div>

        

        <div className="text-lg leading-8 text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>

        
        <div className="mt-12">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Back Home
          </button>
        </div>
        {post?._id && (
        <CommentSection
            postId={post._id}
            user={user}
        />
        )}
      </div>
     </div>
    );

};

export default PostDetailsPage;