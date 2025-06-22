import React, { useState, useEffect } from 'react';
import { connect, getPublicKey } from '@stellar/freighter-api';

export default function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const pk = await getPublicKey();
      if (pk) {
        setPublicKey(pk);
        setWalletConnected(true);
      }
    } catch (error) {
      console.log('Wallet not connected');
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      await connect();
      const pk = await getPublicKey();
      setPublicKey(pk);
      setWalletConnected(true);
    } catch (error) {
      alert('Failed to connect wallet. Please ensure Freighter is installed and unlocked.');
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreatePage />;
      case 'feed':
        return <FeedPage />;
      case 'chats':
        return <ChatsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Web3 Anonymous Matching</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!walletConnected ? (
                <button
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <span className="text-sm text-gray-600">
                  Connected: {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </main>
    </div>
  );
}

// Placeholder components - will be moved to separate files
function HomePage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Anonymous Matching</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Create Profile</h3>
          <p className="text-gray-600">Set up your anonymous profile</p>
        </button>
        <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">View Feed</h3>
          <p className="text-gray-600">Browse anonymous posts</p>
        </button>
        <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Chats</h3>
          <p className="text-gray-600">Anonymous messaging</p>
        </button>
        <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p className="text-gray-600">Manage your account</p>
        </button>
      </div>
    </div>
  );
}

function CreatePage() {
  return <div>Create Page - Coming Soon</div>;
}

function FeedPage() {
  return <div>Feed Page - Coming Soon</div>;
}

function ChatsPage() {
  return <div>Chats Page - Coming Soon</div>;
}

function SettingsPage() {
  return <div>Settings Page - Coming Soon</div>;
} 