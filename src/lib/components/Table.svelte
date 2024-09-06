<script>
	// @ts-nocheck

	import { auth, db } from '$lib/firebaseConfig';
	import { format } from 'date-fns';
	import { onAuthStateChanged } from 'firebase/auth';
	import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	// @ts-ignore
	import SolarDocumentTextBold from '~icons/solar/document-text-bold';
	import MiOptionsVertical from '~icons/mi/options-vertical';

	/**
	 * @type {DocumentData|Undefined[]}
	 */
	let files = [];
	let emails = [];
	let clicked = [];

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
					if (docData) {
						docData.id = file;
						getAuthor(docData.authorId, docData);
						clicked.push(false);
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
		return format(new Date(d.toDate()), 'MM/dd/yyyy');
	}

	async function getAuthor(authorId, docData) {
		const userRef = doc(db, 'Users', authorId);
		try {
			const userData = await getDoc(userRef);
			let temp = emails;
			if (auth.currentUser.email === userData.data().email) {
				docData.authorized = true;
				temp.push('Me');
			} else {
				docData.authorized = false;
				temp.push(userData.data().email);
			}

			emails = temp;
		} catch (error) {
			console.log(error);
		}
	}
	function setClicked(i) {
		let val = clicked[i];
		let temp = [];
		clicked.forEach((e) => {
			temp.push(false);
		});
		temp[i] = !val;
		clicked = temp;
	}

	async function deleteFile(file) {
		if (file.authorized) {
			const UserFilesRef = doc(db, 'Users', file.authorId);
			let idx = files.indexOf(file);
			files.splice(idx, 1);
			clicked.splice(idx, 1);
			emails.splice(idx, 1);
			let temp = []
			clicked.forEach((e) => {
				temp.push(false);
			});
		clicked = temp;

			await updateDoc(UserFilesRef, {
				files: arrayRemove(file.id)
			});
			await deleteDoc(doc(db, 'Doc', file.id));
		}
	}
</script>

<div class="flex flex-col w-full">
	<div
		class="flex w-full text-md pb-3 mb-3 text-neutral-300 font-medium border-b border-b-neutral-400"
	>
		<p class="flex-grow">Name</p>
		<p class="w-1/3">Owner</p>
		<p class="w-[100px]">Last Changed</p>
		<p class="w-[100px] text-end">Actions</p>
	</div>

	<!-- Template File -->
	{#key (emails, clicked)}
		{#each files as file, i}
			<div class="flex w-full border-b border-b-neutral-500 pb-3 mb-3 text-neutral-200">
				<a
					href={`/${file.id}`}
					class="col-span-2 flex items-center flex-grow gap-3 hover:underline"
				>
					<!-- Icon -->
					<SolarDocumentTextBold class="text-2xl text-sky-500" />
					<p class="font-medium text-md">{file.title}</p>
				</a>
				<p class="font-medium text-md w-1/3">{emails[i]}</p>
				<p class="font-medium text-md w-[100px]">{toDate(file.lastUpdated)}</p>
				<button
					class="text-xl w-[100px] flex items-center justify-end"
					on:click={() => setClicked(i)}
				>
					<div class="relative">
						<MiOptionsVertical />
						{#if clicked[i]}
							<div
								class="absolute right-0 bg-white rounded-lg flex flex-col items-center justify-center text-slate-600 z-10 font-medium"
							>
								<button
									class="text-sm border-b border-b-slate-300 w-full p-3 hover:bg-slate-300 rounded-t-lg disabled:hover:bg-white disabled:text-slate-400"
									disabled={!file.authorized}
									on:click={deleteFile(file)}>Delete</button
								>
								<button class="text-sm w-full p-3 hover:bg-slate-300 rounded-b-lg">Copy</button>
							</div>
						{/if}
					</div>
				</button>
			</div>
		{/each}
	{/key}
</div>
