<script>
    import MaterialSymbolsHome from '~icons/material-symbols/home';
    import MdiClockOutline from '~icons/mdi/clock-outline';
    import MaterialSymbolsStarOutline from '~icons/material-symbols/star-outline';

    export let func;

	/**
	 * @type {string}
	 */
	 export let selected;

	 /**
	  * 
	  * @param val {string}
	  */
	 function selectItem(val){
		selected = val;
	 }
</script>

<div class="max-w-[200px] pr-5 w-full bg-neutral-800">
	<button class="w-[120px] text-slate-600 font-medium p-4 bg-white rounded-xl" on:click={()=>func()}>New File</button>
	<ul class="mt-3">
		<li class="mb-1">
			<button on:click={()=>selectItem('home')} class={`hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left  flex gap-4 items-center ${selected === 'home' && 'bg-neutral-700 text-blue-300'}`}
            >
                <MaterialSymbolsHome/>
                <p class='text-sm'>Home</p>
                </button
			>
		</li>
		<li class="mb-1">
			<button on:click={()=>selectItem('recent')} class={`hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left  flex gap-4 items-center ${selected === 'recent' && 'bg-neutral-700 text-blue-300'}`}
				>
                <MdiClockOutline/>
                <p class="text-sm">Recent</p>
                </button
			>
		</li>
		<li class="mb-1">
			<button on:click={()=>selectItem('starred')} class={`hover:bg-neutral-700 rounded-xl text-lg font-medium w-full py-1 px-2 transition-all duration-200 text-left  flex gap-4 items-center ${selected === 'starred' && 'bg-neutral-700 text-blue-300'}`}
				>
                <MaterialSymbolsStarOutline/>
                <p class="text-sm">Starred</p></button
			>
		</li>
	</ul>
</div>
