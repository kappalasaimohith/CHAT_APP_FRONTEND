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
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Register</h1>
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
            <label className={styles.label}>Email</label>
            <input
              type="text"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className={styles.submitButton}>Register</button>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
