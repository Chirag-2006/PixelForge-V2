export async function fetchAsBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download image");
  return Buffer.from(await res.arrayBuffer());
}
