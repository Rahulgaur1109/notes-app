import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import type { Note } from './HomeScreen';

// AsyncStorage key (same as HomeScreen)
const NOTES_KEY = '@notes_app_notes';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateNote'>;

/**
 * CreateNoteScreen — Lets users write and save a new note.
 *
 * The note text is appended to the existing notes array in AsyncStorage.
 * After saving, navigates back to the Home screen.
 */
export default function CreateNoteScreen({ navigation }: Props) {
  const [noteText, setNoteText] = useState('');

  // Save the new note to AsyncStorage and go back to Home
  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter some text for your note.');
      return;
    }

    try {
      // Create a new note object with a unique id and timestamp
      const newNote: Note = {
        id: Date.now().toString(),
        text: noteText.trim(),
        createdAt: new Date().toISOString(),
      };

      // Load existing notes from storage
      const stored = await AsyncStorage.getItem(NOTES_KEY);
      const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

      // Prepend the new note so it appears at the top of the list
      const updatedNotes = [newNote, ...existingNotes];

      // Save updated notes back to AsyncStorage
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));

      Alert.alert('Success', 'Note saved!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.warn('Failed to save note:', error);
      Alert.alert('Error', 'Could not save the note. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Instruction */}
        <Text style={styles.label}>What's on your mind?</Text>

        {/* Note Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Type your note here..."
          placeholderTextColor="#999"
          value={noteText}
          onChangeText={setNoteText}
          multiline
          textAlignVertical="top"
        />

        {/* Character Count */}
        <Text style={styles.charCount}>{noteText.length} characters</Text>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
          <Text style={styles.saveButtonText}>💾 Save Note</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 300,
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
