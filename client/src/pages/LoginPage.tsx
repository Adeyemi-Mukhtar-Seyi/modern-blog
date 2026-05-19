import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';


type Credentials = {
  username: string;
  password: string;
};



const LoginPage = () => {  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const response = await axiosInstance.post(
          "/auth/login",
           credentials
        );

         const data = response.data;
  
      console.log("LOGIN RESPONSE:", data);
      console.log("STATUS:", response.status);

      login(data.token, data.user);

      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    };
    };
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-black mb-8">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Username or Email</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-orange-500 hover:text-orange-600"
          >
            Register
          </button>
        </p>
      </div>
    );
};

export default LoginPage;
