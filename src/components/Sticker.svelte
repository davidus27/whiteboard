<script>
  import MetaSticker from "./MetaSticker.svelte";

  // props for the sticker
  export let stickerData;
  let { name, text } = stickerData;

  // props for the meta sticker
  let { id, position, color, resolution, type } = stickerData;
  const metaProps = {id, position, color, resolution, type };
  export let updateLines, cancelSticker;

  // const onClickEvent = (event) => {
  //   const thisDiv = document.getElementById(id);
  //   const clickedElement = event.path[0];

  //   console.log(clickedElement, thisDiv);

  //   if (thisDiv.contains(clickedElement)) {
  //     console.log("Clicked on itself");
  //   } else if (clickedElement.tagName == "DIV") {
  //     console.log("Clicked on a sticker");
  //     lines.push(
  //       new LeaderLine(thisDiv, clickedElement, {
  //         startPlug: "disc",
  //         endPlug: "disc",
  //       })
  //     );

  //     document.removeEventListener("click", onClickEvent);
  //   } else {
  //     console.log("Clicked on background");
  //   }
  // };
</script>

<MetaSticker { ...metaProps } { updateLines } { cancelSticker } >
  <div class="content" style="--color:{color};">
    <input class="name-input" placeholder={name} />
    <div class="text-input">{text}</div>
    <button
      on:click={() => {
        // create mouse click event
        // document.addEventListener("click", onClickEvent);
      }}
      class="connection-btn">+</button
    >
  </div>
</MetaSticker>

<style>

  .name-input {
    /* make transparent */
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 20px;
    font-family: sans-serif;
    width: 100%;

    /* align to the center */
    text-align: center;
    /* lower the padding */
    margin: 0;
  }

  .text-input {
    /* make transparent */
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 20px;
    font-family: sans-serif;
    width: 100%;

    /* align to the center */
    text-align: center;
    /* lower the padding */
    margin: 0;
  }

  .connection-btn {
    /* center make transparent and make it round */
    background-color: transparent;
    /* border: none; */
    outline: none;
    color: white;
    font-size: 20px;
    font-family: sans-serif;
    width: 100%;
    text-align: center;
    margin: 0;
    /* move it to the bottom of the div */
    position: relative;
    bottom: 0;
  }

  /* make placeholders white */
  ::-webkit-input-placeholder {
    color: white;
  }
  ::-moz-placeholder {
    color: white;
  }
</style>
