import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import axiosInstance from '../api/axios';

import PostCard from '../components/PostCard';

import { categories } from '../constants/categories';

const CategoryPage = () => {
  const { slug } = useParams();

  const currentCategory = categories.find(
    category => category.slug === slug
  );

  const { data, isLoading } = useQuery({
    queryKey: ['category-posts', slug],

    queryFn: async () => {
      const res = await axiosInstance.get(
        `/posts/category/${slug}`
      );

      return res.data;
    },

    enabled: !!slug,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <div className="bg-orange-500 text-white rounded-xl p-6 mb-8">

        <h1 className="text-4xl font-bold text-center mb-4">
          {currentCategory?.name}
        </h1>

        <div className="flex flex-wrap justify-center gap-3">

          {currentCategory?.subcategories.map(
            subcategory => (
              <span
                key={subcategory}
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium"
              >
                {subcategory}
              </span>
            )
          )}

        </div>
      </div>

      <div className="space-y-6">
        {data?.posts.map((post: any) => (
          <PostCard
            key={`${post._id}-${post.likesCount}`}
            post={post}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;