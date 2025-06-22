"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConnectWallet from './components/ConnectWallet';
import PasskeyLogin from './components/PasskeyLogin';
import { useWalletStore } from './lib/walletConnect';

export default function HomePage() {
  const [showPasskey, setShowPasskey] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use wallet store for connection status
  const { isConnected, publicKey } = useWalletStore();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "🔐",
      title: "Anonim Profiller",
      description: "Kimliğinizi gizleyerek güvenli profiller oluşturun",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "💬",
      title: "Güvenli Mesajlaşma",
      description: "Uçtan uca şifrelenmiş anonim mesajlaşma",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🎯",
      title: "Akıllı Eşleştirme",
      description: "AI destekli karşılıklı rıza ile eşleştirme",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "⭐",
      title: "Premium Özellikler",
      description: "Premium kullanıcılar için gelişmiş özellikler",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Aktif Kullanıcı", icon: "👥" },
    { number: "50K+", label: "Gönderilen Mesaj", icon: "💌" },
    { number: "1K+", label: "Başarılı Eşleşme", icon: "❤️" },
    { number: "99.9%", label: "Çalışma Süresi", icon: "⚡" }
  ];

  const steps = [
    {
      number: "1",
      title: "Cüzdan Bağla",
      description: "Freighter cüzdanınızı bağlayarak başlayın",
      icon: "🔗"
    },
    {
      number: "2", 
      title: "Profil Oluştur",
      description: "Blockchain üzerinde anonim profilinizi oluşturun",
      icon: "👤"
    },
    {
      number: "3",
      title: "Eşleşmeye Başla",
      description: "Benzer düşünen insanlarla keşfedin ve bağlanın",
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-bold text-xl">AnonMatch</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <>
                  <button
                    onClick={() => setShowPasskey(true)}
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    🔑 Passkey
                  </button>
                  <ConnectWallet />
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/feed" className="text-white hover:text-blue-300 transition-colors">
                    📰 Feed
                  </Link>
                  <Link href="/chats" className="text-white hover:text-blue-300 transition-colors">
                    💬 Sohbetler
                  </Link>
                  <Link href="/create" className="text-white hover:text-blue-300 transition-colors">
                    ✨ Oluştur
                  </Link>
                  <Link href="/settings" className="text-white hover:text-blue-300 transition-colors">
                    ⚙️ Ayarlar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Anonim Eşleştirme
              <span className="block text-blue-400">
                Platformu
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Stellar blockchain üzerinde anonim olarak başkalarıyla bağlantı kurun. 
              Paylaşın, eşleşin ve tam gizlilik ve güvenlikle mesajlaşın.
            </p>

            {!isConnected ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ConnectWallet />
                <button
                  onClick={() => setShowPasskey(true)}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                >
                  🔑 Passkey Girişini Dene
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/feed" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  🚀 Feed'i Keşfet
                </Link>
                <Link href="/chats" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all">
                  💬 Sohbete Başla
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neden AnonMatch?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Maksimum güvenlik ve gizlilik için Stellar blockchain üzerinde inşa edildi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 relative">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="stat-item slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nasıl Başlar?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sadece 3 basit adımda anonim eşleştirme platformuna katılın
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="step-item scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/20 border-t border-white/10">
        <div className="container text-center">
          <p className="text-gray-400">
            © 2024 AnonMatch. Stellar blockchain üzerinde güvenli anonim eşleştirme.
          </p>
        </div>
      </footer>

      {/* Passkey Modal */}
      {showPasskey && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 border border-white/20">
            <PasskeyLogin onClose={() => setShowPasskey(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
