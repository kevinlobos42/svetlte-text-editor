<script>
	import { onAuthStateChanged, signOut } from 'firebase/auth';
import '../app.css';
	import { auth } from '$lib/firebaseConfig';
	import { onMount } from 'svelte';

	let authenticated = false;

	async function logout() {
        try {
            await signOut(auth);
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

	onMount(() => {
        // If the user is already signed in, redirect to the homepage
        onAuthStateChanged(auth, (user) => {
            if (user) {
               authenticated=true;
            }
        });
    });
</script>

<div class="w-full min-h-screen bg-neutral-800 relative flex flex-col items-center px-8">
	{#if authenticated}
        <div class="flex justify-between text-white items-center max-w-[1400px] w-full pt-4 pb-6">
            <a href="/"><p class='font-bold text-3xl text-slate-700 py-0.5'><span class='px-1 rounded-l bg-sky-100'>My</span><span class='bg-sky-800 rounded text-white p-2'>Drive</span></p></a>
            <button class="rounded w-[100px] py-2 text-center bg-blue-100 z-10 text-slate-700" on:click={logout}>Logout</button>
        </div>
	{/if}
	<slot />
</div>
