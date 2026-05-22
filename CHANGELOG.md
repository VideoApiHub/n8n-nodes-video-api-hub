# Changelog

## 0.6.0

### Added

- **HTML Video** resource — render HTML compositions (Hyperframes) to video via `POST /v1/video/create-html`
  - Accepts raw HTML, auto Base64-encodes before sending
  - Supports width, height, FPS, output format (mp4/mov)
  - Injectable variables via `window.__hfVariables`
  - All standard output types (file, public_url, signed_url, stored)
- Improved README with full resource/operation documentation

## 0.5.4

- fix: add status completed to binary file job result

## 0.5.3

- fix: public_url job result should not override with ?response=url

## 0.5.2

- fix: reorder output types and improve stored description
