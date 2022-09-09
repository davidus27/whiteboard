<script>
    import MetaSticker from "./MetaSticker.svelte";

    // props for the sticker
    export let stickerData;
    export let cancelSticker;
    let { name, text } = stickerData;

    const getNumber = (size) => {
        return Number(size.replace(/[^\d\.\-]/g, ""));
    };

    const calculateFontSize = (resolution) => {
        const width = getNumber(resolution.width);
        const height = getNumber(resolution.height);

        const width_2 = Math.pow(width, 2);
        const height_2 = Math.pow(height, 2);

        return Math.sqrt(width_2 + height_2) / 2;
    };

    // props for the meta sticker
    let { id, position, resolution, type } = stickerData;
    const metaProps = { id, position, resolution, type };

    let fontSize = calculateFontSize(resolution) + "px";

    export let updateLines;
    const update = () => {
        updateLines();
        fontSize = calculateFontSize(resolution) + "px";
    };
</script>

<MetaSticker {...metaProps} updateLines={update} {cancelSticker}>
    <div class="emoji" style="font-size: {fontSize}">
        {type}
    </div>
    <!-- <input id="name-input" placeholder="TEST" /> -->
</MetaSticker>

<style>
    .emoji {
        /* align it to center */
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
