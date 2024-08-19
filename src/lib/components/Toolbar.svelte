<script lang="ts">
	import { browser } from '$app/environment';
	import CilAlignCenter from '~icons/cil/align-center';
	import CilAlignLeft from '~icons/cil/align-left';
	import CilAlignRight from '~icons/cil/align-right';
	import CiBold from '~icons/ci/bold';
	import TablerItalic from '~icons/tabler/italic';
	import TablerUnderline from '~icons/tabler/underline';

	let size = 3;
	let align = 'left';
	let options: Boolean[] = [false, false, false];

	function handleChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		console.log(e.target.value, 1, e.target.value < 1);

		if(e.target.value < 1){
			size = 1
			e.target.value = 1
			return
		}else if(e.target.value > 7){
			size = 7
			e.target.value = 7

			return
		}else size = e.target.value || 3;
	}
	function increment() {
		if(size  === 7){
			return
		}
		size++;
		modifyText('fontSize', true, size.toString())
	}
	function decrement() {
		if(size  === 1){
			return
		}
		size--;
		modifyText('fontSize', true, size.toString())
	}
	function toggleOption(option: number) {
		options[option] = !options[option];
	}
	let page: HTMLElement | null;
	if (browser) {
		page = document.getElementById('page');
	}

	const modifyText = (command: string, defaultUi: boolean, value: string | undefined) => {
		document.execCommand(command, defaultUi, value);
	};
</script>

<div class="flex items-center gap-4">
	<!-- FONT -->
	<select class="w-40 bg-transparent no-arrow" id="fontName" on:change={(e)=>{modifyText('fontName', false, e.target.value)}}>
		<option value="arial">Arial</option>
		<option value="calibri">Calibri</option>
		<option value="fantasy">Papyrus</option>
		<option value="times new roman">Times New Roman</option>
		<option value="lucida console">Licida Console</option>
		<option value="cursive">Brush Script MT</option>
	</select>
	<!-- FONT SIZE -->
	<div class="border border-neutral-300 w-fit rounded flex bg-white" id="fontSize">
		<button class="border-r border-neutral-200 px-3 py-1" on:click={decrement}>-</button>
		<input type="number" value={size} on:change={handleChange} class="max-w-14 text-center" />
		<button class="border-l border-neutral-200 px-3 py-1" on:click={increment}>+</button>
	</div>

	<!-- FONT OPTIONS -->
	<div class="border border-neutral-300 w-fit rounded flex bg-white">
		<button
			class={`border-r border-neutral-200 px-3 py-1 `}
			on:click={() => {toggleOption(0); modifyText('bold', false, undefined)}}
			id="bold"><CiBold /></button
		>
		<button
			class={`px-3 py-1 `}
			on:click={() => {toggleOption(1); modifyText('italic', false, undefined)}}
			id="italic"><TablerItalic /></button
		>
		<button
			class={`border-l border-neutral-200 px-3 py-1 `}
			on:click={() => {toggleOption(2); modifyText('underline', false, undefined)}}
			id="underline"><TablerUnderline /></button
		>
	</div>

	<!-- ALIGN OPTIONS -->
	<div class="border border-neutral-300 rounded flex bg-white">
		<button
			class={`border-r border-neutral-200 px-3 py-1 h-full`}
			on:click={() => (modifyText('justifyLeft', true, undefined))}
			id="justifyLeft"><CilAlignLeft /></button
		>
		<button
			class={`px-3 py-1 `}
			on:click={() => (modifyText('justifyCenter', true, undefined))}
			id="justifCenter"><CilAlignCenter /></button
		>
		<button
			class={`border-l border-neutral-200 px-3 py-1`}
			on:click={() => (modifyText('justifyRight', true, undefined))}
			id="justifyRight"><CilAlignRight /></button
		>
	</div>
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
	}
	input::-webkit-inner-spin-button,
	input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	select {
		-webkit-appearance: none;
		-moz-appearance: none;
		text-indent: 1px;
		text-overflow: '';
	}
</style>
