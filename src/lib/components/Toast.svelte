<script>
	import { toastVal } from '../../store';

	/**
	 * @type string | null
	 */
	export let severity = null;
	/**
	 * @type string | null
	 */
	export let message = null;
	/**
	 * @type ConstructorOfATypedSvelteComponent  | null
	 */
	export let icon = null;

	toastVal.subscribe((val) => {
		severity = val.severity;
		message = val.message;
		icon = val.icon;
		if (val.message !== null) {
			setTimeout(() => {
				toastVal.set({ message: null, severity: null, icon: null });
			}, 3000);
		}
	});

	function getColor() {
		switch (severity) {
			case 'success':
				return 'bg-green-700';
			case 'error':
				return 'bg-red-700';
			case 'neutral':
				return 'bg-slate-700';
		}
	}
</script>

{#if message != null}
	<div
		class="toast flex items-center rounded-lg {getColor()} text-white z-50 p-3 gap-4 text-lg fixed bottom-10"
	>
		<svelte:component this={icon} class="text-2xl" />
		{message}
	</div>
{/if}

<style>
	.toast {
		opacity: 0;
		animation: fadeInOut 3s ease forwards;
		/* Adjust for a faster fade-in or out if needed */
	}
	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: translateY(20px); /* Start slightly below */
		}
		10% {
			opacity: 1;
			transform: translateY(0); /* Moves to original position */
		}
		90% {
			opacity: 1;
			transform: translateY(0); /* Stays fully visible */
		}
		100% {
			opacity: 0;
			transform: translateY(20px); /* Fade out with slight movement */
		}
	}
</style>
