import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Note } from '../screens/HomeScreen';

type NoteItemProps = {
  note: Note;
  onDelete: (id: string) => void;
};

/**
 * NoteItem — Renders a single note card with its text, creation time,
 * and a delete button.
 *
 * Used inside a FlatList on the HomeScreen.
 */
export default function NoteItem({ note, onDelete }: NoteItemProps) {
  // Format the creation date into a readable string
  const formattedDate = new Date(note.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      {/* Note Text */}
      <Text style={styles.noteText}>{note.text}</Text>

      {/* Bottom row: timestamp and delete button */}
      <View style={styles.bottomRow}>
        <Text style={styles.timestamp}>🕒 {formattedDate}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(note.id)}
        >
          <Text style={styles.deleteButtonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#AAA',
  },
  deleteButton: {
    backgroundColor: '#FDE8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 13,
    fontWeight: '600',
  },
});
