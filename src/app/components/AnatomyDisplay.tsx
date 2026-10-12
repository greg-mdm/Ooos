/* The anatomy exhibition display: two museum anatomy exhibits, one playing
   a saxophone and one at a ship's wheel, each on a transparent device
   frame with its message panel ("PLAY WITH PURPOSE!" and "SHARE YOUR
   PASSION"), and a tap on either opening the full photograph in a native
   dialog. Greg built it as a self-contained component (SPRINT 6/references/
   anatomy-display/anatomy-display-component.html, 2026-10-12) and asked for
   it above the midway's "Step right up".

   It is kept as he wrote it: the markup is served as a fragment from
   public/assets/exhibition/anatomy/anatomy-display.html, its style block
   is src/styles/anatomy-display.css, and its four embedded images are
   files beside the fragment. This component loads the fragment, puts it in
   the page, and runs his wiring (ported below, line for line) once it is
   there. The dialog is a real <dialog>, so it opens over the whole page
   rather than inside a frame. */
import { useEffect, useRef, useState } from "react";
import "../../styles/anatomy-display.css";

const FRAGMENT = `${import.meta.env.BASE_URL}assets/exhibition/anatomy/anatomy-display.html`;

export function AnatomyDisplay() {
  const [html, setHtml] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    fetch(FRAGMENT)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => { if (live) setHtml(t); })
      .catch(() => { /* without the fragment the band simply has no display */ });
    return () => { live = false; };
  }, []);

  // Greg's wiring, as in his component's script: each device's screen and
  // its expand control open the dialog on the full photograph with the
  // device's overlay cloned over it; close returns focus to the trigger.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !html) return;
    const exhibit = host.querySelector<HTMLElement>(".ooo-exhibit");
    if (!exhibit || exhibit.dataset.oooReady) return;
    exhibit.dataset.oooReady = "true";
    const viewer = exhibit.querySelector<HTMLDialogElement>(".ooo-exhibit__dialog");
    const fullView = viewer?.querySelector<HTMLElement>(".ooo-exhibit__full-view");
    const fullImage = fullView?.querySelector<HTMLImageElement>(".ooo-exhibit__full-image");
    const closeButton = viewer?.querySelector<HTMLButtonElement>(".ooo-exhibit__close");
    if (!viewer || !fullView || !fullImage || !closeButton) return;
    let returnFocus: HTMLElement | null = null;
    const open = (trigger: HTMLElement) => {
      const device = trigger.closest(".ooo-device");
      const photo = device?.querySelector<HTMLImageElement>(".ooo-device__image");
      const overlay = device?.querySelector("[data-ooo-overlay]");
      if (!photo) return;
      fullView.querySelector("[data-ooo-overlay]")?.remove();
      if (overlay) fullView.append(overlay.cloneNode(true));
      returnFocus = trigger;
      fullImage.src = photo.currentSrc || photo.src;
      fullImage.alt = photo.alt;
      viewer.setAttribute("aria-label", "Full photograph: " + photo.alt);
      viewer.showModal();
      closeButton.focus({ preventScroll: true });
    };
    const triggers = Array.from(exhibit.querySelectorAll<HTMLElement>("[data-ooo-open]"));
    const onTrigger = (e: Event) => open(e.currentTarget as HTMLElement);
    triggers.forEach((t) => t.addEventListener("click", onTrigger));
    const onClose = () => viewer.close();
    closeButton.addEventListener("click", onClose);
    const onBackdrop = (event: MouseEvent) => {
      if (event.target !== viewer) return;
      const b = viewer.getBoundingClientRect();
      const outside = event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom;
      if (outside) viewer.close();
    };
    viewer.addEventListener("click", onBackdrop);
    // the native dialog handles Escape and keeps keyboard focus inside
    const onClosed = () => {
      fullImage.removeAttribute("src");
      fullImage.alt = "";
      fullView.querySelector("[data-ooo-overlay]")?.remove();
      if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    };
    viewer.addEventListener("close", onClosed);
    return () => {
      triggers.forEach((t) => t.removeEventListener("click", onTrigger));
      closeButton.removeEventListener("click", onClose);
      viewer.removeEventListener("click", onBackdrop);
      viewer.removeEventListener("close", onClosed);
      delete exhibit.dataset.oooReady;
    };
  }, [html]);

  if (!html) return null;
  return <div ref={hostRef} className="exhibit-anatomy" dangerouslySetInnerHTML={{ __html: html }} />;
}
