import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc  } from "firebase/firestore";

//=============GET==========================

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

export const getLiqlistFirebase = async (contractValue) => {
    try {
        const querySnapshot = await getDocs(collection(db, "liquiditylistbnb"));
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

//=============POST=========================

export const createLiqlistFirebase = async(name,name1,name2,creator,token1,token2,decimals1, decimals2,lpaddress,date) => {
    const newEvent = {
        name: name,
        name1: name1,
        name2: name2,
        creator: creator,
        token1: token1,
        token2: token2,
        decimals1: decimals1,
        decimals2: decimals2,
        lpaddress: lpaddress,
        date: date
    };

    try {
        const docRef = await addDoc(collection(db, "liquiditylistbnb"), newEvent);
        console.log("Event created with ID: ", docRef.id);

    } catch (error) {
        console.error("Error adding event: ", error);
    }
};
