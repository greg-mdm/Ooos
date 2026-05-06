import { useEffect, useState } from "react";

type Tab = "cad" | "btc" | "token";

export function SupportModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("cad");
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
    // Demo mode: no backend yet. Swap in Formspree endpoint or Stripe link later.
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close support dialog" type="button">×</button>

        {!submitted && (
          <>
            <h3 id="support-modal-title">Support the work</h3>
            <p className="muted">
              Donations are not yet processed. We are gathering interest while
              the Stripe and Bitcoin integrations are finalised. ABSTAIN is a
              legitimate response.
            </p>

            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
              <TabBtn active={tab === "cad"} onClick={() => setTab("cad")}>CAD</TabBtn>
              <TabBtn active={tab === "btc"} onClick={() => setTab("btc")}>Bitcoin</TabBtn>
              <TabBtn active={tab === "token"} onClick={() => setTab("token")}>Ooo Token</TabBtn>
            </div>

            {tab === "cad" && (
              <div className="modal-banner">
                Stripe processing coming soon. Express interest below. We
                will email when CAD donations open.
              </div>
            )}
            {tab === "btc" && (
              <div className="modal-banner">
                Bitcoin address coming soon. Express interest below to be
                notified when the on-chain wallet goes live.
              </div>
            )}
            {tab === "token" && (
              <div className="modal-banner">
                <strong>No token has been issued.</strong> The Ooo token is in
                concept stage only. This waitlist gauges interest. Nothing here
                is a solicitation, offering, or financial advice.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required placeholder="you@example.com" />

              <label htmlFor="amount">
                {tab === "token" ? "Token interest level" : "Indicative amount (CAD)"}
              </label>
              {tab === "token" ? (
                <select id="amount" defaultValue="curious">
                  <option value="curious">Curious. Keep me posted</option>
                  <option value="interested">Interested. Share details when ready</option>
                  <option value="serious">Serious. Would participate at launch</option>
                </select>
              ) : (
                <select id="amount" defaultValue="25">
                  <option value="10">$10</option>
                  <option value="25">$25</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                  <option value="custom">Other</option>
                </select>
              )}

              <label htmlFor="note">Note (optional)</label>
              <textarea id="note" rows={3} placeholder="Anything you want to flag" />

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Submit interest</button>
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        )}

        {submitted && (
          <>
            <h3>Thank you</h3>
            <p className="muted">
              Your interest is recorded. You will be notified when payment
              processing opens. No charges have been made.
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabBtn({
  active, children, onClick,
}: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: "1px solid",
        borderColor: active ? "var(--electric)" : "var(--border-soft)",
        background: active ? "rgba(108,1,244,0.08)" : "#fff",
        color: active ? "var(--electric)" : "var(--slate)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
