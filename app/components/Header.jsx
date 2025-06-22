"use client";
import Link from 'next/link';
import ConnectWallet from './ConnectWallet.jsx';

export default function Header() {
  return (
    <header className="nav-container">
      <div className="container">
        <div className="flex justify-between items-center">
          <div className="nav-brand">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span>AnonMatch</span>
          </div>
          
          <div className="nav-links">
            <Link href="/feed" className="nav-link">📰 Feed</Link>
            <Link href="/create" className="nav-link">✨ Oluştur</Link>
            <Link href="/chats" className="nav-link">💬 Sohbetler</Link>
            <Link href="/settings" className="nav-link">⚙️ Ayarlar</Link>
          </div>
          
          <div>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
} 