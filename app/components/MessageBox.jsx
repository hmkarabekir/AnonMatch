"use client";

import { useState } from 'react';

export default function MessageBox({ messages = [] }) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        content: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString(),
        revealed: false
      };
      
      setLocalMessages([...localMessages, message]);
      setNewMessage('');
    }
  };

  const handleReveal = (messageId) => {
    setLocalMessages(localMessages.map(msg => 
      msg.id === messageId ? { ...msg, revealed: true } : msg
    ));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl">
      {/* Messages Display */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {localMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation to see messages here</p>
          </div>
        ) : (
          localMessages.map((message) => (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-xs">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2">
                  {message.revealed ? (
                    <p>{message.content}</p>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-200">Anonymous Message</span>
                      <button
                        onClick={() => handleReveal(message.id)}
                        className="text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 rounded transition-colors"
                      >
                        Reveal
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/20">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your anonymous message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-400">
          <p>💡 Messages are encrypted and anonymous by default</p>
          <p>🔓 Recipients can choose to reveal your identity</p>
        </div>
      </div>
    </div>
  );
} 