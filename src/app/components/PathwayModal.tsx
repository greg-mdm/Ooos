import { FormEvent, useEffect, useState } from "react";

/* Each enquiry goes to Greg's Google Sheet, one row per enquiry, and an email
   to greg@ooos.ca (Greg, 2026-10-24), through the Apps Script web app in
   scripts/pathway-form.gs. Paste its /exec URL here once deployed; until
   then the form opens a pre-filled email to greg@ooos.ca instead. */
const PATHWAY_ENDPOINT = "";
const PATHWAY_EMAIL = "greg@ooos.ca";

export function PathwayModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState<"" | "sheet" | "email">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) || "").trim();
    const data = {
      name: get("name"),
      email: get("email"),
      exploring: get("exploring"),
      stage: get("stage"),
      timeline: get("timeline"),
      budget: get("budget"),
      website: get("website"),
      page: window.location.href,
    };
    if (!data.name || !data.email || !data.exploring) {
      setError("Please add your name, email and what you are exploring.");
      return;
    }
    setError("");
    if (!PATHWAY_ENDPOINT) {
      const lines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Where I am: ${data.stage}`,
        `Timeline: ${data.timeline}`,
        `Budget: ${data.budget || "(not given)"}`,
        "",
        data.exploring,
      ];
      window.location.href = `mailto:${PATHWAY_EMAIL}?subject=${encodeURIComponent("Studio enquiry: " + data.name)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setSubmitted("email");
      return;
    }
    setBusy(true);
    try {
      // text/plain keeps this a simple request, which Apps Script accepts
      // from another site without a preflight
      const res = await fetch(PATHWAY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({ ok: false }));
      if (!out.ok) throw new Error("not accepted");
      setSubmitted("sheet");
    } catch {
      setError(`Your note could not be sent. Please try again, or email ${PATHWAY_EMAIL}.`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pathway-modal-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close pathway dialog"
          type="button"
        >
          ×
        </button>

        {!submitted && (
          <>
            {/* Greg's copy (2026-10-24); the three paragraphs fold under
                "Explore what's possible" so the form stays in view */}
            <h3 id="pathway-modal-title">Studio Services · 2026–2027</h3>
            <p className="muted">
              For professional teams, artists, and researchers seeking a new
              standard of excellence.
            </p>
            <button
              type="button"
              className="modal-more"
              aria-expanded={more}
              aria-controls="pathway-more"
              onClick={() => setMore((v) => !v)}
            >
              Explore what&rsquo;s possible <span aria-hidden="true">{more ? "↓" : "→"}</span>
            </button>
            <div id="pathway-more" className="modal-more__text" hidden={!more}>
              <p className="muted">
                We welcome a broad range of entrepreneurial, artistic, and
                research-led projects. We&rsquo;re selective about who we work
                with, seeking shared ambition, creative fit, and a commitment to
                quality.
              </p>
              <p className="muted">
                For every collaboration, we define deliverables that are
                Specific, Measurable, Achievable, Relevant, and Time-bound. Our
                SMART projects are typically scoped to be completed within 1–3
                design sprints. Each project receives dedicated time and
                creative attention throughout this expert-led creative process.
              </p>
              <p className="muted">
                Share your vision for what you want to make possible. We respond
                to every thoughtful inquiry with a considered reply: relevant
                resources, a thoughtful referral, or an invitation to explore a
                meaningful collaboration.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="pathway-name">Name</label>
              <input
                id="pathway-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name or team lead"
              />

              <label htmlFor="pathway-email">Email</label>
              <input
                id="pathway-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Best place to follow up"
              />

              <label htmlFor="pathway-exploring">
                What are you exploring, building, or trying to understand?
              </label>
              <textarea
                id="pathway-exploring"
                name="exploring"
                rows={4}
                required
                placeholder="Share the idea, challenge, opportunity, audience, or question that brought you here."
              />

              <label htmlFor="pathway-stage">Where are you in the process?</label>
              <select id="pathway-stage" name="stage" defaultValue="Exploring an early idea">
                <option value="Exploring an early idea">Exploring an early idea</option>
                <option value="Working through a creative or strategic challenge">
                  Working through a creative or strategic challenge
                </option>
                <option value="Ready to implement">Ready to implement</option>
                <option value="Looking for research or direction">Looking for research or direction</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>

              <label htmlFor="pathway-timeline">Timeline</label>
              <select id="pathway-timeline" name="timeline" defaultValue="Flexible">
                <option value="Exploratory">Exploratory</option>
                <option value="1 to 3 months">1 to 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="6 months or more">6 months or more</option>
                <option value="Flexible">Flexible</option>
              </select>

              <label htmlFor="pathway-budget">Budget range</label>
              <input
                id="pathway-budget"
                name="budget"
                type="text"
                placeholder="Optional, but helpful for shaping the right next step"
              />

              {/* left empty by people; bots that fill it are dropped by the script */}
              <div className="modal-trap" aria-hidden="true">
                <label htmlFor="pathway-website">Website</label>
                <input id="pathway-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              {error && <p className="modal-error" role="alert">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? "Sending\u2026" : "Send to Ooo!"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        {submitted && (
          <>
            <h3>Thank you</h3>
            <p className="muted">
              {submitted === "email"
                ? "Your email app should open with your note filled in. Press Send and it reaches Ooo!"
                : "Your note is in. Ooo will follow up with resources, a referral, or an introductory proposal."}
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
