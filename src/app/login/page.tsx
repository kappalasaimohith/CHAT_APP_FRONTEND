'use client';

import { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Fixed import path
import styles from './Login.module.css';
import { AuthContext } from '../context'; // Adjust the import path as necessary

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

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
      setError('Login failed. Check your credentials and try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              className={styles.inputField}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Login</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
