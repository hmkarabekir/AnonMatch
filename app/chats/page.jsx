"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWalletStore } from '../lib/walletConnect';
import { createDataSharingAgreement, approveDataSharing, getContractInfo } from '../lib/smartContract';
import {
  generateKeyPair,
  exportPublicKey,
  importPublicKey,
  encryptMessage,
  decryptMessage,
  generateSessionKey,
  encryptWithSessionKey,
  decryptWithSessionKey,
  exportSessionKey,
  importSessionKey,
  generateChatId,
  storeKeys,
  getStoredKeys,
  clearStoredKeys
} from '../lib/encryption';

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [contractStatus, setContractStatus] = useState('pending'); // pending, bot_approved, both_approved, shared
  const [showDataSharing, setShowDataSharing] = useState(false);
  const [userApproved, setUserApproved] = useState(false);
  const [botApproved, setBotApproved] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [encryptionStatus, setEncryptionStatus] = useState('initializing'); // initializing, ready, error
  const [userKeys, setUserKeys] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);
  const { isConnected, publicKey } = useWalletStore();

  // Bot characters with responses
  const botCharacters = {
    1: {
      name: "CryptoExplorer",
      avatar: "🚀",
      personality: "Teknoloji meraklısı, blockchain tutkunu",
      interests: ["Kripto", "DeFi", "NFT"],
      age: "25-30",
      location: "İstanbul",
      bio: "Blockchain teknolojisinin geleceğini şekillendiren biriyim. DeFi projeleri ve NFT dünyası benim tutkum.",
      responses: [
        "Merhaba! DeFi protokolleri hakkında konuşmak ister misin?",
        "Hangi blockchain projeleri ilgini çekiyor?",
        "NFT'ler hakkında ne düşünüyorsun?",
        "Yield farming stratejileri denedin mi hiç?",
        "Hangi kripto para birimlerine yatırım yapıyorsun?"
      ]
    },
    2: {
      name: "DigitalNomad",
      avatar: "🌍",
      personality: "Seyahat tutkunu, dijital göçebe",
      interests: ["Seyahat", "Uzaktan çalışma", "Kültür"],
      age: "28-35",
      location: "Dünya çapında",
      bio: "Laptopum ve internet bağlantım ile dünyayı dolaşıyorum. Farklı kültürler ve insanlarla tanışmak en büyük tutkum.",
      responses: [
        "Merhaba! Şu anda nerede yaşıyorsun?",
        "Seyahat etmeyi seviyor musun?",
        "Uzaktan çalışma deneyimin var mı?",
        "Hangi ülkeleri ziyaret ettin?",
        "Farklı kültürler hakkında ne düşünüyorsun?"
      ]
    },
    3: {
      name: "CreativeSoul",
      avatar: "🎨",
      personality: "Yaratıcı ruh, sanatçı",
      interests: ["Sanat", "Müzik", "Yaratıcılık"],
      age: "22-28",
      location: "İzmir",
      bio: "Renkler ve notalarla yaşıyorum. Dijital sanat ve geleneksel sanatı birleştiren projeler üretiyorum.",
      responses: [
        "Merhaba! Sanatla ilgileniyor musun?",
        "Hangi tür müzik dinliyorsun?",
        "Yaratıcı projeler üzerinde çalışıyor musun?",
        "Dijital sanat hakkında ne düşünüyorsun?",
        "Hangi sanatçıları takip ediyorsun?"
      ]
    },
    4: {
      name: "TechGuru",
      avatar: "💻",
      personality: "Teknoloji uzmanı, mentor",
      interests: ["Yazılım", "AI", "Startup"],
      age: "30-40",
      location: "Ankara",
      bio: "10+ yıllık yazılım deneyimi ile startup'lara mentorluk yapıyorum. AI ve blockchain teknolojilerinin geleceğine inanıyorum.",
      responses: [
        "Merhaba! Yazılım geliştirme ile ilgileniyor musun?",
        "Hangi programlama dillerini biliyorsun?",
        "AI teknolojileri hakkında ne düşünüyorsun?",
        "Startup dünyası ilgini çekiyor mu?",
        "Hangi teknoloji trendlerini takip ediyorsun?"
      ]
    },
    5: {
      name: "MindfulMeditator",
      avatar: "🧘",
      personality: "Farkındalık tutkunu, meditasyon eğitmeni",
      interests: ["Meditasyon", "Yoga", "Kişisel gelişim"],
      age: "35-45",
      location: "Antalya",
      bio: "Dijital dünyada farkındalığı korumaya çalışan biriyim. Teknoloji ve mindfulness'ı dengelemek mümkün.",
      responses: [
        "Merhaba! Meditasyon yapıyor musun?",
        "Günlük rutinin nasıl?",
        "Mindfulness hakkında ne düşünüyorsun?",
        "Yoga ile ilgileniyor musun?",
        "Kişisel gelişim için ne yapıyorsun?"
      ]
    }
  };

  // Initialize encryption for the user
  useEffect(() => {
    const initializeEncryption = async () => {
      if (!isConnected) return;
      
      try {
        setEncryptionStatus('initializing');
        
        // Generate user's key pair if not exists
        let storedKeys = getStoredKeys('user_keys');
        if (!storedKeys) {
          const keyPair = await generateKeyPair();
          const publicKeyString = await exportPublicKey(keyPair.publicKey);
          
          storedKeys = {
            publicKey: publicKeyString,
            privateKey: keyPair.privateKey
          };
          storeKeys('user_keys', storedKeys);
        }
        
        setUserKeys(storedKeys);
        setEncryptionStatus('ready');
        
        console.log('🔐 Encryption initialized successfully');
      } catch (error) {
        console.error('Encryption initialization failed:', error);
        setEncryptionStatus('error');
      }
    };

    initializeEncryption();
  }, [isConnected]);

  // Mock chats data with bot characters
  useEffect(() => {
    setTimeout(() => {
      const selectedCharacterData = localStorage.getItem('selectedCharacter');
      if (selectedCharacterData) {
        const character = JSON.parse(selectedCharacterData);
        const botCharacter = botCharacters[character.id];
        
        const chatData = {
          id: character.id,
          name: character.name,
          lastMessage: "Merhaba! Nasılsın?",
          timestamp: "Şimdi",
          unread: 1,
          avatar: character.avatar,
          personality: character.personality,
          interests: character.interests,
          age: character.age,
          location: character.location,
          bio: character.bio,
          responses: botCharacter.responses
        };
        
        setChats([chatData]);
        setSelectedChat(chatData);
        
        // Initialize session encryption for this chat
        initializeChatEncryption(character.id);
        
        // Create smart contract for data sharing
        if (publicKey) {
          const contractId = createDataSharingAgreement(publicKey, character);
          setContractId(contractId);
          
          // Monitor contract status
          const checkContractStatus = () => {
            try {
              const status = getContractInfo(contractId);
              if (status.botApproval && !botApproved) {
                setBotApproved(true);
                setContractStatus('bot_approved');
              }
            } catch (error) {
              console.log('Contract not ready yet...');
            }
          };
          
          // Check status every 2 seconds
          const interval = setInterval(checkContractStatus, 2000);
          
          // Cleanup interval after 10 seconds
          setTimeout(() => {
            clearInterval(interval);
          }, 10000);
        }
      } else {
        setChats([
          {
            id: 1,
            name: "Anonim Kullanıcı #1",
            lastMessage: "Merhaba! Nasılsın?",
            timestamp: "2 dakika önce",
            unread: 1,
            avatar: "👤"
          },
          {
            id: 2,
            name: "Anonim Kullanıcı #2",
            lastMessage: "Bu platform gerçekten harika!",
            timestamp: "1 saat önce",
            unread: 0,
            avatar: "👤"
          },
          {
            id: 3,
            name: "Anonim Kullanıcı #3",
            lastMessage: "Blockchain teknolojisi hakkında ne düşünüyorsun?",
            timestamp: "3 saat önce",
            unread: 2,
            avatar: "👤"
          }
        ]);
      }
      setLoading(false);
    }, 1000);
  }, [publicKey, botApproved]);

  // Initialize encryption for a specific chat
  const initializeChatEncryption = async (chatId) => {
    try {
      // Generate session key for this chat
      const sessionKey = await generateSessionKey();
      const sessionKeyString = await exportSessionKey(sessionKey);
      
      // Store session key
      storeKeys(`chat_${chatId}`, {
        sessionKey: sessionKeyString
      });
      
      setSessionKey(sessionKey);
      
      console.log(`🔐 Chat encryption initialized for chat ${chatId}`);
    } catch (error) {
      console.error('Chat encryption initialization failed:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !sessionKey) {
      alert('Mesaj gönderilemedi. Şifreleme hazır değil.');
      return;
    }

    try {
      // Encrypt the message
      const encryptedMessage = await encryptWithSessionKey(newMessage, sessionKey);
      
      // Create message object
      const messageObj = {
        id: Date.now(),
        content: encryptedMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        encrypted: true
      };
      
      // Add to messages
      setMessages(prev => [...prev, messageObj]);
      
      // Simulate bot response
      setTimeout(async () => {
        const botResponse = selectedChat.responses ? 
          selectedChat.responses[Math.floor(Math.random() * selectedChat.responses.length)] : 
          "Teşekkürler! Güzel bir sohbet oldu.";
        
        // Encrypt bot response
        const encryptedBotResponse = await encryptWithSessionKey(botResponse, sessionKey);
        
        const botMessageObj = {
          id: Date.now() + 1,
          content: encryptedBotResponse,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          encrypted: true
        };
        
        setMessages(prev => [...prev, botMessageObj]);
      }, 1000);
      
      setNewMessage('');
      
      // Show smart contract approval dialog
      if (contractStatus === 'pending' || contractStatus === 'bot_approved') {
        setShowDataSharing(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Mesaj gönderilemedi. Şifreleme hatası.');
    }
  };

  const handleUserApprove = async () => {
    if (!contractId || !publicKey) {
      alert('Cüzdan bağlantısı gerekli!');
      return;
    }

    setUserApproved(true);
    setContractStatus('both_approved');
    
    try {
      // Execute smart contract
      const result = await approveDataSharing(contractId, publicKey);
      
      if (result.success && result.sharedData) {
        setContractStatus('shared');
        setSharedData(result.sharedData);
        setShowDataSharing(false);
        
        console.log('✅ Data sharing contract executed successfully!');
        console.log('📊 Shared data:', result.sharedData);
      }
    } catch (error) {
      console.error('Error executing contract:', error);
      alert('Smart contract işlemi başarısız oldu. Lütfen tekrar deneyin.');
      setContractStatus('bot_approved');
      setUserApproved(false);
    }
  };

  const handleUserReject = () => {
    setShowDataSharing(false);
    alert('Veri paylaşımı reddedildi. Sohbet anonim kalacak.');
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
              Anonim sohbetlere katılmak için Freighter cüzdanınızı bağlayın
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
              <Link href="/create" className="text-white hover:text-blue-300 transition-colors">
                ✨ Oluştur
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              💬 Anonim Sohbetler
            </h1>
            <div className="flex items-center space-x-4">
              {encryptionStatus === 'ready' && (
                <div className="text-green-400 text-sm bg-green-400/10 px-3 py-2 rounded-lg">
                  🔐 Şifreleme Aktif
                </div>
              )}
              {encryptionStatus === 'initializing' && (
                <div className="text-yellow-400 text-sm bg-yellow-400/10 px-3 py-2 rounded-lg">
                  🔐 Şifreleme Hazırlanıyor...
                </div>
              )}
              {encryptionStatus === 'error' && (
                <div className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                  ❌ Şifreleme Hatası
                </div>
              )}
              <Link href="/feed" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all">
                🎯 Yeni Eşleşme
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner"></div>
              <span className="text-white ml-4">Sohbetler yükleniyor...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat List */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-white font-semibold">Aktif Sohbetler</h2>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                          selectedChat?.id === chat.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                            {chat.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="text-white font-medium truncate">{chat.name}</h3>
                              <span className="text-gray-400 text-xs">{chat.timestamp}</span>
                            </div>
                            <p className="text-gray-300 text-sm truncate">{chat.lastMessage}</p>
                            {chat.personality && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                {chat.personality}
                              </span>
                            )}
                          </div>
                          {chat.unread > 0 && (
                            <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 h-96">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                            {selectedChat.avatar}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{selectedChat.name}</h3>
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-400 text-sm">
                                {contractStatus === 'shared' ? '🔓 Veri Paylaşıldı' : '🔒 Şifrelenmiş'}
                              </p>
                              {encryptionStatus === 'ready' && (
                                <span className="text-green-400 text-xs">🔐 E2E</span>
                              )}
                            </div>
                          </div>
                          {contractStatus === 'bot_approved' && (
                            <div className="text-green-400 text-sm">
                              ✅ Bot Onayladı
                            </div>
                          )}
                          {contractId && (
                            <div className="text-blue-400 text-xs">
                              Contract: {contractId.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="h-64 overflow-y-auto p-4 space-y-4">
                        <div className="text-center text-gray-400 text-sm py-4">
                          <p>🔒 Bu sohbet uçtan uca şifrelenmiştir</p>
                          <p>Kimlikler gizli tutulur</p>
                          {encryptionStatus === 'ready' && (
                            <p className="text-green-400 mt-1">AES-256-GCM şifreleme aktif</p>
                          )}
                        </div>
                        
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-xs ${
                              message.sender === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/10 text-white'
                            }`}>
                              <p className="text-sm">
                                {message.encrypted ? '🔐 [Şifrelenmiş Mesaj]' : message.content}
                              </p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}

                        {contractStatus === 'shared' && sharedData && (
                          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                            <h4 className="text-green-400 font-semibold mb-2">🔓 Veri Paylaşıldı</h4>
                            <div className="text-white text-sm space-y-2">
                              <div>
                                <h5 className="font-semibold text-green-300">Bot Bilgileri:</h5>
                                <p><strong>Yaş:</strong> {sharedData.botData.age}</p>
                                <p><strong>Konum:</strong> {sharedData.botData.location}</p>
                                <p><strong>İlgi Alanları:</strong> {sharedData.botData.interests.join(', ')}</p>
                                <p><strong>Hakkında:</strong> {sharedData.botData.bio}</p>
                              </div>
                              <div>
                                <h5 className="font-semibold text-blue-300">Sizin Bilgileriniz:</h5>
                                <p><strong>Yaş:</strong> {sharedData.userData.age}</p>
                                <p><strong>Konum:</strong> {sharedData.userData.location}</p>
                                <p><strong>İlgi Alanları:</strong> {sharedData.userData.interests.join(', ')}</p>
                                <p><strong>Hakkında:</strong> {sharedData.userData.bio}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Message Input */}
                      <div className="p-4 border-t border-white/10">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={encryptionStatus === 'ready' ? "Şifrelenmiş mesajınızı yazın..." : "Şifreleme hazırlanıyor..."}
                            disabled={encryptionStatus !== 'ready'}
                            className="flex-1 bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                          />
                          <button
                            onClick={handleSendMessage}
                            disabled={encryptionStatus !== 'ready' || !newMessage.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Gönder
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-400">
                        <p className="text-xl mb-2">Sohbet seçin</p>
                        <p>Mesajlaşmak istediğiniz kişiyi seçin</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Contract Approval Modal */}
      {showDataSharing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-4 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-white text-xl font-bold mb-4">Veri Paylaşım Anlaşması</h3>
              
              <div className="text-gray-300 text-sm mb-6 space-y-2">
                <p>Bot otomatik olarak anlaşmayı onayladı.</p>
                <p>Onaylarsanız karşılıklı olarak:</p>
                <ul className="text-left list-disc list-inside space-y-1">
                  <li>Yaş bilgisi</li>
                  <li>Konum bilgisi</li>
                  <li>İlgi alanları</li>
                  <li>Kişisel bio</li>
                </ul>
                <p className="text-yellow-400 mt-4">
                  Bu işlem blockchain üzerinde geri alınamaz!
                </p>
                {contractId && (
                  <p className="text-blue-400 text-xs mt-2">
                    Contract ID: {contractId}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleUserReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Reddet
                </button>
                <button
                  onClick={handleUserApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Processing Modal */}
      {contractStatus === 'both_approved' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-4 border border-white/20 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-white text-xl font-bold mb-4">Smart Contract İşleniyor</h3>
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-300">Veri paylaşım anlaşması blockchain üzerinde işleniyor...</p>
            {contractId && (
              <p className="text-blue-400 text-xs mt-2">
                Contract: {contractId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 