'use client'

import React,{useState,useEffect,useContext} from 'react'
import styles from '../dashboard.module.css'
import { AuthContext } from '@/app/context';
import { Button } from 'antd';
import axios from 'axios';

const NewRoomsPage = () => {
    const [newRooms, setNewRooms] = useState<any>([]);
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
          axios.get('http://localhost:8000/chatroom/join_room/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(response => {
              console.log(response.data, " is the response daata of created rooms")
              setNewRooms(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("token is not there, token is empty");
        }
      }, [authToken]);
    
      const sendRequest = (room_id: Number) => {
        axios.post('http://localhost:8000/chatroom/join_room/', {
          'room_id': room_id,
        }, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        })
          .then(response => {
            alert(response.data['success'])
          })
          .catch(error => {
            console.error(error);
            throw error("Error in the data");
          });
      }
    
  return (
    <div>
      <h2 className={styles.title}>Request to join rooms</h2>
      <ul className={styles.list}>
        {newRooms.map((room: any) => (
          <li key={room.id} className={styles.listItem} style={{ display: "flex", gap: "30px" }}>
            {/* {room.room_name} */}
            <Button className={styles.roomButton}>{room.room}</Button>
            <Button onClick={() => sendRequest(room.id)} className={styles.roomButton}>Send request to Join</Button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default NewRoomsPage
