import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CharacterTheme } from '../../types';

interface AnimatedWindowProps {
  theme: CharacterTheme;
  children: React.ReactNode;
  isVisible: boolean;
  animationType?: 'slide' | 'roll' | 'fade' | 'scale';
  duration?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedWindow: React.FC<AnimatedWindowProps> = ({
  theme,
  children,
  isVisible,
  animationType = 'roll',
  duration = 800,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const rotateX = useRef(new Animated.Value(90)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      const animations = [];

      switch (animationType) {
        case 'roll':
          animations.push(
            Animated.parallel([
              Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 8,
              }),
              Animated.spring(rotateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.6,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'slide':
          animations.push(
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            })
          );
          break;

        case 'scale':
          animations.push(
            Animated.parallel([
              Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
              Animated.timing(opacity, {
                toValue: 1,
                duration: duration * 0.8,
                useNativeDriver: true,
              }),
            ])
          );
          break;

        case 'fade':
        default:
          animations.push(
            Animated.timing(opacity, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            })
          );
          break;
      }

      Animated.sequence(animations).start();
    } else {
      // Reset animations
      translateY.setValue(screenHeight);
      rotateX.setValue(90);
      scale.setValue(0.8);
      opacity.setValue(0);
    }
  }, [isVisible, animationType, duration]);

  const getTransform = () => {
    const transforms = [];

    if (animationType === 'roll') {
      transforms.push(
        { translateY },
        { 
          rotateX: rotateX.interpolate({
            inputRange: [0, 90],
            outputRange: ['0deg', '90deg'],
          }),
        }
      );
    } else if (animationType === 'slide') {
      transforms.push({ translateY });
    } else if (animationType === 'scale') {
      transforms.push({ scale });
    }

    return transforms;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: getTransform(),
        },
      ]}
    >
      <LinearGradient
        colors={theme.backgroundGradient as [string, string, ...string[]]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.content, { backgroundColor: theme.background + '90' }]}>
        {children}
      </View>
      
      {/* Decorative elements */}
      <View style={[styles.decorativeCorner, { backgroundColor: theme.accent }]} />
      <View style={[styles.decorativeCorner, styles.decorativeCornerBottom, { backgroundColor: theme.secondary }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
  },
  decorativeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 60,
    opacity: 0.3,
  },
  decorativeCornerBottom: {
    top: undefined,
    bottom: 0,
    right: undefined,
    left: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 60,
  },
});

export default AnimatedWindow;
