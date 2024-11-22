import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// Configuration Firebase (remplace les valeurs par tes vraies clés)
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: " "
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export de l'authentification Firebase pour l'utiliser dans d'autres fichiers
export const auth = getAuth(app);
export const db = getFirestore(app);
