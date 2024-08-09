const enum COMMANDS {
    PI_CTRL_HEARTBEAT,
    PI_CTRL_MOUSE_MV,
    PI_CTRL_MOUSE_CLICK,
    PI_CTRL_TEXT,
    PI_CTRL_KEYSYM
}

export function getTextEventCommand(charCode: number) {
    return new Uint8Array([COMMANDS.PI_CTRL_TEXT, 1, charCode])
}
