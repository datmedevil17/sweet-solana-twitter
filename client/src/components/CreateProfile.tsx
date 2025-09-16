'use client'
import React, { useState, useMemo } from 'react'
import { createProfile, getProvider } from '@/services/blockchain'
import { uploadToIpfs } from '@/utils/pinata'
import { toast } from 'react-toastify'
import { useWallet } from '@solana/wallet-adapter-react'
import { FaTimes, FaUser, FaImage } from 'react-icons/fa'

interface CreateProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProfile({ isOpen, onClose }: CreateProfileProps) {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    profileImage: null as File | null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setFormData(prev => ({
        ...prev,
        profileImage: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

    if (!formData.username.trim() || !formData.displayName.trim() || !formData.bio.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(formData.username)) {
      toast.error('Username can only contain letters, numbers, and underscores')
      return
    }

    setIsLoading(true)
    
    try {
      let profileImageUrl = ''
      
      // Upload image to IPFS if provided
      if (formData.profileImage) {
        toast.info('Uploading image to IPFS...')
        try {
          profileImageUrl = await uploadToIpfs(formData.profileImage)
          toast.success('Image uploaded successfully!')
        } catch (uploadError) {
          console.error('Error uploading to IPFS:', uploadError)
          toast.error('Failed to upload image. Proceeding without image.')
          // Continue without image instead of failing completely
        }
      }

      // Create profile on blockchain
      toast.info('Creating profile on blockchain...')
      const tx = await createProfile(
        program,
        publicKey,
        formData.username.trim(),
        formData.displayName.trim(),
        formData.bio.trim(),
        profileImageUrl
      )

      console.log('Profile created successfully:', tx)
      toast.success('Profile created successfully! 🎉')
      
      // Reset form and close modal
      setFormData({
        username: '',
        displayName: '',
        bio: '',
        profileImage: null
      })
      setPreviewImage(null)
      onClose()
      
    } catch (error) {
      console.error('Error creating profile:', error)
      
      // Handle specific error messages
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          toast.error('Username already exists. Please choose a different one.')
        } else if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient funds to create profile')
        } else {
          toast.error('Failed to create profile 😞')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Your Profile</h2>
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
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-500">
                  Letters, numbers, and underscores only
                </div>
                <div className="text-xs text-gray-500">
                  {formData.username.length}/20
                </div>
              </div>
            </div>

            {/* Display Name Field */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your display name"
                required
                disabled={isLoading}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.displayName.length}/50
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength={160}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                placeholder="Tell us about yourself..."
                required
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-500">
                  {formData.bio.length}/160
                </div>
                {formData.bio.length > 140 && (
                  <div className="text-xs text-orange-500">
                    {160 - formData.bio.length} characters left
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image (Optional)
              </label>
              
              {/* Image Preview */}
              {formData.profileImage && previewImage && (
                <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FaImage className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">
                        {formData.profileImage.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(formData.profileImage.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, profileImage: null }))
                        setPreviewImage(null)
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={isLoading}
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                  
                  {/* Image Preview */}
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <FaImage className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {formData.profileImage ? 'Change image' : 'Choose image'}
                    </span>
                  </div>
                </label>
                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, profileImage: null }))
                      setPreviewImage(null)
                    }}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FaTimes className="w-4 h-4 mr-1" />
                    <span className="text-sm">Remove</span>
                  </button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Supported formats: Images (max 5MB)
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
                  disabled={!formData.username.trim() || !formData.displayName.trim() || !formData.bio.trim() || isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[140px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaUser className="w-4 h-4" />
                      <span>Create Profile</span>
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
