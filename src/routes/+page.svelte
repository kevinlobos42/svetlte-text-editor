<script context="module">
	export async function load({ data }) {
		return {
			props: {
				user: data.user
			}
		};
	}
</script>

<script>
	import { auth, db } from '$lib/firebaseConfig';

	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, setDoc } from 'firebase/firestore';

	import { onMount } from 'svelte';

	onMount(async () => {
		console.log('asdasdasdds');

		onAuthStateChanged(auth, async (user) => {
			const docRef = doc(db, 'Users', auth.currentUser?.uid);
			console.log('asdasddsasa');
			try {
				await setDoc(
					docRef,
					{ email: auth.currentUser.email, files: [], recent: [] },
					{ merge: true }
				);
			} catch (error) {
				console.log(error);
			}
			if (!user) {
				window.location.href = '/';
			}
		});
	});

	let uuid = '';

	async function createFile() {
		const response = await fetch('/api/uuid');
		const data = await response.json();
		uuid = data.uuid;

		window.location.href = window.location.origin + `/${uuid}`;
	}
</script>

<div class="w-full h-screen flex items-center justify-center relative text-white">
	<div class="w-[200px] flex flex-col gap-6 items-center">
		<button
			class="w-[200px] text-slate-600 font-medium px-5 py-2 bg-white rounded"
			on:click={createFile}>Create new File</button
		>
		<hr class="w-full" />
		<p>or</p>
		<hr class="w-full" />
		<div class="flex flex-col gap-4 w-[200px]">
			<input class="rounded py-1 px-2 text-slate-600" type="text" placeholder="Room ID..." />
			<button class="text-white font-medium px-5 py-2 bg-slate-700 rounded">Join Room by ID</button>
		</div>
	</div>
</div>

<style>
</style>
