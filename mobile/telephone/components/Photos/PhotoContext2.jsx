import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créez un contexte pour la photo
export const PhotoContext = createContext();

// Créez un fournisseur de contexte
export const PhotoProvider = ({ children }) => {
  const [photo, setPhoto] = useState(require("./../../assets/Profile/profil.jpeg")); // Photo par défaut

  // Charger la photo sauvegardée au démarrage
  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const savedPhoto = await AsyncStorage.getItem('profilePhoto');
        if (savedPhoto) {
          setPhoto({ uri: savedPhoto }); // Mettre à jour l'état avec la photo sauvegardée
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la photo :", error);
      }
    };

    loadPhoto();
  }, []);

  return (
    <PhotoContext.Provider value={{ photo, setPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};