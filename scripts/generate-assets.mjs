// Draws every brand asset from the owner's mark (scripts/brand-mark.mjs) and
// banner (scripts/brand/banner.webp). Run with `npm run assets`; output is committed.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { MARK_H, MARK_PATH, MARK_W } from "./brand-mark.mjs";

/** Mark scaled to `width` user units and centred in a `box` square. */
const placed = (box, width, fill) => {
  const k = width / MARK_W;
  const x = (box - width) / 2;
  const y = (box - MARK_H * k) / 2;
  return `<g transform="translate(${x} ${y}) scale(${k})"><path fill="${fill}" fill-rule="evenodd" d="${MARK_PATH}"/></g>`;
};

/** White mark on the black tile, as in the owner's icon. */
const tile = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#000000"/>
  ${placed(64, 44, "#ffffff")}
</svg>`;

/** Mark alone on transparent ground. */
const bare = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_W} ${MARK_H}"><path fill="#ffffff" fill-rule="evenodd" d="${MARK_PATH}"/></svg>`;

async function png(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 }).resize(size, size).ensureAlpha().png().toBuffer();
}

/** ICO container with PNG payloads (RGBA), which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

await mkdir("public/brand", { recursive: true });
await writeFile("src/app/icon.svg", tile(64));
await writeFile("public/brand/logo-mark.svg", bare);
const sizes = [16, 32, 48];
await writeFile("src/app/favicon.ico", ico(await Promise.all(sizes.map(async (size) => ({ size, data: await png(tile(size), size) })))));
await writeFile("src/app/apple-icon.png", await sharp(Buffer.from(tile(180)), { density: 384 }).resize(180, 180).flatten({ background: "#000000" }).png().toBuffer());
await sharp(Buffer.from(tile(512)), { density: 384 }).resize(512, 512).webp({ quality: 92 }).toFile("public/brand/logo.webp");
await sharp(Buffer.from(bare), { density: 768 }).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 92 }).toFile("public/brand/logo-mark.webp");
// Social card: the owner's banner, cropped around the centred lockup.
await sharp("scripts/brand/banner.webp").resize(1200, 630, { fit: "cover", position: "centre" }).webp({ quality: 90 }).toFile("public/brand/og.webp");
console.log("assets written");
