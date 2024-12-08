import './globals.css'; 
import Sidebar from './components/sidebar'; 

export const metadata = {
  title: 'Next.js with Sidebar and Tailwind',
};

export default function RootLayout({ children }) {
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
