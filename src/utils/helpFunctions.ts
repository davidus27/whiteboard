
export const getParentSticker = (element: HTMLElement): HTMLElement => {
    return element.closest(".resize-drag");
};


export const elementIsSticker = (element: HTMLElement): boolean => {
    return !!element.closest(".resize-drag");
};

export const elementIsEmoji = (element: HTMLElement): boolean => {
    return !!element.closest(".emoji")
};


