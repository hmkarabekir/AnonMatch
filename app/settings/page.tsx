"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWalletStore } from '../lib/walletConnect';
import smartContract from '../lib/smartContract';

export default function SettingsPage() {
  const [userContracts, setUserContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contracts');
  const { isConnected, publicKey } = useWalletStore();

  useEffect(() => {
    if (isConnected && publicKey) {
      loadUserContracts();
    }
  }, [isConnected, publicKey]);

  const loadUserContracts = () => {
    try {
      const contracts = smartContract.getUserContracts(publicKey);
      setUserContracts(contracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'executed': return 'text-green-400';
      case 'both_approved': return 'text-blue-400';
      case 'bot_approved': return 'text-yellow-400';
      case 'user_approved': return 'text-purple-400';
      case 'pending': return 'text-gray-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'executed': return '✅ Yürütüldü';
      case 'both_approved': return '🤝 Her İki Taraf Onayladı';
      case 'bot_approved': return '🤖 Bot Onayladı';
      case 'user_approved': return '👤 Kullanıcı Onayladı';
      case 'pending': return '⏳ Beklemede';
      case 'cancelled': return '❌ İptal Edildi';
      default: return '❓ Bilinmiyor';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
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
              Ayarları görüntülemek için Freighter cüzdanınızı bağlayın
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
              <div className="text-green-400 text-sm">
                {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Bağlı'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              ⚙️ Ayarlar
            </h1>
            <button
              onClick={loadUserContracts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Yenile
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'contracts'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📋 Smart Contracts
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'network'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🌐 Ağ Durumu
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              👤 Profil
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">
                  📋 Smart Contract Geçmişi
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="loading-spinner"></div>
                    <span className="text-white ml-4">Sözleşmeler yükleniyor...</span>
                  </div>
                ) : userContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-medium text-white mb-2">Henüz Sözleşme Yok</h3>
                    <p className="text-gray-400">İlk sohbetinizi başlattığınızda burada görünecek</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userContracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-white font-semibold">
                              Sözleşme: {contract.id.slice(0, 12)}...
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Oluşturulma: {formatDate(contract.createdAt)}
                            </p>
                          </div>
                          <span className={`text-sm font-medium ${getStatusColor(contract.status)}`}>
                            {getStatusText(contract.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Durum:</span>
                            <span className={`ml-2 ${getStatusColor(contract.status)}`}>
                              {getStatusText(contract.status)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Veri Paylaşıldı:</span>
                            <span className={`ml-2 ${contract.dataShared ? 'text-green-400' : 'text-red-400'}`}>
                              {contract.dataShared ? '✅ Evet' : '❌ Hayır'}
                            </span>
                          </div>
                          {contract.executedAt && (
                            <div className="col-span-2">
                              <span className="text-gray-400">Yürütülme:</span>
                              <span className="ml-2 text-white">
                                {formatDate(contract.executedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🌐 Blockchain Ağ Durumu
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Ağ Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ağ:</span>
                        <span className="text-white">Stellar Testnet</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blok Yüksekliği:</span>
                        <span className="text-white">{smartContract.getNetworkStatus().blockHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Fiyatı:</span>
                        <span className="text-white">0.00001 XLM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durum:</span>
                        <span className="text-green-400">Bağlı</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Cüzdan Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Adres:</span>
                        <span className="text-white font-mono">
                          {publicKey ? `${publicKey.slice(0, 8)}...${publicKey.slice(-8)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bağlantı:</span>
                        <span className="text-green-400">Freighter</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Toplam Sözleşme:</span>
                        <span className="text-white">{userContracts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Aktif Sözleşme:</span>
                        <span className="text-white">
                          {userContracts.filter(c => c.status === 'executed').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">
                  👤 Profil Ayarları
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Veri Paylaşım Ayarları</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Otomatik Bot Onayı</p>
                          <p className="text-gray-400 text-sm">Botlar otomatik olarak veri paylaşımını onaylar</p>
                        </div>
                        <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Sözleşme Bildirimleri</p>
                          <p className="text-gray-400 text-sm">Yeni sözleşme onayları için bildirim al</p>
                        </div>
                        <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Anonim Mod</p>
                          <p className="text-gray-400 text-sm">Tüm veri paylaşımlarını devre dışı bırak</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-500 rounded-full flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Güvenlik</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                        🗑️ Tüm Sözleşmeleri İptal Et
                      </button>
                      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors">
                        🔒 Cüzdan Bağlantısını Kes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
