import React from 'react';

type Post = {
  id: number;
  content: string;
  timestamp: number;
  author: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="text-gray-700 mb-2">{post.content}</div>
      <div className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleString()}</div>
    </div>
  );
}
