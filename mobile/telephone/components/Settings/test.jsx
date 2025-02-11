import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import EditProfile from './EditProfile';
import UserProfile from './UserProfile';

export default function Test() {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSignOut = () => {
    console.log('Utilisateur déconnecté'); // Remplacez cette ligne par la logique de déconnexion
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <EditProfile />
      ) : (
        <UserProfile />
      )}
      <Button mode="contained" onPress={toggleEditing} style={styles.toggleButton}>
        {isEditing ? 'Voir le Profil' : 'Modifier le Profil'}
      </Button>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  toggleButton: {
    marginVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
