import { Routes, Route, } from 'react-router-dom';

import { useState, lazy, Suspense, } from 'react';

import Header from './components/Header';
const HomePage = lazy(
  () => import('./pages/HomePage')
);

const LoginPage = lazy(
  () => import('./pages/LoginPage')
);

const RegisterPage = lazy(
  () => import('./pages/RegisterPage')
);

const AdminPage = lazy(
  () => import('./pages/AdminPage')
);

const ForgotPassword = lazy(
  () => import('./pages/ForgotPassword')
);

const ResetPassword = lazy(
  () => import('./pages/ResetPassword')
);

const PostDetailsPage = lazy(
  () => import('./pages/PostDetailsPage')
);

const CategoryPage = lazy(
  () => import('./pages/CategoryPage')
);

const CreatePostPage = lazy(
  () => import('./pages/CreatePostPage')
);

const EditPostPage = lazy(
  () => import('./pages/EditPostPage')
);

const FeedPage = lazy(
  () => import('./pages/FeedPage')
);

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useRealtimePosts, } from './hooks/useRealtimePosts';

const App = () => {

  // useRealtimePosts();

  const [currentPostPage, setCurrentPostPage] =
    useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <main>

        <Suspense
        fallback={
            <div className="flex items-center justify-center py-20 text-lg font-medium">
              Loading page...
            </div>
          }
        >

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

        </Suspense>
      </main>
    </div>
  );
};

export default App;