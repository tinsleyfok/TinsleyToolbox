/** `public/` file URL with Vite `base` (works on GitHub Pages and `/`). */
export function publicUrl(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export const tinsleyProfilePhoto = publicUrl("Image/avatar-tinsley.png");
