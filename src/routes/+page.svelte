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
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Table from '$lib/components/Table.svelte';

	import { auth, db } from '$lib/firebaseConfig';

	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	import { onMount } from 'svelte';

	onMount(async () => {
		onAuthStateChanged(auth, async (user) => {
			const docRef = doc(db, 'Users', auth.currentUser?.uid);
			try {
				const doc = await getDoc(docRef);
				if (!doc.exists()) {
					setDoc(docRef, { email: auth.currentUser.email, files: [], recent: [] }, { merge: true });
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

	const printnew = () => {
		console.log('hello');
	};
</script>

<div class="max-w-[1400px] w-full flex-grow pb-4 flex justify-center relative text-white">
	<Sidebar func={createFile} />
	<div class="flex-grow bg-neutral-900 rounded-xl p-4 px-8">
		<p class="text-2xl text-center mb-4">Recent Files</p>
		<Table/>
	</div>
</div>

<style>
</style>
