<script lang="ts">
	import Github from '$lib/icons/github.svelte';

</script>

<div class="my-auto flex h-[80vh] items-center justify-center">
	<div class="flex flex-col space-y-6 p-12">
		<p class="text-2xl">Log in to Your Account</p>
		<div class="grid grid-cols-1 gap-6">
			<a href="/login/github">
				<button class="w-full btn variant-filled-primary rounded">
					<Github class="mr-2 h-4 w-4" />
					GitHub
				</button></a
			>
		</div>
	</div>
</div>
