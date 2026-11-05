"""Remove only the OUTER background of the original logos (flood fill from the
edges) and export web-friendly sizes. The artwork itself is never altered."""
import sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]

def knock_out(path, bg, tol):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    px = im.load(); mp = mask.load()
    from collections import deque
    q = deque()
    for x in range(w):
        q.append((x, 0)); q.append((x, h - 1))
    for y in range(h):
        q.append((0, y)); q.append((w - 1, y))
    def near(c):
        return all(abs(c[i] - bg[i]) <= tol for i in range(3))
    while q:
        x, y = q.popleft()
        if mp[x, y] or not near(px[x, y]):
            continue
        mp[x, y] = 255
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not mp[nx, ny]:
                q.append((nx, ny))
    rgba = im.convert("RGBA")
    alpha = Image.eval(mask, lambda v: 255 - v)
    rgba.putalpha(alpha)
    return rgba.crop(rgba.getbbox())

full = knock_out(f"{src}/logo.jpeg", (255, 255, 255), 18)
sticker = knock_out(f"{src}/logo2.jpeg", (0, 0, 0), 22)
print("full", full.size, "sticker", sticker.size)

def save(img, name, width):
    r = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    r.save(f"{out}/{name}.png", optimize=True)
    r.save(f"{out}/{name}.webp", quality=88, method=6)
    try:
        r.save(f"{out}/{name}.avif", quality=70)
    except Exception as e:
        print("avif skipped", e)
    return r

save(full, "dogstar-logo", 520)
save(sticker, "dogstar-logo-sticker", 520)
# Wordmark = lower band of the original (crop only, no redraw)
W, H = full.size
word = full.crop((0, int(H * 0.79), W, H))
word = word.crop(word.getbbox())
save(word, "dogstar-wordmark", 360)
emb = full.crop((0, 0, W, int(H * 0.76)))
emb = emb.crop(emb.getbbox())
save(emb, "dogstar-emblem", 256)
# favicon / app icons from the emblem on white
for s in (32, 180, 512):
    canvas = Image.new("RGBA", (s, s), (255, 255, 255, 255))
    e = emb.copy(); e.thumbnail((int(s * .92), int(s * .92)), Image.LANCZOS)
    canvas.alpha_composite(e, ((s - e.width) // 2, (s - e.height) // 2))
    canvas.convert("RGB").save(f"{out}/icon-{s}.png", optimize=True)
