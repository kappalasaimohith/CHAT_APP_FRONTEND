'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../context';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaStar,
  FaBars,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error('AuthContext must be used within an AuthTokenProvider');
  const { logout } = authContext;

  return (
    <aside className="flex flex-col justify-between bg-white shadow-md w-64 min-h-screen p-6">
      {/* Top navigation */}
      <nav>
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-3 text-violet-700 hover:text-violet-900 font-semibold text-lg"
            >
              <FaHome className="w-5 h-5" />
              <span>Home</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/dashboard/favs')}
              className="flex items-center space-x-3 text-violet-700 hover:text-violet-900 font-semibold text-lg"
            >
              <FaStar className="w-5 h-5" />
              <span>Favorites</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/dashboard/more')}
              className="flex items-center space-x-3 text-violet-700 hover:text-violet-900 font-semibold text-lg"
            >
              <FaBars className="w-5 h-5" />
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <nav>
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-3 text-gray-600 hover:text-violet-700 font-medium text-lg"
            >
              <FaUserCircle className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-3 text-gray-600 hover:text-violet-700 font-medium text-lg"
            >
              <FaCog className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => logout()}
              className="flex items-center space-x-3 text-red-600 hover:text-red-800 font-medium text-lg"
            >
              <FaSignOutAlt className=" w-5 h-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
