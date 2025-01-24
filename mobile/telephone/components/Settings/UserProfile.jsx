import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UserProfile = ({ profile, onEdit, onDelete }) => (
  <View style={styles.profileContainer}>
    <Text style={styles.label}>Prénom</Text>
    <Text style={styles.value}>{'profile.firstName'}</Text>

    <Text style={styles.label}>Nom</Text>
    <Text style={styles.value}>{'profile.lastName'}</Text>

    <Text style={styles.label}>Email</Text>
    <Text style={styles.value}>{'profile.email'}</Text>

    <Text style={styles.label}>Téléphone</Text>
    <Text style={styles.value}>{'profile.tel' || 'Non renseigné'}</Text>

    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={onEdit}>
      <Text style={styles.buttonText}>Modifier le profil</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
      <Text style={styles.buttonText}>Supprimer le compte</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  profileContainer: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
  },
  editButton: {
    backgroundColor: '#12b2a6',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserProfile;