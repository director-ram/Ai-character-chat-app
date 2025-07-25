import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Message, CharacterTheme } from '../../types';

interface AnimatedChatBubbleProps {
  message: Message;
  theme: CharacterTheme;
  isVisible: boolean;
  animationDelay?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const AnimatedChatBubble: React.FC<AnimatedChatBubbleProps> = ({
  message,
  theme,
  isVisible,
  animationDelay = 0,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const isUser = message.sender === 'user';

  useEffect(() => {
    if (isVisible) {
      // Stagger animations for smooth appearance
      Animated.sequence([
        Animated.delay(animationDelay),
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 120,
            friction: 7,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isVisible, animationDelay]);

  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isUser ? 50 : -50, 0],
  });

  const bubbleStyle = {
    backgroundColor: isUser ? theme.chatBubbleUser : theme.chatBubbleCharacter,
    alignSelf: isUser ? 'flex-end' as const : 'flex-start' as const,
  };

  const textStyle = {
    color: isUser ? '#FFFFFF' : theme.textPrimary,
    fontFamily: theme.fontFamily,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: slideTransform },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.bubble, bubbleStyle]}>
        {!isUser && (
          <LinearGradient
            colors={[theme.secondary, theme.accent]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <Text style={[styles.text, textStyle]}>{message.text}</Text>
        <Text style={[styles.timestamp, { color: isUser ? '#FFFFFF80' : theme.textSecondary }]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {/* Message tail */}
      <View
        style={[
          styles.tail,
          {
            [isUser ? 'right' : 'left']: -5,
            backgroundColor: isUser ? theme.chatBubbleUser : theme.chatBubbleCharacter,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: screenWidth * 0.8,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  tail: {
    position: 'absolute',
    top: 15,
    width: 10,
    height: 10,
    transform: [{ rotate: '45deg' }],
  },
});

export default AnimatedChatBubble;
