import React, { useState, useLayoutEffect } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assurez-vous d'avoir installé ce package
import { Checkbox } from 'react-native-paper'; // Assurez-vous d'avoir installé ce package
import { router, useNavigation } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Camera } from 'expo-camera'; // Assurez-vous d'avoir installé ce package
import * as ImagePicker from 'expo-image-picker'; // Assurez-vous d'avoir installé ce package
import TextRecognition from '@react-native-ml-kit/text-recognition'; // Assurez-vous d'avoir installé ce package

export default function Register() {
  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [civility, setCivility] = useState('');
  const [tel, setTel] = useState('');
  const [note, setNote] = useState('');

  // États pour les handicaps
  const [handicaps, setHandicaps] = useState({
    visuel: false,
    auditif: false,
    moteur: false,
    mental: false,
    autre: false,
  });
  const [autreHandicap, setAutreHandicap] = useState('');

  // État pour gérer l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);

  // État pour gérer l'affichage du modal du Picker
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  // États pour le scan de la carte d'identité
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  let camera;

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fonction pour formater la date de naissance
  const formatBirthdate = (text) => {
    let formattedText = text.replace(/[^0-9]/g, ''); // Supprime tout sauf les chiffres
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.slice(0, 5) + '/' + formattedText.slice(5, 9);
    }
    setBirthdate(formattedText);
  };

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour valider les champs de l'étape actuelle
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return firstName && lastName;
      case 2:
        return age && birthdate && civility;
      case 3:
        return tel && email;
      case 4:
        return true; // Note est optionnelle
      case 5:
        return password;
      default:
        return false;
    }
  };

  // Fonction pour gérer l'inscription
  const handleRegister = async () => {
    if (!firstName || !lastName || !age || !email || !password || !birthdate || !civility || !tel) {
      alert('Tous les champs sont obligatoires !');
      return;
    }

    if (isNaN(age) || age <= 0) {
      alert('Veuillez entrer un âge valide.');
      return;
    }

    if (isNaN(age) || age <= 18) {
      alert('Vous devez être majeur pour avoir un compte.');
      return;
    }

    if (!/\d{2}\/\d{2}\/\d{4}/.test(birthdate)) {
      alert('Veuillez entrer une date de naissance valide au format JJ/MM/AAAA.');
      return;
    }

    if (!/^\d{10}$/.test(tel)) {
      alert('Veuillez entrer un numéro de téléphone valide à 10 chiffres.');
      return;
    }

    try {
      // Étape 1 : Créer un utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Combiner `firstName` et `lastName`
      const fullName = `${firstName} ${lastName}`;

      // Étape 2 : Ajouter les informations dans Firestore
      const userDocRef = doc(db, 'users', user.uid); // Document avec UID de l'utilisateur
      await setDoc(userDocRef, {
        Name: fullName,
        Age: parseInt(age), // Convertir l'âge en nombre
        Email: email,
        Birthdate: birthdate,
        Civility: civility,
        Tel: tel,
        Note: note,
        Handicaps: {
          visuel: handicaps.visuel,
          auditif: handicaps.auditif,
          moteur: handicaps.moteur,
          mental: handicaps.mental,
          autre: handicaps.autre,
          autreHandicap: handicaps.autre ? autreHandicap : null,
        },
      });

      console.log('Utilisateur enregistré avec succès et ajouté à Firestore !');
      alert('Inscription réussie !');
      router.push('./Login'); // Redirige vers la page Login après inscription
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      alert('Erreur : ' + error.message);
    }
  };

  // Fonction pour scanner la carte d'identité
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraPermission) {
      const photo = await camera.takePictureAsync({ base64: true });
      processImage(photo.uri);
    } else {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la caméra.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      processImage(result.uri);
    }
  };

  const processImage = async (imageUri) => {
    try {
      const text = await TextRecognition.recognize(imageUri);
      const extractedData = extractDataFromText(text);
      setFirstName(extractedData.firstName);
      setLastName(extractedData.lastName);
      setBirthdate(extractedData.birthdate);
      setCivility(extractedData.gender);
      setIsCameraActive(false); // Fermer la caméra après le scan
    } catch (error) {
      console.error('Erreur lors de la reconnaissance du texte :', error);
      Alert.alert('Erreur', 'Impossible de lire la carte d\'identité.');
    }
  };

  const extractDataFromText = (text) => {
    const lines = text.split('\n');
    const data = {
      firstName: '',
      lastName: '',
      birthdate: '',
      gender: '',
    };

    // Exemple de logique pour extraire les informations
    lines.forEach((line) => {
      if (line.match(/^[A-Z]{2,}\s[A-Z]{2,}$/)) {
        const [lastName, firstName] = line.split(' ');
        data.firstName = firstName;
        data.lastName = lastName;
      } else if (line.match(/\d{2}\/\d{2}\/\d{4}/)) {
        data.birthdate = line;
      } else if (line.match(/^(M|F)$/)) {
        data.gender = line === 'M' ? 'Mr' : 'Mme';
      }
    });

    return data;
  };

  // Fonction pour afficher l'étape actuelle
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 1 : Informations personnelles</Text>
            {isCameraActive ? (
              <Camera style={styles.camera} ref={(ref) => (camera = ref)}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <Text style={styles.captureButtonText}>Prendre une photo</Text>
                </TouchableOpacity>
              </Camera>
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={() => setIsCameraActive(true)}>
                  <Text style={styles.buttonText}>Scanner la carte d'identité</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  placeholderTextColor="#888"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  placeholderTextColor="#888"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </>
            )}
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 2 : Informations supplémentaires</Text>
            <TextInput
              style={styles.input}
              placeholder="Âge"
              placeholderTextColor="#888"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (JJ/MM/AAAA)"
              placeholderTextColor="#888"
              value={birthdate}
              onChangeText={formatBirthdate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setIsPickerVisible(true)}
            >
              <Text style={{ color: civility ? 'white' : '#888' }}>
                {civility || 'Civilité'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 3 : Coordonnées</Text>
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              placeholderTextColor="#888"
              value={tel}
              onChangeText={setTel}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 4 : Handicaps</Text>
            <View style={styles.checkboxContainer}>
              {Object.keys(handicaps).map((key) => (
                <View key={key} style={styles.checkboxItem}>
                  <Checkbox
                    status={handicaps[key] ? 'checked' : 'unchecked'}
                    onPress={() => setHandicaps({ ...handicaps, [key]: !handicaps[key] })}
                    color="#12B3A8"
                  />
                  <Text style={styles.checkboxLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
            {handicaps.autre && (
              <TextInput
                style={styles.input}
                placeholder="Précisez votre handicap"
                placeholderTextColor="#888"
                value={autreHandicap}
                onChangeText={setAutreHandicap}
              />
            )}
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 5 : Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/images/CMF_1.webp')}
          style={styles.logo}
        />
        <Text style={styles.text}>Créer un compte</Text>

        {/* Afficher l'étape actuelle */}
        {renderStep()}

        {/* Boutons de navigation */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Text style={styles.navButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          {currentStep < 5 ? (
            <TouchableOpacity style={styles.navButton} onPress={nextStep}>
              <Text style={styles.navButtonText}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Modal pour le Picker de civilité */}
      <Modal
        transparent={true}
        visible={isPickerVisible}
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={civility}
                onValueChange={(itemValue) => {
                  setCivility(itemValue);
                  setIsPickerVisible(false);
                }}
              >
                <Picker.Item label="Mr" value="Mr" />
                <Picker.Item label="Mme" value="Mme" />
                <Picker.Item label="Autre" value="Autre" />
              </Picker>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192031',
    paddingVertical: 20,
  },
  logo: {
    width: 300,
    height: 320,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
  },
  stepContainer: {
    width: '90%',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C3A4A',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  navButton: {
    width: '45%',
    height: 50,
    backgroundColor: '#12B3A8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#12B3A8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2C3A4A',
    borderRadius: 12,
    padding: 16,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  captureButtonText: {
    color: '#000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});