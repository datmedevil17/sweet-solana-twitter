'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllPosts, fetchAllUserProfiles, getProviderReadonly } from '@/services/blockchain'
import PostCard from '@/components/PostCard'
import ProfileCard from '@/components/ProfileCard'
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

    const program = useMemo(() => getProviderReadonly(), [])
  

  useEffect(() => {
    const loadData = async () => {
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
                <div className="cursor-pointer hover:shadow-lg transition-shadow" key={post.id}>
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

export default FeedPage
