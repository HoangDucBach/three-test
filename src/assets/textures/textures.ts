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
        albedo: new URL('./fiber-textured-wall1_albedo.png', import.meta.url).href,
        ao: new URL('./fiber-textured-wall1_ao.png', import.meta.url).href,
        height: new URL('./fiber-textured-wall1_height.png', import.meta.url).href,
        metallic: new URL('./fiber-textured-wall1_metallic.png', import.meta.url).href,
        normal: new URL('./fiber-textured-wall1_normal-ogl.png', import.meta.url).href,
        roughness: new URL('./fiber-textured-wall1_roughness.png', import.meta.url).href,
    }
}