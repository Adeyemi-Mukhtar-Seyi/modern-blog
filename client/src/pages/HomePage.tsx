import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import type { Post } from '../types';

type HomePageProps = {
  posts: Post[];
  currentPage: number;
  postsPerPage: number;
  onPageChange: (page: number) => void;
}

const HomePage = ({posts,currentPage,postsPerPage, onPageChange }: HomePageProps) => {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-4">Welcome to ModernBlog</h2>
        <p className="text-gray-600 text-lg">
          Discover amazing articles and insights from our community
        </p>
      </div>

      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No posts available.
          </p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(posts.length / postsPerPage)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default HomePage;





// import React from 'react';
// import PostCard from '../components/PostCard';
// import Pagination from '../components/Pagination';

// const HomePage = ({
//   posts,
//   currentPage,
//   postsPerPage,
//   onPageChange,
//   onReadMore
// }) => {
//   const totalPages = Math.ceil(posts.length / postsPerPage);

//   const getCurrentPosts = () => {
//     const startIndex = (currentPage - 1) * postsPerPage;
//     return posts.slice(startIndex, startIndex + postsPerPage);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold text-black mb-4">Welcome to ModernBlog</h2>
//         <p className="text-gray-600 text-lg">Discover amazing articles and insights from our community</p>
//       </div>

//       <div className="space-y-8">
//         {getCurrentPosts().map(post => (
//           <PostCard key={post.id} post={post} onReadMore={onReadMore} />
//         ))}
//       </div>

//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={onPageChange}
//       />
//     </div>
//   );
// };

// export default HomePage;
