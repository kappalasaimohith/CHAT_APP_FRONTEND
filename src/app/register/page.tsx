"use client";

import { useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context';
import styles from './Register.module.css';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();
  const authContext = useContext(AuthContext);
  if(!authContext){
    throw new Error('AuthContext must be used within an AuthTokenProvider');
  }

  const {login} = authContext;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/user/signup/', {
        username,
        password,
        email,
      });
      const data = response.data;
      if (data.token) {
        login(data.token);
        setError('');
        console.log(data.token, " is the token")
        router.push('/dashboard');
      }
      setSuccess('User registered successfully!');
      setError('');
      setUsername('');
      setPassword('');
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed. Try again.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:border-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {success && <p className="text-green-500 text-center mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
