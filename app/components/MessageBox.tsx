import React from 'react';

type Message = {
  id: number;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  revealed: boolean;
};

type Props = {
  messages: Message[];
};

export default function MessageBox({ messages }: Props) {
  return (
    <div className="border rounded p-4 bg-white mb-4">
      {messages.map(msg => (
        <div key={msg.id} className="mb-2">
          <div className="text-gray-700">{msg.content}</div>
          <div className="text-xs text-gray-400">
            {new Date(msg.timestamp).toLocaleString()} {msg.revealed ? '(Revealed)' : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
