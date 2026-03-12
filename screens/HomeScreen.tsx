import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import NoteItem from '../components/NoteItem';

// Type for a single note
export type Note = {
  id: string;
  text: string;
  createdAt: string; // ISO date string
};

// AsyncStorage key for notes
const NOTES_KEY = '@notes_app_notes';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

/**
 * HomeScreen — Displays all saved notes in a scrollable list.
 *
 * Notes are loaded from AsyncStorage every time the screen is focused.
 * Users can delete notes or navigate to create new ones and view their profile.
 */
export default function HomeScreen({ navigation }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from AsyncStorage whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const stored = await AsyncStorage.getItem(NOTES_KEY);
          if (stored) {
            setNotes(JSON.parse(stored));
          } else {
            setNotes([]);
          }
        } catch (error) {
          console.warn('Failed to load notes:', error);
        }
      };
      loadNotes();
    }, [])
  );

  // Delete a note by id, update state and AsyncStorage
  const handleDeleteNote = async (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedNotes = notes.filter((note) => note.id !== id);
            setNotes(updatedNotes);
            await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
          } catch (error) {
            console.warn('Failed to delete note:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top action bar with Profile and Add Note buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>👤 Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateNote')}
        >
          <Text style={styles.addButtonText}>+ New Note</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List or Empty State */}
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No notes yet!</Text>
          <Text style={styles.emptySubtext}>
            Tap "+ New Note" to create your first note.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteItem note={item} onDelete={handleDeleteNote} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  profileButton: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#4A90D9',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
