export type Size = 'small' | 'medium' | 'large';
export type AnchorName = 'head' | 'eyes' | 'earL' | 'earR' | 'neck' | 'chest' | 'body';

/** Anchor point as fractions (0–1) of the square image; w = reference width. */
export interface Anchor { x: number; y: number; w: number }
export type Anchors = Record<AnchorName, Anchor>;

export interface Breed {
  slug: string;
  name: string;
  size: Size;
  sizeLabel: string;
  coat: string;
  coatLabel: string;
  srd: boolean;
  origin: string;
  traits: string[];
  description: string;
  colors: string[];
  groomings: string[];
  models: string[];
  cover: string;
  source?: string;
}

export interface DogModel {
  id: string;
  breed: string;
  name: string;
  swatches: string[];
  /** grooming id → image path */
  images: Record<string, string>;
  /** grooming id → anchors (optional for real photos) */
  anchors: Record<string, Anchors>;
  source?: string;
}

export interface GroomingStyle {
  id: string;
  name: string;
  short: string;
  description: string;
  coats: string[];
  breeds: string[];
  reference: string;
  referenceBefore: string;
  referenceModel: string;
}

export interface Fit {
  anchor: AnchorName;
  widthFrom: AnchorName;
  widthMul: number;
  pivotY: number;
}

export interface ClothingColor { id: string; name: string; hex: string; image: string; w: number; h: number }

export interface Clothing {
  id: string;
  name: string;
  category: string;
  description: string;
  sizes: string[];
  colors: ClothingColor[];
  fit: Fit;
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  w: number;
  h: number;
  fit: Fit;
}

/** Something that can be put on the dog in the editor. */
export interface WearableItem {
  key: string; // unique: clothing "id:color" or accessory id
  itemId: string;
  kind: 'clothes' | 'accessory';
  name: string;
  category: string;
  colorName?: string;
  image: string;
  w: number;
  h: number;
  fit: Fit;
}

export interface Layer {
  uid: string;
  key: string;
  itemId: string;
  kind: 'clothes' | 'accessory';
  name: string;
  category: string;
  colorName?: string;
  src: string;
  /** centre + size in stage units (0–1000) */
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  flipX: boolean;
  /** still at its automatic position (re-fits when the base changes) */
  auto: boolean;
}

export type Backdrop = 'star' | 'paper' | 'white';

export type Subject =
  | { kind: 'model'; modelId: string }
  | { kind: 'photo'; photoId: string };

export interface EditorDoc {
  layers: Layer[];
  grooming: string;
  backdrop: Backdrop;
  /** custom anchors for photos (eyes calibration) */
  photoAnchors?: Anchors | null;
}

export interface SavedLook {
  id: string;
  createdAt: number;
  title: string;
  subject: Subject;
  doc: EditorDoc;
  thumbnail: Blob;
  photo?: Blob;
}
