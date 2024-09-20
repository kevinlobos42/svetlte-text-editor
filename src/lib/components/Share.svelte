<script>
	import PhCopy from '~icons/ph/copy';
	import AkarIconsClipboard from '~icons/akar-icons/clipboard';
	import HeroiconsOutlineExclamation from '~icons/heroicons-outline/exclamation';
	import SimpleLineIconsCheck from '~icons/simple-line-icons/check';
	import { currentUser, toastVal, userId } from '../../store';
	import {
		arrayUnion,
		collection,
		doc,
		getDocs,
		getDoc,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';
	import { db } from '$lib/firebaseConfig';
	export let shareOpen;
	/**
	 * @type string
	 */
	export let doc_id;
	/**
	 * @type string
	 */
	let email = '';
	/**
	 * @type string
	 */

	function copyToClipboard() {
		navigator.clipboard.writeText(window.location.href);
		toastVal.set({
			message: 'Successfully copied to clipboard',
			severity: 'success',
			icon: AkarIconsClipboard
		});
	}

	function handleChange(e) {
		email = e.target.value || '';
	}

	async function share() {
		if (email.trim() === '') {
			toastVal.set({
				message: 'Enter a valid email',
				severity: 'error',
				icon: HeroiconsOutlineExclamation
			});
			return;
		}
		const q = query(collection(db, 'Users'), where('email', '==', email));
		let docRef = doc(db, 'Doc', doc_id);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.size < 1) {
			toastVal.set({
				message: 'User does not exist',
				severity: 'error',
				icon: HeroiconsOutlineExclamation
			});
			return;
		} else {
			querySnapshot.forEach(async (doc) => {
				let data = (await getDoc(docRef)).data();
				if (doc.id === currentUser) {
					toastVal.set({
						message: `${email} is the owner of this document`,
						severity: 'error',
						icon: HeroiconsOutlineExclamation
					});
					return;
				} else if (data.users.includes(doc.id)) {
					toastVal.set({
						message: 'User already has access to document',
						severity: 'error',
						icon: HeroiconsOutlineExclamation
					});
					return;
				} else {
					await updateDoc(docRef, { users: arrayUnion(doc.id) }, { merge: true });
					toastVal.set({
						message: 'User added to document',
						severity: 'success',
						icon: SimpleLineIconsCheck
					});
				}
			});
		}
	}
</script>

<div
	class="w-screen fixed h-screen bg-black bg-opacity-30 left-0 top-0 z-30 grid place-items-center"
>
	<div class="bg-white rounded-3xl p-5 flex flex-col gap-6">
		<p class="text-3xl">Share Document with Others!</p>
		<div>
			<input
				value={email}
				on:change={handleChange}
				class="border border-slate-300 rounded w-full px-3 py-2 mb-2"
				placeholder="Enter the email of user you would like to invite!"
			/>
			<p class="bg-slate-100 rounded px-3 py-2 flex items-center justify-between gap-3 text-sm">
				{window.location.href}
				<button
					class="p-2 hover:bg-slate-200 rounded-lg hover:text-slate-600 transition-all"
					on:click={copyToClipboard}
				>
					<PhCopy />
				</button>
			</p>
		</div>
		<div class="w-full flex items-center justify-end gap-2">
			<button
				class="text-blue-600 font-medium transition-all hover:bg-blue-50 rounded-full px-4 py-2"
				on:click={() => (shareOpen = false)}>Close</button
			>
			<button
				class="bg-blue-600 text-white font-medium transition-all hover:bg-blue-500 rounded-full px-5 py-2"
				on:click={() => share()}>Share</button
			>
		</div>
	</div>
</div>
