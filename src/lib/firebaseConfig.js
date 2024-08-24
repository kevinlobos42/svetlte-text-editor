import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyDFXWLHIdl_i6BYcIjN0B1kyplw8hyx4sA",
	authDomain: "collaborative-text.firebaseapp.com",
	projectId: "collaborative-text",
	storageBucket: "collaborative-text.appspot.com",
	messagingSenderId: "345825335337",
	appId: "1:345825335337:web:5f4c8a37005e7c9761e438",
	measurementId: "G-4YQ4JTF6PN"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app);

export {auth, db}