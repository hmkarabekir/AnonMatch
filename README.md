# AnonMatch - Web3 Anonymous Matching Platform

A full-stack Web3 anonymous matching platform built with React, Tailwind CSS, JavaScript, and Soroban smart contracts on the Stellar blockchain. The platform features Freighter wallet integration, optional WebAuthn passkey authentication, user profile creation stored on-chain, anonymous posting, anonymous messaging with mutual consent reveal, and premium matching features.

## 🌟 Features

### Core Features
- **Anonymous Profiles**: Create profiles without revealing your identity
- **Secure Messaging**: End-to-end encrypted anonymous messaging
- **Smart Matching**: AI-powered matching with mutual consent reveal
- **Premium Features**: Advanced features for premium users
- **Blockchain Storage**: All data stored securely on Stellar blockchain

### Authentication
- **Freighter Wallet Integration**: Connect your Stellar wallet
- **WebAuthn Passkey Support**: Optional biometric authentication
- **Anonymous Identity**: Complete privacy protection

### Smart Contracts
- **UserProfileContract**: Manages user profiles and verification
- **PostContract**: Handles anonymous posts and interactions
- **MessagingContract**: Secure messaging with reveal controls
- **PremiumContract**: Premium subscription and feature management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Freighter wallet extension
- Modern browser with WebAuthn support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
blockchain/
├── app/                          # Next.js app directory
│   ├── components/               # React components
│   │   ├── ConnectWallet.jsx     # Wallet connection component
│   │   ├── PasskeyLogin.jsx      # WebAuthn authentication
│   │   ├── UserForm.jsx          # User profile form
│   │   ├── MessageBox.jsx        # Messaging interface
│   │   └── PostCard.jsx          # Post display component
│   ├── create/                   # Create post/profile page
│   ├── feed/                     # Anonymous feed page
│   ├── chats/                    # Messaging page
│   ├── settings/                 # User settings page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── smart_contracts/              # Soroban smart contracts
│   ├── UserProfileContract.rs    # User profile management
│   ├── PostContract.rs           # Post and interaction management
│   ├── MessagingContract.rs      # Secure messaging
│   ├── PremiumContract.rs        # Premium features
│   └── *_test.rs                 # Contract tests
├── components/                   # Legacy components
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # Project documentation
```

## 🔧 Smart Contracts

### UserProfileContract
Manages user profiles with the following features:
- Create and update anonymous profiles
- Profile verification system
- Interest-based search
- Profile privacy controls

### PostContract
Handles anonymous posting with:
- Create anonymous and public posts
- Like and comment functionality
- Tag-based search
- Post moderation

### MessagingContract
Secure messaging system featuring:
- End-to-end encrypted messages
- Mutual consent reveal mechanism
- Message threading
- Anonymous chat rooms

### PremiumContract
Premium subscription management:
- Tier-based subscriptions
- Feature access control
- Payment integration
- Analytics and insights

## 🎨 UI/UX Features

### Design System
- **Modern Glass Morphism**: Beautiful backdrop blur effects
- **Gradient Backgrounds**: Purple to blue gradient themes
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Optimized for dark environments
- **Smooth Animations**: CSS transitions and keyframes

### Components
- **ConnectWallet**: Freighter wallet integration
- **PasskeyLogin**: WebAuthn authentication
- **UserForm**: Profile creation and editing
- **MessageBox**: Real-time messaging interface
- **PostCard**: Rich post display with interactions

## 🔐 Security Features

### Privacy Protection
- **Anonymous Profiles**: No personal information required
- **Encrypted Messages**: End-to-end encryption
- **Blockchain Storage**: Decentralized data storage
- **Consent-Based Reveal**: Users control identity disclosure

### Authentication
- **Freighter Wallet**: Stellar blockchain authentication
- **WebAuthn Passkeys**: Biometric authentication
- **Multi-Factor Security**: Multiple authentication options

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Smart Contract Deployment
```bash
# Deploy to Stellar testnet
soroban contract deploy --network testnet --source <contract-name>

# Deploy to Stellar mainnet
soroban contract deploy --network mainnet --source <contract-name>
```

## 🧪 Testing

### Frontend Testing
```bash
npm test             # Run component tests
npm run test:watch   # Watch mode for tests
```

### Smart Contract Testing
```bash
# Run Rust tests
cargo test

# Run specific contract tests
cargo test --package user-profile-contract
```

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org/) for the blockchain infrastructure
- [Soroban](https://soroban.stellar.org/) for smart contract platform
- [Freighter](https://www.freighter.app/) for wallet integration
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For support and questions:
- Create an issue in the repository
- Join our Discord community
- Email: support@anonmatch.com

---

**Built with ❤️ on the Stellar blockchain** 