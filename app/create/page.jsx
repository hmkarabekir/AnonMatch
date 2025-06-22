"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useWalletStore } from '../lib/walletConnect';

export default function CreatePage() {
  const [post, setPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, publicKey } = useWalletStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.trim()) return;

    setIsSubmitting(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      alert('Gönderiniz başarıyla oluşturuldu! 🎉');
      setPost('');
      setIsSubmitting(false);
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container py-12">
          <div className="glass p-12 rounded-3xl text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Cüzdanınızı Bağlayın
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Anonim gönderi oluşturmak için Freighter cüzdanınızı bağlayın
            </p>
            <Link href="/" className="btn-primary">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/feed" className="text-white hover:text-blue-300 transition-colors">
                📰 Akış
              </Link>
              <Link href="/chats" className="text-white hover:text-blue-300 transition-colors">
                💬 Sohbetler
              </Link>
              <Link href="/settings" className="text-white hover:text-blue-300 transition-colors">
                ⚙️ Ayarlar
              </Link>
              <div className="text-green-400 text-sm">
                {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Bağlı'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              ✨ Anonim Gönderi Oluştur
            </h1>
            <p className="text-gray-300 text-lg">
              Düşüncelerinizi güvenle paylaşın, kimliğiniz gizli kalacak
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-3">
                  Mesajınız
                </label>
                <textarea
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="Düşüncelerinizi buraya yazın... (Anonim olarak paylaşılacak)"
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">
                    {post.length}/500 karakter
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="anonymous" className="text-gray-300 text-sm">
                      Anonim olarak paylaş
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-400 text-xl">🔒</div>
                  <div>
                    <h3 className="text-blue-400 font-medium mb-1">Güvenlik Garantisi</h3>
                    <p className="text-gray-300 text-sm">
                      Gönderiniz Stellar blockchain üzerinde şifrelenmiş olarak saklanır. 
                      Kimliğiniz tamamen gizli kalır.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={!post.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Blockchain'e Kaydediliyor...
                    </div>
                  ) : (
                    '🚀 Gönderiyi Paylaş'
                  )}
                </button>
                
                <Link href="/feed" className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg border border-white/20 transition-all">
                  İptal
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="text-white font-medium mb-1">Tam Gizlilik</h3>
              <p className="text-gray-300 text-sm">Kimliğiniz asla açıklanmaz</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-white font-medium mb-1">Hızlı İşlem</h3>
              <p className="text-gray-300 text-sm">Stellar blockchain üzerinde anında</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="text-white font-medium mb-1">Güvenli</h3>
              <p className="text-gray-300 text-sm">Şifrelenmiş ve güvenli</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 