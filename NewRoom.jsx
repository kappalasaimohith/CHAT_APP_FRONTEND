"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import './animations.css';
import { TiHomeOutline } from 'react-icons/ti';
import { IoLogOutOutline } from "react-icons/io5";
import { sampleRooms, sampleMessages } from './sampledata';
import { FaFile, FaImage, FaPlus, FaStar, FaPhone, FaEllipsisV, FaUser, FaCog } from 'react-icons/fa';

const Rooms = () => {
  const [rooms, setRooms] = useState(sampleRooms);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedRoomId, setSelectedRoomId] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [activeSection, setActiveSection] = useState('rooms');
  
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setDropdownOpen(false);
  }, [selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedRoomId]);

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    setActiveSection('rooms');
    router.push(/chat/${roomId});
  };

  const sendMessage = () => {
    if (!messageInput.trim() && !selectedFile) return;

    const newMessage = {
      id: (messages[selectedRoomId]?.length || 0) + 1,
      sender: 'You',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString(),
      file: selectedFile ? URL.createObjectURL(selectedFile) : null,
      fileName: selectedFile ? selectedFile.name : null,
    };

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedRoomId]: [...(prevMessages[selectedRoomId] || []), newMessage],
    }));

    setMessageInput('');
    setSelectedFile(null);
    setFilePreview('');
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleExitGroup = () => {
    console.log('Exiting the group...');
    setDropdownOpen(false);
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type.split('/')[0];
    const fileExtension = selectedFile.name.split('.').pop();

    if (fileType === 'image') {
      return (
        <div className="w-24 h-24 relative">
          <img src={filePreview} alt="File Preview" className="w-full h-full object-cover rounded-md border border-gray-300 shadow-md" />
        </div>
      );
    }

    return (
      <div className="w-24 h-24 flex flex-col items-center justify-center border border-gray-300 rounded-md bg-gray-200 p-2 shadow-md">
        {fileExtension === 'pdf' ? (
          <FaFile className="text-[#004d40] text-3xl" />
        ) : (
          <FaFile className="text-[#004d40] text-3xl" />
        )}
        <span className="text-xs mt-1 text-[#004d40]">{selectedFile.name}</span>
      </div>
    );
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = {
        id: rooms.length + 1,
        name: newRoomName,
      };
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      setNewRoomName('');
      setIsCreatingRoom(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCreateRoom();
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex w-screen h-screen bg-gradient-to-r from-[#e0f2f1] to-[#b2dfdb]">
      {/* Sidebar */}
      <div className="w-16 bg-[#004d40] p-4 shadow-lg flex flex-col items-center">
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300 ${
            activeSection === 'home' ? 'bg-[#00796b] text-white' : 'text-[#cfd8dc] hover:bg-[#00796b] hover:text-white'
          }`}
          onClick={() => handleSectionChange('home')}
        >
          <TiHomeOutline className="text-xl" />
        </button>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full mt-2 transition-colors duration-300 ${
            activeSection === 'favorites' ? 'bg-[#00796b] text-white' : 'text-[#cfd8dc] hover:bg-[#00796b] hover:text-white'
          }`}
          onClick={() => handleSectionChange('favorites')}
        >
          <FaStar className="text-xl" />
        </button>
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full mt-2 transition-colors duration-300 ${
            activeSection === 'other' ? 'bg-[#00796b] text-white' : 'text-[#cfd8dc] hover:bg-[#00796b] hover:text-white'
          }`}
          onClick={() => handleSectionChange('other')}
        >
          <FaEllipsisV className="text-xl" />
        </button>

        <button
          className="w-12 h-12 flex items-center justify-center rounded-full mt-auto bg-[#004d40] text-white shadow-md hover:bg-[#00796b] transition-colors duration-300"
          onClick={() => console.log('Viewing profile...')}
        >
          <FaUser className="text-xl" />
        </button>

        <button
          className="w-12 h-12 flex items-center justify-center rounded-full mt-2 bg-[#004d40] text-white shadow-md hover:bg-[#00796b] transition-colors duration-300"
          onClick={() => console.log('New icon action...')}
        >
          <FaCog className="text-xl" />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center rounded-full mt-2 bg-[#004d40] text-white shadow-md hover:bg-[#00796b] transition-colors duration-300"
          onClick={() => console.log('Logging out...')}
        >
          <IoLogOutOutline className="text-xl" />
        </button>
      </div>

      {/* Rooms Sidebar */}
      <div className="w-1/6 bg-white p-4 shadow-md flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold text-[#004d40] mb-6">Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className={`p-2 cursor-pointer rounded-full transition-all duration-300 ${
                room.id === selectedRoomId ? 'bg-[#004d40] text-white shadow-lg' : 'bg-[#f1f8e9] text-[#004d40] hover:bg-[#c8e6c9]'
              }`}
              onClick={() => handleRoomClick(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>

        {isCreatingRoom ? (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter room name..."
              className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-[#004d40] shadow-sm"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between mt-2">
              <button
                className="bg-[#00796b] text-white px-4 py-2 rounded-lg hover:bg-[#004d40] transition-colors duration-300"
                onClick={handleCreateRoom}
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

      {/* Chat Window */}
      <div className="flex-1 bg-white flex flex-col border-l border-[#b2dfdb]">
        <div className="flex items-center p-4 bg-[#004d40] text-white relative shadow-md">
          <div className="h-12 w-12 rounded-full bg-[#00796b] flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {rooms.find((room) => room.id === selectedRoomId)?.name.charAt(0)}
          </div>
          <h2 className="text-2xl ml-4 font-bold">
            {rooms.find((room) => room.id === selectedRoomId)?.name}
          </h2>
          <button
            className="ml-auto flex items-center p-2 hover:bg-[#00796b] rounded-full transition-colors duration-300"
            onClick={handleDropdownToggle}
          >
            <div className="bg-[#176f15] text-white p-2 rounded-full">
              <FaEllipsisV className="text-xl" />
            </div>
          </button>
          <div >
            <button
              className="block w-full text-left px-4 py-2 text-[#004d40] rounded-md hover:bg-[#e0f2f1]"
              onClick={() => console.log('Viewing profile...')}
            >
              View Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-[#e57373] rounded-md hover:bg-[#fce4ec]"
              onClick={handleExitGroup}
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
          {messages[selectedRoomId]?.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 animate_animated animate_fadeIn ${
                message.sender === 'You' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg max-w-md break-words ${
                  message.sender === 'You' ? 'bg-[#004d40] text-white' : 'bg-white text-[#004d40]'
                } shadow-lg border border-[#b2dfdb]`}
              >
                <span className="text-xs block font-semibold">{message.sender}</span>
                <p className="leading-relaxed">{message.text}</p>
                {message.file && (
                  <div className="mt-2">
                    {message.fileName && (
                      <div className="flex items-center">
                        {message.fileName.endsWith('.pdf') ? (
                          <FaFile className="text-[#004d40] text-3xl" />
                        ) : (
                          <FaFile className="text-[#004d40] text-3xl" />
                        )}
                        <span className="ml-2 text-sm text-[#004d40]">{message.fileName}</span>
                      </div>
                    )}
                    {message.file && !message.fileName && (
                      <a href={message.file} target="_blank" rel="noopener noreferrer">
                        <img
                          src={message.file}
                          alt="Attachment"
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      </a>
                    )}
                  </div>
                )}
                <span className={`text-[8px] flex justify-end ${message.sender === 'You' ? 'text-white' : 'text-[#004d40]'}`}>{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center p-4 bg-[#e0f2f1] border-t border-[#b2dfdb] rounded-b-lg">
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

export default Rooms;