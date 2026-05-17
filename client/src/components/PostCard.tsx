import React, { useState } from 'react';
import {
  Eye,
  Calendar,
  Clock,
  UserCircle,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Post } from '../types';

import axiosInstance from "../api/axios";

type PostCardProps = {
  post: Post
};

const PostCard = ({
  post
}: PostCardProps) => {

  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null'
  );

  // LOCAL STATE
  const [likes, setLikes] = useState<string[]>(
    post.likes || []
  );

  const [likesCount, setLikesCount] = useState<number>(
    post.likesCount || 0
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const truncateText = (
    text: string,
    maxLength: number = 150
  ) =>
    text.length <= maxLength
      ? text
      : text.substr(0, maxLength) + '...';

  // CHECK IF USER LIKED
  const hasLiked = likes?.some(
    (id: string) => id.toString() === currentUser?.id
  );

  // LIKE / UNLIKE
  const handleLike = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {

      const res = await axiosInstance.put(
        `/posts/${post._id}/like`
      );

       const data = res.data;

      // UPDATE STATE
      setLikes(data.post.likes);
      setLikesCount(data.post.likesCount);

    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const sharePost = async () => {
  const url = `${window.location.origin}/post/${post._id}`;

      await navigator.clipboard.writeText(url);

      alert('Post link copied!');
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
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{formatTime(post.createdAt)}</span>
            </div>

          </div>
        </div>

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
                navigate(`/post/${post.slug}`)
              }
            className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-medium"
          >
            <Eye size={16} />
            <span>Read More</span>
          </button>

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

            <span>{likesCount}</span>
          </button>

          <button onClick={sharePost}>
            Share
          </button>

        </div>
      </div>
    </div>
  );
};

export default PostCard;












// import React from 'react';
// import { Eye, Calendar, Clock, UserCircle, Heart } from 'lucide-react';
// import MediaRenderer from './MediaRenderer';
// import type { Post } from '../types';

// type PostCardProps = {
//   post: Post;
//   onReadMore: (post: Post) => void;
// };

// const PostCard = ({ post, onReadMore }: PostCardProps) => {
//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString();

//   const formatTime = (dateString: string) =>
//     new Date(dateString).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const truncateText = (text: string, maxLength: number = 150) =>
//     text.length <= maxLength
//       ? text
//       : text.substr(0, maxLength) + '...';

//   // Get current logged in user
//   const currentUser = JSON.parse(
//     localStorage.getItem('currentUser') || 'null'
//   );

//   // Like / Unlike function
//   const handleLike = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//       alert('Please login first');
//       return;
//       }

//       const API = import.meta.env.VITE_API_URL;

//       const res = await fetch(
//         `${API}/api/posts/${post._id}/like`,
//         {
//           method: 'PUT',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//         if (!res.ok) {
//       throw new Error(data.message);
//       }

      

//       post.likes = data.post.likes;
//       post.likesCount = data.post.likesCount;
//     } catch (error) {
//       console.error('Like error:', error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
//       <MediaRenderer
//         mediaType={post.mediaType}
//         mediaUrl={post.mediaUrl}
//         title={post.title}
//       />

//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-black mb-3">
//           {post.title}
//         </h3>

//         <p className="text-gray-700 mb-4 leading-relaxed">
//           {truncateText(post.content)}
//         </p>

//         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-1">
//               <UserCircle size={16} />
//               <span>{post.author?.username || 'Unknown'}</span>
//             </div>

//             <div className="flex items-center space-x-1">
//               <Calendar size={16} />
//               <span>{formatDate(post.createdAt)}</span>
//             </div>

//             <div className="flex items-center space-x-1">
//               <Clock size={16} />
//               <span>{formatTime(post.createdAt)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             onClick={() => onReadMore(post)}
//             className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-medium"
//           >
//             <Eye size={16} />
//             <span>Read More</span>
//           </button>

//           <button
//             onClick={handleLike}
//             className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
//           >
//             <Heart
//               size={20}
//               fill={
//                 post.likes?.includes(currentUser?.id)
//                   ? 'red'
//                   : 'none'
//               }
//             />

//             <span>{post.likesCount || 0}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PostCard;



















// import React from 'react';
// import { Eye, Calendar, Clock, UserCircle } from 'lucide-react';
// import MediaRenderer from './MediaRenderer';
// import type { Post } from '../types';
// import { Heart } from 'lucide-react';

// type PostCardProps = {
//   post: Post 
//   onReadMore: (post: Post) => void;
// }

// const PostCard = ({ post, onReadMore }: PostCardProps) => {
//   const formatDate = (dateString: string) =>
//     new Date(dateString).toLocaleDateString();
//   const formatTime = (dateString: string) =>
//     new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   const truncateText = (text: string, maxLength: number = 150) =>
//     text.length <= maxLength ? text : text.substr(0, maxLength) + '...';

//   return (
//     <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
//       {/* Show uploaded media (image/video/audio) */}
//       <MediaRenderer
//         mediaType={post.mediaType}
//         mediaUrl={post.mediaUrl}
//         title={post.title}
//       />

//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-black mb-3">{post.title}</h3>
//         <p className="text-gray-700 mb-4 leading-relaxed">
//           {truncateText(post.content)}
//         </p>

//         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-1">
//               <UserCircle size={16} />
//               {/* ✅ Fix author display */}
//               <span>{post.author?.username || 'Unknown'}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Calendar size={16} />
//               <span>{formatDate(post.createdAt)}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Clock size={16} />
//               <span>{formatTime(post.createdAt)}</span>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={() => onReadMore(post)}
//           className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 font-medium"
//         >
//           <Eye size={16} />
//           <span>Read More</span>
//         </button>
//         <div className="flex justify-end mt-4">
//         <button
//           onClick={handleLike}
//           className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
//         >
//           <Heart
//             size={20}
//             fill={
//               post.likes?.includes(currentUser?.id)
//                 ? 'red'
//                 : 'none'
//             }
//           />

//           <span>{post.likesCount || 0}</span>
//         </button>
//       </div>        
//             </div>
//           </div>
//   );
// };

// export default PostCard;
