'use client'
import React, { useState, useMemo } from 'react'
import { initializeProgram, getProvider } from '@/services/blockchain'
import { toast } from 'react-toastify'
import { useWallet } from '@solana/wallet-adapter-react'
import { FaTimes, FaCog } from 'react-icons/fa'

interface InitializeProgramProps {
  isOpen: boolean
  onClose: () => void
}

export default function InitializeProgram({ isOpen, onClose }: InitializeProgramProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { publicKey, sendTransaction, signTransaction } = useWallet()

  const program = useMemo(
    () => getProvider(publicKey, signTransaction, sendTransaction),
    [publicKey, signTransaction, sendTransaction]
  )

  if (!isOpen) return null

  const handleInitialize = async () => {
    if (!publicKey) {
      toast.warn('Please connect wallet')
      return
    }

    if (!program) {
      toast.error('Program not available')
      return
    }

    setIsLoading(true)
    
    try {
      toast.info('Initializing program...')
      
      const tx = await initializeProgram(program, publicKey)

      console.log('Program initialized successfully:', tx)
      toast.success('Program initialized successfully! 🎉')
      
      onClose()
      
    } catch (error) {
      console.error('Error initializing program:', error)
      
      // Handle specific error messages
      if (error instanceof Error) {
        if (error.message.includes('already initialized')) {
          toast.error('Program is already initialized')
        } else if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient funds to initialize program')
        } else if (error.message.includes('unauthorized')) {
          toast.error('Unauthorized: Only the deployer can initialize the program')
        } else {
          toast.error('Failed to initialize program 😞')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Initialize Program</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={isLoading}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <FaCog className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Initialize Twitter Platform
            </h3>
            <p className="text-sm text-gray-500">
              This will initialize the program state on the blockchain. This action can only be performed once by the deployer.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>This action can only be performed once</li>
                    <li>Only the program deployer can initialize</li>
                    <li>This will consume some SOL for transaction fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleInitialize}
              disabled={!publicKey || isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">Initializing...</span>
                </>
              ) : (
                <>
                  <FaCog className="w-4 h-4" />
                  <span>Initialize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}