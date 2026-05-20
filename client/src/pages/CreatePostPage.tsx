import { useState } from 'react';

import axiosInstance from '../api/axios';

const CreatePostPage = () => {

  const [loading, setLoading] =
    useState(false);

  const [postForm, setPostForm] =
    useState({
      title: '',
      content: '',
      mediaType: 'image' as
        | 'image'
        | 'video'
        | 'audio'
        | 'none',

      mediaUrl: '',

      mediaFile: null as File | null,
    });



  const handleCreatePost = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append(
      'title',
      postForm.title
    );

    formData.append(
      'content',
      postForm.content
    );

    formData.append(
      'mediaType',
      postForm.mediaType
    );

    if (postForm.mediaFile) {
      formData.append(
        'media',
        postForm.mediaFile
      );
    }

    try {

      await axiosInstance.post(
        '/posts',
        formData
      );

      alert('Post created successfully');

      setPostForm({
        title: '',
        content: '',
        mediaType: 'image',
        mediaUrl: '',
        mediaFile: null,
      });

    } catch (err: any) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        'Failed to create post'
      );

    } finally {

      setLoading(false);
    }
  };



  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Create Post
      </h1>



      <form
        onSubmit={handleCreatePost}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >

        <input
          type="text"
          placeholder="Post title"
          value={postForm.title}
          onChange={(e) =>
            setPostForm({
              ...postForm,
              title: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg"
          required
        />



        <textarea
          placeholder="Post content"
          value={postForm.content}
          onChange={(e) =>
            setPostForm({
              ...postForm,
              content: e.target.value
            })
          }
          className="w-full border p-3 rounded-lg h-40"
          required
        />



        <select
          value={postForm.mediaType}
          onChange={(e) =>
            setPostForm({
              ...postForm,
              mediaType:
                e.target.value as
                  | 'image'
                  | 'video'
                  | 'audio'
                  | 'none',
            })
          }
          className="w-full border p-3 rounded-lg"
        >

          <option value="">
            Select media type
          </option>

          <option value="image">
            Image
          </option>

          <option value="video">
            Video
          </option>

          <option value="audio">
            Audio
          </option>

        </select>



        <input
          type="file"
          accept={
            postForm.mediaType === 'image'
              ? 'image/*'
              : postForm.mediaType === 'video'
              ? 'video/*'
              : 'audio/*'
          }
          onChange={(e) =>
            setPostForm({
              ...postForm,
              mediaFile:
                e.target.files?.[0] || null,
            })
          }
          className="w-full border p-3 rounded-lg"
        />



        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >

          {loading
            ? 'Creating...'
            : 'Create Post'}

        </button>

      </form>
    </div>
  );
};

export default CreatePostPage;