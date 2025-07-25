import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import Character3D from '../components/Character3D/Character3D';
import AnimatedChatBubble from '../components/Chat/AnimatedChatBubble';
import AnimatedWindow from '../components/UI/AnimatedWindow';
import FloatingActionButton from '../components/UI/FloatingActionButton';
import { Character, Message } from '../types';
import { characters } from '../utils/characters';

const { height: screenHeight } = Dimensions.get('window');

interface ChatScreenProps {
  selectedCharacter?: Character;
  onGoBack?: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ selectedCharacter = characters[0], onGoBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi there! I'm ${selectedCharacter.name}. How are you doing today? 😊`,
      sender: 'character',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // Keyboard handling with animated values
  const keyboardHeight = useSharedValue(0);
  const inputContainerOffset = useSharedValue(0);

  useEffect(() => {
    // Simulate character speaking animation
    const timer = setTimeout(() => {
      setIsCharacterSpeaking(true);
      setTimeout(() => setIsCharacterSpeaking(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard handling effect
  useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      const height = e.endCoordinates.height;
      keyboardHeight.value = withSpring(height, {
        damping: 20,
        stiffness: 100,
      });
      // Adjust input container to stay above keyboard with some padding
      inputContainerOffset.value = withSpring(-height + 20, {
        damping: 20,
        stiffness: 100,
      });
    };

    const keyboardWillHide = () => {
      keyboardHeight.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
      // Return input container to original position
      inputContainerOffset.value = withSpring(0, {
        damping: 20,
        stiffness: 100,
      });
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate character response
    setTimeout(() => {
      setIsCharacterSpeaking(true);
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getCharacterResponse(inputText, selectedCharacter),
        sender: 'character',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, characterResponse]);
      setTimeout(() => setIsCharacterSpeaking(false), 1500);
    }, 1000);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getCharacterResponse = (userInput: string, character: Character): string => {
    const responses = {
      girlfriend: [
        "That's so sweet of you to say! 💕",
        "I love talking with you about this! 😍",
        "You always know how to make me smile! 🥰",
        "Tell me more, I'm really interested! 💖",
      ],
      bestie: [
        "OMG yes! I totally agree! 🤩",
        "That's so cool! Tell me everything! 😄",
        "You're the best! This is so fun! 🎉",
        "I'm so excited about this! Let's do it! 🚀",
      ],
      friend: [
        "That's really interesting! I'd love to hear more.",
        "Great point! I hadn't thought of it that way.",
        "Thanks for sharing that with me. What else?",
        "That sounds fascinating! How did you discover that?",
      ],
    };

    const characterResponses = responses[character.type];
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  const toggleChatView = () => {
    setShowChat(!showChat);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <AnimatedChatBubble
      message={item}
      theme={selectedCharacter.theme}
      isVisible={true}
      animationDelay={index * 100}
    />
  );

  // Animated style for the input container
  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputContainerOffset.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={selectedCharacter.theme.backgroundGradient as [string, string, ...string[]]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header with Back Button */}
      <View style={styles.header}>
        {onGoBack && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: selectedCharacter.theme.secondary + '20' }]}
            onPress={onGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={selectedCharacter.theme.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: selectedCharacter.theme.textPrimary }]}>
            {selectedCharacter.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: selectedCharacter.theme.textSecondary }]}>
            Your {selectedCharacter.type}
          </Text>
        </View>
      </View>

      {!showChat ? (
        // 3D Character View
        <View style={styles.characterContainer}>
          <Character3D
            character={selectedCharacter}
            isAnimating={isCharacterSpeaking}
          />
          <View style={styles.characterInfo}>
            <Text style={[styles.characterName, { color: selectedCharacter.theme.textPrimary }]}>
              {selectedCharacter.name}
            </Text>
            <Text style={[styles.characterType, { color: selectedCharacter.theme.textSecondary }]}>
              Your {selectedCharacter.type}
            </Text>
            <Text style={[styles.characterPersonality, { color: selectedCharacter.theme.textSecondary }]}>
              {selectedCharacter.personality}
            </Text>
          </View>
        </View>
      ) : (
        // Chat View
        <AnimatedWindow
          theme={selectedCharacter.theme}
          isVisible={showChat}
          animationType="roll"
        >
          <View style={styles.chatContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
          
          <Animated.View style={animatedInputStyle}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >
              <View style={[styles.inputContainer, { backgroundColor: selectedCharacter.theme.background }]}>
                <TouchableOpacity
                  style={[styles.voiceButton, { backgroundColor: selectedCharacter.theme.secondary }]}
                  onPress={() => console.log('Voice input')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={20} color={selectedCharacter.theme.textPrimary} />
                </TouchableOpacity>
                
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: selectedCharacter.theme.textPrimary,
                      borderColor: selectedCharacter.theme.secondary,
                    },
                  ]}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type your message..."
                  placeholderTextColor={selectedCharacter.theme.textSecondary}
                  multiline
                  maxLength={500}
                />
                
                <TouchableOpacity
                  style={[
                    styles.sendButton, 
                    { 
                      backgroundColor: inputText.trim() === '' 
                        ? selectedCharacter.theme.secondary + '60' 
                        : selectedCharacter.theme.primary 
                    }
                  ]}
                  onPress={sendMessage}
                  disabled={inputText.trim() === ''}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() === '' ? selectedCharacter.theme.textSecondary : "#FFFFFF"} 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </AnimatedWindow>
      )}

      {/* Floating Action Buttons */}
      <FloatingActionButton
        theme={selectedCharacter.theme}
        icon={showChat ? "person" : "chatbubbles"}
        onPress={toggleChatView}
        position={showChat ? "top-right" : "bottom-right"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterInfo: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  characterName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  characterType: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  characterPersonality: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default ChatScreen;
