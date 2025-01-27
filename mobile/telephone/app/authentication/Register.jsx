import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper';
import { router, useNavigation } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { CameraView as ExpoCamera, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function Register() {
  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [civility, setCivility] = useState('');
  const [tel, setTel] = useState('');
  const [note, setNote] = useState('');


  // address ip 
  const ipaddress = '192.168.1.29';

  // États pour la caméra
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  // États pour les handicaps
  const [handicaps, setHandicaps] = useState({
    visuel: false,
    auditif: false,
    moteur: false,
    mental: false,
    autre: false,
  });
  const [autreHandicap, setAutreHandicap] = useState('');

  // États pour l'accompagnateur
  const [hasAccompagnateur, setHasAccompagnateur] = useState(false);
  const [accompagnateurInfo, setAccompagnateurInfo] = useState({
    firstName: '',
    lastName: '',
    age: '',
    birthdate: '',
    civility: ''
  });

  // État pour gérer l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);

  // État pour gérer l'affichage des modals
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isAccompagnateurPickerVisible, setIsAccompagnateurPickerVisible] = useState(false);

  const navigation = useNavigation();


  // Masquer l'en-tête de la navigation
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await useCameraPermissions();
      setHasPermission(status === 'granted');
    })();
  }, []);

 

  // Fonction pour formater la date de naissance
  const formatBirthdate = (text) => {
    let formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.slice(0, 5) + '/' + formattedText.slice(5, 9);
    }
    return formattedText;
  };

  const formatISOBirthdate = (text) => {
    let birthdateArray = birthdate.split('/');
    const jour = birthdateArray[0].padStart(2, '0');
    const mois = birthdateArray[1].padStart(2, '0');
    const annee = birthdateArray[2];

    // Retourne la date au format AAAA-MM-JJ
    return `${annee}-${mois}-${jour}`;
  }

  // Fonction pour gérer l'activation de la caméra
  const handleScanPress = async () => {
    try {
      if (!permission?.granted) {
        const { status } = await requestPermission();
        if (status === 'granted') {
          setHasPermission(true);
          setCameraActive(true);
        } else {
          Alert.alert(
            "Permission refusée",
            "L'accès à la caméra est nécessaire pour scanner votre carte d'identité.",
            [
              { text: "Réessayer", onPress: handleScanPress },
              { text: "Annuler", style: "cancel" }
            ]
          );
        }
      } else {
        setHasPermission(true);
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      Alert.alert("Erreur", "Impossible d'accéder à la caméra. Veuillez vérifier vos paramètres.");
    }
  };

  // Fonction pour extraire les informations du texte
  const extractInfoFromText = (text) => {
    const lines = text.split('\n').map(line => line.trim());
    let result = {
      firstName: '',
      lastName: '',
      birthdate: '',
      civility: '',
      found: false
    };
  
    let foundNames = [];
    
    lines.forEach((line) => {
      console.log("Analysing line:", line); // Pour le débogage
  
      // Recherche de la date de naissance (format JJ/MM/AAAA ou JJ MM AAAA)
      const dateMatch = line.match(/(\d{2}[/.]\d{2}[/.]\d{4}|\d{2}\s+\d{2}\s+\d{4})/);
      if (dateMatch) {
        result.birthdate = dateMatch[1].replace(/\s+/g, '/');
        result.found = true;
        console.log("Found birthdate:", result.birthdate);
      }
  
      // Recherche des noms (en majuscules)
      if (/^[A-ZÀ-Ÿ\s-]{2,}$/.test(line) && 
          !line.includes('CARTE') && 
          !line.includes('IDENTITE')) {
        foundNames.push(line.trim());
        console.log("Found name:", line.trim());
      }
  
      // Recherche du genre (M/F)
      if (/^[MF]$/.test(line.trim())) {
        result.civility = line.trim() === 'M' ? 'Mr' : 'Mme';
        result.found = true;
        console.log("Found civility:", result.civility);
      }
    });
  
    // Attribution des noms trouvés
    if (foundNames.length >= 2) {
      result.lastName = foundNames[0];
      result.firstName = foundNames[1];
      result.found = true;
    }
  
    return result;
  };

  // Fonction pour prendre la photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Prendre la photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
  
        console.log("Photo prise, début de la reconnaissance...");
  
        // Reconnaissance du texte
        const result = await TextRecognition.recognize(photo.uri);
        console.log("Texte reconnu :", result.text);
  
        // Extraire les informations
        const extractedInfo = extractInfoFromText(result.text);
        
        if (extractedInfo.found) {
          Alert.alert(
            "Informations trouvées",
            `Nom: ${extractedInfo.lastName}\nPrénom: ${extractedInfo.firstName}\nDate de naissance: ${extractedInfo.birthdate}\nCivilité: ${extractedInfo.civility}\n\nVoulez-vous utiliser ces informations ?`,
            [
              {
                text: "Oui",
                onPress: () => {
                  setFirstName(extractedInfo.firstName);
                  setLastName(extractedInfo.lastName);
                  setBirthdate(extractedInfo.birthdate);
                  setCivility(extractedInfo.civility);
                  setCameraActive(false);
                }
              },
              {
                text: "Non",
                style: "cancel",
                onPress: () => setCameraActive(false)
              }
            ]
          );
        } else {
          Alert.alert(
            "Attention",
            "Aucune information n'a pu être extraite de l'image. Veuillez réessayer avec une photo plus nette ou remplir les champs manuellement.",
            [{ text: "OK" }]
          );
        }
  
      } catch (error) {
        console.error("Erreur lors de la prise de photo :", error);
        Alert.alert(
          "Erreur",
          "Impossible de traiter l'image. Veuillez réessayer."
        );
      }
    }
  };

  // Fonction pour valider l'étape actuelle
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
        return password && confirmPassword && password === confirmPassword && password.length >= 8;
      case 6:
        if (hasAccompagnateur) {
          return accompagnateurInfo.firstName && 
                 accompagnateurInfo.lastName && 
                 accompagnateurInfo.age && 
                 accompagnateurInfo.birthdate && 
                 accompagnateurInfo.civility;
        }
        return true;
      default:
        return false;
    }
  };

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour gérer l'inscription
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (!firstName || !lastName || !age || !email || !password || !birthdate || !civility || !tel) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires !');
      return;
    }

    if (hasAccompagnateur) {
      const { firstName, lastName, age, birthdate, civility } = accompagnateurInfo;
      if (!firstName || !lastName || !age || !birthdate || !civility) {
        Alert.alert('Erreur', 'Tous les champs de l\'accompagnateur sont obligatoires !');
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const accompagnateurData = hasAccompagnateur ? {
        firstName: accompagnateurInfo.firstName,
        lastName: accompagnateurInfo.lastName,
        age: parseInt(accompagnateurInfo.age),
        birthdate: formatISOBirthdate(accompagnateurInfo.birthdate),
        civility: accompagnateurInfo.civility
      } : null;

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        firstName: firstName, // Prénom
        lastName: lastName,   // Nom de famille
        Age: parseInt(age),
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
        Accompagnateur: accompagnateurData,
      });

      try{
        const response = await fetch(`http://${ipaddress}/api/user`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
          },
          body: JSON.stringify({
            firstname: firstName,
            lastname: lastName,
            birthdate: formatISOBirthdate(birthdate),
            email,
            tel,
            password,
            civility,
            note,
            handicap: 1,
            googleUUID: user.uid,
          })
        });
        console.log('Status: ',response.status)
        if (!response.ok) {
          console.error(`Failed with status ${response.status}: ${response.statusText}: ${response.body}`);
        }
        else{
          console.log(`Data sent successfully to API:`);
        }
      }
      catch (error){
        console.error(`Error sending data to API:`, error.message);
    }
      

      console.log('Utilisateur enregistré avec succès et ajouté à Firestore !');
      alert('Inscription réussie !');
      router.push('./Login'); // Redirige vers la page Login après inscription
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      Alert.alert('Erreur', error.message);
    }
  };

  // Fonction pour afficher l'étape actuelle
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 1 : Informations personnelles</Text>
            {cameraActive ? (
              <ExpoCamera
                ref={cameraRef}
                style={styles.cameraContainer}
                type="back"
                onMountError={(error) => {
                  console.error("Erreur montage caméra:", error);
                }}
              >
                {hasPermission && (
                  <View style={styles.overlay}>
                    <View style={styles.frame} />
                    <Text style={styles.instructionText}>
                      Positionnez votre carte d'identité dans le cadre
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity 
                        style={styles.captureButton}
                        onPress={takePicture}
                      >
                        <Text style={styles.captureButtonText}>Prendre la photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => {
                          setCameraActive(false);
                          setHasPermission(false);
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {!hasPermission && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Permission de caméra non accordée</Text>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={handleScanPress}
                    >
                      <Text style={styles.buttonText}>Réessayer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ExpoCamera>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={handleScanPress}
                >
                  <Text style={styles.scanButtonText}>Scanner la carte d'identité</Text>
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
                <TextInput
                  style={styles.input}
                  placeholder="Date de naissance (JJ/MM/AAAA)"
                  placeholderTextColor="#888"
                  value={birthdate}
                  onChangeText={(text) => setBirthdate(formatBirthdate(text))}
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
              </>
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 2 : Coordonnées</Text>
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

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 3 : Handicaps</Text>
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

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 4 : Note complémentaire</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes supplémentaires (optionnel)"
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
            />
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 5 : Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="#888" 
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Étape 6 : Accompagnateur</Text>
            <View style={styles.accompagnateurChoice}>
              <Text style={styles.questionText}>Avez-vous un accompagnateur ?</Text>
              <View style={styles.choiceButtons}>
                <TouchableOpacity 
                  style={[styles.choiceButton, hasAccompagnateur && styles.choiceButtonActive]}
                  onPress={() => setHasAccompagnateur(true)}
                >
                  <Text style={styles.choiceButtonText}>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.choiceButton, !hasAccompagnateur && styles.choiceButtonActive]}
                  onPress={() => setHasAccompagnateur(false)}
                >
                  <Text style={styles.choiceButtonText}>Non</Text>
                </TouchableOpacity>
              </View>
            </View>

            {hasAccompagnateur && (
              <View style={styles.accompagnateurForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom de l'accompagnateur"
                  placeholderTextColor="#888"
                  value={accompagnateurInfo.firstName}
                  onChangeText={(text) => setAccompagnateurInfo({...accompagnateurInfo, firstName: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nom de l'accompagnateur"
                  placeholderTextColor="#888"
                  value={accompagnateurInfo.lastName}
                  onChangeText={(text) => setAccompagnateurInfo({...accompagnateurInfo, lastName: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Âge"
                  placeholderTextColor="#888"
                  value={accompagnateurInfo.age}
                  onChangeText={(text) => setAccompagnateurInfo({...accompagnateurInfo, age: text})}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date de naissance (JJ/MM/AAAA)"
                  placeholderTextColor="#888"
                  value={accompagnateurInfo.birthdate}
                  onChangeText={(text) => {
                    const formatted = formatBirthdate(text);
                    setAccompagnateurInfo({...accompagnateurInfo, birthdate: formatted});
                  }}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setIsAccompagnateurPickerVisible(true)}
                >
                  <Text style={{ color: accompagnateurInfo.civility ? 'white' : '#888' }}>
                    {accompagnateurInfo.civility || 'Civilité de l\'accompagnateur'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

        {renderStep()}

        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.navButton} onPress={prevStep}>
              <Text style={styles.navButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          {currentStep < 6 ? (
            <TouchableOpacity 
              style={[styles.navButton, currentStep === 1 && styles.navButtonFullWidth]} 
              onPress={nextStep}
            >
              <Text style={styles.navButtonText}>Suivant</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.registerButton, currentStep === 1 && styles.navButtonFullWidth]} 
              onPress={handleRegister}
            >
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
                style={{ color: 'white' }}
              >
                <Picker.Item label="Mr" value="Mr" />
                <Picker.Item label="Mme" value="Mme" />
                <Picker.Item label="Autre" value="Autre" />
              </Picker>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal pour le Picker de civilité de l'accompagnateur */}
      <Modal
        transparent={true}
        visible={isAccompagnateurPickerVisible}
        animationType="slide"
        onRequestClose={() => setIsAccompagnateurPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsAccompagnateurPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={accompagnateurInfo.civility}
                onValueChange={(itemValue) => {
                  setAccompagnateurInfo({...accompagnateurInfo, civility: itemValue});
                  setIsAccompagnateurPickerVisible(false);
                }}
                style={{ color: 'white' }}
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
    marginBottom: 30,
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 1,
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
    marginTop: 20,
  },
  navButton: {
    width: '45%',
    height: 50,
    backgroundColor: '#12B3A8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonFullWidth: {
    width: '100%',
    marginBottom: 10,
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2C3A4A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  // Styles pour la caméra
  cameraContainer: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  frame: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'white',
    margin: 30,
    borderRadius: 10,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 10,
    minWidth: 130,
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 10,
    minWidth: 130,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    width: '100%',
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#12B3A8',
    padding: 15,
    borderRadius: 10,
    minWidth: 130,
    alignItems: 'center',
  },
  // Styles pour l'accompagnateur
  accompagnateurChoice: {
    width: '100%',
    marginBottom: 24,
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  choiceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  choiceButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#2C3A4A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C3A4A',
  },
  choiceButtonActive: {
    borderColor: '#12B3A8',
  },
  choiceButtonText: {
    color: 'white',
    fontSize: 16,
  },
  accompagnateurForm: {
    width: '100%',
  },
});