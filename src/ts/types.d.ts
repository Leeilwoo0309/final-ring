type KeyDown = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
    e: {
        isDown: boolean,
        dashLength: number,
        cooltime: number,
    },
    f: {
        isDown: boolean,
        cooltime: number
    },
    mouse: boolean,
};