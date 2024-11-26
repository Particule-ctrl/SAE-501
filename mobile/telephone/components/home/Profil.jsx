// Profil.jsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Profil() {
  return (
    <View style={styles.profilContainer}>
      <Text style={styles.profilText}>Hello, je suis le profil !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profilContainer: {
    flex: 1,
    justifyContent: 'center', // Centrer verticalement le contenu
    alignItems: 'center', // Centrer horizontalement le contenu
    backgroundColor: '#f0f0f0', // Couleur de fond gris clair
    borderRadius: 10, // Ajoute des coins arrondis
    padding: 20,
    elevation: 10, // Ombre pour un effet de profondeur
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  profilText: {
    fontSize: 18,
    color: '#333', // Couleur de texte gris foncé
    fontWeight: 'bold', // Texte en gras
  },
});
