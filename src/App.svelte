<script>
    import Write from "./Write.svelte";
    import OpenPost from "./OpenPost.svelte";
</script>

{#if window.location.pathname === "/"}
    <Write/>
{:else}
    <OpenPost/>
{/if}