<script>
	import Menu from "./Menu.svelte";
	import MenuOption from "./MenuOption.svelte";
	import MenuDivider from "./MenuDivider.svelte";
	import {
		elementIsSticker,
		elementIsEmoji,
	} from "../../utils/helpFunctions";

	export let removeSticker,
		startConnection,
		changeColor,
		addText,
		copySticker;

	let pos = { x: 0, y: 0 };
	let showMenu = false;
	let selectedElement;

	const onRightClick = async (e) => {
		if (showMenu) {
			showMenu = false;
			await new Promise((res) => setTimeout(res, 100));
		}

		pos = { x: e.clientX, y: e.clientY };
		selectedElement = e.target;
		showMenu = true;
	};

	const closeMenu = () => {
		showMenu = false;
	};

	const wrapFunction = (callback) => {
		return () => {
			callback(selectedElement);
			closeMenu();
		};
	};
</script>

{#if showMenu}
	{#if !elementIsSticker(selectedElement)}
		<Menu
			{...pos}
			{selectedElement}
			on:click={closeMenu}
			on:clickoutside={closeMenu}
		>
			<MenuOption isDisabled={true} text="Nothing to do here 😔" />
		</Menu>
	{:else if elementIsEmoji(selectedElement)}
		<Menu
			{...pos}
			{selectedElement}
			on:click={closeMenu}
			on:clickoutside={closeMenu}
		>
			<MenuOption on:click={wrapFunction(copySticker)}>
				<div class="icon">✂️</div>
				Copy this emoji
			</MenuOption>
			<MenuOption on:click={wrapFunction(removeSticker)}>
				<div class="icon">🗑</div>
				Remove this emoji
			</MenuOption>
			<MenuOption on:click={wrapFunction(startConnection)}>
				<div class="icon">🕸</div>
				Add connection
			</MenuOption>
			<MenuOption on:click={wrapFunction(addText)}>
				<div class="icon">𝕋</div>
				Add text
			</MenuOption>
			<MenuDivider />
			<MenuOption
				isDisabled={true}
				text="Other functionalities comming soon..."
			/>
		</Menu>
	{:else}
		<Menu
			{...pos}
			{selectedElement}
			on:click={closeMenu}
			on:clickoutside={closeMenu}
		>
			<MenuOption on:click={wrapFunction(copySticker)}>
				<div class="icon">✂️</div>
				Copy this sticker
			</MenuOption>
			<MenuOption on:click={wrapFunction(removeSticker)}>
				<div class="icon">🗑</div>
				Remove this sticker
			</MenuOption>
			<MenuOption on:click={wrapFunction(startConnection)}>
				<div class="icon">🕸</div>
				Add connection
			</MenuOption>
			<MenuDivider />
			<MenuOption isDisabled={true} text="Other functionalities" />
			<MenuOption on:click={wrapFunction(changeColor)}>
				<div class="icon">🎨</div>
				Change color
			</MenuOption>
		</Menu>
	{/if}
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />

<style>
	.icon {
		font-size: 20px;
		font-weight: bold;
	}
</style>
