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
- **RPC Provider**: Solana RPC endpoints with Shyft fallback
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

4. **Set up environment variables**
```bash
cd client
cp .env.example .env.local
```

## 🔐 Environment Configuration

### **Required Environment Variables**

Create a `.env.local` file in the `client` directory with the following variables:

```bash
# ==========================================
# SOLANA BLOCKCHAIN CONFIGURATION
# ==========================================

# Network to connect to (devnet recommended for development)
NEXT_PUBLIC_CLUSTER=devnet

# Main RPC URL (fallback if no custom RPC specified)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# ==========================================
# IPFS STORAGE CONFIGURATION (REQUIRED)
# ==========================================
# Get these from https://pinata.cloud/
# Required for profile pictures and post images

PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_api_key_here
```

### **Optional Environment Variables (Performance Enhancement)**

```bash
# ==========================================
# OPTIONAL: ENHANCED RPC PROVIDERS
# ==========================================

# Shyft API Key for enhanced devnet performance
# Get from https://shyft.to/ (free tier available)
# If not provided, falls back to default Solana devnet RPC
NEXT_PUBLIC_SHYFT_API_KEY=your_shyft_api_key_here

# Custom RPC URLs (override defaults)
NEXT_PUBLIC_MAINNET_RPC_URL=https://your-custom-mainnet-rpc.com

#Use Shyft Solana Rpc Provider to get your api key. Follow the link : https://dashboard.helius.dev/
NEXT_PUBLIC_DEVNET_RPC_URL=https://your-custom-devnet-rpc.com

# ==========================================
# DEVELOPMENT SETTINGS
# ==========================================

# Set to 'localhost' for local Solana test validator
# NEXT_PUBLIC_CLUSTER=localhost
# NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8899
```

### **🔑 Getting API Keys**

#### **1. Pinata IPFS Storage (Required)**
1. Visit [Pinata Cloud](https://pinata.cloud/)
2. Create a free account
3. Go to API Keys section
4. Generate new API key
5. Copy `API Key` and `API Secret` to your `.env.local`

**Free tier includes:**
- 1 GB storage
- Sufficient for development and testing

#### **2. Shyft RPC (Optional - Performance Enhancement)**
1. Visit [Shyft](https://shyft.to/)
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `NEXT_PUBLIC_SHYFT_API_KEY` in `.env.local`

**Benefits:**
- Enhanced devnet performance
- Better reliability
- Free tier: 100 requests/second

### **🏗️ Network Configuration**

#### **Development (Recommended)**
```bash
NEXT_PUBLIC_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

#### **Local Development with Test Validator**
```bash
NEXT_PUBLIC_CLUSTER=localhost
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8899

# Start local test validator in another terminal
solana-test-validator
```

#### **Production**
```bash
NEXT_PUBLIC_CLUSTER=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
```

### **⚠️ Security Notes**

- **Never commit `.env.local`** to version control
- **Use different API keys** for development and production
- **Rotate API keys regularly** for production deployments
- **Keep your `.env.example`** file updated for contributors

5. **Build the Solana program**
```bash
cd programs/solana-twitter
anchor build
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

## 🧪 Testing Your Setup

### **1. Check RPC Connection**
```bash
# Test devnet connection
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1, "method":"getHealth"}' \
  https://api.devnet.solana.com
```

### **2. Verify Environment Variables**
```bash
# Check if all required vars are set
node -e "
const fs = require('fs');
const path = '.env.local';
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  console.log('✅ .env.local found');
  console.log('Required vars present:');
  console.log('PINATA_API_KEY:', content.includes('PINATA_API_KEY'));
  console.log('PINATA_SECRET_API_KEY:', content.includes('PINATA_SECRET_API_KEY'));
  console.log('NEXT_PUBLIC_CLUSTER:', content.includes('NEXT_PUBLIC_CLUSTER'));
} else {
  console.log('❌ .env.local not found');
}
"
```

### **3. Test Application**
```bash
npm run dev
```
- Open http://localhost:3000
- Try connecting a wallet
- Verify network shows as "devnet" in wallet

## 🌍 Environment Troubleshooting

### **Common Issues**

#### **RPC Connection Issues**
```bash
# Error: "Failed to connect to RPC"
# Solution: Check network connectivity and RPC URL

# Test RPC endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1, "method":"getVersion"}' \
  YOUR_RPC_URL
```

#### **IPFS Upload Issues**
```bash
# Error: "Failed to upload to IPFS"
# Solution: Verify Pinata API keys

# Test Pinata connection
curl -X GET \
  -H "pinata_api_key: YOUR_API_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET_KEY" \
  https://api.pinata.cloud/data/testAuthentication
```

#### **Wallet Connection Issues**
- Ensure you're on the correct network (devnet/mainnet)
- Clear browser cache and wallet data
- Try different wallet (Phantom, Solflare, etc.)

### **Environment Variable Validation**

Add this to your component for debugging:
```typescript
// Add to any component for debugging
console.log('Environment Check:', {
  cluster: process.env.NEXT_PUBLIC_CLUSTER,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  hasShyftKey: !!process.env.NEXT_PUBLIC_SHYFT_API_KEY,
  hasPinataKeys: !!(process.env.PINATA_API_KEY && process.env.PINATA_SECRET_API_KEY)
})
```

## 📁 Project Structure

```
solana-twitter/
├── client/                          # Next.js frontend application
│   ├── .env.example                 # Environment variables template
│   ├── .env.local                   # Your local environment (create this)
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
│   │   │   └── helpers.ts          # Helper functions (RPC config)
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
3. **Set up environment** (follow instructions above)
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with clear messages**
   ```bash
   git commit -m "feat: add dark mode toggle component"
   ```
7. **Push and create a Pull Request**

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
- [Pinata IPFS Documentation](https://docs.pinata.cloud/)
- [Shyft RPC Documentation](https://docs.shyft.to/)

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
- Shyft for enhanced RPC services
- The open-source community for inspiration and tools

---

**Ready to contribute?** Check out our [good first issues](https://github.com/yourusername/solana-twitter/labels/good%20first%20issue) and join the decentralized social media revolution! 🚀

*Made with ❤️ for Hacktoberfest 2024*