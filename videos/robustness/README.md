# Real-world robustness videos

[Browse the 24 clips](https://dill-vla.github.io/videos/robustness/)

Web-ready copies of the author-supplied real-world demo clips.

- H.264 MP4, 640 × 480, 30 fps, with fast-start playback.
- Original duration and playback speed are preserved.
- File names start with the task, followed by `--` and the original condition label.
- `train` identifies the supplied training-setting clip. Noise numbers retain the original source identifiers.
- The source spelling `lightning` is retained in file names and shown as “Lighting” in the viewer.

These are compressed presentation copies; original source videos remain unchanged.
The 24 videos total 57.2 MiB. `manifest.json` maps each file to its original relative path and records its SHA-256 checksum.

For embedding a clip in the project page:

```html
<video controls muted loop playsinline preload="metadata" width="640" height="480">
  <source src="videos/robustness/close-the-laptop--train.mp4" type="video/mp4">
</video>
```

Add `autoplay` for silent automatic looping, respecting the visitor's reduced-motion preference. The viewer loads only the selected clip, rather than all 24 at once.
