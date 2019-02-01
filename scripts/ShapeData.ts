
export interface IShapeData {
    name: string;
    displayName: string;
    image: string;
    offset: {
        x: number,
        y: number
    },
    center: {
        x: number,
        y: number
    },
    hand1: {
        x: number,
        y: number
    },
    hand2?: {
        x: number,
        y: number
    },
    muzzle?: {
        x: number,
        y: number
    },
    angle?: number
}