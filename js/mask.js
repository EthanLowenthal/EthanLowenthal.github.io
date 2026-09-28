"use strict";

// Pixels of outline added around each glyph, so the fluid parts a little
// before it reaches the text rather than grazing it.
const MASK_DILATION = 2;

// Room around a standalone element mask for the dilation and any glyph that
// pokes past the element's box.
const ELEMENT_MASK_PAD = 8;

// Draws every glyph under `root` in white at its document position, for the
// fluid to treat as an obstacle. Positions come from the live layout, so the
// mask matches whatever font and wrapping the browser actually used. Text
// inside `skip` is left out, for an element that doesn't scroll with the
// document and gets its own mask from buildElementMask instead.
//
// The mask spans the whole document at one texel per CSS pixel (scaled down
// if that would exceed `maxSize`), so scrolling only shifts where the shaders
// sample it. Returns the canvas and the document height it covers.
function buildTextMask(root, width, maxSize, skip) {
  const height = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight
  );
  const scale = Math.min(1, maxSize / width, maxSize / height);

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = maskContext(canvas);
  ctx.scale(scale, scale);
  drawGlyphs(ctx, root, 0, window.scrollY, skip);

  return { canvas, height };
}

// Draws the glyphs under `el` relative to its own box, for an element such as
// a sticky one whose place on screen doesn't follow the document scroll. The
// canvas extends `pad` CSS px past the box on every side; returns both.
function buildElementMask(el) {
  const rect = el.getBoundingClientRect();
  // A zero-sized box means the element is hidden.
  if (rect.width === 0 || rect.height === 0) return null;
  const pad = ELEMENT_MASK_PAD;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(Math.max(rect.width, el.scrollWidth)) + 2 * pad;
  canvas.height = Math.ceil(Math.max(rect.height, el.scrollHeight)) + 2 * pad;
  drawGlyphs(maskContext(canvas), el, pad - rect.left, pad - rect.top);

  return { canvas, pad };
}

function maskContext(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = MASK_DILATION;
  ctx.lineJoin = "round";
  ctx.textBaseline = "alphabetic";
  return ctx;
}

// Draws each glyph under `root` at its viewport position offset by (dx, dy).
function drawGlyphs(ctx, root, dx, dy, skip) {
  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.data;
    const el = node.parentElement;
    if (!text.trim() || el.closest(".visually-hidden")) continue;
    if (skip && skip.contains(el)) continue;

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
      const x = rect.left + dx;
      const y = rect.top + ascent + dy;
      ctx.fillText(ch, x, y);
      ctx.strokeText(ch, x, y);
    }
  }
}
