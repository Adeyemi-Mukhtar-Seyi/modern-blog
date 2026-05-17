import {
  Routes,
  Route,
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PostDetailsPage from './pages/PostDetailsPage';

import type { Post } from './types';

import axiosInstance from './api/axios';

type UserData = {
  username: string;
  password: string;
  email?: string;
  role: string;
};

const App = () => {
  const [user, setUser] = useState<UserData | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [currentPostPage, setCurrentPostPage] =
    useState<number>(1);

  const postsPerPage = 5;

  // LOAD SAVED USER
  useEffect(() => {
    const savedUser =
      localStorage.getItem('currentUser');

    if (savedUser) {
      setUser(
        JSON.parse(savedUser) as UserData
      );
    }
  }, []);

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
  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      'currentUser'
    );

    localStorage.removeItem(
      'token'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Header
        user={user}
        logout={logout}
      />

      <main>
        <Routes>

          <Route
            path="/"
            element={
              <HomePage
                posts={posts}
                currentPage={currentPostPage}
                postsPerPage={postsPerPage}
                onPageChange={
                  setCurrentPostPage
                }
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
            element={
              <LoginPage
                setUser={setUser}
              />
            }
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
              <ProtectedRoute>
                <AdminPage
                  user={user}
                  posts={posts}
                  setPosts={setPosts}
                />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
    </div>
  );
};

export default App;












// import {
//   Routes,
//   Route,
// } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import AdminPage from './pages/AdminPage';
// import type { Post } from './types';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import ProtectedRoute from './components/ProtectedRoute';
// import PostDetailsPage from './pages/PostDetailsPage';

// type Credentials = {
//   username: string;
//   password: string;
// };

// type UserData = {
//   username: string;
//   password: string;
//   email?: string;
//   role: string
// };


// const App = () => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]); 
//   const [currentPostPage, setCurrentPostPage] = useState<number>(1);

//   const postsPerPage = 5;

//   useEffect(() => {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser) as UserData);
//     }
//   }, []);

//     useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const API = import.meta.env.VITE_API_URL;

//         const res = await fetch(
//           `${API}/posts?page=${currentPostPage}&limit=${postsPerPage}`
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || 'Failed to fetch posts');
//         }

//         console.log("POSTS FROM BACKEND:", data.posts);

//         setPosts(data.posts);
//       } catch (err) {
//         console.error('Error fetching posts:', err);
//       }
//     };

//     fetchPosts();
//   }, [currentPostPage]);


//   const login = async (credentials: Credentials) => {
//     try {
//       const API = import.meta.env.VITE_API_URL;
//       const res = await fetch(`${API}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('currentUser', JSON.stringify(data.user));
//         setUser(data.user);
//         return true;
//       } else {
//         console.error('Login failed:', data.message);
//         return false;
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       return false;
//     }
//   };

//   const register = async (userData: UserData) => {
//     try {
//       const API = import.meta.env.VITE_API_URL;
//       const res = await fetch(`${API}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         return true;
//       } else {
//         console.error('Register failed:', data.message);
//         return false;
//       }
//     } catch (err) {
//       console.error('Register error:', err);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('token');
//   };



//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header user={user} logout={logout}
// />
//           <main>

//           <Routes>

//             <Route
//               path="/"
//               element={
//                 <HomePage
//                   posts={posts}
//                   currentPage={currentPostPage}
//                   postsPerPage={postsPerPage}
//                   onPageChange={setCurrentPostPage}
//                 />
//               }
//             />
//             <Route
//               path="/post/:slug"
//               element={<PostDetailsPage />}
//             />

//             <Route
//               path="/login"
//               element={
//                 <LoginPage
//                   login={login}
//                   setUser={setUser}
//                 />
//               }
//             />

//             <Route
//               path="/register"
//               element={
//                 <RegisterPage />
//               }
//             />

//             <Route
//               path="/forgot-password"
//               element={<ForgotPassword />}
//             />

//             <Route
//               path="/reset-password/:token"
//               element={<ResetPassword />}
//             />

//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute>
//                   <AdminPage
//                     user={user}
//                     posts={posts}
//                     setPosts={setPosts}
//                   />
//                 </ProtectedRoute>
//               }
//             />

//           </Routes>
        
// </main>
//     </div>
//   );
// };

// export default App;
