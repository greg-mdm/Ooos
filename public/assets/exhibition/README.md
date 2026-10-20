# Play with Purpose: standalone interactive ticket

Ready to upload. This is the existing 4:5 ticket, including the moving cloud video, 3D Canadian beach ball, red envelope, rising ADMIT ONE ticket, and final “Pass it on!” interaction. Your Pool 1 and Pool 2 cards are not included or changed.

## Choose one version

- **play-with-purpose.html**: the easiest option. One self-contained HTML file, approximately 2.60 MB. The video, still image, fonts, artwork, CSS, and JavaScript are all embedded. No build, packages, remote assets, or installation are required.
- **play-with-purpose-optimized.zip**: the same experience with an external 1.83 MB MP4, which browsers can cache independently. Extract it, then upload `index.html`, `assets/clouds.mp4`, and `FONT-LICENSE.txt` together. Keep the `assets` folder beside `index.html`. The ZIP itself is not a web page.

Use either version, not both. The background outside the ticket and its scalloped cutouts is transparent so your website's background shows through. The ticket design itself is unchanged.

## Add it to the existing ooos.ca website

1. Upload `play-with-purpose.html` to the static/public files served by your existing site. Keep the filename. If your site uses a framework with a `public` directory, the file commonly goes there. Follow your site's existing deployment process; a GitHub upload alone does not necessarily publish a file.
2. Open its actual deployed URL in a browser to confirm it loads. If it is published at the root of ooos.ca, that URL will be `https://ooos.ca/play-with-purpose.html`. This is an example destination, not an already-published link.
3. Place this iframe in the neighboring column beside your vertically stacked Pool 1 and Pool 2 cards. Replace `src` if you used another path:

```html
<iframe
  src="/play-with-purpose.html"
  title="Play with Purpose: interactive beach ball and ADMIT ONE ticket"
  width="480"
  height="600"
  style="display:block;width:100%;height:auto;aspect-ratio:4 / 5;border:0;background:transparent"
  loading="lazy"
  allow="clipboard-write; web-share"
></iframe>
```

Keep the iframe at a **4:5 aspect ratio**. For example, 400 pixels wide gives a 500-pixel height. Your site's existing grid can place it beside the stacked cards on desktop and below them on mobile. This package does not alter your card copy, layout, repository, or live website.

If using the optimized ZIP in a `ticket` folder, use `src="/ticket/index.html"` instead, and keep `/ticket/assets/clouds.mp4` alongside it.

## Optional: host on GitHub Pages

For a **new, dedicated repository**, rename the single HTML file to `index.html` before uploading it to the repository root. Alternatively, extract the optimized ZIP and upload its contents, with `index.html` at the root. Do not overwrite the homepage of your existing ooos.ca repository.

In the dedicated repository's **Settings → Pages**, choose **Deploy from a branch**, your branch, and the **/(root)** folder, then save. After deployment, copy the URL from **Visit site**. Use that published HTTPS URL as the iframe `src` on ooos.ca, not a GitHub file-view or raw-file URL. Do not change ooos.ca's DNS or custom domain for this embed.

GitHub Pages availability depends on your plan and repository visibility. Published Pages content can be public even when its source repository is private.

Official instructions, checked October 20, 2026:
- [Create a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configure the publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Choose what “Pass it on!” shares

By default it shares the hosted ticket file's own HTTP(S) URL, without query parameters or a fragment. There is no hardcoded preview-site URL.

To share the containing ooos.ca page instead, find this attribute on the `<main class="poster">` element inside the ticket HTML:

```html
data-share-url=""
```

Change only that attribute to your public page:

```html
data-share-url="https://ooos.ca/"
```

You can use a specific public page or anchor if desired. Use an absolute HTTP(S) URL, not a filesystem path. Configured URLs preserve their query and fragment, so do not include private tokens. Invalid or credential-bearing overrides are ignored. When opened as a local `file://` document without a valid configured public URL, the interaction still finishes, but it explains that the file must be published before sharing. It never copies a local file path or claims a successful copy.

## Behavior and compatibility

- Poke, drag, or flick the ball into the envelope. Keyboard controls also work: Space/Enter nudge, arrow keys aim, and activating the envelope aims the ball at it.
- The sharing button unlocks only when the ticket has risen. Its first press completes the final glide and attempts to copy the link. A later press can open native sharing, copy again, or show a selectable link. Cancelling native sharing does not claim success.
- Clouds play silently, inline, and on repeat. The still image remains if autoplay or video decoding is unavailable. Reduced-motion mode uses the still and skips movement. In the single-file version the video bytes are necessarily part of the HTML download, although playback is not started in reduced-motion mode.
- The 13.3-second source clip repeats at its natural endpoint; a seamless loop is not claimed.
- Clipboard and native sharing depend on HTTPS, browser support, iframe permissions, and the host's Permissions-Policy. The selectable-link fallback works when those APIs are blocked. An unusually restrictive Content Security Policy may need to permit this page's inline script/style and `data:` fonts, images, and video. No external libraries or services are needed.
- No analytics, accounts, external scripts, or automatic sharing. Font copyright and license are included in the HTML and in the optimized package. Cloud footage is the supplied video; this package does not grant additional third-party media rights.

## Verification

Automated checks passed for both packaging variants: script syntax, MP4 identity and format, self-containment, artwork preservation, 320/390/600/1000px deterministic interaction tests, keyboard/pointer behavior, collision/reveal timing, final glide geometry, reduced motion, share/copy failures, native-share cancellation, manual fallback, configured public URLs, and local-file safety. The MP4 is H.264 with no audio and fast-start metadata. The ticket SVG was rendered again and checked independently.

These are deterministic DOM/event/physics and analytical geometry checks, not a claim of full browser or device verification. Chromium could not launch in the execution sandbox. Test the deployed iframe on your target desktop/mobile browsers before going live, especially video playback, clipboard/native sharing, and your site's embed permissions.
