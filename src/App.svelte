<script lang="ts">
	import Whiteboard from "./components/Whiteboard.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		const startElement = document.getElementById("pointer");
		const endElement = document.getElementById("add-sticker-btn");
		console.log("start:", startElement, endElement);
		const line = new LeaderLine(
			LeaderLine.mouseHoverAnchor(startElement, "draw", {
				animOptions: {
					duration: 1000,
				},
			}),
			endElement
		);
		line.setOptions({
			startSocketGravity: [-150, 0],
			dash: { animation: true },
			animOptions: {
				duration: 3000,
			},
			size: 8,
		});
	});
</script>

<div>
	<h1>Welcome to your whiteboard! 👋</h1>
	<h3><b id="pointer">Add</b> new stickers or emojis fast and easy</h3>
	<Whiteboard />
</div>

<style>
	div {
		text-align: center;
		/* make it bigger */
	}
	h1 {
		font-size: 3em;
	}
</style>
