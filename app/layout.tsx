import './globals.css'; 
import Sidebar from './components/sidebar'; 
import React, { ReactNode } from 'react';

export const metadata = {
  title: 'Next.js with Sidebar and Tailwind',
};

type RootLayoutProps = {
  children: ReactNode; // Define the type for children
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        {/* Sidebar with fixed width */}
        <Sidebar />
        {/* Main content takes remaining space */}
        <main className="flex-grow bg-black w-full p-2">
          {children}
        </main>
      </body>
    </html>
  );
}
