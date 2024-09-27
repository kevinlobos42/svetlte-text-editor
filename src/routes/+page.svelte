<script context="module">
	// @ts-ignore
	export async function load({ data }) {
		return {
			props: {
				user: data.user
			}
		};
	}
</script>

<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Table from '$lib/components/Table.svelte';

	import { auth, db } from '$lib/firebaseConfig';

	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	import { onMount } from 'svelte';

	let selected = 'home';

	onMount(async () => {
		onAuthStateChanged(auth, async (user) => {
			// @ts-ignore
			const docRef = doc(db, 'Users', auth.currentUser?.uid);
			try {
				const doc = await getDoc(docRef);
				if (!doc.exists()) {
					// @ts-ignore
					setDoc(docRef, { email: auth.currentUser.email, files: [], recent: [], starred:[] }, { merge: true });
				}
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
		let id = data.uuid;

		window.location.href = window.location.origin + `/${id}`;
	}
</script>

<div class="max-w-[1400px] w-full flex-grow pb-4 flex justify-center relative text-white">
	<Sidebar func={createFile} bind:selected />
	<div class="flex-grow bg-neutral-900 rounded-xl p-4 px-8">
		{#if selected === 'home'}
			<p class="text-2xl text-center mb-4">My Files</p>
		{:else if selected === 'recent'}
			<p class="text-2xl text-center mb-4">Recent Files</p>
		{:else}
			<p class="text-2xl text-center mb-4">Starred Files</p>
		{/if}
		<Table bind:selected />
	</div>
</div>