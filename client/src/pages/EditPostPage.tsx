import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../api/axios';

import { useAuth } from '../context/AuthContext';
import { useUpdatePost } from '../hooks/mutations/useUpdatePost';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';




const EditPostPage = () => {
    
    const { id } = useParams();

    const navigate = useNavigate();
    const updatePostMutation = useUpdatePost();


    const { user } = useAuth();



  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
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

      mediaFile: null as File | null,
    });



  useEffect(() => {

    const fetchPost = async () => {

      try {

        const response =
          await axiosInstance.get(
            `/posts/edit/${id}`
          );

        const post = response.data;



        // OWNER / ADMIN CHECK

        const isOwner =
          post.author?._id === user?.id;

        const isAdmin =
          user?.role === 'admin';



        if (!isOwner && !isAdmin) {

          navigate('/');

          return;
        }



        setPostForm({
          title: post.title,
          content: post.content,
          mediaType:
            post.mediaType || 'image',

          mediaFile: null,
        });

      } catch (error) {

        console.log(error);

        navigate('/');

      } finally {

        setLoading(false);
      }
    };



    fetchPost();

  }, [id, navigate, user]);



  const handleUpdatePost = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setUpdating(true);

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

       await updatePostMutation.mutateAsync({
        id: id!,
        formData,
        });

        toast.success(
        'Post updated successfully'
        );

        navigate('/');

    } catch (err: any) {

      console.log(err);

    } finally {

      setUpdating(false);
    }
  };



    if (loading) {

    return (

        <div className="max-w-3xl mx-auto px-4 py-8">

        <Skeleton height={50} />

        <div className="mt-8">
            <Skeleton height={60} />
        </div>

        <div className="mt-4">
            <Skeleton height={200} />
        </div>

        <div className="mt-4">
            <Skeleton height={60} />
        </div>

        </div>
    );
    }



  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Post
      </h1>



      <form
        onSubmit={handleUpdatePost}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >

        <input
          type="text"
          placeholder="Post title"
          value={postForm.title}
          onChange={(e) =>
            setPostForm({
              ...postForm,
              title: e.target.value,
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
              content: e.target.value,
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
          disabled={updating}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >

          {updating
            ? 'Updating...'
            : 'Update Post'}

        </button>

      </form>
    </div>
  );
};

export default EditPostPage;