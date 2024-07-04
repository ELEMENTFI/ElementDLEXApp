import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc  } from "firebase/firestore";

export const getAccountsFirebase = async (contractValue) => {
    try {
        const querySnapshot = await getDocs(collection(db, "authaccounts"));
        const documents = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            documents.push({ id: doc.id, ...doc.data() });
        });
        console.log("raw",querySnapshot,"pro", documents);
        return documents;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
};