import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {  FaPlusCircle, FaBars, FaTimes, FaHome, FaUser, FaChevronDown } from 'react-icons/fa'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getProvider } from '@/services/blockchain'
import CreatePostModal from './CreatePostModal'
import StartCollaborationModal from './StartCollaborationModal'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false)

  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCreatePost = () => {
    setIsCreateDropdownOpen(false)
    setIsCreatePostModalOpen(true)
  }

  const handleStartCollaboration = () => {
    setIsCreateDropdownOpen(false)
    setIsCollaborationModalOpen(true)
  }

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
              Tweet.sol
            </Link>

            {/* Desktop Navigation */}
            {program && publicKey && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/feed"
                  className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaHome className="w-4 h-4" />
                  <span>Feed</span>
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaUser className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                
                {/* Create Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                    className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <FaPlusCircle className="w-4 h-4" />
                    <span>Create</span>
                    <FaChevronDown className="w-3 h-3" />
                  </button>
                  
                  {isCreateDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={handleCreatePost}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors"
                        >
                          Create New Post
                        </button>
                        <button
                          onClick={handleStartCollaboration}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors"
                        >
                          Start a Collaboration
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            )}

            {/* Desktop Wallet Button */}
            <div className="hidden md:flex items-center">
              {isMounted && (
                <WalletMultiButton
                  style={{ 
                    backgroundColor: '#16a34a', 
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {program && publicKey && (
                <>
                  <Link
                    href="/feed"
                    className="text-gray-600 hover:text-green-600 hover:bg-gray-50 flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaHome className="w-5 h-5" />
                    <span>Feed</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-green-600 hover:bg-gray-50 flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  
                  {/* Mobile Create Options */}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsCreatePostModalOpen(true)
                    }}
                    className="w-full text-left text-gray-600 hover:text-green-600 hover:bg-gray-50 flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    <FaPlusCircle className="w-5 h-5" />
                    <span>Create New Post</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setIsCollaborationModalOpen(true)
                    }}
                    className="w-full text-left text-gray-600 hover:text-green-600 hover:bg-gray-50 flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    <FaPlusCircle className="w-5 h-5" />
                    <span>Start a Collaboration</span>
                  </button>
                </>
              )}
              {isMounted && (
                <div className="px-3 py-2">
                  <WalletMultiButton
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      width: '100%'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <CreatePostModal 
        isOpen={isCreatePostModalOpen} 
        onClose={() => setIsCreatePostModalOpen(false)} 
      />
      <StartCollaborationModal 
        isOpen={isCollaborationModalOpen} 
        onClose={() => setIsCollaborationModalOpen(false)} 
      />
    </>
  )
}