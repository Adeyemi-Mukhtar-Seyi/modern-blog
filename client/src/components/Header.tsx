import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// type UserData = {
//   username: string;
//   email?: string;
//   role: string
// };


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return(
      <header className="bg-white border-b-2 border-orange-500 shadow-sm">
    <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 
        className="text-2xl font-bold text-black cursor-pointer"
        onClick={() => navigate('/')}
      >
        Modern<span className="text-orange-500">Blog</span>
      </h1>

      <nav className="flex items-center space-x-6">
        <button
          onClick={() => navigate('/')}
          className="font-medium text-black hover:text-orange-500"
        >
          Home
        </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="font-medium text-black hover:text-orange-500"
            >
              Admin
            </button>
          )}

          {user && (
            <button
              onClick={() => navigate('/create-post')}
              className="font-medium text-black hover:text-orange-500"
            >
              Create Post
            </button>
          )}

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-black">Welcome, {user.username}</span>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center space-x-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-1 text-black hover:text-orange-500"
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Register
            </button>
          </div>
        )}
      </nav>
    </div>
  </header>
  );

};

export default Header;
