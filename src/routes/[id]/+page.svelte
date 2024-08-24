<script>
	import { Toolbar } from '$lib/index';
	import MdiFloppy from '~icons/mdi/floppy';
	import MaterialSymbolsClose from '~icons/material-symbols/close';
	import MaterialSymbolsChat from '~icons/material-symbols/chat';
	import jsPDF from 'jspdf';
	import html2Canvas from 'html2canvas';
	import { toPng } from 'html-to-image';
	import fileSaver from 'file-saver';
	import { page } from '$app/stores';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';

	let title = 'Untitled';
	let saveOpen = false;
	let chatOpen = true;
	let content = '';
	let doc_id = $page.url.pathname.substr(1);

	let docRef;

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
		try {
			await setDoc(
				docRef,
				{
					authorId: auth.currentUser.uid,
					title: title,
					content: document.getElementById('page')?.innerHTML
				},
				{ merge: true }
			);
		} catch (error) {
			console.error(error);
		}
	}

    onMount(async ()=>{
        docRef = doc(db, 'Doc', doc_id);
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            const data = docSnap.data();
            title = data.title
            content = data.content
        }else {
            await setDoc(docRef, {authorId: auth.currentUser.uid}, {merge: true})
        }
    })
</script>

<div class="w-full h-screen flex justify-center items-center gap-10 flex-col relative">
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

	<div class="absolute right-10 bottom-10 flex flex-col">
		{#if chatOpen}
			<div class="rounded bg-white mb-3 flex flex-col w-[350px] h-[500px]">
				<div class="w-full h-12 bg-neutral-800 rounded-t flex justify-between items-center px-4">
					<p class="text-white font-medium">{title} chat</p>
					<button on:click={() => (chatOpen = false)}>
						<MaterialSymbolsClose style="color:white" class="h-[80%]" />
					</button>
				</div>
				<div class="flex-grow"></div>
				<div class="w-full flex">
					<input
						class="w-[75%] border-t border-neutral-400 px-2 rounded-bl"
						placeholder="Send Message..."
					/>
					<button class="bg-blue-500 w-[25%] py-2 text-white">Send</button>
				</div>
			</div>
		{/if}
		<button
			class="h-16 w-16 bg-neutral-800 rounded-full grid place-items-center cursor-pointer self-end"
			on:click={() => (chatOpen = !chatOpen)}
		>
			{#if !chatOpen}
				<MaterialSymbolsChat style="color:white" class="h-full w-[50%]" />
			{:else}
				<MaterialSymbolsClose style="color:white" class="h-full w-[50%]" />
			{/if}
		</button>
	</div>
	<div class="absolute left-10 bottom-10 flex flex-col">
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
                    on:click={save}
					>Save</button
				>
			</div>
		{/if}
		<button
			class="h-16 w-16 bg-neutral-800 rounded-full grid place-items-center cursor-pointer self-start"
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
