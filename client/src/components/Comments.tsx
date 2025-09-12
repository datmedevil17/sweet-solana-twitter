'use client'

import React, { useState, useEffect } from 'react'
import { createComment, fetchPostComments } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'

interface Comment {
  id: string
  content: string
  author: string
  timestamp: number
  postId: string
}

interface CommentsProps {
  postId: string
  program: any
  onCommentAdded?: () => void
  initialCommentsCount?: number
}

const Comments: React.FC<CommentsProps> = ({ 
  postId, 
  program, 
  onCommentAdded,
  initialCommentsCount = 0
}) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { publicKey } = useWallet()

  const loadComments = async () => {
    if (!program) return
    
    setIsLoadingComments(true)
    try {
      const postIdNum = parseInt(postId)
      const fetchedComments = await fetchPostComments(program, postIdNum)
      const transformedComments: Comment[] = fetchedComments.map((commentAccount) => ({
        id: commentAccount.account.commentId.toString(),
        content: commentAccount.account.content,
        author: commentAccount.account.author.toString(),
        timestamp: commentAccount.account.createdAt.toNumber(),
        postId: commentAccount.account.postId.toString()
      }))
      setComments(transformedComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  useEffect(() => {
    if (showComments && program) {
      loadComments()
    }
  }, [showComments, program, postId])

  const handleSubmitComment = async () => {
    if (!commentText.trim() || isCommenting || !publicKey) return
    
    setIsCommenting(true)
    try {
      const postIdNum = parseInt(postId)
      await createComment(program, publicKey, postIdNum, commentText.trim())
      
      // Add the new comment optimistically
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText.trim(),
        author: publicKey.toString(),
        timestamp: Math.floor(Date.now() / 1000),
        postId: postId
      }
      
      setComments(prev => [newComment, ...prev])
      setCommentText('')
      onCommentAdded?.()
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsCommenting(false)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const formatAuthor = (author: string) => {
    return `${author.slice(0, 4)}...${author.slice(-4)}`
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {/* Comment Input */}
      <div className="mb-4">
        <div className="flex space-x-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={140}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {commentText.length}/140 characters
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setCommentText('')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={!commentText.trim()}
            >
              Clear
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isCommenting || !publicKey}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCommenting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments Toggle */}
      {(initialCommentsCount > 0 || comments.length > 0) && (
        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showComments ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>
            {showComments ? 'Hide' : 'Show'} {comments.length || initialCommentsCount} comment(s)
          </span>
        </button>
      )}

      {/* Comments List */}
      {showComments && (
        <div className="space-y-4">
          {isLoadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatAuthor(comment.author)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.timestamp * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Comments