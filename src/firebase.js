// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvzUBatMDNhxB1dol3UpaXDI5fcqssxtA",
  authDomain: "elementdlex.firebaseapp.com",
  projectId: "elementdlex",
  storageBucket: "elementdlex.appspot.com",
  messagingSenderId: "945025489766",
  appId: "1:945025489766:web:78e765aa84ac0bb7b346a7",
  measurementId: "G-DSFNXTB1NY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {db};