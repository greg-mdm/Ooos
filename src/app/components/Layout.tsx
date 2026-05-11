import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export function SkipLink() {
  return (
    <a href="#main" className="skip-link">Skip to main content</a>
  );
}

export function Nav({ onSupport }: { onSupport: () => void }) {
  const navRef = useRef<HTMLElement | null>(null);

  // Nav is permanently dark indigo (matches the footer band). No over-dark swap needed.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    nav.classList.remove("over-dark");
  }, []);

  return (
    <nav ref={navRef} className="nav" aria-label="Primary">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Ooo Digital Media Studio home">
          <span className="nav-brand-mark">Ooo!</span>
          <span className="nav-brand-text">DIGITAL MEDIA STUDIO</span>
        </Link>
        <div className="nav-links">
          <Link to="/ostara">Ostara</Link>
          <Link to="/cid">Innovation</Link>
          <Link to="/exhibition">Exhibition</Link>
          <Link to="/about">Design</Link>
          <button onClick={onSupport} className="nav-cta" type="button">
            Support
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const { pathname } = useLocation();
  const showDisclosure = !pathname.startsWith("/exhibition");
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
      <div className="disclosure-banner" style={showDisclosure ? {} : { display: "none" }}>
        <strong>Not financial advice.</strong> All signals, simulations, and
        votes are research and educational artifacts. ABSTAIN is a legitimate
        response.
      </div>
    </>
  );
}
