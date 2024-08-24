import { auth, db } from '$lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function handle({ event, resolve }) {
	let user = null;

	await new Promise((resolvePromise) => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			user = firebaseUser;
			event.locals.user = user;
			unsubscribe();
			resolvePromise();
		});
	});

	return resolve(event);
}
