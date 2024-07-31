'use client';

import { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Fixed import path
import styles from './Login.module.css';
import { AuthContext } from '../context'; // Adjust the import path as necessary
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword,setShowPassword] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () =>{
    setShowPassword(!showPassword);
  }

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
        sessionStorage.setItem('authToken',data.token);
        console.log("token set is ",sessionStorage.getItem('authToken'));
        setError('');
        console.log(data.token, " is the token")
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Login failed. Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-4 focus:border-blue-500 outline-none"
            placeholder="Username"
            required
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:border-blue-500 outline-none"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
