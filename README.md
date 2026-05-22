# n8n-nodes-video-api-hub

An n8n community node for [Video Api Hub](https://videoapihub.com) — create, render, and transform videos directly from your n8n workflows.

[![npm](https://img.shields.io/npm/v/n8n-nodes-video-api-hub)](https://www.npmjs.com/package/n8n-nodes-video-api-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-video-api-hub
```

## Credentials

1. Sign up at [videoapihub.com](https://videoapihub.com)
2. Copy your API key (format: `vah_...`)
3. In n8n, create a new **Video Api Hub API** credential and paste your key

## Resources & Operations

One node, eight resources, covering the full Video Api Hub API.

### HTML Video ⭐

Render HTML compositions to video using [Hyperframes](https://github.com/heygen-com/hyperframes). Write standard HTML with CSS, GSAP animations, Lottie, Google Fonts, or any browser-renderable content — rendered frame-by-frame via headless Chrome and encoded to MP4.

| Operation | Description |
|-----------|-------------|
| **Create HTML Video** | Render an HTML composition to video. Accepts raw HTML (auto Base64-encoded), width, height, FPS, output format, and injectable variables (`window.__hfVariables`) |

**HTML Composition Rules:**
- Use GSAP for animations: `gsap.timeline({ paused: true })`
- Register timeline: `window.__timelines["<composition-id>"] = tl`
- Root element needs: `data-composition-id`, `data-start="0"`, `data-width`, `data-height`
- Each clip needs: `id`, `class="clip"`, `data-start`, `data-duration`, `data-track-index`
- GSAP CDN: `https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js`
- Google Fonts work via `<link>` tags

### Create Video

| Operation | Description |
|-----------|-------------|
| **Create from Design** | Build a video from layers (text, images, GIFs, video clips, audio, shapes) with canvas presets, backgrounds, animations, and font controls |
| **Create Slideshow** | Turn a series of images into a video with optional background music |
| **Merge Videos** | Join several videos together, played one after another |

### Edit Video

| Operation | Description |
|-----------|-------------|
| **Clip** | Cut a section from a video by start time and duration |
| **Extract Multiple Clips** | Cut several segments at once (specific times or evenly spaced) |
| **Resize** | Change aspect ratio with presets (16:9, 9:16, 1:1, etc.) or custom dimensions |
| **Convert Format** | Convert between MP4, WebM, MOV, and MKV |
| **Run Custom Command** | Run a custom FFmpeg command for advanced processing |

### Video Audio

| Operation | Description |
|-----------|-------------|
| **Add Audio** | Add background music or replace existing audio (volume, delay, trim) |
| **Remove Audio** | Strip the audio track from a video |
| **Extract Audio** | Save the audio track as MP3 or other formats |

### Video Thumbnail

| Operation | Description |
|-----------|-------------|
| **Get Thumbnail** | Capture a single frame as JPEG/PNG |
| **Thumbnail with Text** | Capture a frame and overlay text or a logo |
| **Take Screenshots** | Capture multiple frames (fixed count, specific times, or random) |

### Template

| Operation | Description |
|-----------|-------------|
| **Render** | Generate a video from a saved template by filling in variables |

### Job

| Operation | Description |
|-----------|-------------|
| **Get Result** | Download the output file or get a download link for a completed job |

### File

| Operation | Description |
|-----------|-------------|
| **Upload File** | Upload a file from a previous node (binary data) |
| **Download File** | Download as binary data or get a temporary download link |

## Output Types

Every video operation supports these output modes:

| Mode | Description |
|------|-------------|
| **File** | Download the file directly when the job completes |
| **Public URL** | Permanent public link — no authentication needed |
| **Download Link** | Temporary signed URL that expires (configurable) |
| **Save to Storage** | Store in your VideoApiHub dashboard for later use |

## Typical Workflow

1. **Upload** a video or provide a URL
2. **Process** it (clip, resize, add audio, render HTML, etc.) — returns a `task_id`
3. **Get Result** with Job → Get Result (returns the file, URL, or binary data)

## Links

- [Video Api Hub](https://videoapihub.com)
- [API Documentation](https://docs.videoapihub.com)
- [npm Package](https://www.npmjs.com/package/n8n-nodes-video-api-hub)
- [GitHub Repository](https://github.com/VideoApiHub/n8n-nodes-video-api-hub)

## License

[MIT](LICENSE.md)

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
