'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { likePost, unlikePost, getProvider } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import Comments from './Comments'

interface Post {
  id: string
  content: string
  timestamp: number
  likes: number
  author: string
  imageUrl?: string
  commentsCount: number
  isLiked?: boolean
}

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  showActions?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  showActions = true 
}) => {
  const [isLiking, setIsLiking] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes)
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount)
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  const handleLike = async () => {
    if (isLiking || !publicKey) return
    
    setIsLiking(true)
    try {
      const postId = parseInt(post.id)
      
      if (isLiked) {
        await unlikePost(program!, publicKey, postId)
        setLocalLikes(prev => prev - 1)
        setIsLiked(false)
      } else {
        await likePost(program!, publicKey, postId)
        setLocalLikes(prev => prev + 1)
        setIsLiked(true)
      }
      
      onLike?.(post.id)
    } catch (error) {
      console.error('Error liking/unliking post:', error)
      // Revert optimistic update on error
      if (isLiked) {
        setLocalLikes(prev => prev + 1)
        setIsLiked(true)
      } else {
        setLocalLikes(prev => prev - 1)
        setIsLiked(false)
      }
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = () => {
    setShowCommentInput(!showCommentInput)
    onComment?.(post.id)
  }

  const handleCommentAdded = () => {
    setLocalCommentsCount(prev => prev + 1)
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Post Content */}
      <p className="text-gray-900 mb-4 text-base leading-relaxed">{post.content}</p>
      
      {/* Post Image */}
      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}
      
      {/* Post Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <svg className={`w-4 h-4 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{localLikes}</span>
          </span>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{localCommentsCount}</span>
          </span>
          <span className="text-gray-400">•</span>
          <span>{new Date(post.timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors text-sm ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isLiking ? 'Loading...' : (isLiked ? 'Unlike' : 'Like')}</span>
            </button>
            <button 
              onClick={handleComment}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Comment</span>
            </button>
          </div>
        )}
      </div>

      {/* Comments Component */}
      {showCommentInput && (
        <Comments 
          postId={post.id}
          program={program}
          onCommentAdded={handleCommentAdded}
          initialCommentsCount={post.commentsCount}
        />
      )}
    </div>
  )
}

export default PostCard