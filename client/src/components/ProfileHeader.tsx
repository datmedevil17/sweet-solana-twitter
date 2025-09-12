'use client'

import React from 'react'

interface UserProfile {
  username: string
  bio: string
  avatar: string
  followersCount: number
  followingCount: number
  postsCount: number
}

interface ProfileHeaderProps {
  userProfile: UserProfile
  postsCount: number
  followersCount: number
  followingCount: number
  onEditProfile: () => void
  isOwnProfile?: boolean
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  postsCount,
  followersCount,
  followingCount,
  onEditProfile,
  isOwnProfile = true
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          {isOwnProfile && (
            <button
              onClick={onEditProfile}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.avatar || userProfile.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {userProfile.username || 'Anonymous User'}
            </h2>
            <p className="text-gray-600 mb-4">
              {userProfile.bio || 'No bio available'}
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <span><strong>{postsCount}</strong> Posts</span>
              <span><strong>{followersCount}</strong> Followers</span>
              <span><strong>{followingCount}</strong> Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader