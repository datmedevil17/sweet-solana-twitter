'use client'

import React, { useMemo, useState } from 'react'
import IPFSImage from './IPFSImage'
import { likePost, unlikePost, getProvider,deletePost,checkIfLiked } from '@/services/blockchain'
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
  const program = useMemo(() => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      return null
    }
    return getProvider(publicKey, signTransaction, sendTransaction)
  }, [publicKey, signTransaction, sendTransaction])

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-0.5">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <div className="text-gray-500 text-sm font-bold">
                {post.author.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors duration-200">
              {post.author.slice(0, 8)}...{post.author.slice(-8)}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(post.timestamp * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-900 text-sm leading-relaxed">{post.content}</p>
      </div>
      
      {/* Post Image */}
      {post.imageUrl && (
        <div className="relative overflow-hidden bg-gray-100">
          <IPFSImage
            src={post.imageUrl}
            alt="Post image"
            width={600}
            height={400}
            className="w-full h-auto object-cover max-h-96 transition-opacity duration-200 hover:opacity-95"
          />
        </div>
      )}
      
      {/* Post Actions */}
      {showActions && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-1 p-2 rounded-full transition-all duration-200 hover:bg-gray-50 group ${
                  isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg 
                  className={`w-6 h-6 transition-all duration-200 ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <button 
                onClick={handleComment}
                className="flex items-center space-x-1 p-2 rounded-full transition-all duration-200 hover:bg-gray-50 text-gray-600 hover:text-blue-500 group"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              <button className="flex items-center space-x-1 p-2 rounded-full transition-all duration-200 hover:bg-gray-50 text-gray-600 hover:text-green-500 group">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Right actions */}
            <button className="p-2 rounded-full transition-all duration-200 hover:bg-gray-50 text-gray-600 hover:text-yellow-500 group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Likes count */}
          {localLikes > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-900">
                {localLikes} {localLikes === 1 ? 'like' : 'likes'}
              </p>
            </div>
          )}

          {/* Comments count */}
          {localCommentsCount > 0 && (
            <button 
              onClick={handleComment}
              className="mt-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              View all {localCommentsCount} {localCommentsCount === 1 ? 'comment' : 'comments'}
            </button>
          )}
        </div>
      )}

      {/* Comments Component */}
      {showCommentInput && (
        <div className="border-t border-gray-100">
          <Comments 
            postId={post.id}
            program={program}
            onCommentAdded={handleCommentAdded}
            initialCommentsCount={post.commentsCount}
          />
        </div>
      )}
    </div>
  )
}

export default PostCard