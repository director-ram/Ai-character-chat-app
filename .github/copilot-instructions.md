<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Character Chat App - Development Guidelines

This is a React Native Expo project for an AI Character Chat App with 3D animations and multiple character personalities.

## Project Structure
- `/src/components/` - Reusable UI components including 3D characters, chat bubbles, and animated windows
- `/src/screens/` - Main application screens (Chat, Character Selection)
- `/src/types/` - TypeScript type definitions
- `/src/themes/` - Character-specific color themes and styling
- `/src/utils/` - Utility functions and character data

## Key Technologies
- **React Native with Expo** - Mobile app framework
- **Three.js with React Three Fiber** - 3D animations and character rendering
- **React Native Reanimated** - High-performance animations
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **TypeScript** - Type safety and better development experience

## Development Guidelines

### Character System
- Each character has a unique personality, voice settings, and color theme
- Character types: girlfriend, bestie, friend
- Themes include primary/secondary colors, gradients, and typography

### Animation Principles
- Use smooth spring animations for character interactions
- Implement rolling window effects for screen transitions
- Chat bubbles should have staggered animations for natural conversation flow
- 3D characters should have floating, breathing, and speaking animations

### UI/UX Guidelines
- Follow Material Design principles for Android and Human Interface Guidelines for iOS
- Use consistent color themes based on selected character
- Implement proper accessibility features
- Ensure responsive design for different screen sizes

### Code Standards
- Use TypeScript for all new components
- Follow React Native best practices
- Implement proper error handling
- Use async/await for asynchronous operations
- Comment complex animation logic

### Performance Considerations
- Optimize 3D rendering with proper LOD (Level of Detail)
- Use FlatList for chat messages to handle large conversations
- Implement proper memory management for animations
- Use native driver for animations when possible

## Features to Implement
- Voice input/output with regional language support
- Real-time chat with AI backend integration
- Character emotion system based on conversation context
- Customizable themes and settings
- Offline message caching
- Push notifications for character responses
