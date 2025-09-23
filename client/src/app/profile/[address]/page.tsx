'use client'

import CreateProfile from '@/components/CreateProfile'
import PostCard from '@/components/PostCard'
import UserCard from '@/components/UserCard'
import TabNavigation from '@/components/TabNavigation'
import EmptyState from '@/components/EmptyState'
import React, { useState, useEffect, useMemo } from 'react'
import { fetchUserFollowers, fetchUserPosts, fetchUserProfile, fetchUserFollows, getProviderReadonly, followUser,unfollowUser, getProvider } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useParams } from 'next/navigation'
import { UserProfile, Post, User } from '@/utils/interfaces'
import Image from 'next/image'

const ProfilePage = () => {
  const params = useParams()
  const profileAddress = params.address as string
  
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  const { publicKey, signTransaction, sendTransaction } = useWallet()
  console.log('Current publicKey:', publicKey?.toBase58())
  console.log('Profile address:', profileAddress)
  const program = useMemo(() => getProviderReadonly(), [])
  const walletProgram = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  const isOwnProfile = publicKey?.toBase58() === profileAddress
  console.log('Is own profile:', isOwnProfile)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpenProfile = () => {
    setIsOpen(true)
  }

  const handleLike = (postId: string) => {
    console.log('Like post:', postId)
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
  }

  const handleUserClick = (address: string) => {
    window.location.href = `/profile/${address}`
  }

  const handleFollowToggle = async () => {
    if (!publicKey || !walletProgram) return
    
    setFollowLoading(true)
    try {
      const targetUser = new PublicKey(profileAddress)
      
      if (isFollowing) {
        await unfollowUser(walletProgram, publicKey, targetUser)
        setIsFollowing(false)
        setUserProfile(prev => prev ? {
          ...prev,
          followersCount: prev.followersCount - 1
        } : null)
      } else {
        await followUser(walletProgram, publicKey, targetUser)
        setIsFollowing(true)
        setUserProfile(prev => prev ? {
          ...prev,
          followersCount: prev.followersCount + 1
        } : null)
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if profile address matches current user's public key
      let profileData
      if (isOwnProfile && publicKey) {
        profileData = await fetchUserProfile(program!, publicKey)
      } else {
        // For other users, we need to use the profile address
        const targetPublicKey = new PublicKey(profileAddress)
        profileData = await fetchUserProfile(program!, targetPublicKey)
      }
      
      if (profileData) {
        setUserProfile({
          username: profileData.username,
          bio: profileData.bio,
          avatar: profileData.profileImageUrl || '',
          followersCount: Number(profileData.followersCount),
          followingCount: Number(profileData.followingCount),
          postsCount: Number(profileData.postsCount),
        })

        const targetPublicKey = new PublicKey(profileAddress)
        const [postsData, followersData, followingData] = await Promise.all([
          fetchUserPosts(program!, targetPublicKey),
          fetchUserFollowers(program!, targetPublicKey),
          fetchUserFollows(program!, targetPublicKey)
        ])
        
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

        // Check if current user is following this profile
        if (publicKey && !isOwnProfile) {
          const isCurrentlyFollowing = followersData.some(
            follower => follower.account.follower.toString() === publicKey.toString()
          )
          setIsFollowing(isCurrentlyFollowing)
        }
      } else {
        setError('Profile not found')
      }
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profileAddress && program) {
      loadProfileData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAddress, publicKey, program])

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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {isOwnProfile ? (
                <button
                  onClick={handleOpenProfile}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
                >
                  Edit Profile
                </button>
              ) : publicKey ? (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-4 py-2 font-bold rounded-lg shadow-md transition-colors ${
                    isFollowing
                      ? 'bg-gray-500 hover:bg-gray-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-700 text-white'
                  } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}
                </button>
              ) : (
                <div className="text-gray-500 text-sm">
                  Connect wallet to follow
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {userProfile.avatar ? (
                  <Image 
                    src={userProfile.avatar} 
                    alt="Profile" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  userProfile.username?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {userProfile.username || 'Anonymous User'}
                </h2>
                <p className="text-gray-600 mb-4">
                  {userProfile.bio || 'No bio available'}
                </p>
                <div className="flex space-x-6 text-sm text-gray-500">
                  <span><strong>{posts.length}</strong> Posts</span>
                  <span><strong>{userProfile.followersCount}</strong> Followers</span>
                  <span><strong>{userProfile.followingCount}</strong> Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  description={isOwnProfile ? "Share your first thought!" : "This user hasn't posted anything yet."}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
                      text: 'View',
                      onClick: handleUserClick,
                      variant: 'primary'
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

      {isOwnProfile && <CreateProfile isOpen={isOpen} onClose={handleClose} />}
    </div>
  )
}

export default ProfilePage