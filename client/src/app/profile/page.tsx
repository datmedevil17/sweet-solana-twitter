'use client'

import CreateProfile from '@/components/CreateProfile'
import PostCard from '@/components/PostCard'
import UserCard from '@/components/UserCard'
import ProfileHeader from '@/components/ProfileHeader'
import TabNavigation from '@/components/TabNavigation'
import EmptyState from '@/components/EmptyState'
import React, { useState, useEffect, useMemo } from 'react'
import { fetchUserFollowers, fetchUserPosts, fetchUserProfile, fetchUserFollows, getProviderReadonly } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'

interface UserProfile {
  username: string
  bio: string
  avatar: string
  followersCount: number
  followingCount: number
  postsCount: number
}

interface Post {
  id: string
  content: string
  timestamp: number
  likes: number
  author: string
  imageUrl?: string
  commentsCount: number
}

interface User {
  username: string
  avatar: string
  address: string
}

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { publicKey } = useWallet()
  const program = useMemo(() => getProviderReadonly(), [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpenProfile = () => {
    setIsOpen(true)
  }

  const handleLike = (postId: string) => {
    console.log('Like post:', postId)
    // Implement like functionality
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
    // Implement comment functionality
  }

  const handleUserClick = (address: string) => {
    console.log('Navigate to user:', address)
    // Implement navigation to user profile
  }

  const handleUnfollow = (address: string) => {
    console.log('Unfollow user:', address)
    // Implement unfollow functionality
  }

  const loadProfileData = async () => {
    if (!publicKey || !program) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const [profileData, postsData, followersData, followingData] = await Promise.all([
        fetchUserProfile(program, publicKey),
        fetchUserPosts(program, publicKey),
        fetchUserFollowers(program, publicKey),
        fetchUserFollows(program, publicKey)
      ])
      
      if (profileData) {
        setUserProfile({
          username: profileData.username,
          bio: profileData.bio,
          avatar: profileData.profileImageUrl || '',
          followersCount: Number(profileData.followersCount),
          followingCount: Number(profileData.followingCount),
          postsCount: Number(profileData.postsCount),
        })
      } else {
        setError('Profile data is unavailable')
      }
      
      setPosts(postsData.map(post => ({
        id: post.account.postId.toString(),
        content: post.account.content,
        timestamp: post.account.createdAt.toNumber(),
        likes: post.account.likesCount.toNumber(),
        author: post.account.author.toBase58(),
        imageUrl: post.account.imageUrl || undefined,
        commentsCount: post.account.commentsCount.toNumber(),
      })))
      
      setFollowers(followersData.map(follower => ({
        username: follower.account.follower.toBase58(),
        avatar: '',
        address: follower.account.follower.toBase58(),
      })))
      
      setFollowing(followingData.map(following => ({
        username: following.account.following.toBase58(),
        avatar: '',
        address: following.account.following.toBase58(),
      })))
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (publicKey && program) {
      loadProfileData()
    }
  }, [publicKey, program])

  const tabs = [
    { key: 'posts', label: 'posts', count: posts.length },
    { key: 'followers', label: 'followers', count: followers.length },
    { key: 'following', label: 'following', count: following.length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadProfileData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {userProfile && (
        <ProfileHeader
          userProfile={userProfile}
          postsCount={posts.length}
          followersCount={followers.length}
          followingCount={following.length}
          onEditProfile={handleOpenProfile}
          isOwnProfile={true}
        />
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))
              ) : (
                <EmptyState
                  title="No posts yet"
                  description="Share your first thought!"
                  icon={
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  }
                />
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followers.length > 0 ? (
                followers.map((user) => (
                  <UserCard
                    key={user.address}
                    user={user}
                    actionButton={{
                      text: 'View',
                      onClick: handleUserClick,
                      variant: 'primary'
                    }}
                    onClick={handleUserClick}
                  />
                ))
              ) : (
                <EmptyState
                  title="No followers yet"
                  className="col-span-2"
                  icon={
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {following.length > 0 ? (
                following.map((user) => (
                  <UserCard
                    key={user.address}
                    user={user}
                    actionButton={{
                      text: 'Unfollow',
                      onClick: handleUnfollow,
                      variant: 'secondary'
                    }}
                    onClick={handleUserClick}
                  />
                ))
              ) : (
                <EmptyState
                  title="Not following anyone yet"
                  className="col-span-2"
                  icon={
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>

      <CreateProfile isOpen={isOpen} onClose={handleClose} />
    </div>
  )
}

export default ProfilePage

