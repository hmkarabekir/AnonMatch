```jsx
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
      content: "Today I discovered a new DeFi protocol! Yield farming strategies are really interesting. Who wants to share their experiences on this?",
      timestamp: "2 hours ago",
      upvotes: 15,
      downvotes: 2
    },
    {
      id: 2,
      content: "The NFT art world is incredible! I bought a digital artwork from an artist and now I can chat with them. This technology is truly revolutionary.",
      timestamp: "1 day ago",
      upvotes: 23,
      downvotes: 1
    },
    {
      id: 3,
      content: "I discovered this platform while working at a cafe in Bali. Being able to chat anonymously with people from all over the world is amazing!",
      timestamp: "4 hours ago",
      upvotes: 31,
      downvotes: 3
    },
    {
      id: 4,
      content: "I met a blockchain community in this beautiful coastal town in Portugal. Technology really removes borders.",
      timestamp: "2 days ago",
      upvotes: 18,
      downvotes: 0
    },
    {
      id: 5,
      content: "I'm working on a new digital art series. Sharing and selling artworks on the blockchain is truly liberating.",
      timestamp: "6 hours ago",
      upvotes: 42,
      downvotes: 1
    },
    {
      id: 6,
      content: "Thanks to this anonymous platform, I can share my art while keeping my identity hidden. I get really genuine feedback.",
      timestamp: "3 days ago",
      upvotes: 27,
      downvotes: 2
    },
    {
      id: 7,
      content: "I'm seeing very interesting projects at the intersection of AI and blockchain. There's incredible potential when these technologies are used together.",
      timestamp: "8 hours ago",
      upvotes: 35,
      downvotes: 4
    },
    {
      id: 8,
      content: "My advice to young entrepreneurs: Solve the problem first, then choose the technology. Blockchain isn't necessary for every solution.",
      timestamp: "5 days ago",
      upvotes: 29,
      downvotes: 1
    },
    {
      id: 9,
      content: "Thanks to this anonymous platform, I can communicate as my true self. We can be more genuine when our identity is hidden.",
      timestamp: "12 hours ago",
      upvotes: 19,
      downvotes: 0
    },
    {
      id: 10,
      content: "I can use this platform even during a digital detox. Anonymous chats really help me maintain my mental health.",
      timestamp: "1 week ago",
      upvotes: 33,
      downvotes: 2
    }
  ];

  // Load anonymous posts
  useEffect(() => {
    setTimeout(() => {
      // Sort by timestamp (newest first)
      const sortedPosts = [...anonymousPosts].sort((a, b) => {
        const timeA = a.timestamp.includes('hour') ? parseInt(a.timestamp) : 
                     a.timestamp.includes('day') ? parseInt(a.timestamp) * 24 : 
                     a.timestamp.includes('week') ? parseInt(a.timestamp) * 168 : 0;
        const timeB = b.timestamp.includes('hour') ? parseInt(b.timestamp) : 
                     b.timestamp.includes('day') ? parseInt(b.timestamp) * 24 : 
                     b.timestamp.includes('week') ? parseInt(b.timestamp) * 168 : 0;
        return timeA - timeB;
      });
      
      setPosts(sortedPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpvote = (postId) => {
    if (!isConnected) {
      alert('Connect your wallet to vote!');
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
      alert('Connect your wallet to vote!');
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
      alert('Connect your wallet to send a message!');
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
                🏠 Home Page
              </Link>
              <Link href="/create" className="text-white hover:text-blue-300 transition-colors">
                ✨ Create
              </Link>
              <Link href="/chats" className="text-white hover:text-blue-300 transition-colors">
                💬 Chats
              </Link>
              <Link href="/settings" className="text-white hover:text-blue-300 transition-colors">
                ⚙️ Settings
              </Link>
              <div className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? (publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Connected') : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            📰 Anonymous Feed
          </h1>
          <div className="flex items-center space-x-4">
            {!isConnected && (
              <div className="text-yellow-400 text-sm bg-yellow-400/10 px-3 py-2 rounded-lg">
                ⚠️ Wallet connection required for some features
              </div>
            )}
            <Link href="/create" className={`btn-primary ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}>
              ✨ New Post
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading-spinner"></div>
            <span className="text-white ml-4">Loading posts...</span>
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
                    💬 Send Message
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
```
