import {
  Routes,
  Route,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PostDetailsPage from './pages/PostDetailsPage';
import CategoryPage from './pages/CategoryPage';
import type { Post } from './types';
import axiosInstance from './api/axios';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

type UserData = {
  username: string;
  password: string;
  email?: string;
  role: string;
};

const App = () => {
  const { logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);

  const [currentPostPage, setCurrentPostPage] =
    useState<number>(1);

  const postsPerPage = 5;

  // FETCH POSTS
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response =
          await axiosInstance.get(
            `/posts?page=${currentPostPage}&limit=${postsPerPage}`
          );

        console.log(
          'POSTS FROM BACKEND:',
          response.data.posts
        );

        setPosts(response.data.posts);

      } catch (err: any) {
        console.error(
          'Error fetching posts:',
          err.response?.data?.message || err.message
        );
      }
    };

    fetchPosts();
  }, [currentPostPage]);

  // REGISTER
  const register = async (
    userData: UserData
  ) => {
    try {
      await axiosInstance.post(
        '/auth/register',
        userData
      );

      return true;

    } catch (err: any) {
      console.error(
        'Register error:',
        err.response?.data?.message || err.message
      );

      return false;
    }
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <main>
        <Routes>

          <Route
            path="/category/:slug"
            element={<CategoryPage />}
          />

          <Route
            path="/"
            element={
              <HomePage
                posts={posts}
                setPosts={setPosts}
                currentPage={currentPostPage}
                postsPerPage={postsPerPage}
                onPageChange={setCurrentPostPage}
              />
            }
          />

          <Route
            path="/post/:slug"
            element={
              <PostDetailsPage />
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <ResetPassword />
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage
                  posts={posts}
                  setPosts={setPosts}
                />
              </AdminRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        
      </main>
    </div>
  );
};

export default App;
