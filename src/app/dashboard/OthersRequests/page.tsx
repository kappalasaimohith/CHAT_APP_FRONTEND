
'use client'

import React,{useState,useEffect,useContext} from 'react'
import styles from '../dashboard.module.css'
import { AuthContext } from '@/app/context';
import { Button } from 'antd';
import axios from 'axios';

const OtherRequestsPage = () => {
    const [newRooms, setNewRooms] = useState<any>([]);
    const authContext = useContext(AuthContext);
    const [otherRequests, setOtherRequests] = useState<any>([]);

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
          axios.get('http://localhost:8000/chatroom/other_requests/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
            .then(response => {
              console.log(response.data, " is the response daata of new rooms")
              setOtherRequests(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }
        else {
          console.log("token is not there, token is empty");
        }
      }, [authToken])

      const handleMember = (room: any, status: string) => {
        axios.post('http://localhost:8000/chatroom/other_requests/', {
          'room_name': room.room,
          'user': room.user,
          'status': status
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
          });
      }
    
    
  return (
    <div>
     <h2 className={styles.title} style={{ 'marginTop': 10 }}>Others requests</h2>
      <div className={styles.list}>
        <table>
          <thead>
            <tr>
              <th>RoomName</th>
              <th>Requested By</th>
              <th>Status</th>
              <th>Accept/Reject</th>
            </tr>
          </thead>
          <tbody>
            {otherRequests.map((room: any, index: number) => (
              <tr key={index}>
                <td>{room.room_name}</td>
                <td>{room.username}</td>
                <td>{room.status}</td>
                <td>{room.status == 'pending' ? (<div>
                  <Button onClick={() => handleMember(room, 'accepted')}>Accept</Button>
                  <Button onClick={() => handleMember(room, 'rejected')}>Reject</Button>
                </div>) : (
                  <p>{room.status}</p>
                )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default OtherRequestsPage
