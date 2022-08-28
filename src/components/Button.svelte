<script lang="ts">
    import { clickOutside } from "./clickOutside.js";
    import EmojiPicker from "./EmojiPicker.svelte";

    export let addSticker: (arg: any) => void;

    const createSticker = (selected) => {
        addSticker(selected);
    } 

    let clicked = false;
    let selected = "None";
    let emojiSelected = false;
</script>

<div>
    <!-- {#if clicked}
        <select
            class="select-type"
            bind:value={selected}
            on:change={() => {
                addSticker(selected);
                clicked = !clicked;
            }}
        >
            <option value="sticker">Sticker</option>
            <option value="emoji">Emoji</option>
        </select>
    {/if} -->

    {#if clicked}
        <li
            use:clickOutside
            on:click_outside={() => (clicked = !clicked)}
            class="custom-select"
        >
            <button
                class="button-type"
                on:click={() => {
                    // clicked = !clicked;
                    selected = "sticker";
                    console.log("selected", selected);
                    addSticker(selected);
                }}
            >
                Sticker
            </button>
            <button
                class="button-type"
                on:click={() => {
                    selected = "emoji";
                    emojiSelected = !emojiSelected;
                    console.log("selected", selected);
                }}
            >
                Emoji
            </button>
            {#if selected == "emoji" && emojiSelected }
                <EmojiPicker handleEmojiPicked={(pickedEmoji) => {
                    console.log(pickedEmoji);
                    addSticker(pickedEmoji);
                }} />
            {/if}
        </li>
    {/if}

    <button
        class="add-sticker-btn"
        on:click={() => {
            clicked = !clicked;
        }}>+</button
    >
</div>

<style>
    .add-sticker-btn {
        /* make this button nice looking */
        border-color: blue;
        outline: none;
        /* make a border round */
        border-radius: 50%;
        /* make the button big */
        width: 5rem;
        height: 5rem;
        /* make the plus sign white and transparent*/

        background-color: transparent;
        color: blue;
        font-size: 60px;
        font-family: sans-serif;
        margin: 0;
        padding: 0;
        cursor: pointer;
    }

    .add-sticker-btn {
        /* position it at the right bottom with some padding */
        position: absolute;
        bottom: 1rem;
        right: 1rem;
    }

    .custom-select {
        /* align elements vertically */
        display: flex;
        flex-direction: column;

        /* place it above sticker-btn */
        position: absolute;
        bottom: 6rem;
        right: 2rem;
    }

    .button-type {
        /* no padding no margin */
        padding: 0;
        margin: 0;
        /* make it bigger */
        font-size: 20px;
        font-family: sans-serif;
        width: 100%;

        /* make it round */
        border-radius: 10%;
        /* make it big */
        width: 10rem;
        height: 3rem;
    }
</style>
