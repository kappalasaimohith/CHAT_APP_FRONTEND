'use client';

import axios from "axios";
import { useEffect, useState, useContext, FormEvent } from "react";
import { AuthContext } from "../context";
import styles from './dashboard.module.css';
import { Button, Divider } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthTokenProvider');
  }

  const { authToken, login } = authContext;

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      login(token);
    }
  }, [login]);

  

 
  return (
    <div className={styles.container}>

      <Button><a href="dashboard/YourGroups">Check your groups</a></Button>
      <hr />
      <hr />
      <Button><a href="dashboard/MyRequest">See My Requests</a></Button>
      <hr />
      <hr />
      <Button><a href="dashboard/NewRooms">Join New rooms</a></Button>
      <hr />
      <hr />
      <Button><a href="dashboard/OthersRequests">Other Requests to your group</a></Button>
      <hr />
      <hr />
      <Button><a href="dashboard/AllRooms">Check your all rooms</a></Button>

      
    </div>
  );
}
