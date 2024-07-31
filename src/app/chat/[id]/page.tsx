'use client'
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/app/context';

interface Message {
  id: number;
  message: string;
  sent_by: number;
  created_at: string;
}

const ChatRoom = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const authContext = useContext(AuthContext);
  const socketRef = useRef<WebSocket | null>(null);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthTokenProvider');
  }

  const { authToken } = authContext;

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://127.0.0.1:8000/ws/${id}/?token=${authToken}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (e) => {
      console.log('Received WebSocket message:', e.data);
      const data = JSON.parse(e.data);

      if (data.type === 'initial_messages') {
        setMessages(data.messages);
      } else if (data.type === 'chat_message') {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: data.message.id,
            message: data.message.message,
            sent_by: data.message.sent_by,
            created_at: data.message.created_at,
          },
        ]);
      }
    };

    socket.onclose = () => {
      console.error('Chat socket closed unexpectedly');
    };

    return () => {
      socket.close();
    };
  }, [id, authToken]);

  const sendMessage = () => {
    if (messageInput.trim()) {
      const socket = socketRef.current; // Access the WebSocket instance from the ref
      if (socket) {
        const socketMessage = {
          message: messageInput,
        };
        socket.send(JSON.stringify(socketMessage));
        setMessageInput('');
      } else {
        console.error('WebSocket is not defined');
      }
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <div className="sender">{msg.username}</div>
            <div className="text">{msg.message}</div>
            <div className="timestamp">{msg.created_at}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
