import React, { useState, useLayoutEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './firebaseConfig'; // Import Firebase Auth et Firestore
import { doc, setDoc } from 'firebase/firestore'; // Import des fonctions Firestore

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


  // address ip 

  const ipaddress = '192.168.0.65';

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
    if (!firstName || !lastName || !age || !email || !password || !birthdate || !civility || !tel) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
  
    if (isNaN(age) || age <= 0) {
      alert("Veuillez entrer un âge valide.");
      return;
    }

    if (isNaN(age) || age <= 18){
      alert("Vous devez etre majeur pour avoir un compte ")
    }
  
    if (!/\d{4}-\d{2}-\d{2}/.test(birthdate)) {
      alert("Veuillez entrer une date de naissance valide au format JJ-MM-AAAA.");
      return;
    }
  
    if (!/^\d{10}$/.test(tel)) {
      alert("Veuillez entrer un numéro de téléphone valide à 10 chiffres.");
      return;
    }

    try {
      // Étape 1 : Créer un utilisateur avec Firebase Auth
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
        Name: fullName,
        Age: parseInt(age), // Convertir l'âge en nombre
        Email: email,
        Birthdate: birthdate,
        Civility: civility,
        Tel: tel,
        Note: note,
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
      console.error('Erreur lors de l\'inscription :', error.message);
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.text}>Créer un compte</Text>

      {/* Champ Prénom */}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Champ Nom */}
      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Champ Âge */}
      <TextInput
        style={styles.input}
        placeholder="Âge"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Champ Date de naissance */}
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (JJ-MM-AAAA)"
        placeholderTextColor="#888"
        value={birthdate}
        onChangeText={setBirthdate}
      />

      {/* Champ Civilité */}
      <TextInput
        style={styles.input}
        placeholder="Civilité (Mr, Mme)"
        placeholderTextColor="#888"
        value={civility}
        onChangeText={setCivility}
      />

      {/* Champ Téléphone */}
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        placeholderTextColor="#888"
        value={tel}
        onChangeText={setTel}
        keyboardType="phone-pad"
      />

      {/* Champ Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Champ Mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Champ Note */}
      <TextInput
        style={styles.input}
        placeholder="Note (optionnel)"
        placeholderTextColor="#888"
        value={note}
        onChangeText={setNote}
      />

      {/* Bouton S'inscrire */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a5acd',
    paddingVertical: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 24,
    color: 'white',
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#4B0082',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
