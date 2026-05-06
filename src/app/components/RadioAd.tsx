import { useRef, useState } from "react";

type Lang = {
  code: "en" | "de";
  label: string;
  src: string;
  download: string;
  credit: { name: string; org: string };
};

export function RadioAd() {
  const base = import.meta.env.BASE_URL;
  const langs: Lang[] = [
    {
      code: "en",
      label: "English",
      src: `${base}assets/audio/radio-ad-en.mp4`,
      download: "ooo-radio-ad-en.mp4",
      credit: { name: "CJ Smith", org: "Resonate Strategy Inc." },
    },
    {
      code: "de",
      label: "German",
      src: `${base}assets/audio/radio-ad-de.m4a`,
      download: "ooo-radio-ad-de.m4a",
      credit: { name: "CJ Smith", org: "Resonate Strategy Inc." },
    },
  ];

  return (
    <section className="section radio">
      <div className="radio-grid">
        <div className="radio-text">
          <div className="section-eyebrow">★ On the air</div>
          <h2>Listen to our radio ad!</h2>
          <p>
            Tap a card to play. Open it to download and share.
          </p>
        </div>
        <div className="radio-cards">
          {langs.map((l) => (
            <RadioLangCard key={l.code} lang={l} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RadioLangCard({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
      if (!open) setOpen(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const toggleOpen = () => setOpen((o) => !o);

  return (
    <div className={`radio-card ${open ? "is-open" : ""}`}>
      <div className="radio-card-head">
        <button
          type="button"
          className="play-btn"
          onClick={togglePlay}
          aria-label={`${playing ? "Pause" : "Play"} ${lang.label} radio ad`}
          aria-pressed={playing}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="radio-card-meta">
          <div className="lang">{lang.label}</div>
          <div className="credit">
            <strong>{lang.credit.name}</strong>
            <span className="credit-org"> · {lang.credit.org}</span>
          </div>
        </div>
        <button
          type="button"
          className="expand-btn"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-controls={`radio-detail-${lang.code}`}
          aria-label={`${open ? "Close" : "Open"} ${lang.label} download details`}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <audio
        ref={audioRef}
        src={lang.src}
        preload="none"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
      />

      {open && (
        <div className="radio-card-body" id={`radio-detail-${lang.code}`}>
          <p>
            Click here to download and share. English and German versions are
            available for distribution thanks to in-kind donations of talent.
          </p>
          <a className="download" href={lang.src} download={lang.download}>
            Download {lang.label}
          </a>
        </div>
      )}
    </div>
  );
}
