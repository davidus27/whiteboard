<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let layerCount = 1;
    export let selectedLayer: number;

    const MAX_LAYERS = 10;

</script>
    
<div>Select your workspace:</div>
{#each { length: layerCount } as _, layerIndex}
    <button
        on:click={() => {
            selectedLayer = layerIndex;
        }}
    >
        {#if selectedLayer === layerIndex}
            <strong>{layerIndex + 1}</strong>
        {:else}
            {layerIndex + 1}
        {/if}
    </button>
{/each}
<button
    on:click={() => {
        if (layerCount >= MAX_LAYERS) {
            alert("You have reached the maximum number of layers");
            return;
        }
        layerCount++;
        console.log("AddedLayer event dispatched");
        dispatch("addedLayer", layerCount);
    }}>+</button
>

<style>
</style>
