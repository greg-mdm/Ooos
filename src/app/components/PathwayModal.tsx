import { useEffect, useState } from "react";

export function PathwayModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

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
            <h3 id="pathway-modal-title">Open the Pathway with a Conversation</h3>
            <p className="muted">
              Studio capacity is limited, but every thoughtful inquiry will
              receive a clear response: resources, a referral, or an
              introductory proposal sharing where our stars might align for
              outstanding creative work.
            </p>
            <p className="muted">
              Curiosity is welcome. You do not need a finished brief, only a
              starting point.
            </p>

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
