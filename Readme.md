# 🐦 Solana Twitter - Decentralized Social Media Platform

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2024-blueviolet.svg)](https://hacktoberfest.digitalocean.com/)
[![Solana](https://img.shields.io/badge/Solana-Blockchain-purple.svg)](https://solana.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-Smart%20Contracts-orange.svg)](https://www.rust-lang.org/)

A fully decentralized Twitter-like social media platform built on the Solana blockchain. Create profiles, post content, follow users, like posts, comment, and collaborate - all stored immutably on-chain with IPFS integration for media storage.

## 🌟 Features

### 🔐 **Blockchain-Powered**
- **Solana Integration**: Fast, low-cost transactions
- **Wallet Authentication**: Phantom, Solflare, and other Solana wallets
- **On-chain Storage**: All user data and interactions stored on Solana
- **IPFS Media Storage**: Decentralized image and media hosting via Pinata

### 👤 **User Management**
- **Profile Creation**: Custom usernames, display names, bios, and profile pictures
- **Profile Updates**: Edit your profile information anytime
- **User Discovery**: Browse and discover other users on the platform

### 📱 **Social Features**
- **Post Creation**: Text posts with optional image attachments
- **Collaboration Posts**: Co-author posts with other users
- **Like System**: Like and unlike posts with real-time updates
- **Comment System**: Comment on posts with threaded discussions
- **Follow System**: Follow/unfollow users to curate your feed

### 💰 **Creator Economy**
- **Donation System**: Support your favorite creators with SOL
- **Platform Fees**: Built-in monetization for platform sustainability
- **Creator Analytics**: Track followers, posts, and engagement

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live interaction feedback
- **Dark/Light Theme**: Customizable user interface
- **Smooth Animations**: Enhanced user experience with transitions

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Wallet Integration**: Solana Wallet Adapter
- **Icons**: React Icons (Font Awesome)
- **Notifications**: React Toastify

### **Backend/Blockchain**
- **Blockchain**: Solana
- **Smart Contract Language**: Rust (Anchor Framework)
- **RPC Provider**: Solana RPC endpoints
- **Storage**: IPFS via Pinata for media files

### **Development Tools**
- **Package Manager**: npm/yarn
- **Linting**: ESLint with TypeScript rules
- **Code Formatting**: Prettier
- **Build Tool**: Next.js built-in bundler

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.28+
- Git

### 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solana-twitter.git
cd solana-twitter
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install Rust and Solana tools**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Install Anchor
npm install -g @coral-xyz/anchor-cli
```

4. **Build the Solana program**
```bash
cd programs/solana-twitter
anchor build
```

5. **Set up environment variables**
```bash
cd client
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

6. **Deploy the program (optional for development)**
```bash
anchor deploy
```

7. **Start the development server**
```bash
cd client
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
solana-twitter/
├── client/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                     # Next.js 14 app router pages
│   │   │   ├── admin/               # Admin panel
│   │   │   ├── feed/                # Main feed page
│   │   │   ├── profile/             # Profile pages
│   │   │   └── layout.tsx           # Root layout
│   │   ├── components/              # Reusable React components
│   │   │   ├── Comments.tsx         # Comment system
│   │   │   ├── CreateProfile.tsx    # Profile creation modal
│   │   │   ├── CreatePostModal.tsx  # Post creation modal
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   ├── PostCard.tsx         # Individual post component
│   │   │   └── ...                  # Other components
│   │   ├── services/                # Blockchain interaction services
│   │   │   └── blockchain.tsx       # Main blockchain service
│   │   ├── utils/                   # Utility functions
│   │   │   ├── interfaces.ts        # TypeScript interfaces
│   │   │   ├── pinata.ts           # IPFS integration
│   │   │   └── helpers.ts          # Helper functions
│   │   └── styles/                  # Global styles
│   ├── public/                      # Static assets
│   └── package.json                 # Frontend dependencies
├── programs/                        # Solana smart contracts
│   └── solana-twitter/
│       ├── src/
│       │   ├── instructions/        # Program instructions
│       │   │   ├── create_profile.rs
│       │   │   ├── create_post.rs
│       │   │   ├── like_post.rs
│       │   │   ├── follow_user.rs
│       │   │   └── ...
│       │   ├── states/              # Account state definitions
│       │   │   ├── user_profile.rs
│       │   │   ├── post.rs
│       │   │   ├── comment.rs
│       │   │   └── ...
│       │   ├── errors/              # Custom error definitions
│       │   ├── constants/           # Program constants
│       │   └── lib.rs              # Main program entry
│       └── Cargo.toml              # Rust dependencies
└── README.md                       # This file
```

## 🎯 Hacktoberfest Contribution Areas

We're specifically looking for **UI/UX improvements**! Here are priority areas:

### 🎨 **High Priority - Design & UX**
- [ ] **Mobile Responsiveness**: Improve mobile layouts and touch interactions
- [ ] **Dark Mode Implementation**: Add proper dark/light theme toggle
- [ ] **Loading States**: Better loading animations and skeleton screens
- [ ] **Error Boundaries**: Implement proper error handling UI
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 🌟 **Medium Priority - Features**
- [ ] **Search Functionality**: Search users and posts
- [ ] **Notification System**: In-app notifications for likes, follows, comments
- [ ] **Media Viewer**: Image carousel and video player components
- [ ] **Emoji Picker**: Rich text editor with emoji support
- [ ] **Trending Section**: Display trending posts and users

### 🔧 **Low Priority - Enhancements**
- [ ] **Performance Optimization**: Code splitting, lazy loading
- [ ] **PWA Features**: Service worker, offline support
- [ ] **Animation Library**: Framer Motion integration
- [ ] **Component Library**: Storybook setup for component documentation
- [ ] **Testing**: Unit tests for components

## 📋 Contribution Guidelines

### 🚀 **Getting Started**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add dark mode toggle component"
   ```
6. **Push and create a Pull Request**

### 📝 **Code Standards**

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS classes, avoid inline styles
- **File naming**: PascalCase for components, camelCase for utilities
- **Commit messages**: Follow conventional commits format

### 🧪 **Testing Your Changes**

```bash
# Run the development server
npm run dev

# Run linting
npm run lint

# Build for production (optional)
npm run build
```

### 🎨 **UI/UX Guidelines**

- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Performance**: Optimize images and animations
- **Mobile-first**: Design for mobile, enhance for desktop
- **User Feedback**: Provide clear feedback for all actions

## 🔍 Key Components to Understand

### **PostCard Component** (`/client/src/components/PostCard.tsx`)
- Main post display component
- Handles likes, comments, and delete functionality
- Integrates with blockchain for real-time updates

### **Comments Component** (`/client/src/components/Comments.tsx`)
- Nested comment system
- Real-time comment loading and posting
- User interaction feedback

### **CreateProfile Component** (`/client/src/components/CreateProfile.tsx`)
- Profile creation and editing
- IPFS image upload integration
- Form validation and error handling

### **Header Component** (`/client/src/components/Header.tsx`)
- Main navigation
- Wallet connection status
- Mobile responsive menu

## 🔌 Blockchain Integration

### **Smart Contract Structure**
```rust
// Main program instructions
- initialize()           // Initialize platform
- create_profile()       // Create user profile
- update_profile()       // Update user profile  
- create_post()          // Create new post
- delete_post()          // Delete user's post
- like_post()            // Like a post
- unlike_post()          // Unlike a post
- create_comment()       // Comment on post
- follow_user()          // Follow another user
- unfollow_user()        // Unfollow user
- donate_to_creator()    // Send SOL to creator
```

### **Account Types**
- **UserProfile**: User account data
- **Post**: Individual post data
- **Comment**: Comment data
- **Follow**: Follow relationship
- **Like**: Like relationship
- **Donation**: Donation record

## 🌍 Environment Setup

### **Development Environment**
```env
NEXT_PUBLIC_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

### **Production Environment**
```env
NEXT_PUBLIC_CLUSTER=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

## 🐛 Known Issues & Improvement Areas

1. **Mobile Menu**: Needs better touch interactions
2. **Image Loading**: Slow IPFS loading needs optimization
3. **Error Messages**: More user-friendly error display
4. **Wallet Connection**: Better connection state handling
5. **Real-time Updates**: Implement WebSocket for live updates

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://book.anchor-lang.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## 🤝 Community

- **Discord**: [Join our community](https://discord.gg/your-server)
- **Telegram**: [Developer chat](https://t.me/your-group)
- **Twitter**: [@SolanaTwitter](https://twitter.com/your-handle)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Foundation for the amazing blockchain infrastructure
- Anchor framework for simplifying Solana development
- Pinata for IPFS storage solutions
- The open-source community for inspiration and tools

---

**Ready to contribute?** Check out our [good first issues](https://github.com/yourusername/solana-twitter/labels/good%20first%20issue) and join the decentralized social media revolution! 🚀

*Made with ❤️ for Hacktoberfest 2024*