import React, {
  useState,
  useEffect,
} from 'react';

import {
  useParams,
  useNavigate,
} from 'react-router-dom';

import {
  Eye,
  EyeOff,
} from 'lucide-react';

import axiosInstance from "../api/axios";

const ResetPassword = () => {

  const { token } = useParams();

  const navigate = useNavigate();

  const email =
    localStorage.getItem('resetEmail');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [countdown, setCountdown] =
    useState(30);

  useEffect(() => {

    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [countdown]);

  const handleResend = async () => {
        try {

            if (!email) {
            return alert(
                'No email found'
            );
            }

            const response =
            await axiosInstance.post(
                '/auth/forgot-password',
                { email }
            );

            alert(response.data.message);

            setCountdown(30);

        } catch (error: any) {

            console.log(error);

            alert(
            error.response?.data?.message ||
            'Failed to resend link'
            );
        }
    };

  const handleSubmit = async (
    e: React.FormEvent
    ) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            return alert(
            'Passwords do not match'
            );
        }

        try {

            const response =
            await axiosInstance.put(
                `/auth/reset-password/${token}`,
                {
                password,
                }
            );

            const data = response.data;

            alert(data.message);

            navigate('/login');

        } catch (error: any) {

            console.log(error);

            alert(
            error.response?.data?.message ||
            'Reset failed'
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
          Reset Password
        </h1>

        <div>

          <label className="block mb-2">
            New Password
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border p-3 rounded"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-3 top-3"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        <div>

          <label className="block mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-3"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded"
        >
          Reset Password
        </button>

        <div className="flex items-center justify-between">

          <button
            type="button"
            onClick={() =>
              navigate('/login')
            }
            className="text-gray-600 hover:text-orange-500"
          >
            Back to Login
          </button>

          {countdown > 0 ? (

            <span className="text-sm text-gray-500">
              Resend in {countdown}s
            </span>

          ) : (

            <button
              type="button"
              onClick={handleResend}
              className="text-orange-500"
            >
              Resend Link
            </button>

          )}

        </div>

      </form>
    </div>
  );
};

export default ResetPassword;















// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Eye, EyeOff } from 'lucide-react';
// import React, {
//   useEffect
// } from 'react';

// const ResetPassword = () => {

//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [countdown, setCountdown] = useState(30);

//   const handleResend = async () => {

//         try {

//             const API = import.meta.env.VITE_API_URL;

//             await fetch(
//             `${API}/api/auth/forgot-password`,
//             {
//                 method: 'POST',
//                 headers: {
//                 'Content-Type': 'application/json',
//                 },

//                 body: JSON.stringify({
//                 email,
//                 }),
//             }
//             );

//             alert('Reset link resent');

//             setCountdown(30);

//         } catch (error) {
//             console.log(error);
//         }
//         };

//   // GET TOKEN FROM URL
//   const { token } = useParams();

//     useEffect(() => {

//         if (countdown <= 0) return;

//         const timer = setInterval(() => {
//             setCountdown((prev) => prev - 1);
//         }, 1000);

//         return () => clearInterval(timer);

//     }, [countdown]);

//     const handleResend = async () => {

//         try {

//             const API = import.meta.env.VITE_API_URL;

//             await fetch(
//             `${API}/api/auth/forgot-password`,
//             {
//                 method: 'POST',
//                 headers: {
//                 'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email }),
//             }
//             );

//             setCountdown(30);

//         } catch (error) {
//             console.log(error);
//         }
//     };

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     try {

//       const API = import.meta.env.VITE_API_URL;

//       const res = await fetch(
//         `${API}/api/auth/reset-password/${token}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ password }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message);
//       }

//       alert(data.message);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4"
//       >

//         <div>
//             <label className="block text-sm font-medium text-black mb-2">
//                 New Password
//             </label>

//             <div className="relative">

//                 <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
//                 required
//                 />

//                 <button
//                 type="button"
//                 onClick={() =>
//                     setShowPassword(!showPassword)
//                 }
//                 className="absolute right-3 top-3 text-gray-500"
//                 >
//                 {showPassword ? (
//                     <EyeOff size={18} />
//                 ) : (
//                     <Eye size={18} />
//                 )}
//                 </button>

//             </div>
//         </div>
//         <div>
//             <label className="block text-sm font-medium text-black mb-2">
//                 Confirm Password
//             </label>

//             <div className="relative">

//                 <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 value={confirmPassword}
//                 onChange={(e) =>
//                     setConfirmPassword(e.target.value)
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
//                 required
//                 />

//                 <button
//                 type="button"
//                 onClick={() =>
//                     setShowConfirmPassword(
//                     !showConfirmPassword
//                     )
//                 }
//                 className="absolute right-3 top-3 text-gray-500"
//                 >
//                 {showConfirmPassword ? (
//                     <EyeOff size={18} />
//                 ) : (
//                     <Eye size={18} />
//                 )}
//                 </button>

//             </div>
//             </div>

//         <button
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           Reset Password
//         </button>

//         <div className="flex items-center justify-between mt-6">

//         <button
//             type="button"
//             onClick={() => navigate('/login')}
//             className="text-gray-600 hover:text-orange-500"
//         >
//             Back to Login
//         </button>

//         {countdown > 0 ? (

//             <span className="text-sm text-gray-500">
//             Resend in {countdown}s
//             </span>

//         ) : (

//             <button
//             type="button"
//             onClick={handleResend}
//             className="text-orange-500 hover:text-orange-600"
//             >
//             Resend Link
//             </button>

//         )}

//     </div>

//       </form>
//     </div>
//   );
// };

// export default ResetPassword;






// import { useState } from 'react';
// import { useParams } from 'react-router-dom';

// const ResetPassword = () => {
//   const { token } = useParams();

//   const [password, setPassword] = useState('');

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     try {
//       const API = import.meta.env.VITE_API_URL;

//       const res = await fetch(
//         `${API}/api/auth/reset-password/${token}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ password }),
//         }
//       );

//       const data = await res.json();

//       alert(data.message);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4"
//       >
//         <h1 className="text-2xl font-bold">
//           Reset Password
//         </h1>

//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e) =>
//             setPassword(e.target.value)
//           }
//           className="w-full border p-3 rounded"
//         />

//         <button
//           className="bg-black text-white px-4 py-2 rounded"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;