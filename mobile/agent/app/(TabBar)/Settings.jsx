import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router'; // Importer router
import { auth } from '../authentication/firebaseConfig'; // Import Firebase Auth
import { signOut } from 'firebase/auth'; // Import de la fonction signOut

export default function Setting() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Utilisateur déconnecté avec succès !');
      router.replace('/'); // Chemin absolu vers la page d'accueil
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
      <Link href="../">
        <Text>Go to interface</Text>
      </Link>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#808080",
  },
  text: {
    fontSize: 16,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#4B0082',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});