'use client';

import { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthTokenProvider');
  }

  const { login } = authContext;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/user/login/', {
        username,
        password,
      });
      const data = response.data;
      if (data.token) {
        login(data.token);
        sessionStorage.setItem('authToken', data.token);
        setError('');
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Login failed. Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-6">
      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-md w-full animate-fade-in-up transition-all duration-700">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 text-center mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Log in to continue the conversation
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            placeholder="Username"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Login
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          New user?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-purple-600 hover:underline cursor-pointer font-semibold"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
