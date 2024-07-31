'use client';

import axios from "axios";
import { useEffect, useState, useContext, FormEvent } from "react";
import { AuthContext } from "../context";
import styles from './dashboard.module.css';
import { Button, Divider } from "antd";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Sidebar2 = () => {
    const router = useRouter();
  const [rooms, setrooms] = useState<any[]>([]);
  const [rooms2, setrooms2] = useState<any[]>([]);
  const [roomName, setRoomName] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
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
        console.log(response.data);
        setRoomName(''); // Clear the input field after successful room addition
        setrooms(prevrooms => [...prevrooms, response.data]); // Update the list with the new room
      })
      .catch(error => {
        console.error(error);
        alert("room already creatd")
      });
  }

  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      addRoom(e);
    }
  };
  return (
    <div>
      <div className="w-full min-h-screen mt-0 bg-white p-4 shadow-md flex flex-col overflow-y-auto" >
        <h2 className="text-lg font-bold text-[#004d40] mb-6">Rooms</h2>
        <ul className="space-y-2">
          {rooms?.map((room) => (
            <li
              key={room.id}
              className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${room.id === selectedRoomId ? 'bg-[#004d40] text-white shadow-lg' : 'bg-[#f1f8e9] text-[#004d40] hover:bg-[#c8e6c9]'
                }`}
              onClick={() => {
                console.log(room, " is the room id of the app")
                router.push(`/dashboard/${room.id}`)
              }}
            >
              {room.room}
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {rooms2?.map((room) => (
            <li
              key={room.id}
              className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${room.id === selectedRoomId ? 'bg-[#004d40] text-white shadow-lg' : 'bg-[#f1f8e9] text-[#004d40] hover:bg-[#c8e6c9]'
                }`}
              onClick={() => {
                console.log(room, " is the room id of the app")
                router.push(`/dashboard/${room.room}`)
              }}
            >
              {room.room}
            </li>
          ))}
        </ul>
        {isCreatingRoom ? (
          <div className="mt-0">
            <input
              type="text"
              placeholder="Enter room name..."
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-[#004d40] shadow-sm"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between mt-0">
              <button
                className="bg-[#00796b] text-white px-4 py-2 rounded-lg hover:bg-[#004d40] transition-colors duration-300"
                onClick={(e)=>{addRoom(e)}}
              >
                Create
              </button>
              <button
                className="bg-[#e57373] text-white px-4 py-2 rounded-lg hover:bg-[#c62828] transition-colors duration-300"
                onClick={() => setIsCreatingRoom(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="bg-[#004d40] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#00796b] transition-colors duration-300 mt-auto flex items-center justify-center"
            onClick={() => setIsCreatingRoom(true)}
          >
            <FaPlus className="text-xl mr-2" />
            Create Room
          </button>
        )}
      </div>
    </div>
  )
}

export default Sidebar2
