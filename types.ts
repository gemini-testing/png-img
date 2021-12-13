export interface SaveCallback {
    (error: string): void;
};

export interface Size {
    width: number;
    height: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a?: number;
}
