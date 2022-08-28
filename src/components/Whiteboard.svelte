<script lang="ts">
    import Sticker from "./Sticker.svelte";
    import Button from "./Button.svelte";
    import Emoji from "./Emoji.svelte";

    let lines = [];

    const updateLines = () => {
        console.log("Updating lines");
    };

    interface StickerData {
        type: string;
        position: {
            x: number;
            y: number;
        };
        resolution: {
            width: string;
            height: string;
        };
        color: string;
        text: string;
        id: string;
        name: string;
    }

    const generateColor = () => {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    const generateId = () => {
        return Math.random().toString(36).substring(2, 9);
    }

    const addSticker = (type = "sticker") => {
        stickers.push({
            type: type,
            position: {
                x: 0,
                y: 0,
            },
            resolution: {
                width: "200px",
                height: "200px",
            },
            // random nice color
            color: generateColor(),
            text: "Write something awesome here",
            id: generateId(),
            name: "Sticker " + (stickers.length + 1),
        });
        stickers = stickers;
        console.log("addSticker", stickers);
    };

    let stickers: Array<StickerData> = [
        { 
            type: 'sticker',
            name: "Sticker 1",
            position: {
                x: 0,
                y: 0,
            },
            resolution: {
                width: "200px",
                height: "200px",
            },
            text: "Hello World!",
            color: generateColor(),
            id: generateId(),
        },
    ];

    const cancelSticker = (id: string) => {
        console.log("Cancelling sticker ", id);
        console.log("Stickers before", stickers);
        stickers = stickers.filter((sticker) => sticker.id !== id, );
        console.log("Stickers after", stickers);
    }
</script>

<div class="whiteboard">
    {#each stickers as sticker}
        {#if sticker.type === "sticker"}
            <Sticker stickerData={sticker} {updateLines} { cancelSticker }/>
        {:else}
            <Emoji stickerData={sticker} {updateLines} { cancelSticker }  />
        {/if}
    {/each}
    <Button {addSticker} />
</div>

<style>
    .whiteboard {
        width: 100%;
        height: 100vh;

        /* make background light blue*/
        background-color: #e6f2ff;
        border: 1px solid rgb(180, 180, 180);
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgb(180, 180, 180);

        /* background: white; */
        background-image: radial-gradient(black 1px, transparent 1px), radial-gradient(black 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -19px -19px;
        
    }

    /* hide and disable scrollbars */
    .whiteboard::-webkit-scrollbar {
        display: none;
    }
</style>
