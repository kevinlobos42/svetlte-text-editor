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
	import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';
	import Message from '$lib/components/message.svelte';
	import ChatBox from '$lib/components/ChatBox.svelte';

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
	let timer;

	/**
	 * @param {{ target: { value: string; }; }} e
	 */
	function handleChange(e) {
		title = e.target.value || 'Untitled';
		changePage()
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

		// if (docSnap.exists()) {
		// 	const data = docSnap.data();
		// 	title = data.title;
		// 	content = data.content;
		// }
		if(!docSnap.exists()){
			await setDoc(
				docRef,
				{ authorId: auth.currentUser.uid, title: 'Untitled', content: '', lastUpdated: new Date() },
				{ merge: true }
			);
		}

		const unsub = onSnapshot(docRef, doc=>{
			title = doc.data().title
			content = doc.data().content

		})
	});

	function changePage (){
		clearTimeout(timer);
		timer = setTimeout(()=>{
			save()
		}, 1000)
	}
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
		on:input={changePage}
	></div>

	<div class="fixed right-10 bottom-10 flex flex-col">
		{#if chatOpen}

			<ChatBox title={title} bind:chatOpen/>
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
