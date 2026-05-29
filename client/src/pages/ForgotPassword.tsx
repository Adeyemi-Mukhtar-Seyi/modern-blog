import { useState } from 'react';
import axiosInstance from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        { email }
      );

      const data = response.data;

      localStorage.setItem(
        'resetEmail',
        email
      );

      alert(data.message);

    } catch (error: any) {
      setError(
        error.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <h1 className="text-2xl font-bold">
          Forgot Password
        </h1>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border p-3 rounded"
          required
        />

        <button
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
