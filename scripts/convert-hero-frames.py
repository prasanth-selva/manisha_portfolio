#!/usr/bin/env python3
"""Convert supplied 1280x720 PNG hero frames into optimized WebP assets.

Example:
  python3 scripts/convert-hero-frames.py \\
    --source /path/to/original-png-frames \\
    --output public/hero-frames

Original PNG files are never modified. The generated manifest references both
all desktop frames and a lighter mobile subset sampled uniformly through time.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--mobile-frames", type=int, default=48)
    args = parser.parse_args()

    if not 1 <= args.quality <= 100:
        parser.error("--quality must be between 1 and 100")
    if args.mobile_frames < 2:
        parser.error("--mobile-frames must be at least 2")

    sources = sorted(args.source.glob("ezgif-frame-*.png"))
    if len(sources) != 300:
        parser.error(f"Expected exactly 300 ezgif-frame-*.png files; found {len(sources)}")
    args.output.mkdir(parents=True, exist_ok=True)
    desktop_dir = args.output / "desktop"
    mobile_dir = args.output / "mobile"
    desktop_dir.mkdir(parents=True, exist_ok=True)
    mobile_dir.mkdir(parents=True, exist_ok=True)

    widths: set[int] = set()
    heights: set[int] = set()
    for path in sources:
        with Image.open(path) as im:
            image = ImageOps.exif_transpose(im)
            widths.add(image.width)
            heights.add(image.height)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            destination = desktop_dir / f"{path.stem}.webp"
            image.save(destination, "WEBP", quality=args.quality, method=6)

    if len(widths) != 1 or len(heights) != 1:
        parser.error(f"Input frames have inconsistent dimensions: {sorted(widths)} x {sorted(heights)}")

    count = min(args.mobile_frames, len(sources))
    indices = sorted({round(i * (len(sources) - 1) / (count - 1)) for i in range(count)})
    for index in indices:
        source = sources[index]
        with Image.open(desktop_dir / f"{source.stem}.webp") as im:
            im.save(mobile_dir / f"{source.stem}.webp", "WEBP", quality=min(args.quality, 76), method=6)

    desktop_bytes = sum(path.stat().st_size for path in desktop_dir.glob("*.webp"))
    mobile_bytes = sum(path.stat().st_size for path in mobile_dir.glob("*.webp"))
    manifest = {
        "width": next(iter(widths)),
        "height": next(iter(heights)),
        "aspectRatio": next(iter(widths)) / next(iter(heights)),
        "desktop": [f"/hero-frames/desktop/{sources[i].stem}.webp" for i in range(len(sources))],
        "mobile": [f"/hero-frames/mobile/{sources[i].stem}.webp" for i in indices],
        "desktopBytes": desktop_bytes,
        "mobileBytes": mobile_bytes,
        "quality": args.quality,
    }
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Converted {len(sources)} desktop frames ({desktop_bytes / 1024 / 1024:.1f} MiB)")
    print(f"Created {len(indices)} mobile frames ({mobile_bytes / 1024 / 1024:.1f} MiB)")
    print(f"Dimensions: {manifest['width']}x{manifest['height']}; output: {args.output}")


if __name__ == "__main__":
    main()
