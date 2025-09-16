export interface UserProfile {
  username: string
  bio: string
  avatar: string
  followersCount: number
  followingCount: number
  postsCount: number
}

export interface Post {
  id: string
  content: string
  timestamp: number
  likes: number
  author: string
  imageUrl?: string
  commentsCount: number
  publicKey?: string
  comments?: number
  account?: {
    topic: string
    content: string
    user: string
    timestamp: number
  }
}

export interface User {
  username: string
  avatar: string
  address: string
}

export interface Comment {
  id: string
  content: string
  author: string
  timestamp: number
  postId: string
}

export interface CommentsProps {
  postId: string
  program: unknown
  onCommentAdded?: () => void
  initialCommentsCount?: number
}

export interface CreateProfileProps {
  isOpen: boolean
  onClose: () => void
}

export interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface StartCollaborationModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface InitializeProgramProps {
  isOpen: boolean
  onClose: () => void
}

export interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  showActions?: boolean
}

export interface UserCardProps {
  user: User
  actionButton?: {
    text: string
    onClick: (address: string) => void
    variant: 'primary' | 'secondary' | 'danger'
  }
  onClick?: (address: string) => void
}

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  className?: string
}

export interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{
    key: string
    label: string
    count: number
  }>
}

export interface ProfileHeaderProps {
  userProfile: UserProfile
  postsCount: number
  followersCount: number
  followingCount: number
  onEditProfile: () => void
  isOwnProfile?: boolean
}

export interface ProfileCardUser {
  publicKey: string
  account: {
    user: string
    name: string
    avatar: string
  }
}

export interface ProfileCardProps {
  profile: ProfileCardUser
}

export interface PinataResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export interface PinataError {
  error: {
    reason: string
    details: string
  }
}
