import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Header from './Header';
import Profil from './Profil';

export default function Map() {
  // Déclaration de l'état en dehors de la fonction toggleProfil
  const [isProfilVisible, setProfilVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;  // Valeur d'animation initiale

  const toggleProfil = () => {
    setProfilVisible(!isProfilVisible); // Bascule l'état de visibilité du Profil

    // Animation de glissement à droite si le Profil est affiché, sinon à gauche
    Animated.timing(slideAnim, {
      toValue: isProfilVisible ? -300 : 0,  // Si Profil est visible, on le cache à -300
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.map}>
      {/* Header2 avec le bouton pour afficher/masquer le Profil */}
      <TouchableOpacity onPress={toggleProfil}>
        <Header />
      </TouchableOpacity>

      {/* Vue animée qui contient le Profil */}
      <Animated.View style={[styles.profilContainer, { transform: [{ translateX: slideAnim }] }]}>
        <Profil />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 700, 
        backgroundColor: 'red',
        top: -900,
       
      },
  profilContainer: {
    position: 'absolute',
    left: 0,  // Le composant commence à gauche
    top: 100,  // Ajuste la position verticale
    width: 300,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 5, // Ombre pour effet de profondeur
  },
});
