'use client'

import React, { useState, useMemo } from 'react'
import { FaTimes, FaImage, FaPaperPlane } from 'react-icons/fa'
import { createPost, getProvider } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-toastify'
import { uploadToIpfs } from '@/utils/pinata'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      toast.warn('Please connect wallet')
      return
    }

    if (!program) {
      toast.error('Program not initialized')
      return
    }

    setIsLoading(true)

    try {
      let imageUrl: string | undefined = undefined

      // Upload image to IPFS if selected
      if (selectedFile) {
        toast.info('Uploading image to IPFS...')
        try {
          imageUrl = await uploadToIpfs(selectedFile)
          toast.success('Image uploaded successfully!')
        } catch (uploadError) {
          console.error('Error uploading to IPFS:', uploadError)
          toast.error('Failed to upload image. Proceeding without image.')
          // Continue without image instead of failing completely
        }
      }

      // Create post on blockchain
      toast.info('Creating post on blockchain...')
      const tx = await createPost(
        program,
        publicKey,
        content,
        imageUrl || ''
      )

      console.log('Post created successfully:', tx)
      toast.success('Post created successfully! 🎉')
      
      // Reset form and close modal
      setContent('')
      setSelectedFile(null)
      onClose()
      
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post 😞')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Please select an image or video file')
        return
      }
      
      setSelectedFile(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Content Textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                rows={4}
                maxLength={280}
                required
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-right text-sm text-gray-500">
                  {content.length}/280
                </div>
                {content.length > 250 && (
                  <div className="text-xs text-orange-500">
                    {280 - content.length} characters left
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Media (Optional)
              </label>
              
              {/* File Preview */}
              {selectedFile && (
                <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaImage className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={isLoading}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  {selectedFile.type.startsWith('image/') && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="max-w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <FaImage className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {selectedFile ? 'Change file' : 'Choose file'}
                    </span>
                  </div>
                </label>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FaTimes className="w-4 h-4 mr-1" />
                    <span className="text-sm">Remove</span>
                  </button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Supported formats: Images and videos (max 5MB)
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Posting...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      <span>Post</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}