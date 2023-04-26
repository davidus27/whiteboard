<script lang="ts">
    import Konva from "konva";

    import Stage from "./wrapper/Stage.svelte";
    import Layer from "./wrapper/Layer.svelte";
    import Element from "./Element.svelte";
    // import Rect from "./wrapper/Rect.svelte";
    import { menuStore } from "../stores/menuStore";

    import WhiteboardUtils from "../utils/WhiteboardUtils";

    interface IELement {
        shape: Konva.Shape;
        customName: string;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    let stageContainer: any;
    let stage: Konva.Stage;
    let isDraggable: boolean;

    menuStore.subscribe((store) => {
        isDraggable = store.isStageDraggable;
    });

    const updateDragging = () => {
        menuStore.update((store) => {
            store.isStageDraggable = isDraggable;
            return store;
        });
        WhiteboardUtils.toggleDragging(isDraggable, stage);
    };

    $: isDraggable, updateDragging();

    const currentElements: IELement[] = [
        {
            shape: new Konva.Rect({
                x: 100,
                y: 100,
                width: 100,
                height: 50,
                fill: "green",
                stroke: "black",
                strokeWidth: 4,
                draggable: true,
            }),
            customName: "test",
        }
    ];

    // add random text label
    currentElements.push({
        shape: new Konva.Text({
            x: Math.random() * width,
            y: Math.random() * height,
            text: "Hello World!",
            fontSize: 30,
            fontFamily: "Calibri",
            fill: "green",
            draggable: true,
            name: "test1",
        }),
        customName: "test2",
    });

    // add random stars
    currentElements.push({
        shape: new Konva.Star({
            x: Math.random() * width,
            y: Math.random() * height,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50,
            fill: "yellow",
            stroke: "black",
            strokeWidth: 4,
            draggable: true,
            name: "test2",
        }),
        customName: "test2",
    })


    for (let i = 0; i < 20; i++) {
        currentElements.push({
            shape: new Konva.Rect({
                x: Math.random() * width,
                y: Math.random() * height,
                width: 100 + Math.random() * 100,
                height: 50 + Math.random() * 100,
                fill: Math.random() > 0.5 ? "green" : "red",
                stroke: "black",
                strokeWidth: 4,
                draggable: true,
                name: "test" + i,
            }),
            customName: "test2",
        });
    }

    // on space hold enable dragging else disable
    document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.code === "Space" && !isDraggable) {
            isDraggable = true;
        }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.code === "Space") {
            isDraggable = false;
        }
    });
</script>

<div id="whiteboard-container">
    <div bind:this={stageContainer} class="container" />
</div>

{#if stageContainer}
    <Stage
        {width}
        {height}
        container={stageContainer}
        bind:stage
        draggable={isDraggable}
        on:wheel={(e) => WhiteboardUtils.zoomInZoomOut(stage, e.detail)}
    >
        <Layer>
            {#each currentElements as element}
                <Element node={element.shape} 
                    on:dragstart={(e) => {console.log("dragstarted on: ", e.detail.target.name())}}
                />
            {/each}
        </Layer>
    </Stage>
{/if}

<style>
    #whiteboard-container {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
</style>
