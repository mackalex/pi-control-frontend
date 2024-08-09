const enum PICTRL_COMMANDS {
    PI_CTRL_HEARTBEAT,
    PI_CTRL_MOUSE_MV,
    PI_CTRL_MOUSE_CLICK,
    PI_CTRL_TEXT,
    PI_CTRL_KEYSYM
}

export const enum PICTRL_MOUSE_BUTTONS {
    PI_CTRL_MOUSE_LEFT,
    PI_CTRL_MOUSE_RIGHT,
}

export const enum PICTRL_MOUSE_CLICK {
    PI_CTRL_MOUSE_UP,
    PI_CTRL_MOUSE_DOWN,
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
export const enum BROWSER_MOUSE_BUTTONS {
    MAIN,
    AUX, // Usually wheel or middle
    SEC, // Usually right click
    FOURTH,
    FIFTH
}

export function getTextEventCommand(charCode: number) {
    return new Uint8Array([PICTRL_COMMANDS.PI_CTRL_TEXT, 1, charCode])
}

export function getMouseClickEventCommand(btn: PICTRL_MOUSE_BUTTONS, click: PICTRL_MOUSE_CLICK) {
    let byte: number = btn << 1;
    byte |= click;
    return new Uint8Array([PICTRL_COMMANDS.PI_CTRL_MOUSE_CLICK, 1, byte])
}