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

  const program = useMemo(() => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      return null
    }
    return getProvider(publicKey, signTransaction, sendTransaction)
  }, [publicKey, signTransaction, sendTransaction])

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
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hover:from-green-700 hover:to-blue-700 transition-all duration-300">
              Tweet.sol
            </Link>

            {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/feed"
                  className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 group"
                >
                  <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Feed</span>
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 group"
                >
                  <FaUser className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Profile</span>
                </Link>
                
                {/* Create Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                    className="text-gray-600 hover:text-green-600 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 group"
                  >
                    <FaPlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Create</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCreateDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCreateDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                      <div className="py-2">
                        <button
                          onClick={handleCreatePost}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaPlusCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Create New Post</div>
                            <div className="text-xs text-gray-500">Share your thoughts</div>
                          </div>
                        </button>
                        <button
                          onClick={handleStartCollaboration}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center space-x-3"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaPlusCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Start a Collaboration</div>
                            <div className="text-xs text-gray-500">Work together</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            

            {/* Desktop Wallet Button */}
            <div className="hidden md:flex items-center">
              {isMounted && (
                <WalletMultiButton
                  style={{ 
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 14px 0 rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  className="hover:scale-105 hover:shadow-lg transition-all duration-200"
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