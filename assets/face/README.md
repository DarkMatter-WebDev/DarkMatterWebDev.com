# Face Interactive Deployment

This package contains one deployable file:

- `face-interactive.html`

Upload `face-interactive.html` to the public/static assets area of your website, then link to it from a button or anchor on your page.

The page requests camera access only after the visitor clicks its internal "Start camera" button. It must be served from `https://` in production, or from `localhost` while developing.

Example link:

```html
<a href="/face-interactive.html" target="_blank" rel="noopener">Launch face interactive</a>
```

The file is self-contained for your local code, but it still loads Three.js, MediaPipe, and the face model from their public CDNs.
