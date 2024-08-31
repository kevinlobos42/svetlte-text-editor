<script>
    import MaterialSymbolsHome from '~icons/material-symbols/home';
    import MdiClockOutline from '~icons/mdi/clock-outline';
    import MaterialSymbolsStarOutline from '~icons/material-symbols/star-outline';

    export let func;
</script>

<div class="max-w-[200px] pr-5 w-full bg-neutral-800">
	<button class="w-[120px] text-slate-600 font-medium p-4 bg-white rounded-xl" on:click={()=>func()}>New File</button>
	<ul class="mt-3">
		<li>
			<button class="hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left  flex gap-4 items-center"
            >
                <MaterialSymbolsHome/>
                <p class="text-sm">Home</p>
                </button
			>
		</li>
		<li>
			<button class="hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left  flex gap-4 items-center"
				>
                <MdiClockOutline/>
                <p class="text-sm">Recent</p>
                </button
			>
		</li>
		<li>
			<button class="hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left flex gap-4 items-center"
				>
                <MaterialSymbolsStarOutline/>
                <p class="text-sm">Starred</p></button
			>
		</li>
	</ul>
</div>
