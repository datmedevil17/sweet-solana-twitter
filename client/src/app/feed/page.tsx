'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllPosts, fetchAllUserProfiles, getProviderReadonly } from '@/services/blockchain'
import PostCard from '@/components/PostCard'
import ProfileCard from '@/components/ProfileCard'
import Link from 'next/link'

interface Post {
  id: string;
  publicKey: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  author: string;
  commentsCount: number;
  imageUrl?: string; // Add imageUrl field
  account: {
    topic: string;
    content: string;
    user: string;
    timestamp: number;
  };
}

interface UserProfile {
  publicKey: string;
  account: {
    user: string;
    name: string;
    avatar: string;
  };
}

const page = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

    const program = useMemo(() => getProviderReadonly(), [])
  

  useEffect(() => {
    const loadData = async () => {
      try {
        const postsData = await fetchAllPosts(program)
        setPosts(postsData.map((post: any) => ({
          id: post.account.postId?.toString() || post.publicKey.toString(),
          publicKey: post.publicKey.toString(),
          content: post.account.content,
          timestamp: post.account.createdAt.toNumber(),
          likes: post.account.likesCount?.toNumber() || 0, // Use actual likes count
          comments: post.account.commentsCount?.toNumber() || 0, // Use actual comments count
          author: post.account.author.toString(),
          commentsCount: post.account.commentsCount?.toNumber() || 0, // Use actual comments count
          imageUrl: post.account.imageUrl || undefined, // Add image URL support
          account: {
            topic: post.account.content,
            content: post.account.content,
            user: post.account.author.toString(),
            timestamp: post.account.createdAt.toNumber()
          }
        })))

        const profilesData = await fetchAllUserProfiles(program)
        setProfiles(profilesData.map((profile) => ({
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
      }
    }

    loadData()
  }, [program])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Feed</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Posts Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
                <div className="cursor-pointer hover:shadow-lg transition-shadow">
                  <PostCard post={post} />
                </div>
            ))}
            {posts.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No posts available
              </div>
            )}
          </div>
        </div>

        {/* Profiles Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">User Profiles</h2>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <Link key={profile.publicKey} href={`/profile/${profile.account.user}`}>
                <div className="cursor-pointer hover:shadow-lg transition-shadow">
                  <ProfileCard profile={profile} />
                </div>
              </Link>
            ))}
            {profiles.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No profiles available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
