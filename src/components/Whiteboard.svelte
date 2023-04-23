<script lang="ts">
    import Konva from "konva";
    import { onMount } from "svelte";
    import { menuStore } from "../stores/menuStore";
    import WhiteboardUtils from "../utils/WhiteboardUtils";

    const width = window.innerWidth;
    const height = window.innerHeight;

    let stage: Konva.Stage;
    // let layers: Konva.Layer[] = [];
    let selectedElements: Array<Konva.Node> = [];
    let isDraggable: boolean;
    let layerCount: number;
    let selectedLayer: number;

    // EXPERIMENTAL
    // let isDrawing = false;
    // let selectionRectangle: Konva.Rect;

    menuStore.subscribe((store) => {
        isDraggable = store.isStageDraggable;
        layerCount = store.workspaceCount;
        selectedLayer = store.workspaceIndex;
    });

    onMount(() => {
        stage = new Konva.Stage({
            container: "whiteboard-container",
            width: width,
            height: height,
            draggable: isDraggable,
            name: "whiteboard-stage",
        });

        // add zooming to the stage
        stage.on("wheel", (event) =>
            WhiteboardUtils.zoomInZoomOut(stage, event)
        );

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

        // add initial layer
        const layer = new Konva.Layer();
        stage.add(layer);

        for (let i = 0; i < 70; i++) {
            const rect = new Konva.Rect({
                x: Math.random() * stage.width(),
                y: Math.random() * stage.height(),
                width: 100,
                height: 100,
                fill: "red",
                stroke: "black",
                draggable: true,
                name: "rectangle",
            });

            layer.add(rect);
        }

        // add transformer to the selected object and remove other ones
        layer.on("dragstart", (event) => {
            selectedElements = WhiteboardUtils.handleDragging(
                selectedElements,
                layer,
                event
            );
        });

        // rmeove transformer on double click
        stage.on("dblclick dbltap", () =>
            WhiteboardUtils.removeTransformers(layer)
        );

        // implemented selection rectangle
        // stage.on("mousedown", () => {
        //     const position = stage.getPointerPosition();
        //     selectionRectangle = new Konva.Rect({
        //         x: position.x,
        //         y: position.y,
        //         width: 0,
        //         height: 0,
        //         stroke: "black",
        //         strokeWidth: 1,
        //         dash: [5, 5],
        //         fill: "rgba(0, 0, 0, 0.1)",
        //         visible: true,
        //         name: "selection-rectangle",
        //     });
        //     layer.add(selectionRectangle);
        //     isDrawing = true;
        // });

        // stage.on("mousemove", () => {
        //     if (!isDrawing) {
        //         return;
        //     }
        //     WhiteboardUtils.handleSelection(stage, selectionRectangle);
        // });

        // stage.on("mouseup", () => {
        //     isDrawing = false;

        //     // remove any selection rectangle
        //     layer.find("Rect").forEach((rect) => {
        //         if (rect.name() === "selection-rectangle") {
        //             rect.destroy();
        //         }
        //     });
        // });
    });
    // const changeWorkspace = () => {
    //     // change from one layer to another
    //     console.log("changeWorkspace called");
    //     console.log("layerCount: ", layerCount);
    //     stage?.removeChildren();
    //     stage?.add(layers[selectedLayer]);
    // };

    // on change of isDraggable call toggleDragging
    $: isDraggable, WhiteboardUtils.toggleDragging(isDraggable, stage);
    // $: layerCount, () => layers.push(WhiteboardUtils.generateNewLayer());
    // $: selectedLayer, changeWorkspace();
</script>

<div id="whiteboard-container" />

<style>
    #whiteboard-container {
        /* make light shadow on the corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
</style>
