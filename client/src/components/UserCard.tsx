// filepath: /home/datmedevil17/solana-twitter/client/src/components/UserCard.tsx
'use client'

import React from 'react'

interface User {
  username: string
  avatar: string
  address: string
}

interface UserCardProps {
  user: User
  actionButton?: {
    text: string
    onClick: (address: string) => void
    variant: 'primary' | 'secondary' | 'danger'
  }
  onClick?: (address: string) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, actionButton, onClick }) => {
  const getGradientClass = (address: string) => {
    const colors = [
      'from-green-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-red-500',
      'from-indigo-400 to-purple-500',
      'from-pink-400 to-red-500',
    ]
    const index = address?.charCodeAt(0) % colors.length || 0
    return colors[index]
  }

  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      case 'secondary':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      case 'danger':
        return 'bg-red-100 text-red-600 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  }

  return (
    <div 
      className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick?.(user.address)}
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGradientClass(user.address)} flex items-center justify-center text-white font-bold`}>
        {user.avatar || user.username?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{user.username || 'Anonymous'}</p>
        <p className="text-xs text-gray-500">{user.address?.slice(0, 8)}...{user.address?.slice(-4)}</p>
      </div>
      {actionButton && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            actionButton.onClick(user.address)
          }}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${getButtonStyles(actionButton.variant)}`}
        >
          {actionButton.text}
        </button>
      )}
    </div>
  )
}

export default UserCard