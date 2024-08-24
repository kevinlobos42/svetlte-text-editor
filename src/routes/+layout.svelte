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

<div class="w-full h-screen bg-sky-600 relative">
	{#if authenticated}
		<button class="fixed right-0 top-0 rounded w-[100px] py-2 text-center bg-blue-100 mr-5 mt-5 z-10" on:click={logout}>Logout</button>
	{/if}
	<slot />
</div>
