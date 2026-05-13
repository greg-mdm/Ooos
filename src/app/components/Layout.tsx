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
            <h4>Connect</h4>
            <ul className="footer-connect">
              <li>
                <a href="mailto:greg@ooos.ca" className="footer-connect-link">
                  <span className="footer-icon">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="3.5" width="17" height="12" rx="2" stroke="#F0F4F5" strokeWidth="1.4"/>
                      <path d="M1.5 4.5L9.5 11L17.5 4.5" stroke="#F0F4F5" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </span>
                  greg@ooos.ca
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/ooodigital" target="_blank" rel="noreferrer" className="footer-connect-link">
                  <span className="footer-icon">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="17" height="17" rx="4.5" stroke="#F0F4F5" strokeWidth="1.4"/>
                      <circle cx="9.5" cy="9.5" r="3.5" stroke="#F0F4F5" strokeWidth="1.4"/>
                      <circle cx="14" cy="5" r="1" fill="#F0F4F5"/>
                    </svg>
                  </span>
                  OooDigital
                </a>
              </li>
              <li>
                <a href="https://github.com/greg-mdm/Ooos" target="_blank" rel="noreferrer" className="footer-connect-link">
                  <span className="footer-icon">
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 1C4.806 1 1 4.806 1 9.5c0 3.757 2.438 6.946 5.819 8.073.425.078.581-.184.581-.41 0-.202-.007-.737-.011-1.447-2.365.513-2.865-1.14-2.865-1.14-.387-.982-.945-1.244-.945-1.244-.772-.528.058-.517.058-.517.854.06 1.303.877 1.303.877.759 1.3 1.99.924 2.476.707.077-.55.297-.924.54-1.136-1.888-.215-3.873-.944-3.873-4.203 0-.928.332-1.688.876-2.283-.088-.215-.38-1.08.083-2.25 0 0 .714-.229 2.34.872A8.16 8.16 0 0 1 9.5 5.32c.723.003 1.451.098 2.13.287 1.624-1.1 2.337-.872 2.337-.872.464 1.17.172 2.035.084 2.25.546.595.875 1.355.875 2.283 0 3.267-1.988 3.986-3.882 4.197.305.263.577.781.577 1.574 0 1.136-.01 2.052-.01 2.332 0 .228.154.493.584.41C15.564 16.443 18 13.255 18 9.5 18 4.806 14.194 1 9.5 1Z" fill="#F0F4F5"/>
                    </svg>
                  </span>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ooo Digital Media Studio</span>
          <span>Toronto · Ontario · Canada</span>
        </div>
      </footer>
      <div className="disclosure-banner" style={{ display: "none" }}>
        <strong>Not financial advice.</strong> All signals, simulations, and
        votes are research and educational artifacts. ABSTAIN is a legitimate
        response.
      </div>
    </>
  );
}
