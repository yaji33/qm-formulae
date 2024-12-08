import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-gray-800 p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/probability" className="block text-white hover:text-blue-400">
              Probability Distributions
            </Link>
          </li>
          <li>
            <Link href="/descriptive" className="block text-white hover:text-blue-400">
              Descriptive Statistics
            </Link>
          </li>
          <li>
            <Link href="/inferential" className="block text-white hover:text-blue-400">
              Inferential Statistics
            </Link>
          </li>
          <li>
            <Link href="/regression" className="block text-white hover:text-blue-400">
              Regression Analysis
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
