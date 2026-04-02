function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** DiceBear only — xsgames/robohash often 404 or block hotlinking in browsers. */
const STYLES = ["adventurer", "fun-emoji", "lorelei", "notionists", "pixel-art", "thumbs"];

export function holoAvatar(username: string, _size = 56): string {
  const h = hashSeed(username);
  const style = STYLES[h % STYLES.length];
  const seed = encodeURIComponent(username);
  return `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&size=${Math.min(_size, 256)}`;
}
