'use client'

import React from 'react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{
    key: string
    label: string
    count: number
  }>
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default TabNavigation
