import { auth, db } from '$lib/firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// src/routes/+layout.server.js
export async function load({ url, locals }) {
	let user = null;

	// Get the current user asynchronously
	await new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			user = firebaseUser;
			unsubscribe();
			resolve();
		});
	});

	return { user };
}
