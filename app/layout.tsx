'use client';

import './globals.css'; 
import Sidebar from './components/sidebar'; 
import React, {useState} from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <title>
          Qm Formulae
        </title>
      </head>
      <body className="flex h-screen">
        {/* Toggle Button */}
        <button
          className="sm:hidden fixed top-4 left-4 z-20 bg-indigo-600 text-white p-2 rounded-md"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed sm:relative z-10 h-screen bg-gray-800 transition-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 sm:block w-60`}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main
          className={`flex-grow bg-black w-full p-4 transition-opacity ${
            isSidebarOpen ? 'opacity-70 sm:opacity-100' : 'opacity-100'
          }`}
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Close sidebar when clicking outside
        >
          {children}
        </main>
      </body>
    </html>
  );
}
