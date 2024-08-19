<script>
	import { Toolbar } from "$lib/index";

    let title='Untitled'

    function handleChange(e) {
		title = e.target.value || 'Untitled';
	}

</script>

<div class="w-full h-screen flex justify-center items-center gap-10 flex-col">
    <div class='w-[773px] flex flex-col justify-start gap-4 bg-white p-3 rounded shadow'>
        <input type="text" class="text-3xl bg-transparent border-b border-neutral-400" value={title} on:change={handleChange}/>
        <Toolbar />
    </div>
    <div class="page w-[773px] h-[1000px] p-2 bg-white" contenteditable="true" id="page">
        
    </div>
</div>

<style>
    .page{
        box-shadow: 0px 0px 12px 1px rgb(0,0,0,.3);
    }
    .shadow{
        box-shadow: 0px 0px 12px 1px rgb(0,0,0,.3);
    }
</style>