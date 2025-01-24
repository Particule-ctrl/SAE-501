import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Pour sélectionner une image ou prendre une photo
import * as FileSystem from 'expo-file-system'; // Pour gérer les fichiers
import * as MediaLibrary from 'expo-media-library'; // Pour enregistrer dans la galerie
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour persister la photo
import { PhotoContext } from './PhotoContext2'; // Importez le contexte

const PhotoButton = () => {
  const { photo, setPhoto } = useContext(PhotoContext); // Utilisez le contexte

  // Chemin du dossier Photos dans le répertoire de documents de l'application
  const photosFolderPath = `${FileSystem.documentDirectory}Photos/`;

  // Fonction pour vérifier si un fichier existe
  const checkIfFileExists = async (filePath) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      return fileInfo.exists; // Retourne true si le fichier existe
    } catch (error) {
      console.error("Erreur lors de la vérification du fichier :", error);
      return false;
    }
  };

  // Fonction pour sauvegarder l'image dans le stockage local
  const savePhotoToStorage = async (filePath) => {
    try {
      await AsyncStorage.setItem('profilePhoto', filePath); // Sauvegarder le chemin de la photo
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la photo :", error);
    }
  };

  // Fonction pour charger la photo depuis le stockage local
  const loadPhotoFromStorage = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem('profilePhoto');
      if (savedPhoto) {
        setPhoto({ uri: savedPhoto }); // Mettre à jour l'état avec la photo sauvegardée
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la photo :", error);
    }
  };

  // Fonction pour enregistrer l'image dans la galerie
  const saveImageToGallery = async (filePath) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert("Désolé, nous avons besoin de la permission d'accéder à la galerie pour enregistrer l'image.");
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(filePath);
      await MediaLibrary.createAlbumAsync('Photos', asset, false);
      console.log("Image enregistrée dans la galerie :", filePath);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'image dans la galerie :", error);
    }
  };

  // Charger la photo au démarrage
  React.useEffect(() => {
    loadPhotoFromStorage();
  }, []);

  // Fonction pour ouvrir la galerie ou l'appareil photo
  const pickImage = async (source) => {
    // Demander la permission d'accéder à la galerie ou à l'appareil photo
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Désolé, nous avons besoin de la permission d'accéder à la galerie ou à l'appareil photo pour continuer.");
      return;
    }

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Seulement les images
        allowsEditing: true, // Permettre à l'utilisateur de recadrer l'image
        aspect: [1, 1], // Ratio carré
        quality: 1, // Qualité maximale
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Seulement les images
        allowsEditing: true, // Permettre à l'utilisateur de recadrer l'image
        aspect: [1, 1], // Ratio carré
        quality: 1, // Qualité maximale
      });
    }

    // Si l'utilisateur a sélectionné ou pris une photo
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;

      // Nom unique pour l'image
      const fileName = `profile_${Date.now()}.jpg`;
      const filePath = `${photosFolderPath}${fileName}`;

      try {
        // Créer le dossier Photos s'il n'existe pas
        await FileSystem.makeDirectoryAsync(photosFolderPath, { intermediates: true });

        // Copier l'image sélectionnée dans le dossier Photos
        await FileSystem.copyAsync({
          from: selectedImage,
          to: filePath,
        });

        // Vérifier si le fichier existe
        const fileExists = await checkIfFileExists(filePath);

        if (fileExists) {
          setPhoto({ uri: filePath }); // Mettre à jour l'état avec la nouvelle image
          await savePhotoToStorage(filePath); // Sauvegarder le chemin de la photo
          console.log("Image sauvegardée et affichée :", filePath);

          // Enregistrer l'image dans la galerie publique
          await saveImageToGallery(filePath);
        } else {
          console.error("Le fichier n'existe pas :", filePath);
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'image :", error);
      }
    }
  };

  // Fonction pour supprimer la photo
  const deletePhoto = async () => {
    try {
      await AsyncStorage.removeItem('profilePhoto'); // Supprimer la photo du stockage local
      setPhoto(require("./../../assets/Profile/profil.jpeg")); // Revenir à la photo par défaut
      console.log("Photo supprimée et remplacée par la photo par défaut.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo :", error);
    }
  };

  // Fonction pour afficher une alerte avec les options
  const showOptions = () => {
    Alert.alert(
      "Modifier la photo de profil",
      "Choisissez une option :",
      [
        {
          text: "Prendre une photo",
          onPress: () => pickImage('camera'),
        },
        {
          text: "Choisir dans la galerie",
          onPress: () => pickImage('gallery'),
        },
        {
          text: "Supprimer la photo",
          onPress: deletePhoto,
          style: "destructive",
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={showOptions}>
      <Text style={styles.buttonText}>Modifier</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#192031',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default PhotoButton;