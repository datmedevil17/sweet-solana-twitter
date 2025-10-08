'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllPosts, fetchAllUserProfiles, getProviderReadonly } from '@/services/blockchain'
import PostCard from '@/components/PostCard'
import ProfileCard from '@/components/ProfileCard'
import CreatePostModal from '@/components/CreatePostModal'
import StartCollaborationModal from '@/components/StartCollaborationModal'
import Link from 'next/link'
import { Post, ProfileCardUser } from '@/utils/interfaces'

interface RawPostData {
  publicKey: {
    toString(): string
  }
  account: {
    postId: {
      toString(): string
    }
    content: string
    createdAt: {
      toNumber(): number
    }
    likesCount: {
      toNumber(): number
    }
    commentsCount: {
      toNumber(): number
    }
    author: {
      toString(): string
    }
    imageUrl: string | null
  }
}

interface RawProfileData {
  publicKey: {
    toString(): string
  }
  account: {
    owner?: {
      toString(): string
    }
    displayName?: string
    username?: string
    profileImageUrl?: string
  }
}

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [profiles, setProfiles] = useState<ProfileCardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false)

    const program = useMemo(() => getProviderReadonly(), [])
  
  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    }
    
    try {
      const postsData = await fetchAllPosts(program)
      setPosts(postsData.map((post: RawPostData) => ({
        id: post.account.postId.toString(),
        publicKey: post.publicKey.toString(),
        content: post.account.content,
        timestamp: post.account.createdAt.toNumber(),
        likes: post.account.likesCount.toNumber(),
        comments: post.account.commentsCount.toNumber(),
        author: post.account.author.toString(),
        commentsCount: post.account.commentsCount.toNumber(),
        imageUrl: post.account.imageUrl || undefined,
        account: {
          topic: post.account.content,
          content: post.account.content,
          user: post.account.author.toString(),
          timestamp: post.account.createdAt.toNumber()
        }
      })))

      const profilesData = await fetchAllUserProfiles(program)
      setProfiles(profilesData.map((profile: RawProfileData) => ({
        publicKey: profile.publicKey.toString(),
        account: {
          user: profile.account.owner?.toString() || '',
          name: profile.account.displayName || profile.account.username || '',
          avatar: profile.account.profileImageUrl || ''
        }
      })))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handlePostCreated = () => {
    // Refresh the feed when a new post is created
    loadData(true)
  }
  

  useEffect(() => {
    loadData()
  }, [program])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCreateDropdownOpen) {
        setIsCreateDropdownOpen(false)
      }
    }

    if (isCreateDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isCreateDropdownOpen])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Loading animation */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="w-12 h-12 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your feed</h2>
          <p className="text-gray-600 max-w-sm mx-auto">Getting the latest posts and profiles for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container - with top padding to account for fixed navbar */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-6 lg:pt-24 lg:pb-8">
        
        {/* Mobile/Tablet: Profiles at top */}
        <div className="lg:hidden mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span>Suggested Users</span>
              </h2>
              <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {profiles.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Connect with amazing creators</p>
            
            {/* Horizontal scrollable profiles for mobile */}
            <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-2 scrollbar-hide">
              {profiles.map((profile) => (
                <Link key={profile.publicKey} href={`/profile/${profile.account.user}`}>
                  <div className="flex-shrink-0 cursor-pointer group">
                    <div className="flex flex-col items-center space-y-2 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-0.5 shadow-lg">
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {profile.account.avatar ? (
                            <img 
                              src={profile.account.avatar} 
                              alt={profile.account.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-500 text-sm sm:text-lg font-bold">
                              {profile.account.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-900 truncate max-w-[60px] sm:max-w-[70px]">
                          {profile.account.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {profiles.length === 0 && (
                <div className="flex-shrink-0 w-full">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No profiles available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* Posts Section - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 lg:w-8 lg:h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Latest Posts
                  {refreshing && (
                    <div className="ml-3 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h1>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => loadData(true)}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="transition-all duration-200 hover:shadow-lg cursor-pointer"
                  >
                    <PostCard post={post} />
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 max-w-sm">
                      Be the first to share something amazing with the community!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: Profiles Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 xl:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg xl:text-xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="leading-tight">Suggested for you</span>
                    </h2>
                    <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full border border-gray-200 flex-shrink-0">
                      {profiles.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Connect with amazing creators</p>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {profiles.map((profile) => (
                      <Link key={profile.publicKey} href={`/profile/${profile.account.user}`}>
                        <div className="group cursor-pointer">
                          <ProfileCard profile={profile} />
                        </div>
                      </Link>
                    ))}
                    {profiles.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No profiles available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Only */}
      <div className="fixed bottom-6 right-6 block md:hidden z-40">
        <button
          onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105"
        >
          <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Mobile FAB Menu */}
        {isCreateDropdownOpen && (
          <div className="absolute bottom-16 right-0 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="py-2">
              <button
                onClick={() => {
                  setIsCreateDropdownOpen(false)
                  setIsCreatePostModalOpen(true)
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Create Post</div>
                  <div className="text-xs text-gray-500">Share your thoughts</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsCreateDropdownOpen(false)
                  setIsCollaborationModalOpen(true)
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Start Collaboration</div>
                  <div className="text-xs text-gray-500">Work together</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePostModal 
        isOpen={isCreatePostModalOpen} 
        onClose={() => {
          setIsCreatePostModalOpen(false)
          handlePostCreated() // Refresh feed when modal closes
        }} 
      />
      <StartCollaborationModal 
        isOpen={isCollaborationModalOpen} 
        onClose={() => {
          setIsCollaborationModalOpen(false)
          handlePostCreated() // Refresh feed when modal closes
        }} 
      />
    </div>
  )
}

export default FeedPage
