import { Link } from "react-router-dom";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { PathwayModal } from "./PathwayModal";
import { OooDivisions } from "./OooDivisions";
import "../../styles/hero-top.css";

const ARRIVAL_WORDS =
  "You have arrived at a gateway to Ontario's vibrant innovation ecosystem.".split(" ");

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
  const [pathwayOpen, setPathwayOpen] = useState(false);
  return (
    <>
      <section className="ooos-top" aria-label="Welcome">
        <div className="ot-content">
          <div className="ot-trio">
            <div className="ot-trio__side ot-trio__left">
              <span className="ot-pill ot-pill--welcome">
                <img
                  className="ot-pill__ico"
                  src={`${import.meta.env.BASE_URL}assets/Ooo-Global-Network-Electric.png`}
                  alt=""
                  aria-hidden="true"
                />
                Everyone is welcome here.
              </span>
            </div>
            <div className="ot-trio__orb">
              <img
                className="ot-logo"
                src={`${import.meta.env.BASE_URL}assets/Final%20Logo%20-%20Ooo%20-%20Light%20Blue%20Background.png`}
                alt="Ooo Digital Media Studio"
                width="300"
                height="300"
              />
            </div>
            <div className="ot-trio__side ot-trio__right">
              <div className="ot-sign" role="img" aria-label="Toronto, Canada" />
            </div>
          </div>

          <p className="ot-arrival">
            {ARRIVAL_WORDS.map((word, i) => (
              <Fragment key={i}>
                <span className="w" style={{ animationDelay: `${(0.6 + i * 0.1).toFixed(2)}s` }}>{word}</span>
                {i < ARRIVAL_WORDS.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </p>

          <div className="ot-bigbox">
            <h1>
              <strong>Ooo Digital Media Studio</strong> designs interactive experiences and creative campaigns for founders, organizations, and communities.
            </h1>
            <img
              className="ot-bigbox__leaf"
              src={`${import.meta.env.BASE_URL}assets/LEAF%20asset.webp`}
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <OooDivisions />

      <section className="section section-tinted section--featured">
        <div className="section-header">
          <div className="section-eyebrow">★ Featured Experiences</div>
        </div>

        <div className="hero-cta">
          <Link to="/ostara" className="btn-ostara">Ostara: Collective Intelligence System</Link>
          <Link to="/exhibition" className="btn-exhibition">Canadian Interactive Exhibition</Link>
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
              <span className="exh-descriptor exh-descriptor--cie exh-descriptor--cie-full">
                <span className="cie-prefix">
                  <span className="cie-prefix-hyphen">State-of-the-Art</span>{' '}
                  <span className="cie-prefix-show">Show:</span>
                </span>{' '}
                <span className="cie-name">Canadian Interactive Exhibition</span>
              </span>
              <span className="exh-label"><span className="exh-label-main">Immersive</span><span className="exh-label-sub">experiences</span></span>
              <span className="exh-descriptor exh-descriptor--ruby exh-descriptor--poppins">WANTED: 20 Digital Art Influencers</span>
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
        <div className="vote-top-row">
          <div className="vote-guide-box">
            <div className="vote-guide-eyebrow">
              <span className="vote-guide-star">&#9733;</span>
              <span className="vote-guide-title"> Choosing Our Digital Destiny</span>
              <span className="vote-guide-access"> &bull; Workshop</span>
            </div>
            <p className="vote-guide-access-line">&bull; Exclusive access for 200 innovators and visionary thinkers</p>
            <p className="vote-guide-body">
              Explore the digital economy, exchange perspectives on AI, and examine opportunities for funding innovation.
            </p>
          </div>

          <a
            className="vote-qr-card"
            href="https://kahoot.it/challenge/03428365"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="vote-qr-card__text">
              <p className="vote-qr-card__headline">Join our Kahoot workshop to exchange insights and have fun!</p>
              <ul className="vote-qr-card__bullets">
                <li>Asynchronous interaction anytime until our session closes on July 31, 2026</li>
                <li>A collective exploration lasting 31 days</li>
              </ul>
            </div>
            <img
              className="vote-qr-card__qr"
              src={`${import.meta.env.BASE_URL}assets/Ooo%20Kahoot%20QR.png`}
              alt="Scan QR code to join Kahoot"
            />
          </a>
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
            href="https://kahoot.it/challenge/03428365"
            target="_blank"
            rel="noopener noreferrer"
          >
            VOTE ON KAHOOT →
          </a>
        </div>
      </section>

      <section className="section section-light">
        <div className="section-header">
          <div className="section-eyebrow">Creative Offerings</div>
        </div>
        <div className="dual">
          <div className="pane">
            <div className="pane-wordmark">
              <h3>Digital Products</h3>
              <span className="pane-wordmark__ooo" tabIndex={0} aria-label="Ooo!"><span className="xk" data-i="0">O</span><span className="xk" data-i="1">o</span><span className="xk" data-i="2">o</span><span className="xk pane-wordmark__bang" data-i="3">!</span></span>
            </div>
            <p className="pane-lead">Our downloadable creative resources fuse research insights with guided market strategies. You can launch today and learn from every campaign.</p>
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
                <ul className="service-chip__list service-chip__list--grid">
                  <li>Chatbot subscriptions</li>
                  <li>Marketing automation campaigns</li>
                  <li>Culturally aware localization</li>
                  <li>AI-executed audience targeting</li>
                </ul>
              </div>
              <div className="service-chip">
                <strong>Trustworthy-AI Governance</strong>
                <ul className="service-chip__list">
                  <li>Guiding new roles for AI adoption</li>
                  <li>Safety plans for human-AI cooperation</li>
                </ul>
              </div>
            </div>
            <div className="studio-testimonial">
              <p className="studio-testimonial__quote">&ldquo;Your report was very helpful. I have already applied some of the strategies to expand our community network and add practical value to our marketplace.&rdquo;</p>
              <div className="studio-testimonial__meta">
                <img src="/assets/NORWAY-flag-ooo.png" alt="Norway" height="14" style={{borderRadius:'2px',flexShrink:0,display:'block'}} />
                <span className="studio-testimonial__role">Founder &amp; CEO <img src="/assets/Ooo-Global-Network-Electric.png" alt="" className="studio-testimonial__globe" /> Norway</span>
              </div>
            </div>
            <div className="shop-ad" role="complementary" aria-label="Ooo Media Shop">
              <img src="/assets/Ooo.Media-Shop-Trans.png" alt="" className="shop-ad__art" />
              <div className="shop-ad__body">
                <div className="shop-ad__eyebrow">Ooo Media Shop <span className="shop-ad__status">&middot; Open Soon!</span></div>
                <p className="shop-ad__text">Shop digital assets on demand.</p>
              </div>
            </div>
          </div>
          <div className="pane">
            <div className="pane-wordmark">
              <h3>Studio Services</h3>
              <span className="pane-wordmark__ahh" tabIndex={0} aria-label="Ahhhh"><span className="xk" data-i="0">A</span><span className="xk" data-i="1">h</span><span className="xk" data-i="2">h</span><span className="xk" data-i="3">h</span><span className="xk" data-i="4">h</span></span>
            </div>
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
                <img src="/assets/CANADA-Flag-Drop.png" alt="Canada" height="14" style={{borderRadius:'2px',flexShrink:0,display:'block'}} />
                <span className="studio-testimonial__role">CEO <img src="/assets/Ooo-Global-Network-Electric.png" alt="" className="studio-testimonial__globe" /> Canada</span>
              </div>
              <p className="studio-testimonial__pitch">
                <span className="studio-pitch-dot studio-pitch-dot--problem" aria-hidden="true"></span>
                <span>Outsourcing SEO and PPC is prone to high turnover, which leads to repeated onboarding and slows progress.</span>
              </p>
              <p className="studio-testimonial__pitch">
                <span className="studio-pitch-dot studio-pitch-dot--solution" aria-hidden="true"></span>
                <span><strong>Ooo Digital Media Studio</strong> provides a consistent creative lead, so your team can build on every success, strengthen internal digital capacity, and drive measurable business growth.</span>
              </p>
            </div>
            <div className="studio-ad" role="complementary" aria-label="Limited studio spaces">
              <div className="studio-ad__body">
                <div className="studio-ad__eyebrow">Studio Services · 2026–2027</div>
                <p className="studio-ad__text">
                  Collaboration spaces are opening for teams seeking research-led creative and digital strategy.
                </p>
                <button
                  type="button"
                  className="studio-ad__cta"
                  onClick={() => setPathwayOpen(true)}
                >
                  Open the pathway with a conversation →
                </button>
              </div>
              <img src="/assets/Ooo-Target.png" alt="" className="studio-ad__art" />
            </div>
          </div>
        </div>
      </section>

      <section className="section support" id="find-your-path">
        <div className="section-header">
          <div className="section-eyebrow support-eyebrow">Find Your Path</div>
          <h2>Ooo offers various ways to engage!</h2>
          <p className="lead">
            Explore free resources, access premium assets, receive project
            support, or work together on collaborative studio ventures.
          </p>
        </div>

        <div className="path-tank">
          <div className="path-grid">
            <PathCard
              title="Join our stream"
              tag="Public access"
              cta="Learn more"
              summary="Explore open resources and downloadable content."
              detail="If you remix or republish Ooo media, keep an active link to Ooos.ca anywhere on your site while the media is up."
            />
            <PathCard
              title="Flow into the current"
              tag="Community members"
              cta="Get inside access"
              summary={<>Access premium creative assets, research reports, workshop and strategy kits, and early releases from <strong>Ooos universe</strong>.</>}
              detail="The waitlist for the Ooo token is now open!"
            />
            <PathCard
              title="Donate to support a shared vision!"
              tag="Project partners"
              cta="Create a wave!"
              summary={<><strong>Choose</strong> a project that inspires you, benefits your community, or reflects your values. <strong>Every contribution adds to a visible pool of public support!</strong></>}
              detail="Watch and share as the total grows and the project advances toward its next public milestone!"
            />
          </div>
        </div>

        <div className="path-feature">
          <div className="path-feature__title-band">
            <span className="path-feature__title-band-eyebrow">Featured project: CIX</span>
            <span className="path-feature__title-band-name">CANADIAN INTERACTIVE EXHIBITION</span>
          </div>
          <div className="path-feature__grid">
            <div className="path-feature__narrative">
              <p className="path-feature__body path-feature__body--wide">
                Canadian nonprofits share real-world challenges and community insights, matching with digital artists to design virtual experiences that bring these diverse narratives to life. Collaborating from ideation to execution, our teams develop interactive experiences that engage the public, build understanding and foster dialogue about solutions.
              </p>
            </div>
            <div className="pool-board" role="group" aria-label="Project funding pools">
              <PoolWidget
                label="Pool 1 · Launch"
                goal={10000}
                raised={7}
                unlocks="Help us hit this funding goal to launch an experimental event with seven nonprofit partners! Ten digital art influencers will test our vision for meaningful virtual engagement by creating interactive experiences that the public can explore for free."
                cta="Join our mission"
                onSupport={onSupport}
              />
              <PoolWidget
                label="Pool 2 · National"
                goal={25000}
                raised={7}
                unlocks="Let’s elevate our exhibition! Rally behind our national grant proposal today. Your donation will help bring diverse stories and serious issues into a shared public space. Plus, you can enjoy perks like personalizing your signature on the donor wall in the virtual exhibition."
                revealLabel="Peek behind the national stage"
                reveal={<>
                  <p>With a transparent pool of public support, Ooo Digital Media Studio will apply to the Canada Council for the Arts as the project's Creative Director in pursuit of Sector Support, Innovation and Development funding to help expand the exhibition nationally.</p>
                  <p>Supporters can add their names to a digital donor wall in the national exhibition gallery, recognizing the innovators and visionaries who saw the potential for cross-sector collaboration before the experience opened to the public for free.</p>
                </>}
                cta="Support the exhibition!"
                onSupport={onSupport}
              />
            </div>
          </div>
        </div>

        <div className="path-links">
          <span className="path-links__label">Other project links</span>
          <Link to="/ostara" className="path-links__link">Ostara: Collective Intelligence System</Link>
          <Link to="/cid" className="path-links__link">Canadian Innovation Dimension (CID)</Link>
        </div>

        <p className="support-disclosure">
          No payments are processed yet. Stripe (CAD) and Bitcoin integrations
          are coming. The Ooo token is in concept stage only. No token has
          been issued. Nothing here is a solicitation or financial advice.
        </p>
      </section>
      {pathwayOpen && <PathwayModal onClose={() => setPathwayOpen(false)} />}
    </>
  );
}

function PathCard({
  title,
  tag,
  summary,
  detail,
  cta = "Create a wave!",
}: {
  title: string;
  tag?: string;
  summary: ReactNode;
  detail: ReactNode;
  cta?: string;
}) {
  const [open, setOpen] = useState(false);
  const detailId = `path-detail-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="path-pool">
      {tag && <div className="path-pool__tag">{tag}</div>}
      <article className={`path-card ${open ? "is-open" : ""}`}>
        <div className="path-card__label">
          <h3 className="path-card__title">{title}</h3>
          <p className="path-card__body">{summary}</p>
          <div
            id={detailId}
            className="path-card__detail"
            hidden={!open}
          >
            <p>{detail}</p>
          </div>
          <button
            type="button"
            className="path-card__toggle"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Show less" : cta}
            <span aria-hidden="true" className="path-card__toggle-arrow">
              {open ? "↑" : "↓"}
            </span>
          </button>
        </div>
      </article>
    </div>
  );
}

function PoolWidget({
  label,
  goal,
  raised,
  unlocks,
  cta,
  onSupport,
  reveal,
  revealLabel,
}: {
  label: string;
  goal: number;
  raised: number;
  unlocks: string;
  cta: string;
  onSupport: () => void;
  reveal?: ReactNode;
  revealLabel?: string;
}) {
  const targetPct = Math.max(0, Math.min(100, (raised / goal) * 100));
  const [pct, setPct] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(targetPct);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPct(targetPct);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [targetPct]);

  const fmt = (n: number) =>
    n.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  const pctLabel = Math.round(pct);

  return (
    <div ref={ref} className="pool-widget">
      <div className="pool-widget__head">
        <span className="pool-widget__label">{label}</span>
        <span className="pool-widget__chip" aria-label="Pool currently open">
          Open
        </span>
      </div>
      <div className="pool-widget__amounts">
        <span className="pool-widget__goal">{fmt(goal)} <span className="pool-widget__currency">CAD</span></span>
        <span className="pool-widget__raised">{fmt(raised)} raised so far</span>
      </div>
      <div
        className="pool-widget__bar"
        role="progressbar"
        aria-label={`${label} progress`}
        aria-valuenow={Math.round(targetPct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="pool-widget__fill"
          style={{ width: `${pct}%` }}
        />
        <span className="pool-widget__pct">{pctLabel}%</span>
      </div>
      <PoolUnlocks unlocks={unlocks} reveal={reveal} revealLabel={revealLabel} />
      <button
        type="button"
        className="pool-widget__cta"
        onClick={onSupport}
      >
        {cta} →
      </button>
    </div>
  );
}

function PoolUnlocks({
  unlocks,
  reveal,
  revealLabel,
}: {
  unlocks: ReactNode;
  reveal?: ReactNode;
  revealLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const label = revealLabel ?? "Read more";
  return (
    <>
      <p className="pool-widget__unlocks">
        {unlocks}
        {reveal && (
          <>
            {" "}
            <button
              type="button"
              className="pool-widget__reveal-toggle pool-widget__reveal-toggle-inline"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Hide details" : label}
              <span aria-hidden="true">{open ? " ↑" : " ↓"}</span>
            </button>
          </>
        )}
      </p>
      {reveal && (
        <div className="pool-widget__reveal-body" hidden={!open}>
          {reveal}
        </div>
      )}
    </>
  );
}
