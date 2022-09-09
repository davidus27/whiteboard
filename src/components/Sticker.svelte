<script>
  import MetaSticker from "./MetaSticker.svelte";
  import { onMount } from "svelte";

  // props for the sticker
  export let stickerData;
  let { name, text } = stickerData;

  // props for the meta sticker
  let { id, position, resolution, type } = stickerData;
  const metaProps = { id, position, resolution, type };
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

  onMount(() => {
    const toolbarOptions = [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ font: [] }],

      ["bold", "italic", "underline", "strike"],
      ["link"],
      
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }], // dropdown with defaults from theme

      // ["clean"],
    ];

    const element = document
      .getElementById(id)
      .getElementsByClassName("editor")[0];
    const quill = new Quill(element, {
      theme: "snow",
      placeholder: text,
      modules: {
        toolbar: toolbarOptions,
      },
    });
  });
</script>

<MetaSticker {...metaProps} {updateLines} {cancelSticker}>
  <!-- <input id="name-input" placeholder={name} />
    <Paper /> -->
  <div class="content">
    <input id="name-input" bind:value={name} placeholder={name} />
    <!-- <textarea id="text-input" placeholder={text} /> -->

    <div class="editor" />
  </div>
</MetaSticker>

<style>
  .content {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    height: 100%;
    width: 100%;
  }

  .editor {
    /* height: 100%; */
    width: 100%;
  }

  #name-input {
    /* make transparent */
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 30px;
    font-family: sans-serif;
    width: 100%;

    /* align to the center */
    text-align: center;
    /* lower the padding */
    padding: 0;
  }

  #text-input {
    /* make transparent */
    background-color: transparent;
    border: none;
    outline: none;

    font-size: 20px;
    font-family: sans-serif;

    width: 90%;
    height: 50%;

    /* align div to the center */
    display: flex;
    justify-content: center;
    align-items: center;

    /* align text to the right */
    text-align: right;

    /* lower the padding */
    border: 10px;

    /* make it nonresizable */
    resize: none;
  }

  #text-input {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: "Baloo 2", Inter, -apple-system, BlinkMacSystemFont, Segoe UI,
      Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
    text-align: center;
    box-sizing: border-box;
    /* margin: 0; */
    position: relative;
    font-weight: 400;
    display: grid;
    border-radius: 1rem;
    background-color: #feecd9;
  }

  /* make placeholders white */
  /* ::-webkit-input-placeholder {
    color: white;
  }
  ::-moz-placeholder {
    color: white;
  } */

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
</style>
