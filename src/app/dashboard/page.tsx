'use client';

import axios from 'axios';
import { useEffect, useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../context';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Home() {
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
    <main className="flex-1 p-8 bg-gray-50 min-h-screen overflow-auto">
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h1 className="text-3xl font-extrabold text-violet-700 mb-8">Your Rooms</h1>

        <ul className="space-y-4 mb-8">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id);
                router.push(`/dashboard/chat/${room.id}`);
              }}
              className={`cursor-pointer rounded-md p-4 transition-colors ${
                selectedRoomId === room.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'bg-violet-100 text-violet-800 hover:bg-violet-300'
              }`}
            >
              {room.room}
            </li>
          ))}
        </ul>

        {isCreatingRoom ? (
          <form onSubmit={addRoom} className="flex flex-col space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Enter room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-violet-300 rounded-md p-3 focus:outline-none focus:ring-4 focus:ring-violet-600"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-3 rounded-md hover:bg-violet-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
                onClick={() => setIsCreatingRoom(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingRoom(true)}
            className="flex items-center justify-center bg-violet-600 text-white px-8 py-3 rounded-md hover:bg-violet-700 transition w-max"
          >
            <FaPlus className="mr-3" /> Create Room
          </button>
        )}
      </section>
    </main>
  );
}
