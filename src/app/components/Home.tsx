import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const PALETTE = ['#f0c040','#00d4aa','#ff4444','#00e676','#6C01F4','#4488ff'];

function OstaraParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let W = 0, H = 0;
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let particles: Particle[] = [];

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = canvas!.width  = rect.width;
      H = canvas!.height = rect.height;
    }
    function init() {
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5,
        c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
    }
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx!.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(108,1,244,${(1 - d / 120) * 0.14})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx!.fillStyle = a.c + '99';
        ctx!.fill();
      }
    }
    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas.parentElement!);
    resize(); init(); draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="ostara-particle-canvas" aria-hidden="true" />;
}

export function Home({ onSupport }: { onSupport: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo-wrap">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/brand/ooo-logo.png`}
              alt=""
              className="hero-logo"
              width="120"
              height="120"
              aria-hidden="true"
            />
          </div>
          <h1>
            <strong>Ooo Digital Media Studio</strong> designs interactive experiences and creative campaigns for founders, organizations, and communities.
          </h1>
          <p className="lead">
            Based in Ontario's innovation ecosystem, Ooo works with partners across Canada and builds with a growing network of global digital engagement partners.
          </p>
          <div className="hero-cta">
            <Link to="/ostara" className="btn-ostara">Ostara: Collective Intelligence System</Link>
            <Link to="/exhibition" className="btn-exhibition">Canadian Interactive Exhibition</Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="section-header">
          <div className="section-eyebrow">★ Featured Assets</div>
          <h2>Two systems, one design language.</h2>
          <p className="lead">
            Both projects use the same backbone: structured signals, agent role
            separation, persistent disclosure, and audience input as evidence.
          </p>
        </div>

        <div className="featured">
          <Link to="/ostara" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb ostara ostara-brand ostara-brand--image">
              <OstaraParticleCanvas />
              <img
                className="ostara-brand-image"
                src={`${import.meta.env.BASE_URL}assets/images/ostara-login.png`}
                alt="Ostara: Collective Intelligence System login screen with solar sphere"
                loading="lazy"
              />
            </div>
            <div className="ostara-pill-bar">
              <span className="ostara-descriptor">Aggregates signals</span>
              <span className="ostara-descriptor">Routes intent</span>
              <span className="ostara-descriptor">Orchestrates agents</span>
              <span className="ostara-descriptor">Channels strategic foresight</span>
            </div>
            <div className="feature-body">
              <p>
                A locally hosted, AI-assisted decision-support environment for
                reasoning under uncertainty. Workshop interface, Python signal
                pipeline, agent-role-separated architecture.
              </p>
              <div className="feature-meta">
                <span className="chip">DG8010</span>
                <span className="chip teal">Research</span>
                <span className="chip">Privacy by design</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>

          <Link to="/exhibition" className="feature-card" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="feature-thumb exh-thumb exh-thumb--image">
              <img
                className="feature-thumb-image"
                src={`${import.meta.env.BASE_URL}assets/images/portals-open-live.png`}
                alt="Non-profit portals are now open"
                loading="lazy"
              />
            </div>
            <div className="exh-pill-bar">
              <span className="exh-label"><span className="exh-label-main">Immersive</span><span className="exh-label-sub">experiences</span></span>
              <span className="exh-descriptor">A public canvas to embed your work</span>
              <span className="exh-descriptor exh-descriptor--ruby">WANTED: 20 Digital Art Influencers</span>
            </div>
            <div className="feature-body">
              <p>
                A public canvas for interactive artwork, non-profit campaigns,
                and fan-supported experiences. Gateway portals connect visitors
                to independent artist-created worlds.
              </p>
              <div className="feature-meta">
                <span className="chip">Exhibition</span>
                <span className="chip teal">Public canvas</span>
                <span className="chip">Artist portals</span>
              </div>
              <span className="feature-link">Open case study →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="section vote-feature">
        <div className="section-header">
          <div className="section-eyebrow" style={{fontSize: '11px'}}>★ Choosing Our Digital Destiny · Exclusive Access</div>
          <p className="lead">
            Join our interactive workshop to co-play with 200 innovators! Explore the digital economy,<br />
            exchange perspectives on AI, and examine opportunities for funding innovation.
          </p>
        </div>
        <div className="vote-stage">
          <div className="vote-source-label">
            POLYMARKET · <span className="vote-volume">$29.05M LIVE VOLUME</span> · EXPIRES 2026-06-30
          </div>
          <div className="vote-question-text">
            Will the US and Iran reach<br />a permanent peace deal by June 30?
          </div>
          <div className="vote-cards-row">
            <div className="big-vote-card yes-card">
              <div className="bvc-label">YES</div>
              <div className="bvc-price">18¢</div>
            </div>
            <div className="big-vote-card no-card">
              <div className="bvc-label">NO</div>
              <div className="bvc-price">82¢</div>
            </div>
            <div className="big-vote-card abstain-card">
              <div className="bvc-label">ABSTAIN</div>
            </div>
          </div>
          <a
            className="vote-cta-btn"
            href="https://kahoot.it/challenge/01297559"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vote on Kahoot →
          </a>
        </div>
      </section>

      <section className="section section-light">
        <div className="section-header">
          <div className="section-eyebrow">What we build</div>
          <h2>Ooos and Ahhhs.</h2>
        </div>
        <div className="dual">
          <div className="pane">
            <h3>Digital Products</h3>
            <p className="pane-lead"><strong>Ooos-on-demand are for immediate impact. Masterfully crafted assets built to launch quickly and scale with intention.</strong></p>
            <div className="service-chips service-chips--stack">
              <div className="service-chip">
                <strong>Interactive Digital Media</strong>
                <ul className="service-chip__list">
                  <li>Brand templates and sales-cycle systems</li>
                  <li>Workshop kits for live engagement</li>
                </ul>
              </div>
              <div className="service-chip">
                <strong>Intelligent Communication</strong>
                <ul className="service-chip__list">
                  <li>Chatbot subscriptions</li>
                  <li>Messaging for automation strategy</li>
                </ul>
              </div>
              <div className="service-chip">
                <strong>Trustworthy-AI Governance</strong>
                <ul className="service-chip__list">
                  <li>Guiding new roles for AI adoption</li>
                  <li>Safety planning for human-AI cooperation</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pane">
            <h3>Studio Services</h3>
            <p className="pane-lead">When research, strategy, and execution work in harmony, you can see the whole picture clearly: <strong><em>Ahhh. Deeper understanding drives success.</em></strong></p>
            <div className="service-chips">
              <div className="service-chip">
                <strong>Digital Strategy</strong>
                <span>Direction + Execution</span>
              </div>
              <div className="service-chip">
                <strong>Advertising</strong>
                <span>SEO + PPC + Adwords</span>
              </div>
              <div className="service-chip">
                <strong>Data Visualization</strong>
                <span>3D &middot; Immersive &middot; Interactive</span>
              </div>
              <div className="service-chip">
                <strong>Internationalization</strong>
                <span>Global Digital Engagement</span>
              </div>
            </div>
            <div className="studio-testimonial">
              <p className="studio-testimonial__eyebrow">One creative contact. No reset cycle.</p>
              <p className="studio-testimonial__quote">&ldquo;The problem with external SEO agencies is the turnover. Every six months, there&rsquo;s a new key contact to bring up to speed.&rdquo;</p>
              <div className="studio-testimonial__meta">
                <span className="studio-testimonial__flag" role="img" aria-label="Canada">&#127809;</span>
                <span className="studio-testimonial__role">CEO, Canada</span>
              </div>
              <p className="studio-testimonial__pitch">Outsourcing SEO and PPC is prone to high turnover, which repeats onboarding and slows progress. Ooos micro-studio model ensures a consistent creative lead, helping teams build internal digital capacity that translates directly into measurable business growth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section support">
        <div className="section-header">
          <div className="section-eyebrow" style={{ color: "var(--teal)" }}>Express interest</div>
          <h2>Support the next portal.</h2>
          <p className="lead">
            We are testing willingness-to-engage, not running a fundraising
            campaign. Pick an indicative amount or join the token waitlist.
          </p>
        </div>
        <div className="support-tiers">
          <Tier name="Spark" amt="$10" desc="Keeps the lights on for one workshop kit download." cls="t1" onSupport={onSupport} />
          <Tier name="Signal" amt="$25" desc="Funds one signal-card research cycle." cls="t2" onSupport={onSupport} />
          <Tier name="Studio" amt="$50" desc="Sponsors a facilitator one-pager and walkthrough video." cls="t3" onSupport={onSupport} />
          <Tier name="Patron" amt="$100+" desc="Supports a full session of a workshop with a non-academic audience." cls="t4" onSupport={onSupport} />
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={onSupport} className="btn btn-primary">Open support form</button>
        </div>
        <p className="support-disclosure">
          No payments are processed yet. Stripe (CAD) and Bitcoin integrations
          are coming. The Ooo token is in concept stage only. No token has
          been issued. Nothing here is a solicitation or financial advice.
        </p>
      </section>
    </>
  );
}

function Tier({
  name, amt, desc, cls, onSupport,
}: { name: string; amt: string; desc: string; cls: string; onSupport: () => void }) {
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSupport();
    }
  };
  return (
    <div
      className={`tier ${cls}`}
      onClick={onSupport}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={`Support tier ${name}, ${amt}. ${desc}`}
    >
      <div className="tier-name">{name}</div>
      <div className="tier-amt">{amt}</div>
      <div className="tier-desc">{desc}</div>
    </div>
  );
}

