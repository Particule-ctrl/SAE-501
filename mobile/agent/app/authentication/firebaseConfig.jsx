import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
    apiKey: "AIzaSyC0NNxgCTjQ4VoKxTlKG-sxSSc5lEd4n1c",
    authDomain: "sae-501-agent.firebaseapp.com",
    projectId: "sae-501-agent",
    storageBucket: "sae-501-agent.appspot.com",
    messagingSenderId: "1044220809411",
    appId: "1:1044220809411:web:7318fdf0f16e17e3bb5276",
    measurementId: "G-BBCWCE2ME3"
};

// Vérifiez si une instance de Firebase existe déjà
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export de l'authentification Firebase pour l'utiliser dans d'autres fichiers
export const auth = getAuth(app);
export const db = getFirestore(app);