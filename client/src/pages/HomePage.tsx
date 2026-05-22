import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import CategoryBar from '../components/CategoryBar';

import type { Post } from '../types';

import { categories } from '../lib/categories';

import { useDebounce } from '../hooks/useDebounce';

import { searchPosts } from '../services/postService';
import PostCardSkeleton from '../components/skeletons/PostCardSkeleton';
import {
  useInfinitePosts,
} from '../hooks/useInfinitePosts';

type HomePageProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
};

const HomePage = ({
  currentPage,
  onPageChange,
}: HomePageProps) => {

  // SEARCH STATE
  const [search, setSearch] = useState('');

  // CATEGORY STATE
  const [category, setCategory] = useState('');

  // SUBCATEGORY STATE
  const [subcategory, setSubcategory] =
    useState('');

  // DEBOUNCED SEARCH
  const debouncedSearch =
    useDebounce(search);

  // FETCH POSTS
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'posts',
      debouncedSearch,
      category,
      subcategory,
      currentPage,
    ],

    queryFn: () =>
      searchPosts({
        search: debouncedSearch,
        category,
        subcategory,
        page: currentPage,
      }),
  });

  // LOADING
  if (isLoading) {
    return (
      <div className="grid gap-6">

        {Array.from({ length: 6 }).map(
          (_, index) => (

            <PostCardSkeleton
              key={index}
            />
          )
        )}

      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load posts.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* HERO */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-4">
          Welcome to ModernBlog
        </h2>

        <p className="text-gray-600 text-lg">
          Discover amazing articles and insights
          from our community
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="space-y-4 mb-8">

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-full"
        />

        {/* DROPDOWNS */}
        <div className="flex gap-4">

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory('');
            }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Categories
            </option>

            {Object.keys(categories).map(
              (cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              )
            )}
          </select>

          {/* SUBCATEGORY */}
          <select
            value={subcategory}
            onChange={(e) =>
              setSubcategory(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              All Subcategories
            </option>

            {category &&
              categories[
                category as keyof typeof categories
              ]?.map((sub) => (
                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>
              ))}
          </select>

        </div>
      </div>

      {/* CATEGORY BAR */}
      <CategoryBar />

      {/* POSTS */}
      <div className="space-y-8">

        {data?.posts?.length > 0 ? (

          data?.posts?.map((post: Post) => (
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

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={
          data?.totalPages || 1
        }
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default HomePage;
