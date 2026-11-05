import type { Anchors, Layer, WearableItem } from '../types';

export const STAGE = 1000;

let counter = 0;
export const newUid = () => `l${Date.now().toString(36)}${(counter++).toString(36)}`;

/**
 * Default anchors for a photo when the visitor hasn't marked the eyes:
 * assumes a dog roughly centred, facing the camera.
 */
export const DEFAULT_PHOTO_ANCHORS: Anchors = anchorsFromEyes({ x: 420, y: 380 }, { x: 580, y: 380 });

/**
 * Derive every anchor from the two eye positions (stage units). Uses the same
 * proportions as the illustrated models (eye distance = 0.7 × head radius),
 * and follows the head tilt.
 */
export function anchorsFromEyes(left: { x: number; y: number }, right: { x: number; y: number }): Anchors {
  const dx = right.x - left.x;
  const dy = right.y - left.y;
  const dist = Math.max(20, Math.hypot(dx, dy));
  const R = dist / 0.7;
  const mx = (left.x + right.x) / 2;
  const my = (left.y + right.y) / 2;
  // unit vectors: along the eye line (u) and "down the face" (v)
  const ux = dx / dist;
  const uy = dy / dist;
  const vx = -uy;
  const vy = ux;
  const at = (alongU: number, alongV: number, w: number) => ({
    x: (mx + ux * alongU + vx * alongV) / STAGE,
    y: (my + uy * alongU + vy * alongV) / STAGE,
    w: w / STAGE,
  });
  return {
    eyes: at(0, 0, dist),
    head: at(0, -R * 0.98, R * 1.55),
    earL: at(-R * 0.72, -R * 0.72, R * 0.5),
    earR: at(R * 0.72, -R * 0.72, R * 0.5),
    neck: at(0, R * 1.05, R * 1.2),
    chest: at(0, R * 1.6, R * 1.15),
    body: at(0, R * 2.1, R * 2.2),
  };
}

/** Rotation (deg) implied by anchors that came from tilted eyes. */
export function anchorTilt(a: Anchors): number {
  const dx = a.earR.x - a.earL.x;
  const dy = a.earR.y - a.earL.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** Where an item lands automatically, in stage units. */
export function fitItem(item: WearableItem, anchors: Anchors) {
  const anchor = anchors[item.fit.anchor];
  const ref = anchors[item.fit.widthFrom];
  const w = ref.w * STAGE * item.fit.widthMul;
  const h = (w * item.h) / item.w;
  const rotation = anchorTilt(anchors);
  const rad = (rotation * Math.PI) / 180;
  // shift so that the item's pivot (not its centre) sits on the anchor
  const off = (0.5 - item.fit.pivotY) * h;
  return {
    x: anchor.x * STAGE - Math.sin(rad) * off,
    y: anchor.y * STAGE + Math.cos(rad) * off,
    w,
    h,
    rotation: Math.abs(rotation) < 0.5 ? 0 : rotation,
  };
}

export function createLayer(item: WearableItem, anchors: Anchors): Layer {
  return {
    uid: newUid(),
    key: item.key,
    itemId: item.itemId,
    kind: item.kind,
    name: item.name,
    category: item.category,
    colorName: item.colorName,
    src: item.image,
    ...fitItem(item, anchors),
    opacity: 1,
    flipX: false,
    auto: true,
  };
}

/** Clothes go under accessories; accessories keep the order they were added. */
export function insertLayer(layers: Layer[], layer: Layer): Layer[] {
  if (layer.kind === 'clothes') {
    const firstAcc = layers.findIndex((l) => l.kind === 'accessory');
    if (firstAcc === -1) return [...layers, layer];
    return [...layers.slice(0, firstAcc), layer, ...layers.slice(firstAcc)];
  }
  return [...layers, layer];
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
