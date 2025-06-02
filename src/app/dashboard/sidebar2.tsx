'use client';

import axios from 'axios';
import { useEffect, useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../context';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Sidebar2 = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error('AuthContext must be used within an AuthTokenProvider');
  const { authToken, login } = authContext;

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) login(token);
  }, [login]);

  useEffect(() => {
    if (authToken) {
      axios
        .get('http://localhost:8000/chatroom/get_all_rooms/', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((res) => {
          setRooms(res.data.rooms || []);
        })
        .catch(console.error);
    }
  }, [authToken]);

  const addRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    axios
      .post(
        'http://localhost:8000/chatroom/rooms/',
        { room: roomName },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((res) => {
        setRooms((prev) => [...prev, res.data]);
        setRoomName('');
        setIsCreatingRoom(false);
      })
      .catch(() => alert('Room already created'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addRoom(e as any);
  };

  return (
    <aside className="flex flex-col bg-white shadow-md p-6 w-64 min-h-screen max-h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold text-violet-700 mb-6">Rooms</h2>

      <ul className="flex flex-col space-y-3 mb-6">
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => {
              setSelectedRoomId(room.id);
              router.push(`/dashboard/${room.id}`);
            }}
            className={`cursor-pointer rounded-md p-3 transition-colors ${
              selectedRoomId === room.id
                ? 'bg-violet-600 text-white shadow'
                : 'bg-violet-50 text-violet-700 hover:bg-violet-200'
            }`}
          >
            {room.room}
          </li>
        ))}
      </ul>

      {isCreatingRoom ? (
        <form onSubmit={addRoom} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Enter room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-violet-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
            autoFocus
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 transition"
            >
              Create
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => setIsCreatingRoom(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingRoom(true)}
          className="flex items-center justify-center bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition"
        >
          <FaPlus className="mr-2" /> Create Room
        </button>
      )}
    </aside>
  );
};

export default Sidebar2;
  