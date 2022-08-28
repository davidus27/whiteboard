<script>
  export let
    position,
    id,
    color = "red",
    resolution,
    type,
    updateLines;

  
  console.log("Created Sticker: ", id);

  export let cancelSticker;

  const setupModifiers = [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 150, height: 150 },
        }),
      ];
  
  if(type != "sticker") {
    setupModifiers.push(
      interact.modifiers.aspectRatio({
        ratio: 1,
      })
    )
  }

  console.log("setupModifiers", setupModifiers);

  interact(".resize-drag")
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },

      listeners: {
        move(event) {
          let target = event.target;
          position.x = parseFloat(target.getAttribute("data-x")) || 0;
          position.y = parseFloat(target.getAttribute("data-y")) || 0;

          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // translate when resizing from top or left edges
          position.x += event.deltaRect.left;
          position.y += event.deltaRect.top;

          target.style.transform =
            "translate(" + position.x + "px," + position.y + "px)";

          target.setAttribute("data-x", position.x);
          target.setAttribute("data-y", position.y);

          resolution.width = event.rect.width + "px";
          resolution.height = event.rect.height + "px";

          updateLines();
        },
      },
      modifiers: setupModifiers,

      // inertia: true,
    })
    .draggable({
      // enable inertial throwing
      // inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,
      },
    });

  function dragMoveListener(event) {
    let target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    position.x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    position.y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform =
      "translate(" + position.x + "px, " + position.y + "px)";

    // update the posiion attributes
    target.setAttribute("data-x", position.x);
    target.setAttribute("data-y", position.y);

    updateLines();
  }

  // this function is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

  // if (type != 'sticker') {
  //   color = 'transparent';
  // }
  
</script>

<div {id} class="resize-drag" style="--color:{color};--width:{resolution.width};--height:{resolution.height}">
  <button class="close" on:click={() => cancelSticker(id)}>X</button>
  <slot></slot>
</div>

<style>
  .close {
    float: right;
    display:inline-block;
    padding:2px 5px;
    /* background:#ccc; */
    z-index: 100;
    /* set background color to partly transparent */
    background: rgba(204, 204, 204, 0);
    border-color: rgba(204, 204, 204, 0);
    color: rgba(0, 0, 0, 0.1);

    /* make it a circle */
    width: 30px;
    height: 30px;
    border-radius: 50%;
 
  }

  .close:hover {
    float:right;
    display:inline-block;
    padding:2px 5px;
    background:#ccc;
    color:#fff;
}

  .resize-drag {
    /* display: flex; */
    width: var(--width);
    height: var(--height);
    border-radius: 8px;
    margin: 1rem;
    background-color: var(--color);
    font-size: 20px;
    font-family: sans-serif;

    touch-action: none;

    /* This makes things *much* easier */
    box-sizing: border-box;
  }

  /* make placeholders white */
  ::-webkit-input-placeholder {
    color: white;
  }
  ::-moz-placeholder {
    color: white;
  }
</style>
