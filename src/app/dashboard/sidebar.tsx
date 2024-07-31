"use client";

import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context';
import { TiHomeOutline } from 'react-icons/ti';
import { IoLogOutOutline } from "react-icons/io5";
import {  FaStar,  FaEllipsisV, FaUser, FaCog } from 'react-icons/fa';

const Sidebar = () => {
    const [activeSection, setActiveSection] = useState('rooms');
    const handleSectionChange = (section:any) => {
        setActiveSection(section);
      };

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
  return (
    <div className="flex h-screen bg-gradient-to-r from-[#e0f2f1] to-[#b2dfdb]">
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

    </div>
  )
}

export default Sidebar
