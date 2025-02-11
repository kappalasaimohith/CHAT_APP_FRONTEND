'use client'

import React,{useState,useEffect,useContext} from 'react'
import styles from '../dashboard.module.css'
import { AuthContext } from '@/app/context';
import axios from 'axios';

const MyRequestPage = () => {
    const [myRequests, setMyRequests] = useState<any>([]);
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

    useEffect(() => {
        if (authToken) {
          axios.get('http://localhost:8000/chatroom/my_requests/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(response => {
              console.log(response.data, " is the response daata of new rooms")
              setMyRequests(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }
        else {
          console.log("token is not there, token is empty");
        }
      }, [authToken])
  return (
    <div>
      <h2 className={styles.title}>My requests</h2>
      <div className={styles.list}>
        <table>
          <thead>
            <tr>
              <th>RoomName</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((room:any, index: number) => (
              <tr key={index}>
                <td>{room.room_name}</td>
                <td>{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyRequestPage