# AI Character Chat App 🤖💬

A beautiful React Native mobile app that lets you chat with AI-powered characters featuring stunning 3D animations, personalized themes, and multilingual support.

## ✨ Features

### 🎭 Character System
- **Multiple Character Types**: Choose from Girlfriend, Bestie, or Friend personalities
- **Unique Personalities**: Each character has distinct conversation styles and responses
- **Custom Themes**: Character-specific color schemes and visual styling
- **3D Avatars**: Interactive 3D character representations with animations

### 💬 Chat Experience
- **Real-time Conversations**: Seamless chat interface with animated message bubbles
- **Voice Support**: Text-to-speech and speech-to-text capabilities
- **Regional Languages**: Support for English, Telugu, Tamil, Hindi, Kannada, Malayalam, and Bengali
- **Animated Responses**: Characters show visual reactions while speaking

### 🎨 Visual Design
- **Rolling Window Animations**: Smooth screen transitions with advanced animations
- **Dynamic Themes**: Color schemes that change based on selected character
- **Modern Typography**: Custom fonts for enhanced readability
- **Gradient Backgrounds**: Beautiful gradient overlays matching character themes

### 🚀 Technical Features
- **Three.js Integration**: Advanced 3D rendering and animations
- **React Native Reanimated**: High-performance native animations
- **TypeScript**: Full type safety and enhanced development experience
- **Responsive Design**: Optimized for various screen sizes and orientations

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: React Native Reanimated 3
- **UI Components**: Custom components with Material Design principles
- **Language**: TypeScript
- **Styling**: StyleSheet with Expo Linear Gradient
- **Navigation**: React Navigation 6
- **State Management**: React Hooks and Context API

## 📱 Screenshots

*Screenshots will be added once the app is running*

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-character-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

4. **Run on your preferred platform**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## 📁 Project Structure

```
ai-character-chat/
├── App.tsx                 # Main application component
├── src/
│   ├── components/
│   │   ├── Character3D/    # 3D character components
│   │   ├── Chat/          # Chat-related components
│   │   └── UI/            # Reusable UI components
│   ├── screens/           # Application screens
│   ├── types/             # TypeScript type definitions
│   ├── themes/            # Character themes and styling
│   └── utils/             # Utility functions and data
├── assets/                # App assets (fonts, images)
└── .github/              # GitHub configuration and docs
```

## 🎯 Available Characters

### 👩‍❤️‍👨 Girlfriend Characters
- **Maya**: Sweet, caring, and romantic
- **Priya**: Playful, affectionate, and supportive

### 🤗 Bestie Characters  
- **Alex**: Fun-loving, loyal, adventure buddy
- **Sara**: Energetic, supportive, full of good advice

### 🧠 Friend Characters
- **Rohan**: Calm, thoughtful, great for deep discussions
- **Kavya**: Creative, artistic, loves culture and art

## 🌐 Supported Languages

- English (EN)
- Telugu (TE) 
- Tamil (TA)
- Hindi (HI)
- Kannada (KN)
- Malayalam (ML)
- Bengali (BN)

## 🎨 Theme Customization

Each character comes with a unique theme including:
- **Primary & Secondary Colors**: Main interface colors
- **Accent Colors**: Highlight and interactive elements
- **Background Gradients**: Multi-color gradient backgrounds
- **Typography**: Character-specific font families
- **Chat Bubbles**: Custom styled message containers

## 🔧 Development

### Adding New Characters

1. Update `src/utils/characters.ts` with new character data
2. Create theme in `src/themes/characterThemes.ts`
3. Update type definitions in `src/types/index.ts`

### Customizing Animations

Animations are built using React Native Reanimated and Three.js:
- **Chat Animations**: Located in `src/components/Chat/`
- **3D Animations**: Located in `src/components/Character3D/`
- **UI Animations**: Located in `src/components/UI/`

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for amazing 3D capabilities
- React Native team for the excellent mobile framework
- Expo team for simplifying React Native development
- All contributors and testers

## 📞 Support

For support, email support@aicharacterchat.com or join our Discord community.

---

Made with ❤️ using React Native and Three.js
