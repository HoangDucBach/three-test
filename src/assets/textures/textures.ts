type Texture = {
    [key: string]: {
        albedo?: string; // Base color or diffuse color
        ao?: string; // Ambient occlusion
        height?: string; // Height map
        metallic?: string; // Metallic map
        normal: string; // Normal map
        roughness?: string; // Roughness map
    }
}
export const TEXTURES: Texture = {
    WALL: {
        albedo: new URL('./modern-fractured-wallpaper_albedo.png', import.meta.url).href,
        ao: new URL('./modern-fractured-wallpaper_ao.png', import.meta.url).href,
        height: new URL('./modern-fractured-wallpaper_height.png', import.meta.url).href,
        metallic: new URL('./modern-fractured-wallpaper_metallic.png', import.meta.url).href,
        normal: new URL('./modern-fractured-wallpaper_normal-ogl.png', import.meta.url).href,
        roughness: new URL('./modern-fractured-wallpaper_roughness.png', import.meta.url).href,
    }
}