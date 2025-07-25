import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

import { Character } from '../types';
import { characters } from '../utils/characters';
import { girlfriendTheme, bestieTheme, friendTheme } from '../themes/characterThemes';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = 400;

interface CharacterSelectionScreenProps {
  onSelectCharacter: (character: Character) => void;
}

const CharacterCard: React.FC<{
  character: Character;
  index: number;
  onSelect: (character: Character) => void;
  isFocused: boolean;
}> = ({ character, index, onSelect, isFocused }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const cardScale = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withDelay(index * 200, withSpring(1));
    scale.value = withDelay(index * 200, withSpring(1));
  }, []);

  React.useEffect(() => {
    cardScale.value = withSpring(isFocused ? 1.05 : 1, { damping: 20, stiffness: 150 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * cardScale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.card,
          isFocused && styles.cardFocused,
        ]}
        onPress={() => onSelect(character)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={character.theme.backgroundGradient as [string, string, ...string[]]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{character.avatar}</Text>
          </View>
          
          <Text style={[styles.characterName, { color: character.theme.textPrimary }]}>
            {character.name}
          </Text>
          
          <View style={[styles.typeBadge, { backgroundColor: character.theme.primary }]}>
            <Text style={styles.typeText}>{character.type.toUpperCase()}</Text>
          </View>
          
          <Text style={[styles.personality, { color: character.theme.textSecondary }]}>
            {character.personality}
          </Text>
          
          <View style={styles.voiceInfo}>
            <Text style={[styles.voiceLabel, { color: character.theme.textSecondary }]}>
              Voice: {character.voice.language.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {/* Decorative elements */}
        <View style={[styles.decorativeCircle, { backgroundColor: character.theme.accent }]} />
        <View style={[styles.decorativeCircle2, { backgroundColor: character.theme.secondary }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const CharacterSelectionScreen: React.FC<CharacterSelectionScreenProps> = ({
  onSelectCharacter,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'girlfriend' | 'bestie' | 'friend'>('all');
  const [focusedCharacterIndex, setFocusedCharacterIndex] = useState(0);
  
  const scrollProgress = useSharedValue(0);
  const backgroundTransition = useSharedValue(0);

  const filteredCharacters = selectedType === 'all' 
    ? characters 
    : characters.filter(char => char.type === selectedType);

  // Get the currently focused character for background theming
  const focusedCharacter = filteredCharacters[focusedCharacterIndex] || filteredCharacters[0];

  // Animated background colors based on focused character
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(1, { damping: 25, stiffness: 120 }),
      transform: [
        {
          scale: withSpring(1, { damping: 25, stiffness: 120 })
        }
      ]
    };
  });

  // Create a more dynamic background transition effect
  const backgroundColors = React.useMemo(() => {
    return focusedCharacter?.theme.backgroundGradient || ['#667eea', '#764ba2', '#f093fb'];
  }, [focusedCharacter]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + 20));
    
    if (newIndex !== focusedCharacterIndex && newIndex >= 0 && newIndex < filteredCharacters.length) {
      setFocusedCharacterIndex(newIndex);
      backgroundTransition.value = withSpring(newIndex, { damping: 20, stiffness: 100 });
    }
  };

  const renderCharacter = ({ item, index }: { item: Character; index: number }) => (
    <CharacterCard
      character={item}
      index={index}
      onSelect={onSelectCharacter}
      isFocused={index === focusedCharacterIndex}
    />
  );

  // Reset focused character when filter changes
  React.useEffect(() => {
    setFocusedCharacterIndex(0);
    backgroundTransition.value = withSpring(0, { damping: 20, stiffness: 100 });
  }, [selectedType]);

  const getThemeForType = (type: typeof selectedType) => {
    switch (type) {
      case 'girlfriend': return girlfriendTheme;
      case 'bestie': return bestieTheme;
      case 'friend': return friendTheme;
      default: return { primary: '#667eea', secondary: '#764ba2' }; // Default for 'all'
    }
  };

  const TypeFilter: React.FC<{ type: typeof selectedType; label: string }> = ({ type, label }) => {
    const theme = getThemeForType(type);
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedType === type && [
            styles.filterButtonActive,
            { backgroundColor: theme.primary, borderColor: theme.secondary }
          ],
          selectedType !== type && type !== 'all' && {
            borderColor: theme.primary + '40', // 25% opacity
            backgroundColor: theme.primary + '10', // 6% opacity
          }
        ]}
        onPress={() => setSelectedType(type)}
      >
        <Text
          style={[
            styles.filterText,
            selectedType === type && styles.filterTextActive,
            selectedType !== type && type !== 'all' && { color: theme.primary }
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Animated Background that changes with focused character */}
      <Animated.View 
        style={[StyleSheet.absoluteFillObject, animatedBackgroundStyle]}
        key={`background-${focusedCharacter?.id || 'default'}`}
      >
        <LinearGradient
          colors={backgroundColors as [string, string, ...string[]]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Overlay for better text readability */}
      <View style={styles.backgroundOverlay} />

      {/* Decorative floating elements */}
      <View style={styles.decorativeElements}>
        <Animated.View 
          style={[
            styles.floatingElement, 
            styles.floatingElement1,
            { backgroundColor: focusedCharacter?.theme.accent + '30' || '#FFFFFF20' }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingElement, 
            styles.floatingElement2,
            { backgroundColor: focusedCharacter?.theme.secondary + '20' || '#FFFFFF15' }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingElement, 
            styles.floatingElement3,
            { backgroundColor: focusedCharacter?.theme.primary + '15' || '#FFFFFF10' }
          ]} 
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Choose Your AI Companion</Text>
        <Text style={styles.subtitle}>Select the perfect character for your conversations</Text>
      </View>

      <View style={styles.filterContainer}>
        <TypeFilter type="all" label="All" />
        <TypeFilter type="girlfriend" label="Girlfriend" />
        <TypeFilter type="bestie" label="Bestie" />
        <TypeFilter type="friend" label="Friend" />
      </View>

      <FlatList
        data={filteredCharacters}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={CARD_WIDTH + 20}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle overlay for better text readability
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF90',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF20',
    borderWidth: 1,
    borderColor: '#FFFFFF40',
  },
  filterButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#667eea',
  },
  listContainer: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2,
    paddingBottom: 50,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardFocused: {
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 20,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 40,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  personality: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  voiceInfo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF20',
  },
  voiceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.4,
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.6,
  },
  floatingElement1: {
    width: 120,
    height: 120,
    top: '15%',
    left: '10%',
  },
  floatingElement2: {
    width: 80,
    height: 80,
    top: '60%',
    right: '15%',
  },
  floatingElement3: {
    width: 100,
    height: 100,
    bottom: '20%',
    left: '20%',
  },
});

export default CharacterSelectionScreen;
