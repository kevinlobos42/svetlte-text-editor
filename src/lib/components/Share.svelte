<script>
	import PhCopy from '~icons/ph/copy';

    export let shareOpen;
</script>

<div
	class="w-screen fixed h-screen bg-black bg-opacity-30 left-0 top-0 z-30 grid place-items-center"
>
	<div class="bg-white rounded-3xl p-5 flex flex-col gap-6">
		<p class="text-3xl">Share Document with Others!</p>
		<div>
			<input
				class="border border-slate-300 rounded w-full px-3 py-2 mb-2"
				placeholder="Enter the email of user you would like to invite!"
			/>
			<p class="bg-slate-100 rounded px-3 py-2 flex items-center justify-between gap-3 text-sm">
				{window.location.href}
                <button class="p-2 hover:bg-slate-200 rounded-lg hover:text-slate-600 transition-all">
                    <PhCopy />
                </button>
			</p>
		</div>
		<div class="w-full flex items-center justify-end gap-2">
			<button
				class="text-blue-600 font-medium transition-all hover:bg-blue-50 rounded-full px-4 py-2"
                on:click={()=>shareOpen = false}
                >Close</button
			>
			<button
				class="bg-blue-600 text-white font-medium transition-all hover:bg-blue-500 rounded-full px-5 py-2"
				>Share</button
			>
		</div>
	</div>
</div>
