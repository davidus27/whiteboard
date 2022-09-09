<script lang="ts">
    import Sticker from "./Sticker.svelte";
    import Button from "./Button.svelte";
    import Emoji from "./Emoji.svelte";
    import { onMount } from "svelte";
    import CustomMenu from "./context-menu/CustomMenu.svelte";
    import App from "../App.svelte";
    import { getParentSticker } from "../utils/helpFunctions";

    let lines = [];

    const updateLines = () => {
        lines.forEach((line) => {
            line.position();
        });
    };

    const connectionAlreadyExist = (start, end) => {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (
                (line.start === start && line.end === end) ||
                (line.start === end && line.end === start)
            ) {
                return true;
            }
        }
        return false;
    };

    const removeConnectionsFromSticker = (sticker) => {
        // filter the lines that are connected to the sticker
        lines = lines.filter((line) => {
            if (line.start === sticker || line.end === sticker) {
                line.remove();
                return false;
            }
            return true;
        });
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
        text: string;
        id: string;
        name: string;
    }


    const generateId = () => {
        return Math.random().toString(36).substring(2, 9);
    };

    const menuActions = {
        removeSticker: (element: HTMLElement) => {
            console.log("removeSticker", element);
            console.log("sticker: ", getParentSticker(element));
            // get id of the element
            const id = getParentSticker(element)?.getAttribute("id");
            console.log(id);
            // remove the element from the DOM
            cancelSticker(id);
        },
        startConnection: (element: HTMLElement) => {
            console.log("startConnection");

            const stickerElement = getParentSticker(element);
            const sticker = getStickerById(stickerElement?.getAttribute("id"));

            finishConnection(stickerElement);
            return;
        },
        changeColor: (element: HTMLElement) => {
            console.log("changeColor");
        },
        addText: (element: HTMLElement) => {
            console.log("addText");

            const stickerElement = getParentSticker(element);
            const sticker = getStickerById(stickerElement?.getAttribute("id"));

            console.log(stickerElement);
            console.log(sticker);
            // add new text input element
            const input = document.createElement("input");
            input.className = "name-input";
            input.placeholder = "Name";
            input.addEventListener("change", (event) => {
                sticker.text = event.target.value;
            });

            stickerElement?.appendChild(input);
        },
        copySticker: (element: HTMLElement) => {
            console.log("copySticker");
            const stickerElement = getParentSticker(element);
            console.log("stickerElement", stickerElement);
            const id = stickerElement?.getAttribute("id");

            const sticker = getStickerById(id);
            console.log("sticker", sticker);

            addSticker(sticker.type, sticker.name, sticker.text);
        },
    };

    const createTemporaryLine = (startingElement: HTMLElement) => {
        // create a div element that will always be at the mouse position
        const line = document.createElement("div");
        line.id = "tmp-picking-line";
        line.style.position = "absolute";
        line.style.width = "10px";
        line.style.height = "10px";
        line.style.color = "black";

        // add the line to the body
        document.body.appendChild(line);

        // add line to the lines array

        const svgLine = new LeaderLine(startingElement, line, {
            startPlug: "behind",
            endPlug: "endSocket",
            color: "red",
            size: 2,
            path: "fluid",
        });

        const updateLinePosition = (event) => {
            line.style.left = event.clientX + "px";
            line.style.top = event.clientY + "px";
        };

        document.addEventListener("mousemove", (event) => {
            updateLinePosition(event);
            // svgLine.position();
        });

        return {
            svgLine, // the line element
            updateLinePosition, // the function that updates the line position
        };
    };

    const finishConnection = (element: HTMLElement) => {
        // create temporary line
        // const { svgLine, updateLinePosition } = createTemporaryLine(element);

        // add event listener to the mouseup event
        // document
        //     .getElementById("whiteboard")
        //     .addEventListener("click", (e) => {

        //         // document.addEventListener("mousemove", updateLinePosition);
        //         // svgLine.remove();
        //         onStickerClicked(e);
        //     });

        const onStickerClick = (event) => {
            const clickedElement = event.path[0];

            const parent = clickedElement.closest(".resize-drag");
            console.log("clickedElement Parent", parent);

            // if not a sticker, return
            if (!parent || connectionAlreadyExist(element, parent)) {
                console.log("Not going to create a connection");
                return;
            }
            if (parent === element) {
                console.log("Not going to create a connection to itself");
                return;
            }

            lines.push(
                new LeaderLine(element, parent, {
                    startPlug: "disc",
                    endPlug: "disc",
                    hoverStyle: {
                        color: "blue",
                    },
                })
            );

            
            console.log("ending");
            document
                .getElementById("whiteboard")
                .removeEventListener("click", onStickerClick);
        };

        document
            .getElementById("whiteboard")
            .addEventListener("click", onStickerClick);

        return;
    };

    // create an onclick mouse event
    const onStickerClicked = (event) => {
        const clickedElement = event.path[0];

        const parent = clickedElement.closest(".resize-drag");
        console.log("clickedElement Parent", parent);

        // if not a sticker, return
        if (!parent) {
            console.log("Clicked on background");
            pickingLine = null;
            return;
        }

        // if the clicked element is the same as the one we are picking, return
        // or if the connection already exist
        if (
            !pickingLine ||
            pickingLine == parent ||
            connectionAlreadyExist(pickingLine, parent)
        ) {
            pickingLine = parent;
            return;
        }

        lines.push(
            new LeaderLine(pickingLine, parent, {
                startPlug: "disc",
                endPlug: "disc",
            })
        );
        pickingLine = null;

        console.log("ending");
        document
            .getElementById("whiteboard")
            .removeEventListener("click", onStickerClicked);
    };

    const addSticker = (
        type = "sticker",
        initialName = "",
        initialText = ""
    ) => {
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
            text: initialText || "Write something awesome here",
            id: generateId(),
            name: initialName || "Sticker " + (stickers.length + 1),
        });
        stickers = stickers;
        console.log("addSticker", stickers);
    };

    let stickers: Array<StickerData> = [];
    addSticker("sticker");

    const getStickerById = (id: string) => {
        return stickers.find((sticker) => sticker.id === id);
    };

    const cancelSticker = (id: string) => {
        console.log("Cancelling sticker ", id);
        console.log("Stickers before", stickers);

        removeConnectionsFromSticker(document.getElementById(id));
        stickers = stickers.filter((sticker) => sticker.id !== id);
        console.log("Stickers after", stickers);
    };

    onMount(() => {
        // document
        //     .getElementById("whiteboard")
        //     .addEventListener("click", onStickerClicked);
    });
</script>

<div id="whiteboard">
    {#each stickers as sticker}
        {#if sticker.type === "sticker"}
            <Sticker stickerData={sticker} {updateLines} {cancelSticker} />
        {:else}
            <Emoji stickerData={sticker} {updateLines} {cancelSticker} />
        {/if}
    {/each}
    <Button {addSticker} />
    <CustomMenu {...menuActions} />
</div>

<style>
    #whiteboard {
        width: 100%;
        height: 100vh;

        /* make background light blue*/
        background-color: #e6f2ff;
        border: 1px solid rgb(180, 180, 180);
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgb(180, 180, 180);

        /* background: white; */
        background-image: radial-gradient(black 1px, transparent 1px),
            radial-gradient(black 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -19px -19px;
    }

    /* hide and disable scrollbars */
    .whiteboard::-webkit-scrollbar {
        display: none;
    }

    .whiteboard {
        overflow: hidden;
        user-select: none;
        touch-action: none;
        cursor: move;

        margin: 0;
    }

    #draggable {
        width: 100%;
        height: 100%;
        position: relative;
    }
</style>
