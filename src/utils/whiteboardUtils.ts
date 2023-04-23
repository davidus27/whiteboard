import Konva from "konva";

namespace WhiteboardUtils {
    export const NUMBER = 200;
    export const MAX_WIDTH = 200;
    export const SCALE_BY = 1.025;
    export const MAX_SCALE = 5;
    export const MIN_SCALE = 0.25;


    export const generateNewTransformer = () => {
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
    };

    export const zoomInZoomOut = (stage: Konva.Stage, event: Konva.KonvaEventObject<WheelEvent>) => {
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

        // calculate new scale
        let newScale =
            direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

        // limit scale
        newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    export const removeTransformers = (layer: Konva.Layer) => {
        layer.find("Transformer")?.forEach((tr) => {
            tr.destroy();
        });
    };

    export const handleDragging = (
        selected: Array<Konva.Node>,
        layer: Konva.Layer,
        event: Konva.KonvaEventObject<DragEvent>
    ) => {
        // remove all transformers if they are not selected
        if (selected.includes(event.target)) {
            return selected;
        }
        removeTransformers(layer);
        selected = selected.filter((node) => node == event.target);

        // add new transformer to the selected object
        const tr = generateNewTransformer();
        tr.nodes([event.target]);
        selected.push(event.target);
        layer.add(tr);
        return selected;
    };

    export const handleSelection = (stage: Konva.Stage, selectionRectangle: Konva.Rect) => {
        const layer = stage.children[0] as Konva.Layer;
        // remove previous selection
        WhiteboardUtils.removeTransformers(layer);
        // selected = [];
        // selectionNames = {};

        const position = stage.getPointerPosition();
        selectionRectangle.width(position.x - selectionRectangle.x());
        selectionRectangle.height(position.y - selectionRectangle.y());


        // add transformer to the selected objects inside the selection rectangle
        // go over all shapes in the layer
        // console.log(layer.find("Shape"));
        // layer.find("Circle").forEach((shape: Konva.Shape) => {
        // if (shape.name() === "selection-rectangle") {
        //     return;
        // }
        // if (isIntersecting(selectionRectangle, shape)) {
        //     if (!selectionNames[shape.name()]) {
        //         selectionNames[shape.name()] = shape;
        //         console.log("intersecting", shape.name());
        //     }
        // }
        // });
        // for(const key in selectionNames) {
        //     const tr = generateNewTransformer();
        //     tr.nodes([selectionNames[key]]);
        //     layer.add(tr);
        // }
        // selectionNames = {};
    }

    export const changeWorkspace = (stage: Konva.Stage, layers: Konva.Layer[], selectedLayer: number) => {
        // change from one layer to another
        stage?.removeChildren();
        stage?.add(layers[selectedLayer]);
    };

    export const generateNewLayer = () => {
        console.log("generating new layer");
        const layer = new Konva.Layer();
        for (let i = 0; i < NUMBER; i++) {
            layer.add(generateNode(i));
        }
        return layer;
    }

    export const isIntersecting = (selection: Konva.Shape, element: Konva.Shape) => {
        const selectionBox = selection.getClientRect();
        const elementBox = element.getClientRect();
        return (
            selectionBox.x < elementBox.x + elementBox.width &&
            selectionBox.x + selectionBox.width > elementBox.x &&
            selectionBox.y < elementBox.y + elementBox.height &&
            selectionBox.y + selectionBox.height > elementBox.y
        );
    };

    export const generateNode = (index: number) => {
        const WIDTH = 3000;
        const HEIGHT = 3000;

        return new Konva.Circle({
            x: WIDTH * Math.random(),
            y: HEIGHT * Math.random(),
            radius: 1 + Math.random() * 99,
            name: `node-${index}`,
            fill: ["red", "green", "blue", "yellow"][
                Math.floor(Math.random() * 4)
            ],
            stroke: "black",
            draggable: true,
        });
    };

    export const toggleDragging = (isDraggable: boolean, stage: Konva.Stage) => {
        // TODO: there must be a better way to do this
        stage?.draggable(isDraggable);
        for (let i = 0; i < stage?.children.length; i++) {
            for (let j = 0; j < stage.children[i].children.length; j++) {
                stage?.children[i].children[j].draggable(!isDraggable);
            }
        }
    };
}

export default WhiteboardUtils;