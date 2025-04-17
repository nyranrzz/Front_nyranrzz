import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import MarketPanel from './src/screens/MarketPanel';
import BazaPanel from './src/screens/BazaPanel';
import InfoPanel from './src/screens/InfoPanel';
import * as Storage from './src/utils/storage';
import { colors } from './src/constants/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // This will pre-load any AsyncStorage data to ensure it's available
    const prepareApp = async () => {
      try {
        // Just access the stored data - actual routing is handled in LoginScreen
        await Storage.getStoredToken();
        await Storage.getStoredUserData();
      } catch (error) {
        console.error('Error preparing app:', error);
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MarketPanel" component={MarketPanel} />
        <Stack.Screen name="BazaPanel" component={BazaPanel} />
        <Stack.Screen name="InfoPanel" component={InfoPanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
