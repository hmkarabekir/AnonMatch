import React, { useState } from 'react';
import UserForm from '../components/UserForm';

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async (profileData) => {
    setLoading(true);
    try {
      // TODO: Submit profile to blockchain
      console.log('Profile data:', profileData);
      alert('Profile created successfully! (Blockchain integration pending)');
    } catch (error) {
      console.error('Profile creation error:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      alert('Please enter some content for your post.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Submit post to blockchain
      console.log('Post content:', postContent);
      alert('Post created successfully! (Blockchain integration pending)');
      setPostContent('');
    } catch (error) {
      console.error('Post creation error:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create</h1>
        <p className="text-gray-600">Set up your profile and share anonymous posts</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Profile
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'post'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Post
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Your Profile</h2>
            <p className="text-gray-600">
              Set up your anonymous profile. This information will be stored securely on the blockchain 
              and only revealed with your explicit consent.
            </p>
          </div>
          <UserForm onSubmit={handleProfileSubmit} loading={loading} />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Anonymous Post</h2>
            <p className="text-gray-600">
              Share your thoughts anonymously. Your identity will remain hidden unless you choose to reveal it.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handlePostSubmit}>
              <div className="mb-4">
                <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-2">
                  What's on your mind? *
                </label>
                <textarea
                  id="postContent"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts, experiences, or what you're looking for..."
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {postContent.length}/1000 characters
                </div>
                <button
                  type="submit"
                  disabled={loading || !postContent.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Posting...' : 'Post Anonymously'}
                </button>
              </div>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Anonymous Posting:</strong> Your post will be visible to everyone, 
                but your identity will remain completely anonymous.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 