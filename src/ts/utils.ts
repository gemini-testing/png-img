import type {Color} from './types';

function RGBToString(rgb: Color): string {
    return '#' + toStr_(rgb.r) + toStr_(rgb.g) + toStr_(rgb.b);

    ///
    function toStr_(n: number): string {
        const str = n.toString(16);

        return str.length < 2 ? '0' + str : str;
    }
}

function stringToRGBA(string: string): Color | null {
    const match = string.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

    if (!match) {
        return null;
    }

    return {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
        a: 255
    };
}

export = {
    RGBToString,
    stringToRGBA
};
