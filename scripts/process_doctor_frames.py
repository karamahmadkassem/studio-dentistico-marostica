"""Extract doctor animation frames with original colors and clean alpha edges."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "doctor_nobg.mp4"
OUTPUT_DIR = ROOT / "public" / "images" / "home" / "hero" / "animation"
DEFAULT_WEBP_QUALITY = 82


def compute_alpha(frame: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    green = cv2.inRange(hsv, (35, 60, 60), (85, 255, 255))
    green = cv2.morphologyEx(green, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    green = cv2.morphologyEx(green, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    green = cv2.GaussianBlur(green, (7, 7), 0)

    alpha = cv2.subtract(255, green)
    alpha = cv2.erode(alpha, np.ones((3, 3), np.uint8), iterations=1)
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
    return alpha


def soften_edges(bgr: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    b, g, r = [channel.astype(np.float32) for channel in cv2.split(bgr)]
    a = alpha.astype(np.float32)
    edge = (alpha > 12) & (alpha < 245)
    fade = np.clip(1 - a / 255, 0, 1)

    # Reduce blue/green spill on semi-transparent edges without shifting skin tone.
    max_rb = np.maximum(r, b)
    spill = np.clip(g - max_rb, 0, 255)
    g = g - spill * 0.25 * fade

    blue_excess = np.clip(b - np.maximum(r, g), 0, 255)
    b = b - blue_excess * 0.35 * fade

    # Lift edges toward white for a softer blend on the bright clinic background.
    for channel in (b, g, r):
        lift = (255 - channel) * 0.14 * fade
        channel[edge] = np.clip(channel[edge] + lift[edge], 0, 255)

    return cv2.merge([c.astype(np.uint8) for c in (b, g, r)])


def process_frame(frame: np.ndarray) -> np.ndarray:
    alpha = compute_alpha(frame)
    bgr = soften_edges(frame, alpha)
    return cv2.merge([*cv2.split(bgr), alpha])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--quality",
        type=int,
        default=DEFAULT_WEBP_QUALITY,
        help="WebP quality (82 ~= 100 KB/frame at 1880x1080)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=OUTPUT_DIR,
        help="Directory for exported frame files",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not SOURCE.exists():
        print(f"Missing source video: {SOURCE}", file=sys.stderr)
        return 1

    args.output_dir.mkdir(parents=True, exist_ok=True)

    capture = cv2.VideoCapture(str(SOURCE))
    if not capture.isOpened():
        print(f"Unable to open video: {SOURCE}", file=sys.stderr)
        return 1

    index = 1
    while True:
        ok, frame = capture.read()
        if not ok:
            break

        rgba = process_frame(frame)
        output_path = args.output_dir / f"frame_{index:03d}.webp"
        cv2.imwrite(
            str(output_path),
            rgba,
            [cv2.IMWRITE_WEBP_QUALITY, args.quality],
        )
        index += 1

    capture.release()
    print(f"Wrote {index - 1} frames to {args.output_dir} (quality={args.quality})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
