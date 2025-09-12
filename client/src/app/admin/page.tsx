'use client'

import InitializeProgram from '@/components/InitializeProgram'
import React, { useState } from 'react'
import { FaCog, FaShieldAlt } from 'react-icons/fa'

const AdminPage = () => {
  const [isInitializeOpen, setIsInitializeOpen] = useState(false)

  const handleClose = () => {
    setIsInitializeOpen(false)
  }

  const handleOpenInitialize = () => {
    setIsInitializeOpen(true)
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FaShieldAlt className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">
            Administrative functions for the Twitter Platform. Only authorized users can perform these actions.
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Initialize Program Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FaCog className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Initialize Program
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Initialize the Twitter Platform program state. This is required before any other operations can be performed.
            </p>
            <button
              onClick={handleOpenInitialize}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Initialize
            </button>
          </div>

          {/* Placeholder for future admin functions */}
          <div className="bg-white rounded-lg shadow-sm p-6 opacity-50">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
              <FaCog className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              More Features
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Additional admin features will be available here in the future.
            </p>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Admin Access Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These administrative functions require special permissions. Make sure you are connected with the authorized wallet before attempting any operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InitializeProgram isOpen={isInitializeOpen} onClose={handleClose} />
    </div>
  )
}

export default AdminPage