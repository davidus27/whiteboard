<script lang="ts">
    import WorkspaceSwitcher from "./WorkspaceSwitcher.svelte";
    import { menuStore } from "../stores/menuStore";

</script>

<div id="menu">
    <!-- this will look like a real horizonal menu one day -->

    {#if $menuStore.isStageDraggable}
        <button
            id="btn"
            on:click={() => {
                console.log("Stop dragging");
                menuStore.update((store) => {
                    store.isStageDraggable = false;
                    return store;
                });
                console.log("isDraggable", $menuStore.isStageDraggable);
            }}>Stop dragging</button
        >
    {:else}
        <button
            id="btn"
            on:click={() => {
                menuStore.update((store) => {
                    store.isStageDraggable = true;
                    return store;
                });
            }}>Start dragging</button
        >
    {/if}

    <!-- <WorkspaceSwitcher
        bind:selectedLayer={$menuStore.workspaceIndex}
        on:addedLayer={() => {
            menuStore.update((store) => {
                store.workspaceCount++;
                store.workspaceIndex = store.workspaceCount - 1;
                console.log("store.workspaceCount", store.workspaceCount);
                return store;
            });
        }}
    /> -->
</div>

<style>
</style>
