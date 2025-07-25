import { CharacterTheme } from '../types';

export const girlfriendTheme: CharacterTheme = {
  primary: '#FF1493', // Deep Hot Pink
  secondary: '#FF69B4', // Hot Pink
  accent: '#FFB6C1', // Light Pink
  background: '#FFF0F5', // Lavender Blush
  backgroundGradient: ['#FF1493', '#FF69B4', '#FFCCCB', '#FFF0F5'], // Hot pink gradient
  textPrimary: '#8B0026', // Dark Red
  textSecondary: '#C71585', // Medium Violet Red
  chatBubbleUser: '#FF1493',
  chatBubbleCharacter: '#FFB6C1',
  fontFamily: 'Poppins-Regular',
};

export const bestieTheme: CharacterTheme = {
  primary: '#FF6347', // Tomato (energetic and fun)
  secondary: '#FFD700', // Gold (bright and cheerful)
  accent: '#FFA500', // Orange (warm and friendly)
  background: '#FFFACD', // Lemon Chiffon
  backgroundGradient: ['#FF6347', '#FFD700', '#FFA500', '#FFFACD'], // Warm energetic gradient
  textPrimary: '#8B4513', // Saddle Brown
  textSecondary: '#CD853F', // Peru
  chatBubbleUser: '#FF6347',
  chatBubbleCharacter: '#FFA500',
  fontFamily: 'Nunito-Regular',
};

export const friendTheme: CharacterTheme = {
  primary: '#1E90FF', // Dodger Blue (friendly and calm)
  secondary: '#87CEEB', // Sky Blue (light and peaceful)
  accent: '#ADD8E6', // Light Blue (soft and approachable)
  background: '#F0F8FF', // Alice Blue (very light blue background)
  backgroundGradient: ['#1E90FF', '#87CEEB', '#ADD8E6', '#F0F8FF'], // Light blue gradient
  textPrimary: '#191970', // Midnight Blue (strong contrast)
  textSecondary: '#4682B4', // Steel Blue (medium contrast)
  chatBubbleUser: '#1E90FF',
  chatBubbleCharacter: '#ADD8E6',
  fontFamily: 'Roboto-Regular',
};

export const themes = {
  girlfriend: girlfriendTheme,
  bestie: bestieTheme,
  friend: friendTheme,
};

export const getThemeByCharacterType = (type: 'girlfriend' | 'bestie' | 'friend'): CharacterTheme => {
  return themes[type];
};
