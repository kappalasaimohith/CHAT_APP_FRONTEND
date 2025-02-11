'use client';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/app/context';
import { FaEllipsisV } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Message {
  id: number;
  username: string;
  message: string;
  sent_by: number;
  created_at: string;
}

const ChatRoom = () => {
  const { id } = useParams();
  const [roomName, setRoomName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const authContext = useContext(AuthContext);
  const socketRef = useRef<WebSocket | null>(null);
  const router = useRouter();

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
      const data = JSON.parse(e.data);

      if (data.type === 'initial_messages') {
        setMessages(data.messages);
        setCurrentUser(data.user);
        setRoomName(data.room_name);
      } else if (data.type === 'chat_message') {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.message.id,
            username: data.message.username,
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

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const socket = socketRef.current;
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

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type?.split('/')[0];

    if (fileType === 'image') {
      return (
        <div className="w-24 h-24 relative">
          <Image
            src={filePreview}
            alt="File Preview"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-md border border-gray-300 shadow-md"
          />
        </div>
      );
    }
    return null;
};


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-full flex flex-col h-screen border-l border-[#b2dfdb]">
      <div className="flex items-center p-4 bg-[#004d40] text-white relative shadow-md">
        <h2 className="text-2xl ml-4 font-bold">{roomName}</h2>

        <button
          className="ml-auto flex items-center p-2 hover:bg-[#00796b] rounded-full transition-colors duration-300"
          onClick={handleDropdownToggle}
        >
          <div className="bg-[#176f15] text-white p-2 rounded-full">
            <FaEllipsisV className="text-xl" />
          </div>
        </button>
        <div className={`absolute right-4 top-16 bg-white shadow-lg rounded-lg w-48 ${dropdownOpen ? 'block' : 'hidden'}`}>
          <button
            className="block w-full text-left px-4 py-2 text-[#004d40] rounded-md hover:bg-[#e0f2f1]"
            onClick={() => console.log('Viewing profile...')}
          >
            View Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-[#e57373] rounded-md hover:bg-[#fce4ec]"
            onClick={() => router.push(`/dashboard`)}
          >
            Exit Group
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-[#00796b] rounded-md hover:bg-[#e0f2f1]"
            onClick={() => setDropdownOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 animate_animated animate_fadeIn ${msg.username === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-1.5 rounded-lg max-w-md break-words ${msg.username === currentUser ? 'bg-[#004d40] text-white' : 'bg-white text-[#004d40]'} shadow-lg border border-[#b2dfbdb]`}
            >
              <span className="text-xs block font-semibold">{msg.username}</span>
              <p className="leading-relaxed">{msg.message}</p>
              <span className={`text-[8px] flex justify-end ${msg.username === currentUser ? 'text-white' : 'text-[#004d40]'}`}>{formatTime(msg.created_at)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-[#e0f2f1] border-t border-[#b2dfbdb] rounded-b-lg flex-shrink-0">
        <div className="w-full flex items-center">
          {filePreview && (
            <div className="mr-4 flex items-center">
              {renderFilePreview()}
            </div>
          )}
          <input
            type="text"
            placeholder="Type your message..."
            className="border border-[#b2dfb2] p-2 w-full rounded-lg focus:outline-none focus:ring-[#004d40] shadow-sm"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <label className="bg-[#004d40] text-white px-4 py-2 ml-3 rounded-lg cursor-pointer flex items-center hover:bg-[#00796b] transition-colors duration-300">
            <input
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <span>Attach</span>
          </label>
          <button
            className="bg-[#004d40] text-white px-4 py-2 ml-3 rounded-lg hover:bg-[#00796b] transition-colors duration-300"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
