"use client";

import { useState } from 'react';
import { formatters } from '../lib/utils';

export default function PostCard({ post, onLike, onComment, onShare, currentUser }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(post.id, !isLiked);
    }
  };

  const handleComment = () => {
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatContent = (content) => {
    if (content.length <= 200 || isExpanded) {
      return content;
    }
    return content.substring(0, 200) + '...';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {post.anonymous ? 'A' : (post.author?.slice(0, 2) || 'U')}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {post.anonymous ? 'Anonymous User' : (post.author || 'Unknown User')}
            </h3>
            <p className="text-gray-300 text-sm">
              {formatters.formatRelativeTime(post.timestamp)}
            </p>
          </div>
        </div>
        
        {/* Post Options */}
        <div className="relative">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">
          {formatContent(post.content)}
          {post.content.length > 200 && (
            <button
              onClick={toggleExpanded}
              className="text-purple-400 hover:text-purple-300 ml-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
        <div className="flex items-center space-x-4">
          <span>{formatters.formatNumber(post.likes || 0)} likes</span>
          <span>{formatters.formatNumber(post.comments || 0)} comments</span>
          <span>{formatters.formatNumber(post.shares || 0)} shares</span>
        </div>
        
        {post.anonymous && (
          <div className="flex items-center space-x-1 text-purple-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Anonymous</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isLiked 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isLiked ? 'scale-110' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>

        {/* Bookmark Button */}
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-white/10 pt-4">
          {/* Comment Input */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {currentUser?.slice(0, 1) || 'U'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
            </div>
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {/* Sample Comments */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white text-sm">Great post! Thanks for sharing.</p>
                  <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                B
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white text-sm">I completely agree with this perspective.</p>
                  <p className="text-gray-400 text-xs mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 