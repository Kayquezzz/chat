// src/Services/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Importando a autenticação
import { getStorage } from 'firebase/storage'; // Importando o Storage

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCumq_xyLsKqGdcuRU8LafEKbf3Yyv9ksY",
    authDomain: "chat-553c9.firebaseapp.com",
    projectId: "chat-553c9",
    storageBucket: "chat-553c9.appspot.com",
    messagingSenderId: "1039184301878",
    appId: "1:1039184301878:web:a5d56bda43bfd37eab2d97",
    measurementId: "G-CP2X1EVDX5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa a autenticação
const auth = getAuth(app); // Inicializando a autenticação

// Inicializa o Storage
const storage = getStorage(app); // Inicializando o Storage

// Exportando as instâncias
export { db, auth, storage }; // Certifique-se de exportar o auth e o storage
