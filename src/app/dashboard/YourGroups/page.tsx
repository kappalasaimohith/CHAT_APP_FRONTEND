'use client'

import React, { useState, useEffect, useContext, FormEvent, useCallback } from 'react';
import styles from '../dashboard.module.css';
import { AuthContext } from '@/app/context';
import axios from 'axios';
import { Button } from 'antd';
import { useRouter } from "next/navigation";

const Pages = () => {
    const [data, setData] = useState<any[]>([]);
    const [roomName, setRoomName] = useState<string>('');
    const authContext = useContext(AuthContext);
    const router = useRouter();

    // Ensure AuthContext is available
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthTokenProvider');
    }

    const { authToken, login } = authContext;

    // Login effect that triggers on component mount
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            login(token);
        }
    }, [login]);

    // Memoize the fetchRooms function to prevent unnecessary re-renders
    const fetchRooms = useCallback(() => {
        if (authToken) {
            axios.get('http://localhost:8000/chatroom/rooms/', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                console.log(response.data, " is the response data of new rooms");
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            console.log("token is not there, token is empty");
        }
    }, [authToken]); // Memoizing fetchRooms based on authToken

    // Use effect for fetching rooms whenever the authToken changes
    useEffect(() => {
        fetchRooms();
    }, [authToken, fetchRooms]);

    // Handle adding a new room
    const addRoom = (e: FormEvent) => {
        e.preventDefault();
        console.log(roomName, " is the room name");

        axios.post('http://localhost:8000/chatroom/rooms/', {
            'room': roomName,
        }, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        })
        .then(response => {
            console.log(response.data);
            setRoomName(''); // Clear the input field after successful room addition
            setData(prevData => [...prevData, response.data]); // Update the list with the new room
            fetchRooms(); // Fetch the updated list of rooms
        })
        .catch(error => {
            console.error(error);
            alert("room already created");
        });
    };

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
                {data.map(room => (
                    <li key={room.id} className={styles.listItem} style={{ display: "flex", gap: "30px" }}>
                        <Button onClick={() => {
                            console.log(room, " is the room id of the app")
                            router.push(`/dashboard/chat/${room.id}`)
                        }} className={styles.roomButton}>{room.room}</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Pages;
