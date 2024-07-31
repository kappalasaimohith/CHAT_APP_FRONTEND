'use client'

import React,{useState,useEffect,useContext, FormEvent} from 'react'
import styles from '../dashboard.module.css'
import { AuthContext } from '@/app/context';
import axios from 'axios';
import { Button } from 'antd';
import { useRouter } from "next/navigation";

const pages = () => {
    const [rooms, setrooms] = useState<any[]>([]);
    const [rooms2, setrooms2]  = useState<any[]>([]);
    const [roomName, setRoomName] = useState<string>('');
    const authContext = useContext(AuthContext);
    const router = useRouter();
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
          axios.get('http://localhost:8000/chatroom/get_all_rooms/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(response => {
              console.log(response.data, " is the response daata of new rooms")
              setrooms(response.data['rooms']);
              setrooms2(response.data['rooms2'])
            })
            .catch(error => {
              console.log(error);
            });
        }
        else {
          console.log("token is not there, token is empty");
        }
      }, [authToken])
      
    
  const addRoom = (e: FormEvent) => {
    e.preventDefault();
    console.log(roomName, " is the room name")
    axios.post('http://localhost:8000/chatroom/rooms/', {
      'room': roomName,
    }, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    })
      .then(response => {
        console.log(response.rooms);
        setRoomName(''); // Clear the input field after successful room addition
        setrooms(prevrooms => [...prevrooms, response.rooms]); // Update the list with the new room
      })
      .catch(error => {
        console.error(error);
        alert("room already creatd")
      });
  }  
    return (
    <div>

<form onSubmit={addRoom} className={styles.form}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className={styles.input}
          placeholder="Enter room name"
        />
        <button type="submit" className={styles.button}>Add New Room</button>
      </form>
      <h2 className={styles.title}>Your Groups</h2>
      <ul className={styles.list}>
        {rooms?.map(room => (
          <li key={room.id} className={styles.listItem} style={{ display: "flex", gap: "30px" }}>
            {/* {room.room_name} */}
            <Button onClick={() => { 
                console.log(room, " is the room id of the app")
                router.push(`/chat/${room.id}`) }} className={styles.roomButton}>{room.room}</Button>
          </li>
        ))}
      </ul>
      <ul className={styles.list}>
        {rooms2?.map(room => (
          <li key={room.id} className={styles.listItem} style={{ display: "flex", gap: "30px" }}>
            {/* {room.room_name} */}
            <Button onClick={() => { 
                console.log(room, " is the room id of the app")
                router.push(`/chat/${room.room}`) }} className={styles.roomButton}>{room.room}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default pages
