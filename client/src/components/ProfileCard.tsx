import React from 'react'

interface UserProfile {
  publicKey: string;
  account: {
    user: string;
    name: string;
    avatar: string;
  };
}

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group cursor-pointer">
      <div className="flex items-center space-x-3">
        {/* Avatar with gradient ring */}
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-0.5 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profile.account.avatar ? (
                                  <img 
                    src={profile.account.avatar} 
                    alt={profile.account.name}
                    className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                  />
              ) : (
                <div className="text-gray-500 text-lg font-bold group-hover:text-gray-600 transition-colors duration-300">
                  {profile.account.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full group-hover:bg-green-500 transition-colors duration-300"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
            {profile.account.name}
          </h3>
          <p className="text-xs text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-300">
            {profile.account.user}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            {profile.publicKey.slice(0, 6)}...{profile.publicKey.slice(-6)}
          </p>
        </div>

        {/* Follow button */}
        <div className="flex-shrink-0">
          <button className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
            Follow
          </button>
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="mt-3 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  )
}

export default ProfileCard