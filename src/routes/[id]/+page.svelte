<script>
// @ts-nocheck
	import { Toolbar } from '$lib/index';
	import MdiFloppy from '~icons/mdi/floppy';
	import MaterialSymbolsClose from '~icons/material-symbols/close';
	import MaterialSymbolsChat from '~icons/material-symbols/chat';
	import jsPDF from 'jspdf';
	import html2Canvas from 'html2canvas';
	import { toPng } from 'html-to-image';
	import fileSaver from 'file-saver';
	import { page } from '$app/stores';
	import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';
	import Message from '$lib/components/message.svelte';

	let title = 'Untitled';
	let saveOpen = false;
	let chatOpen = false;
	let content = '';
	let doc_id = $page.url.pathname.substr(1);

	/**
	 * @type {import("@firebase/firestore").DocumentReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData> | import("@firebase/firestore").DocumentReference<{ authorId: string; title: string; content: string | undefined; lastUpdated: Date; }, import("@firebase/firestore").DocumentData>}
	 */
	let docRef;
	let userRef;

	/**
	 * @param {{ target: { value: string; }; }} e
	 */
	function handleChange(e) {
		title = e.target.value || 'Untitled';
	}

	function savePDF() {
		const page = document.getElementById('page') || new HTMLElement();
		html2Canvas(page).then((canvas) => {
			const imgData = canvas.toDataURL('images/png');
			const pdf = new jsPDF();
			const imgProps = pdf.getImageProperties(imgData);
			const width = pdf.internal.pageSize.getWidth();
			const height = pdf.internal.pageSize.getHeight();

			pdf.addImage(imgData, 'PNG', 0, 0, width, height);
			pdf.save(`${title}.pdf`);
		});
	}

	function savePNG() {
		const page = document.getElementById('page') || new HTMLElement();
		toPng(page).then((dataUrl) => {
			fileSaver.saveAs(dataUrl, `${title}.png`);
		});
	}

	async function save() {
		userRef = doc(db, 'Users', auth.currentUser.uid);
		try {
			await setDoc(
				docRef,
				{
					authorId: auth.currentUser.uid,
					title: title,
					content: document.getElementById('page')?.innerHTML,
					lastUpdated: new Date()
				},
				{ merge: true }
			);

			await updateDoc(userRef, { files: arrayUnion(doc_id) }, { merge: true });
		} catch (error) {
			console.error(error);
		}
	}

	onMount(async () => {
		docRef = doc(db, 'Doc', doc_id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data();
			title = data.title;
			content = data.content;
		} else {
			await setDoc(
				docRef,
				{ authorId: auth.currentUser.uid, title: 'Untitled', content: '', lastUpdated: new Date() },
				{ merge: true }
			);
		}
	});
</script>

<div class="max-w-[1400px] w-full flex items-center gap-2 flex-col relative">
	<div class="w-[773px] flex flex-col justify-start gap-4 bg-white p-3 rounded shadow">
		<input
			type="text"
			class="text-3xl bg-transparent border-b border-neutral-400"
			value={title}
			on:change={handleChange}
		/>
		<Toolbar />
	</div>
	<div
		class="page w-[773px] h-[1000px] p-4 bg-white"
		contenteditable="true"
		id="page"
		bind:innerHTML={content}
	></div>

	<div class="fixed right-10 bottom-10 flex flex-col">
		{#if chatOpen}
			<div class="bg-white shadow-md rounded-lg max-w-lg w-full">
				<div
					class="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center"
				>
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
					<Message text="This is a text" time="12:00" name = "Bob Bobby"/>
					<Message text="This is a Response" time="12:13" name = "Kevin Lobos"/>
					<Message text="Followup" time="12:14" name = "Kevin Lobos"/>
					<Message text="Confirmation" time="12:20" name = "Bob Bobby"/>

				</div>
				<div class="p-4 border-t flex">
					<input
						id="user-input"
						type="text"
						placeholder="Type a message"
						class="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						id="send-button"
						class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
						>Send</button
					>
				</div>
			</div>
		{/if}
		<button
			class="h-16 w-16 bg-neutral-700 rounded-full grid place-items-center cursor-pointer self-end"
			on:click={() => (chatOpen = !chatOpen)}
		>
			{#if !chatOpen}
				<MaterialSymbolsChat style="color:white" class="h-full w-[50%]" />
			{:else}
				<MaterialSymbolsClose style="color:white" class="h-full w-[50%]" />
			{/if}
		</button>
	</div>
	<div class="fixed left-10 bottom-10 flex flex-col">
		{#if saveOpen}
			<div class="rounded bg-white mb-3 flex flex-col">
				<button
					class="text-left p-2 text-slate-600 border-b border-slate-300 hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200"
					on:click={savePDF}>Download PDF</button
				>
				<button
					class="text-left p-2 text-slate-600 border-b border-slate-300 hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200"
					on:click={savePNG}>Download PNG</button
				>
				<button
					class="text-left p-2 text-slate-600 border-b hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200"
					>Download DOCX</button
				>
				<button
					class="text-left p-2 text-slate-600 hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200"
					on:click={save}>Save</button
				>
			</div>
		{/if}
		<button
			class="h-16 w-16 bg-neutral-700 rounded-full grid place-items-center cursor-pointer self-start"
			on:click={() => (saveOpen = !saveOpen)}
		>
			{#if !saveOpen}
				<MdiFloppy style="color:white" class="h-full w-[50%]" />
			{:else}
				<MaterialSymbolsClose style="color:white" class="h-full w-[50%]" />
			{/if}
		</button>
	</div>
</div>

<style>
	.page {
		box-shadow: 0px 0px 12px 1px rgb(0, 0, 0, 0.3);
	}
	.shadow {
		box-shadow: 0px 0px 12px 1px rgb(0, 0, 0, 0.3);
	}
</style>
