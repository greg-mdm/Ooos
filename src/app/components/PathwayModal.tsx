import { useEffect, useState } from "react";

export function PathwayModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo mode: no backend yet. Wire to Formspree or studio inbox later.
    setSubmitted(true);
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
                type="text"
                required
                placeholder="Your name or team lead"
              />

              <label htmlFor="pathway-email">Email</label>
              <input
                id="pathway-email"
                type="email"
                required
                placeholder="Best place to follow up"
              />

              <label htmlFor="pathway-exploring">
                What are you exploring, building, or trying to understand?
              </label>
              <textarea
                id="pathway-exploring"
                rows={4}
                required
                placeholder="Share the idea, challenge, opportunity, audience, or question that brought you here."
              />

              <label htmlFor="pathway-stage">Where are you in the process?</label>
              <select id="pathway-stage" defaultValue="exploring">
                <option value="exploring">Exploring an early idea</option>
                <option value="navigating">
                  Working through a creative or strategic challenge
                </option>
                <option value="ready">Ready to implement</option>
                <option value="research">Looking for research or direction</option>
                <option value="unsure">Not sure yet</option>
              </select>

              <label htmlFor="pathway-timeline">Timeline</label>
              <select id="pathway-timeline" defaultValue="flexible">
                <option value="exploratory">Exploratory</option>
                <option value="1-3">1 to 3 months</option>
                <option value="3-6">3 to 6 months</option>
                <option value="6+">6 months or more</option>
                <option value="flexible">Flexible</option>
              </select>

              <label htmlFor="pathway-budget">Budget range</label>
              <input
                id="pathway-budget"
                type="text"
                placeholder="Optional, but helpful for shaping the right next step"
              />

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Send to Ooo!
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
              Your note is in. Ooo will follow up with resources, a referral,
              or an introductory proposal.
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
