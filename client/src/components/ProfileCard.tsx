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
    <div className="bg-white rounded-lg shadow-md p-6 border hover:border-blue-300 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {profile.account.avatar ? (
            <img 
              src={profile.account.avatar} 
              alt={profile.account.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-2xl font-bold">
              {profile.account.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {profile.account.name}
          </h3>
          <p className="text-sm text-gray-500 break-all">
            {profile.account.user}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {profile.publicKey.slice(0, 8)}...{profile.publicKey.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard