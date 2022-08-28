<script>
	import { fly } from 'svelte/transition';

    let pickedEmoji;
    export let handleEmojiPicked;
	
	let emojiSets = [
		{ type: "faces", minVal:128512, maxVal: 128580 },
		{ type: "faces2", minVal:129296, maxVal: 129327},
		{ type: "body", minVal:128066, maxVal: 128080},
		{ type: "animals", minVal:129408, maxVal: 129442},
		{ type: "transport", minVal:128640, maxVal: 128676},
		{ type: "misc", minVal:129494, maxVal: 129535},
			
	];
	
	let selectedSet = 0;
	// $: console.log(selectedSet)
	$: min = emojiSets[selectedSet].minVal;
	$: max = emojiSets[selectedSet].maxVal;
	
	// storage of emojis to make emoji keyboard
	let emojis = [];
	
	$: for (let i = min; i <= max; i++) {
		//console.log(String.fromCharCode(i))
		emojis = [...emojis, String.fromCodePoint(i)]
	}
	
	const clearEmojiMenu = () => emojis = []; 
	
	const chooseEmojiSet = (e) => {	
		selectedSet = Number(e.target.dataset.id);
		clearEmojiMenu()
	}

	// Header on emoji keyboard to select different emoji sets
	let setIcons = [128512, 129313, 128074, 129417, 128664, 129504]
	
	// Emoji icon to open modal of emojis
	// let emojiIcon = String.fromCodePoint(128571);
	
	// Modal of emoji keyboard
	export let modalOpen = true;

	
	const addEmoji = (e) => {
        pickedEmoji = e.target.textContent;
        handleEmojiPicked(pickedEmoji);
	}
</script>


<section>
    <!-- <div id="btn-emoji-icon-cont">
        <div id="emoji-opener-icon" on:click={() => modalOpen = true}>{emojiIcon}</div>
    </div> -->

	{#if modalOpen}
		<div id="emoji-cont" transition:fly={{ y: -30 }}>
			<header>
				{#each setIcons as icon, i}
					<div data-id={i} on:click={chooseEmojiSet}>{String.fromCodePoint(icon)}</div>		
				{/each}
					<div id="closer-icon" on:click={() => modalOpen = false}>X</div>
			</header>

			{#each emojis as emoji}
				<span on:click={addEmoji}>{emoji}</span>
			{/each}
		</div>
	{/if}
</section>	


<style>
  * {box-sizing: border-box;}

	section {
		width: 300px;
		margin: 0 auto;
	}
	
	#emoji-cont {
		max-width: 300px;
		max-height: 248px;
		overflow: scroll;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-left: 10px;
	}
	
	#emoji-cont header {
		width: 98%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border: 1px solid gray;
	}
	
	#emoji-cont header div {
		cursor: pointer;
	}
	
	span {
		font-size: 1.5rem;
		padding: .3rem;
		border: 1px solid gray;
		background: #eee;
		cursor: pointer;
	}
	
	span:active {
		background: #fff;
	}
	
	#closer-icon {
		font-size: 1.5rem;
		font-weight: bold;
		text-align: right;
	}
</style>