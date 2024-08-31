<script>
// @ts-nocheck

	import { auth, db } from '$lib/firebaseConfig';
	import { format } from 'date-fns';
	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	// @ts-ignore
	import SolarDocumentTextBold from '~icons/solar/document-text-bold';

	/**
	 * @type {DocumentData|Undefined[]}
	 */
	let files = [];

	onMount(() => {
		// @ts-ignore
		onAuthStateChanged(auth, async (user) => {
			// @ts-ignore
			const userRef = doc(db, 'Users', auth.currentUser?.uid);
			try {
				const userData = await getDoc(userRef);
				let temp = userData.data()?.files;
				const fetchedFiles = [];

				for (let file of temp) {
					let docRef = doc(db, 'Doc', file);
					let docData = (await getDoc(docRef)).data();
					if(docData){
						docData.id = file;
						await fetchedFiles.push(docData);
					}
				}

				files = fetchedFiles.sort((a, b) => {
					return b?.lastUpdated - a?.lastUpdated;
				});
			} catch (error) {
				console.log(error);
			}
		});
	});

	// @ts-ignore
	function toDate(d) {
		let date = new Date(d.toDate());
		console.log(date);
		return format(new Date(d.toDate()), 'MM/dd/yyyy');
	}
</script>

<div class="flex flex-col w-full">
	<div
		class="grid grid-cols-5 w-full justify-between text-md pb-3 mb-3 text-neutral-300 font-medium border-b border-b-neutral-400"
	>
		<p class="col-span-3">Name</p>
		<p class="col-span-2">Last Changed</p>
	</div>

	<!-- Template File -->
	{#each files as file, i}
		<a
			href={`/${file.id}`}
			class="grid grid-cols-5 w-full justify-between border-b border-b-neutral-500 pb-3 mb-3 text-neutral-200"
		>
			<div class="col-span-3 flex items-center gap-3">
				<!-- Icon -->
				<SolarDocumentTextBold class="text-2xl text-sky-500" />
				<p class="font-medium text-md">{file.title}</p>
			</div>
			<p class="font-medium text-md">{toDate(file.lastUpdated)}</p>
		</a>
	{/each}
</div>
