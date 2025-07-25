import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import ChatScreen from './src/screens/ChatScreen';
import CharacterSelectionScreen from './src/screens/CharacterSelectionScreen';
import { Character } from './src/types';
import { characters } from './src/utils/characters';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'Poppins-Regular': 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff',
          'Nunito-Regular': 'https://fonts.gstatic.com/s/nunito/v25/XRXV3I6Li01BKofINeaE.woff2',
          'Roboto-Regular': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
        });
        
        // Artificially delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleGoBack = () => {
    setSelectedCharacter(null);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {selectedCharacter ? (
          <ChatScreen selectedCharacter={selectedCharacter} onGoBack={handleGoBack} />
        ) : (
          <CharacterSelectionScreen onSelectCharacter={handleCharacterSelect} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
