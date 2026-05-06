export function RadioAd() {
  const base = import.meta.env.BASE_URL;
  const en = `${base}assets/audio/radio-ad-en.mp4`;
  const de = `${base}assets/audio/radio-ad-de.m4a`;

  return (
    <section className="section radio">
      <div className="radio-grid">
        <div className="radio-text">
          <div className="section-eyebrow">★ On the air</div>
          <h2>Listen to our radio ad.</h2>
          <p>
            Click to play, or download and share. English and German versions
            are available for distribution.
          </p>
          <p className="credit" style={{ fontSize: 13, opacity: 0.8, marginTop: 8, lineHeight: 1.4 }}>
            <strong>CJ Smith</strong><br />
            Resonate Strategy Inc.
          </p>
        </div>
        <div className="radio-cards">
          <div className="radio-card">
            <div className="lang">English</div>
            <div className="actions">
              <audio controls preload="none" src={en} aria-label="English radio ad audio player" />
              <a className="download" href={en} download="ooo-radio-ad-en.mp4">Download</a>
            </div>
          </div>
          <div className="radio-card">
            <div className="lang">German</div>
            <div className="actions">
              <audio controls preload="none" src={de} aria-label="German radio ad audio player" />
              <a className="download" href={de} download="ooo-radio-ad-de.m4a">Download</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
