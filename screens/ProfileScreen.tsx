import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

// Shape of the current user data stored in AsyncStorage
type UserInfo = {
  name: string;
  email: string;
};

/**
 * ProfileScreen — Displays the logged-in user's name and email.
 *
 * Also provides a logout button that clears the session and
 * navigates back to the Login screen.
 */
export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<UserInfo | null>(null);

  // Load current user info when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const stored = await AsyncStorage.getItem('@notes_app_current_user');
          if (stored) {
            setUser(JSON.parse(stored));
          }
        } catch (error) {
          console.warn('Failed to load user info:', error);
        }
      };
      loadUser();
    }, [])
  );

  // Handle logout: clear current user session, navigate to Login
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            // Remove the current user session (keep user account & notes)
            await AsyncStorage.removeItem('@notes_app_current_user');
            // Navigate back to Login and reset the stack
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.warn('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* User Avatar Placeholder */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>👤 Name</Text>
          <Text style={styles.infoValue}>{user?.name ?? 'Loading...'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📧 Email</Text>
          <Text style={styles.infoValue}>{user?.email ?? 'Loading...'}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 3,
  },
  infoRow: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
