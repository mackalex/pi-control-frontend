const enum PICTRL_COMMAND {
    HEARTBEAT,
    MOUSE_MV,
    MOUSE_CLICK,
    TEXT,
    KEYSYM
}

export const enum PICTRL_MOUSE_BUTTON {
    LEFT,
    RIGHT,
}

export const enum PICTRL_MOUSE_CLICK {
    UP,
    DOWN,
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
export const enum BROWSER_MOUSE_BUTTON {
    MAIN,
    AUX, // Usually wheel or middle
    SEC, // Usually right click
    FOURTH,
    FIFTH
}

export function getTextEventCommand(charCode: number) {
    return new Uint8Array([PICTRL_COMMAND.TEXT, 1, charCode])
}

export function getMouseClickEventCommand(btn: PICTRL_MOUSE_BUTTON, click: PICTRL_MOUSE_CLICK) {
    let byte: number = btn << 1;
    byte |= click;
    return new Uint8Array([PICTRL_COMMAND.MOUSE_CLICK, 1, byte])
}