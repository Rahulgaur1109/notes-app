import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import all screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CreateNoteScreen from './screens/CreateNoteScreen';
import ProfileScreen from './screens/ProfileScreen';

// Define the navigation param list for type safety
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  CreateNote: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App — Root component for the Simple Notes App.
 *
 * Sets up React Navigation with a stack navigator.
 * Auth screens (Login, Signup) have no header.
 * Main screens (Home, CreateNote, Profile) use styled headers.
 */
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90D9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Auth Screens — no header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'My Notes',
            // Prevent going back to login with the back button
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="CreateNote"
          component={CreateNoteScreen}
          options={{ title: 'Create Note' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
