<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import Message from './message.svelte';
	import { page } from '$app/stores';
	import { db } from '$lib/firebaseConfig';
	import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

	export let title;
	/**
	 * @type {boolean}
	 */
	export let chatOpen;
	let doc_id = $page.url.pathname.substr(1);

	/**
	 * @type {object[]}
	 */
	let messages = [];
    let userMessage = ''

	onMount(async () => {
		// const querySnapshot = await getDocs(collection(db,'Chat', doc_id, 'messages'))
		// querySnapshot.forEach(d=>{
		//     console.log(d.data());
		// })
		const chatRef = collection(db, 'Chat', doc_id, 'messages');

		const unsub = onSnapshot(chatRef, (doc) => {
			/**
			 * @type {object[]}
			 */
			let temp = [];
			doc.forEach((d) => {
				temp.push(d.data());
			});
			messages = temp.sort((a,b)=> a.time.toDate() - b.time.toDate());
		});
	});

	function getTime(timestamp) {
		const date = timestamp.toDate();
		let hours = date.getHours()
		const minutes = date.getMinutes().toString().padStart(2, '0');

		const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

		// Convert hours from 24-hour to 12-hour format
		hours = hours % 12;
		hours = hours ? hours : 12;

		return `${hours}:${minutes} ${ampm}`;
	}

    async function sendMessage(){
        if(userMessage.trim().length === 0) return;
        const docRef = await addDoc(collection(db, 'Chat', doc_id, 'messages'), {
            from: 'testing send',
            time: serverTimestamp(),
            message: userMessage
        })
    }
</script>

<div class="bg-white shadow-md rounded-lg max-w-lg w-full">
	<div class="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
		<p class="text-lg font-semibold">{title}</p>
		<button
			id="close-chat"
			class="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
			on:click={() => (chatOpen = !chatOpen)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>
	</div>

	<div id="chatbox" class="p-4 h-96 overflow-y-auto">
		<!-- Chat messages will be displayed here -->
		{#each messages as msg}
			<Message text={msg.message} time={getTime(msg.time)} name={msg.from} />
		{/each}
	</div>
	<div class="p-4 border-t flex">
		<input
			id="user-input"
			type="text"
			placeholder="Type a message"
			class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            bind:value={userMessage}
		/>
		<button
			id="send-button"
			class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
            on:click={sendMessage}
			>Send</button
		>
	</div>
</div>
