<script lang="ts">
    import { onDestroy, setContext, onMount, afterUpdate } from "svelte";
    import Konva from "konva";
    import { stageKey, eventNames } from "../../utils/wrapperUtils";
    import { createEventDispatcher } from "svelte";
    const dispatcher = createEventDispatcher();
    
    export let container: string;

    export let width: number;
    export let height: number;
    export let draggable = false;
    const scale = 1;
  
    export let stage: Konva.Stage;
    setContext(stageKey, {
      getStage: () => stage,
    });
  
    onMount(async () => {
      stage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        scaleX: scale,
        scaleY: scale,
        draggable: draggable,
      });
      eventNames.forEach((event_name) => {
        stage.on(event_name, (args: Konva.KonvaEventObject<any>) => {
          dispatcher(event_name, { ...args });
        });
      });
    });
  
    afterUpdate(() => {
      // probably not gonna do this since we want to keep the scale
      // alternative would be store scale as a prop and update it
      // stage.scaleX(scale);
      // stage.scaleY(scale);
      stage.setAttr("width", width);
      stage.setAttr("height", height);
    });
  
    onDestroy(() => {
      if (stage) stage.remove();
    });
  </script>
  
  {#if stage}
    <slot />
  {/if}