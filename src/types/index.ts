export interface Character {
  id: string;
  name: string;
  type: 'girlfriend' | 'bestie' | 'friend';
  personality: string;
  avatar: string;
  voice: {
    language: string;
    accent: string;
    pitch: number;
    speed: number;
  };
  theme: CharacterTheme;
}

export interface CharacterTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundGradient: string[];
  textPrimary: string;
  textSecondary: string;
  chatBubbleUser: string;
  chatBubbleCharacter: string;
  fontFamily: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
  audioUrl?: string;
  language?: string;
}

export interface VoiceSettings {
  language: string;
  accent: string;
  pitch: number;
  speed: number;
  enabled: boolean;
}

export interface UserPreferences {
  selectedCharacter: string;
  voiceSettings: VoiceSettings;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoTranslate: boolean;
}

export type SupportedLanguage = 
  | 'en' 
  | 'te' 
  | 'ta' 
  | 'hi' 
  | 'kn' 
  | 'ml' 
  | 'bn';

export interface AnimationConfig {
  duration: number;
  easing: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
}
