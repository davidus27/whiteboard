import { writable } from "svelte/store";

interface MenuState {
    isStageDraggable: boolean;
    workspaceCount: number;
    workspaceIndex: number;
};

const initialState: MenuState = {
    isStageDraggable: false,
    workspaceCount: 1,
    workspaceIndex: 0,
};


export const menuStore = writable(initialState);
