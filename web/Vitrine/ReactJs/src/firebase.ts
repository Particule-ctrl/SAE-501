// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCiwXkkI9Xrcff7wm8VrNCuOniLzG5yx2c",
    authDomain: "sae-501-67d36.firebaseapp.com",
    projectId: "sae-501-67d36",
    storageBucket: "sae-501-67d36.appspot.com",
    messagingSenderId: "600137491483",
    appId: "1:600137491483:web:927ac0d77797912da884be",
    measurementId: "G-ED2CLQ1G0D"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Export de l'authentification et de Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export {};