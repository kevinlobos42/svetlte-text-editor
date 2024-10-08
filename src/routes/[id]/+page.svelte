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
	import Share from '$lib/components/Share.svelte';
	import { currentUser } from '../../store';
	import MingcuteLoadingFill from '~icons/mingcute/loading-fill';

	let title = 'Untitled';
	let saveOpen = false;
	let chatOpen = false;
	let shareOpen = false;
	let content = '';
	let showShare = false;
	let doc_id = $page.url.pathname.substr(1);

	/**
	 * @type {import("@firebase/firestore").DocumentReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData> | import("@firebase/firestore").DocumentReference<{ authorId: string; title: string; content: string | undefined; lastUpdated: Date; }, import("@firebase/firestore").DocumentData>}
	 */
	let docRef;
	let userRef;
	let docOwner;
	let timer;
	let notAuth;
	/**
	 * @param {{ target: { value: string; }; }} e
	 */
	function handleChange(e) {
		title = e.target.value || 'Untitled';
		changePage();
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
			await updateDoc(
				docRef,
				{
					title: title,
					content: document.getElementById('page')?.innerHTML,
					lastUpdated: new Date()
				},
				{ merge: true }
			);
			if(docOwner === currentUser){
				await updateDoc(userRef, { files: arrayUnion(doc_id) }, { merge: true });
			}
			await updateDoc(userRef, { recent: arrayUnion(doc_id) }, { merge: true });
		} catch (error) {
			console.error(error);
		}
	}

	function cleanup() {
		const page = document.getElementById('page');
		const spans = page.querySelectorAll('span');

		spans.forEach((span) => {
			const content = span.textContent;
			if (content == '') {
				span.remove();
			}
		});
	}

	onMount(async () => {
		docRef = doc(db, 'Doc', doc_id);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			await setDoc(
				docRef,
				{ authorId: auth.currentUser.uid, title: 'Untitled', content: '', lastUpdated: new Date(), users:[] },
				{ merge: true }
			);
		}

		const unsub = onSnapshot(docRef, (doc) => {
			let data = doc.data();
			docOwner = data.authorId
			if (data.authorId === currentUser) {
				notAuth = false;
				showShare = true;
				title = data.title;
				content = data.content;
			} else if (data.users.includes(currentUser)) {
				notAuth = false;
				title = data.title;
				content = data.content;
			} else {
				notAuth = true;
			}
		});
	});

	function changePage() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			cleanup();
			save();
		}, 1000);
	}
</script>

{#if notAuth === undefined}
	<div class="w-full grid place-items-center flex-1">
		<MingcuteLoadingFill class="-mt-52 text-white text-4xl animate-spin" />
	</div>
{:else if notAuth}
	<div class="w-full flex flex-col justify-center items-center flex-1">
		<p class="font-medium text-white text-xl -mt-52 text-center">
			You are not Authroized to view or edit this document
		</p>
		<button
			class="bg-blue-500 rounded mt-6 px-8 py-3 text-white font-medium text-lg"
			on:click={() => (window.location.href = '/')}>Return to Home</button
		>
	</div>
{:else}
	<div class="max-w-[1400px] w-full flex items-center gap-2 flex-col relative">
		<div class="w-[773px] flex flex-col justify-start gap-4 bg-white p-3 rounded shadow">
			<div class="w-full flex items-center gap-2">
				<input
					type="text"
					class="text-3xl bg-transparent border-b border-neutral-400 flex-1"
					value={title}
					on:change={handleChange}
				/>
				{#if showShare}
					<button
						class="bg-sky-200 rounded-full px-6 py-2 font-[500] text-lg text-blue-900 hover:bg-blue-100 hover:text-slate-500 transition-all"
						on:click={() => (shareOpen = true)}>Share</button
					>
				{/if}
				{#if shareOpen}
					<Share bind:shareOpen {doc_id} />
				{/if}
			</div>
			<Toolbar />
		</div>
		<div
			class="page w-[773px] min-h-[1000px] p-4 bg-white"
			contenteditable="true"
			id="page"
			bind:innerHTML={content}
			on:input={changePage}
		></div>

		<div class="fixed right-10 bottom-10 flex flex-col gap-2">
			{#if chatOpen}
				<ChatBox {title} bind:chatOpen />
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
				<div class=" menuLeft rounded bg-white mb-3 flex flex-col">
					<button
						class="text-left p-2 text-slate-600 border-b border-slate-300 hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200 text-nowrap"
						on:click={savePDF}>Download PDF</button
					>
					<button
						class="text-left p-2 text-slate-600 border-b border-slate-300 hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200 text-nowrap"
						on:click={savePNG}>Download PNG</button
					>
					<button
						class="text-left p-2 text-slate-600 border-b hover:bg-sky-100 hover:text-slate-500 cursor-pointer transition-all duration-200 text-nowrap"
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
{/if}

<style>
	.page {
		box-shadow: 0px 0px 12px 1px rgb(0, 0, 0, 0.3);
	}
	.shadow {
		box-shadow: 0px 0px 12px 1px rgb(0, 0, 0, 0.3);
	}
	.menuLeft {
		width: 0;
		height: 0;
		opacity: 1;
		overflow: hidden; /* Prevent content from showing before expansion */
		animation: expandMenuLeft 0.3s ease forwards;
		transition: all 0.3s ease;
	}
	@keyframes expandMenuLeft {
		0% {
			width: 0px;
			height: 1px;
			opacity: 1;
		}
		100% {
			width: 100%;
			height: 123px;
			opacity: 1;
		}
	}
</style>
