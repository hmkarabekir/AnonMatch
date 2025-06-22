"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWalletStore } from '../lib/walletConnect';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, publicKey } = useWalletStore();

  // Anonymous posts without personal information
  const anonymousPosts = [
    {
      id: 1,
      content: "Bugün yeni bir DeFi protokolü keşfettim! Yield farming stratejileri gerçekten çok ilginç. Kimler bu konuda deneyim paylaşmak ister?",
      timestamp: "2 saat önce",
      upvotes: 15,
      downvotes: 2
    },
    {
      id: 2,
      content: "NFT sanat dünyası inanılmaz! Bir sanatçının dijital eserini satın aldım ve şimdi onunla sohbet edebiliyorum. Bu teknoloji gerçekten devrim niteliğinde.",
      timestamp: "1 gün önce",
      upvotes: 23,
      downvotes: 1
    },
    {
      id: 3,
      content: "Bali'de bir kafede çalışırken bu platformu keşfettim. Anonim olarak dünyanın her yerinden insanlarla sohbet edebilmek harika!",
      timestamp: "4 saat önce",
      upvotes: 31,
      downvotes: 3
    },
    {
      id: 4,
      content: "Portekiz'deki bu güzel sahil kasabasında blockchain topluluğu ile tanıştım. Teknoloji gerçekten sınırları kaldırıyor.",
      timestamp: "2 gün önce",
      upvotes: 18,
      downvotes: 0
    },
    {
      id: 5,
      content: "Yeni bir dijital sanat serisi üzerinde çalışıyorum. Blockchain üzerinde sanat eserlerini paylaşmak ve satmak gerçekten özgürleştirici.",
      timestamp: "6 saat önce",
      upvotes: 42,
      downvotes: 1
    },
    {
      id: 6,
      content: "Bu anonim platform sayesinde sanatımı kimlik gizli kalarak paylaşabiliyorum. Gerçekten samimi geri bildirimler alıyorum.",
      timestamp: "3 gün önce",
      upvotes: 27,
      downvotes: 2
    },
    {
      id: 7,
      content: "Yapay zeka ve blockchain'in kesişim noktasında çok ilginç projeler görüyorum. Bu teknolojiler birlikte kullanıldığında inanılmaz potansiyel var.",
      timestamp: "8 saat önce",
      upvotes: 35,
      downvotes: 4
    },
    {
      id: 8,
      content: "Genç girişimcilere tavsiyem: Önce problemi çözün, sonra teknolojiyi seçin. Blockchain her çözüm için gerekli değil.",
      timestamp: "5 gün önce",
      upvotes: 29,
      downvotes: 1
    },
    {
      id: 9,
      content: "Bu anonim platform sayesinde gerçek benliğimle iletişim kurabiliyorum. Kimlik gizli kalınca daha samimi olabiliyoruz.",
      timestamp: "12 saat önce",
      upvotes: 19,
      downvotes: 0
    },
    {
      id: 10,
      content: "Dijital detoks yaparken bile bu platformu kullanabiliyorum. Anonim sohbetler gerçekten ruh sağlığımı korumama yardımcı oluyor.",
      timestamp: "1 hafta önce",
      upvotes: 33,
      downvotes: 2
    }
  ];

  // Load anonymous posts
  useEffect(() => {
    setTimeout(() => {
      // Sort by timestamp (newest first)
      const sortedPosts = [...anonymousPosts].sort((a, b) => {
        const timeA = a.timestamp.includes('saat') ? parseInt(a.timestamp) : 
                     a.timestamp.includes('gün') ? parseInt(a.timestamp) * 24 : 
                     a.timestamp.includes('hafta') ? parseInt(a.timestamp) * 168 : 0;
        const timeB = b.timestamp.includes('saat') ? parseInt(b.timestamp) : 
                     b.timestamp.includes('gün') ? parseInt(b.timestamp) * 24 : 
                     b.timestamp.includes('hafta') ? parseInt(b.timestamp) * 168 : 0;
        return timeA - timeB;
      });
      
      setPosts(sortedPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpvote = (postId) => {
    if (!isConnected) {
      alert('Oy vermek için cüzdanınızı bağlayın!');
      return;
    }
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, upvotes: post.upvotes + 1 }
        : post
    ));
  };

  const handleDownvote = (postId) => {
    if (!isConnected) {
      alert('Oy vermek için cüzdanınızı bağlayın!');
      return;
    }
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, downvotes: post.downvotes + 1 }
        : post
    ));
  };

  const handleMessage = (postId) => {
    if (!isConnected) {
      alert('Mesaj göndermek için cüzdanınızı bağlayın!');
      return;
    }
    // Navigate to chats with anonymous post info
    localStorage.setItem('selectedPost', JSON.stringify({ id: postId }));
    window.location.href = '/chats';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-bold text-xl">AnonMatch</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-blue-300 transition-colors">
                🏠 Ana Sayfa
              </Link>
              <Link href="/create" className="text-white hover:text-blue-300 transition-colors">
                ✨ Oluştur
              </Link>
              <Link href="/chats" className="text-white hover:text-blue-300 transition-colors">
                💬 Sohbetler
              </Link>
              <Link href="/settings" className="text-white hover:text-blue-300 transition-colors">
                ⚙️ Ayarlar
              </Link>
              <div className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? (publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Bağlı') : 'Bağlı Değil'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            📰 Anonim Akış
          </h1>
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <div className="text-yellow-400 text-sm bg-yellow-400/10 px-3 py-2 rounded-lg">
                ⚠️ Bazı özellikler için cüzdan bağlantısı gerekli
              </div>
            )}
            <Link href="/create" className={`btn-primary ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}>
              ✨ Yeni Gönderi
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
            <span className="text-white ml-4">Gönderiler yükleniyor...</span>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">{post.timestamp}</p>
                </div>
                
                <p className="text-white text-lg leading-relaxed mb-6">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${isConnected ? 'text-gray-300 hover:text-green-400' : 'text-gray-500 cursor-not-allowed'}`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="font-medium text-green-400">{post.upvotes}</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownvote(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${isConnected ? 'text-gray-300 hover:text-red-400' : 'text-gray-500 cursor-not-allowed'}`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="font-medium text-red-400">{post.downvotes}</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleMessage(post.id)}
                    className={`transition-colors ${isConnected ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 cursor-not-allowed'}`}
                  >
                    💬 Mesaj Gönder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 