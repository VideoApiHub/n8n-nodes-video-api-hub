# n8n-nodes-video-api-hub

An n8n community node for [Video Api Hub](https://videoapihub.com) — process, create, and transform videos directly from your n8n workflows.

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-video-api-hub
```

## Credentials

You need a Video Api Hub API key to use this node.

1. Sign up at [videoapihub.com](https://videoapihub.com)
2. Copy your API key (format: `vah_...`)
3. In n8n, create a new **Video Api Hub API** credential and paste your key

## Node: Video Api Hub

One node with five resources covering every Video Api Hub API endpoint.

### Video

| Operation | Description |
|-----------|-------------|
| **Create from Design** | Build a video from layers (text, images, GIFs, video clips, audio, shapes) with canvas presets, background colors/gradients, animations, and font controls |
| **Create Slideshow** | Turn a series of images into a video with optional background music |
| **Clip** | Cut a section from a video by start time and duration |
| **Extract Multiple Clips** | Cut several segments at once (pick specific times or evenly spaced) |
| **Resize** | Change aspect ratio with presets (16:9, 9:16, 1:1, etc.) or custom dimensions |
| **Convert Format** | Convert between MP4, WebM, MOV, and MKV |
| **Add Audio** | Add background music or replace existing audio (with volume, delay, trim controls) |
| **Remove Audio** | Strip the audio track from a video |
| **Extract Audio** | Save the audio track as an MP3 file |
| **Get Thumbnail** | Capture a single frame as a JPEG image |
| **Thumbnail with Text** | Capture a frame and overlay text or a logo |
| **Take Screenshots** | Capture multiple frames (fixed count, specific times, or random) |
| **Run Custom Command** | Run a custom FFmpeg command for advanced processing |

### File

| Operation | Description |
|-----------|-------------|
| **Upload File** | Upload a file directly from a previous node (binary data) |
| **Download File** | Download a file as binary data or get a temporary download link |

### Template

| Operation | Description |
|-----------|-------------|
| **Render** | Generate a video from a saved template by filling in variables |

### Job

| Operation | Description |
|-----------|-------------|
| **Check Status** | See if a job is queued, processing, completed, or failed (with progress %) |
| **Get Result** | Download the output file or get a download link for a completed job |

### Account

| Operation | Description |
|-----------|-------------|
| **My Account** | View your plan, API key info, and current usage |
| **Health Check** | Verify the service is running |
| **View Plans** | See available subscription plans and features |

## Typical Workflow

1. **Upload** a video using the File → Upload File operation
2. **Process** it (clip, resize, add audio, etc.) — returns a `task_id`
3. **Poll** with Job → Check Status until `status` is `completed`
4. **Download** with Job → Get Result (returns the file directly)

## Links

- [Video Api Hub Documentation](https://docs.videoapihub.com)
- [npm Package](https://www.npmjs.com/package/n8n-nodes-video-api-hub)
- [GitHub Repository](https://github.com/VideoApiHub/n8n-nodes-video-api-hub)

## License

[MIT](LICENSE.md)

### 11. Submit for Verification (Optional)

Get your node verified for n8n Cloud:

1. Ensure your node meets the [requirements](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/):
   - Uses MIT license ✅ (included in this starter)
   - No external package dependencies
   - Follows n8n's design guidelines
   - Passes quality and security review

2. Submit through the [n8n Creator Portal](https://creators.n8n.io/nodes)

**Benefits of verification:**

- Available directly in n8n Cloud
- Discoverable in the n8n nodes panel
- Verified badge for quality assurance
- Increased visibility in the n8n community

## Available Scripts

This starter includes several npm scripts to streamline development:

| Script                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `npm run dev`         | Start n8n with your node and watch for changes (runs `n8n-node dev`)        |
| `npm run build`       | Compile TypeScript to JavaScript for production (runs `n8n-node build`)     |
| `npm run build:watch` | Build in watch mode (auto-rebuild on changes)                               |
| `npm run lint`        | Check your code for errors and style issues (runs `n8n-node lint`)          |
| `npm run lint:fix`    | Automatically fix linting issues when possible (runs `n8n-node lint --fix`) |
| `npm run release`     | Create a new release (runs `n8n-node release`)                              |

> [!TIP]
> These scripts use the [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli) under the hood. You can also run CLI commands directly, e.g., `npx n8n-node dev`.

## Troubleshooting

### My node doesn't appear in n8n

1. Make sure you ran `npm install` to install dependencies
2. Check that your node is listed in `package.json` under `n8n.nodes`
3. Restart the dev server with `npm run dev`
4. Check the console for any error messages

### Linting errors

Run `npm run lint:fix` to automatically fix most common issues. For remaining errors, check the [n8n node development guidelines](https://docs.n8n.io/integrations/creating-nodes/).

### TypeScript errors

Make sure you're using Node.js v22 or higher and have run `npm install` to get all type definitions.

## Resources

- **[n8n Node Documentation](https://docs.n8n.io/integrations/creating-nodes/)** - Complete guide to building nodes
- **[n8n Community Forum](https://community.n8n.io/)** - Get help and share your nodes
- **[@n8n/node-cli Documentation](https://www.npmjs.com/package/@n8n/node-cli)** - CLI tool reference
- **[n8n Creator Portal](https://creators.n8n.io/nodes)** - Submit your node for verification
- **[Submit Community Nodes Guide](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/)** - Verification requirements and process

## Contributing

Have suggestions for improving this starter? [Open an issue](https://github.com/n8n-io/n8n-nodes-starter/issues) or submit a pull request!

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
