<script lang="ts">
	import Konva from 'konva';
	import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';

	const WIDTH = 3000;
	const HEIGHT = 3000;
	const NUMBER = 200;
	const MAX_WIDTH = 200;
    const SCALE_BY = 1.025;


	const width = window.innerWidth;
	const height = window.innerHeight;

	let stage: Konva.Stage;
    let selected: Array<Konva.Node> = [];
	export let isDraggable = false;
    export let whiteboardObjects: WhiteboardElement[] = [];

	const generateNewTransformer = () => {
		return new Konva.Transformer({
			boundBoxFunc: function (oldBoundBox, newBoundBox) {
			// "boundBox" is an object with
			// x, y, width, height and rotation properties
			// transformer tool will try to fit nodes into that box

			// the logic is simple, if new width is too big
			// we will return previous state
			if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
				return oldBoundBox;
			}

			return newBoundBox;
        },
      });
	}
    
    const zoomInZoomOut = (event: Konva.KonvaEventObject<WheelEvent>) => {
            // stop default scrolling
            event.evt.preventDefault();

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = event.evt.deltaY > 0 ? 1 : -1;

            // when we zoom on trackpad, e.evt.ctrlKey is true
            // in that case lets revert direction
            if (event.evt.ctrlKey) {
                direction = -direction;
            }

            const newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);
    }

	const removeTransformers = (layer: Konva.Layer) => {
		layer.find('Transformer')?.forEach((tr) => {
			tr.destroy();
		});
	}

    const handleDragging = (layer: Konva.Layer, event: Konva.KonvaEventObject<DragEvent>) => {
            
            // remove all transformers if they are not selected
            if (selected.includes(event.target)) {
                return;
            }
            removeTransformers(layer);
            selected = selected.filter((node) => node == event.target);
            console.log("Selected: ", selected);

            const tr = generateNewTransformer();
            tr.nodes([event.target]);

            selected.push(event.target);

            layer.add(tr);
    }

	const generateNode = (index: number) => {
		return new Konva.Circle({
			x: WIDTH * Math.random(),
			y: HEIGHT * Math.random(),
			radius: 1 + Math.random() * 99,
			name: `node-${index}`,
			fill: ["red", "green", "blue", "yellow"][Math.floor(Math.random() * 4)],
			stroke: 'black',
			draggable: true,
		});
	}

	const toggleDragging = () => {
		// TODO: there must be a better way to do this
		console.log("Toggle dragging was called");
		stage?.draggable(isDraggable);
		for (let i = 0; i < stage?.children.length; i++) {
			for (let j = 0; j < stage.children[i].children.length; j++) {
				stage?.children[i].children[j].draggable(!isDraggable);
			}			
		}
	}

	onMount(() => {
        stage = new Konva.Stage({
            container: 'whiteboard-container',
            width: width,
            height: height,
            draggable: isDraggable,
        });

        // add zooming to the stage
        stage.on('wheel', zoomInZoomOut);

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

        // add new layer to the stage
        const layer = new Konva.Layer();
        stage.add(layer);

        for (let i = 0; i < NUMBER; i++) {
            layer.add(generateNode(i));
        }

        // add transformer to the selected object and remove other ones
        layer.on('dragstart', (evt) => handleDragging(layer, evt));

        // rmeove transformer on double click
        stage.on('dblclick dbltap', (evt) => {
            removeTransformers(layer);
        });
        
	});

    // on change of isDraggable call toggleDragging
    $: isDraggable, toggleDragging();

</script>

<div id="whiteboard-container">
    <!-- <btn>Hello</btn> -->
</div>

<style>
	#whiteboard-container {
		/* make light shadow on the corners */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}
</style>
