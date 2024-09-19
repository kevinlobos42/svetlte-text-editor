<script>
	import { auth, db } from '$lib/firebaseConfig';
	import { signInWithPopup, GithubAuthProvider, onAuthStateChanged } from 'firebase/auth';
	import { doc, setDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import MdiGithub from '~icons/mdi/github';
	import { userId } from '../../store';

	let isSigningIn = false;
	const provider = new GithubAuthProvider();

	const handleGitHubSignIn = async () => {
		console.log(auth);
		try {
			isSigningIn = true;
			await signInWithPopup(auth, provider);
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					window.location.href = '/';
					userId.set({userId:user.uid})
				} else {
					console.error('User not signed in');
					isSigningIn = false;
				}
			});
		} catch (error) {
			console.error('Login failed:', error);
			isSigningIn = false;
		}
	};

	onMount(() => {
		// If the user is already signed in, redirect to the homepage
		onAuthStateChanged(auth, (user) => {
			if (user) {
				window.location.href = '/';
				userId.set({userId:user.uid})
			}
		});
	});
</script>

<div class="max-w-[1400px] w-full h-screen grid place-items-center">
	<button
		disabled={isSigningIn}
		on:click={handleGitHubSignIn}
		class="w-[300px] py-4 bg-slate-700 text-white rounded font-medium flex items-center justify-center gap-4 text-lg"
	>
		Sign in with GitHub <span><MdiGithub class="h-14 w-full" /></span>
	</button>
</div>
