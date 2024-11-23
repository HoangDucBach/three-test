type Picture = {
    [key: string]: string;
}
export const PICTURES: Picture = {
    PICTURE_1: new URL('./picture-1.jpg', import.meta.url).href,
    PICTURE_2: new URL('./picture-2.jpg', import.meta.url).href,
    PICTURE_3: new URL('./picture-1.jpg', import.meta.url).href,
}