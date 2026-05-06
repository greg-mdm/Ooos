export function RadioAd() {
  // Place audio files at: site/public/assets/audio/radio-ad-en.mp3 and radio-ad-de.mp3
  const base = import.meta.env.BASE_URL;
  const en = `${base}assets/audio/radio-ad-en.mp3`;
  const de = `${base}assets/audio/radio-ad-de.mp3`;

  return (
    <section className="section radio">
      <div className="radio-grid">
        <div className="radio-text">
          <div className="section-eyebrow">★ On the air</div>
          <h2>Listen to our radio ad.</h2>
          <p>
            Click to play, or download and share. English and German versions
            are available for distribution thanks to incredible in-kind
            donations of talent.
          </p>
        </div>
        <div className="radio-cards">
          <div className="radio-card">
            <div className="lang">English</div>
            <div className="actions">
              <audio controls preload="none" src={en} />
              <a className="download" href={en} download>Download</a>
            </div>
          </div>
          <div className="radio-card">
            <div className="lang">German</div>
            <div className="actions">
              <audio controls preload="none" src={de} />
              <a className="download" href={de} download>Download</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
