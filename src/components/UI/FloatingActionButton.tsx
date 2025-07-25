import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CharacterTheme } from '../../types';

interface FloatingActionButtonProps {
  theme: CharacterTheme;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  isVisible?: boolean;
  size?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  theme,
  icon,
  onPress,
  position = 'bottom-right',
  isVisible = true,
  size = 56,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }).start();
    }
  }, [isVisible]);

  const handlePress = () => {
    // Rotation animation on press
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const getPositionStyles = () => {
    const styles: any = { position: 'absolute' };
    
    switch (position) {
      case 'bottom-right':
        styles.bottom = 24;
        styles.right = 24;
        break;
      case 'bottom-left':
        styles.bottom = 24;
        styles.left = 24;
        break;
      case 'top-right':
        styles.top = 60;
        styles.right = 24;
        break;
      case 'top-left':
        styles.top = 60;
        styles.left = 24;
        break;
    }
    
    return styles;
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        getPositionStyles(),
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotation },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.primary,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={size * 0.4}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default FloatingActionButton;
