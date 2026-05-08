import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function SkipLink() {
  return (
    <a href="#main" className="skip-link">Skip to main content</a>
  );
}

export function Nav({ onSupport }: { onSupport: () => void }) {
  const base = import.meta.env.BASE_URL;
  const navRef = useRef<HTMLElement | null>(null);

  // Dynamic header contrast: when nav overlaps a dark section, swap to teal/white.
  // Mirrors the pattern used in canada_watchlist.html (over-light), inverted.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const darkSelectors = ".case-hero, .hero, .cid-vote-panel, .vote-feature";

    const check = () => {
      const navRect = nav.getBoundingClientRect();
      let overDark = false;
      document.querySelectorAll(darkSelectors).forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        if (navRect.bottom > r.top && navRect.top < r.bottom) overDark = true;
      });
      nav.classList.toggle("over-dark", overDark);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <nav ref={navRef} className="nav" aria-label="Primary">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Ooo Digital Media Studio home">
          <img src={`${base}assets/images/brand/ooo-logo.png`} alt="" width="36" height="36" />
          <span className="nav-brand-text">DIGITAL MEDIA STUDIO</span>
        </Link>
        <div className="nav-links">
          <Link to="/ostara">Ostara</Link>
          <Link to="/cid">Innovation Dimension</Link>
          <Link to="/exhibition">Exhibition</Link>
          <Link to="/about">About</Link>
          <button onClick={onSupport} className="nav-cta" type="button">
            Support
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Ooos</div>
            <p style={{ margin: 0, maxWidth: 360 }}>
              A portfolio of decision-support and participatory-design work by
              Greg Long. Locally hosted artifacts, public-source signals,
              transparent authorship.
            </p>
          </div>
          <div>
            <h4>Projects</h4>
            <ul>
              <li><Link to="/ostara">Ostara</Link></li>
              <li><Link to="/exhibition">Canadian Interactive Exhibition</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:greg@ooos.ca">greg@ooos.ca</a></li>
              <li><a href="https://github.com/greg-mdm/Ooos" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ooo Digital Media Studio</span>
          <span>Toronto · Canada</span>
        </div>
      </footer>
      <div className="disclosure-banner">
        <strong>Not financial advice.</strong> All signals, simulations, and
        votes are research and educational artifacts. ABSTAIN is a legitimate
        response.
      </div>
    </>
  );
}
