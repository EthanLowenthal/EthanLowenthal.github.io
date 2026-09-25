"use strict";

// Pixels of outline added around each glyph, so the fluid parts a little
// before it reaches the text rather than grazing it.
const MASK_DILATION = 2;

// Draws every glyph under `root` in white at its document position, for the
// fluid to treat as an obstacle. Positions come from the live layout, so the
// mask matches whatever font and wrapping the browser actually used.
//
// The mask spans the whole document at one texel per CSS pixel (scaled down
// if that would exceed `maxSize`), so scrolling only shifts where the shaders
// sample it. Returns the canvas and the document height it covers.
function buildTextMask(root, width, maxSize) {
  const height = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  const scale = Math.min(1, maxSize / width, maxSize / height);

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = MASK_DILATION;
  ctx.lineJoin = "round";
  ctx.textBaseline = "alphabetic";

  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.data;
    const el = node.parentElement;
    if (!text.trim() || el.closest(".visually-hidden")) continue;

    // Built by hand: Firefox's computed `font` shorthand can be empty.
    const style = getComputedStyle(el);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    // A character's rect is its font's content area, so its top sits one
    // font ascent above the baseline.
    const ascent =
      ctx.measureText("M").fontBoundingBoxAscent ??
      parseFloat(style.fontSize) * 0.984;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === " " || ch === "\n" || ch === "\t") continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getBoundingClientRect();
      // Nothing to draw for text inside a display: none box.
      if (rect.width === 0) continue;
      const x = rect.left;
      const y = rect.top + window.scrollY + ascent;
      ctx.fillText(ch, x, y);
      ctx.strokeText(ch, x, y);
    }
  }

  return { canvas, height };
}
