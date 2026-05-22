import {
  Routes,
  Route,
} from 'react-router-dom';

import { useState } from 'react';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PostDetailsPage from './pages/PostDetailsPage';
import CategoryPage from './pages/CategoryPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import FeedPage from './pages/FeedPage';

const App = () => {

  const [currentPostPage, setCurrentPostPage] =
    useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <main>
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <HomePage
                currentPage={currentPostPage}
                onPageChange={setCurrentPostPage}
              />
            }
          />

          <Route
            path="/feed"
            element={<FeedPage />}
          />

          {/* SINGLE POST */}
          <Route
            path="/post/:slug"
            element={<PostDetailsPage />}
          />

          {/* CATEGORY */}
          <Route
            path="/category/:slug"
            element={<CategoryPage />}
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* CREATE POST */}
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />

          {/* EDIT POST */}
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

        </Routes>
      </main>
    </div>
  );
};

export default App;