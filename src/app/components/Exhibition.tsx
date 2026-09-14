import { ReactNode, useEffect, useRef, useState } from "react";
import { RadioAd } from "./RadioAd";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <div className="exhibit-scope">
      <section className="exhibit-event-banner" aria-label="Canadian Interactive Exhibition">
        <div className="container">
          <h1 className="exhibit-event-banner__title">Canadian Interactive Exhibition</h1>
        </div>
      </section>

      <section className="exhibit-intro-section">
      <div className="exhibit-intro-row">
        <div className="exhibit-intro-text">
          <h2 className="exhibit-intro-h2">
            A Shared Public Space for Canada&rsquo;s Nonprofits
            <span className="exhibit-intro-pill">National Pilot</span>
          </h2>
          <p>
            The <span className="exhibit-sb">Canadian Interactive Exhibition</span> promises public access to an
            innovative virtual environment. Nonprofit organizations and
            avant-garde artists are teaming up to turn real-world challenges
            into interactive experiences that can change minds and open hearts.
          </p>
          <h3 className="exhibit-match-heading">
            Your mission deserves to be experienced!
          </h3>
          <p>
            <span className="exhibit-sb">Ooo Digital Media Studio</span> connects nonprofits with interactive
            artists who share common values and goals, guiding each team to
            harmonize complementary creative and technical skills.
          </p>
          <h3 className="exhibit-match-lead">
            Transform your cause into an interactive experience
          </h3>
          <ul className="exhibit-match-bullets">
            <li>User-friendly platform architecture</li>
            <li>Donation station for every cause</li>
            <li>Tip trays tagged to artists</li>
            <li>Plug-ins, embed tools, and gateway nodes</li>
          </ul>
          <div className="exhibit-match-image-wrap">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/matchmaking.png`}
              alt="Artist and nonprofit matchmaking — people connected through a central hub"
              className="exhibit-match-image"
              loading="lazy"
            />
          </div>
          <div className="exhibit-match-table">
            <div className="exhibit-match-box">
              <h4 className="exhibit-match-box__title">Advantages for YOU</h4>
              <ul className="exhibit-match-bullets exhibit-match-bullets--after">
                <li>Personalized guidance</li>
                <li>Customized solutions</li>
                <li>Reusable creative content</li>
                <li>Rally support for your cause!</li>
              </ul>
            </div>
            <div className="exhibit-match-box">
              <h4 className="exhibit-match-box__title">Benefits for EVERYONE</h4>
              <ul className="exhibit-match-bullets exhibit-match-bullets--after">
                <li>Strategic alignment</li>
                <li>Powerful partnerships</li>
                <li>Lead innovation together</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Programming: the midway. One card per attraction, laid
          out as a grid on a night-sky band so each attraction can carry its
          own art. The Idea Accelerator card plays a short muted loop; the
          others show a striped booth panel until their art arrives. Add an
          attraction's art by filling in its `media` entry in ATTRACTIONS. */}
      <section className="exhibit-midway" aria-labelledby="exhibit-midway-heading">
        <div className="exhibit-band exhibit-midway__inner">
          <p className="exhibit-midway__eyebrow">Step right up</p>
          <h2 id="exhibit-midway-heading" className="exhibit-midway__heading">
            Interactive Programming
          </h2>
          <div className="exhibit-midway__grid">
            {ATTRACTIONS.map((a, i) => (
              <AttractionCard key={a.id} attraction={a} booth={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <div className="exhibit-band">
          <div className="exhibit-reach">
            <div className="exhibit-reach__feature">
              <img
                src={`${import.meta.env.BASE_URL}assets/Ad-Display.png`}
                alt=""
                className="exhibit-reach__thumb"
                loading="lazy"
              />
              <div className="exhibit-reach__feature-body">
                <h3 className="exhibit-reach__heading">Community Reach Campaigns</h3>
                <p className="exhibit-reach__feature-text">
                  60% of searches now end without a click. Reclaim category
                  authority from AI-generated summaries!
                </p>
              </div>
            </div>
            <p className="exhibit-reach__pill">
              <span className="exhibit-reach__pill-label">Canadian Co-marketing Teams</span>
              <span className="exhibit-reach__pill-sep" aria-hidden="true">·</span>
              <span className="exhibit-reach__pill-date">Tryouts start July 1, 2026</span>
            </p>
            <p className="exhibit-reach__intro">
              Ooo Digital Media Studio is building Canadian
              co-marketing teams to <span className="exhibit-sb">strengthen domain authority</span>
              {" "}for mission-driven organizations,
              {" "}<span className="exhibit-sb">reinforce credibility</span> and
              {" "}<span className="exhibit-sb">increase visibility</span> for important causes.
            </p>
            <p className="exhibit-reach__section-name">Ooo Canadian Co-marketers <span className="exhibit-reach__section-abbr">(OCC)</span></p>
            <p className="exhibit-reach__hint">Click a team to preview our gameplan</p>
            <div className="exhibit-reach__plays">
              <PlayItem title="Power Play" meta={<><strong className="exhibit-play-num">6</strong> strategic partners in two related sectors</>}>
                <p>
                  A unified market-entry strategy designed for optimal impact.
                  Join forces with six allies across two related fields to
                  advance systems thinking, test solutions, enhance
                  collaboration, and engage the public. These priorities set
                  our dream team up for success!
                </p>
              </PlayItem>
              <PlayItem title="Spread Eagle" meta={<>Solo mission for <strong className="exhibit-play-num">1</strong> marketing maven</>}>
                <p>
                  For courageous community builders who cover ground others
                  can&rsquo;t. Two campaigns run in parallel: one courts donors
                  and philanthropic partners; the other reaches the people
                  your services are designed to help. Strategic targeting and
                  automated discovery elevate your digital presence and
                  directly translate into real-world impact.
                </p>
              </PlayItem>
              <PlayItem title="Give &amp; Receive" meta={<><strong className="exhibit-play-num">2</strong> players &middot; Seasonal plan or annual agreement</>}>
                <p>
                  Mutual commitments sharpen your strategic advantage. Our systematic approach establishes category authority that algorithms cannot overlook. Utilize shared values, common goals, and well-defined roles to create a strong reciprocal dynamic.
                </p>
                <p>
                  By exchanging online signals that confirm credibility and expertise, co-marketers collaborate to establish category authority that algorithms cannot ignore.
                </p>
              </PlayItem>
              <PlayItem title="Double Bumper" meta={<><strong className="exhibit-play-num">2</strong> players &middot; Quick launch or booster packs</>}>
                <p>
                  Start targeting together with two easy steps. Step 1: Co-sponsor a 3-week campaign to form an ad-buy alliance quickly. Step 2: Customize an effective multi-channel digital advertising plan.
                </p>
                <p>
                  Ooo optimizes your campaign to achieve key objectives and provides progress reports.
                </p>
              </PlayItem>
              <PlayItem title="Hat-Tricks" meta={<><strong className="exhibit-play-num">3</strong> allies &middot; Confidential contracts with a shared playbook</>}>
                <p>
                  Accelerate outreach with a trio of promotional partners
                  aligned with your nonprofit&rsquo;s niche. Our game plan
                  synchronizes marketing efforts, integrates insights, and
                  efficiently manages live leads across audience segments.
                </p>
                <p className="exhibit-play__pro">
                  <span className="exhibit-play__pro-label">Pro-plan:</span>{" "}
                  Refine through repetition. Redeploy top-performing tactics
                  and retarget audiences.
                </p>
              </PlayItem>
            </div>
          </div>
      </div>
      </section>

      <section className="exhibit-support">
        <div className="container">
          <div className="exhibit-support-inner">
            <div className="exhibit-support-content">
              <p className="tiers-label">Donate to support a shared vision!</p>
              <p className="tier-note">
                The Canadian Interactive Exhibition gets closer to a national
                launch with every contribution. Your support is critical to
                funding platform design and development, as well as building
                public support for expanding access to immersive digital
                environments.
              </p>
              <div className="support-tiers">
                <button type="button" onClick={onSupport} className="tier t1">
                  <div className="tier-name">Supporter</div>
                  <div className="tier-amt">$25+</div>
                  <div className="tier-desc">Name on the contributor wall</div>
                </button>
                <button type="button" onClick={onSupport} className="tier t2">
                  <div className="tier-name">Builder</div>
                  <div className="tier-amt">$100+</div>
                  <div className="tier-desc">Featured on the exhibition landing</div>
                </button>
                <button type="button" onClick={onSupport} className="tier t3">
                  <div className="tier-name">Patron</div>
                  <div className="tier-amt">$250+</div>
                  <div className="tier-desc">Name embedded in the exhibition</div>
                </button>
                <button type="button" onClick={onSupport} className="tier t4">
                  <div className="tier-name">Founding Partner</div>
                  <div className="tier-amt">$500+</div>
                  <div className="tier-desc">Custom portal in the virtual gallery</div>
                </button>
              </div>

              <button onClick={onSupport} className="btn btn-primary exhibit-cta">
                Join our mission! Support the exhibition <span className="exhibit-cta-arrow">➠</span>
              </button>
            </div>

            <div className="exhibit-support-image">
              <p className="tier-note tier-note--demand">
                We demand expanded public access to immersive digital environments!
              </p>
              <img
                src={`${import.meta.env.BASE_URL}assets/images/donor-wall-square.png`}
                alt="Exhibition contributor wall — your name displayed here"
                className="exhibit-donor-wall"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="case-body exhibit-includes-section">
        <p className="exhibit-includes-eyebrow">What the Exhibition Includes</p>
        <div className="exhibit-includes-pills">
          <span className="chip chip--exhibit-pill">Active public participation</span>
          <span className="chip chip--exhibit-pill">Cross-sector collaboration</span>
        </div>
        <div className="outcome-grid">
          <div className="outcome-item">
            <strong>Nonprofit and artist collaborations</strong> from across Canada
          </div>
          <div className="outcome-item">
            <strong>Public canvas</strong> for interactive experiences
          </div>
          <div className="outcome-item">
            <strong>One-month online space</strong> open to everyone
          </div>
          <div className="outcome-item">
            <strong>Participatory engagement</strong> with nonprofit missions
          </div>
        </div>
      </div>

      <section className="case-hero case-hero--mid">
        <div className="container">
          <div className="exhibit-hero-split">
            <div className="exhibit-hero-split__left">
              <img
                className="exhibit-cta-art"
                src="/assets/CTA-MIssion-Ooo.png"
                alt="Share your mission. Join the exhibition."
                loading="lazy"
              />
            </div>
            <div className="exhibit-hero-split__right">
                <img
                  className="exhibit-founding-quote-art"
                  src="/assets/Tight-Quote.png"
                  alt="Public is not a passive, fixed idea; it must be vigilantly invented and reconstructed by each generation. But Is It Art? The Spirit of Art as Activism. Art anthology edited by Nina Felshin, p. 305 (1995)."
                  loading="lazy"
                />
            </div>
          </div>
        </div>
      </section>

      <RadioAd />
    </div>
  );
}

type Tone = "ruby" | "gold" | "teal" | "portal" | "electric";

type Media =
  | { kind: "video"; mp4: string; webm: string; poster: string; alt: string }
  | { kind: "image"; src: string; alt: string };

type Attraction = {
  id: string;
  title: string;
  tag: string;
  tone: Tone;
  media?: Media;
  body: ReactNode;
};

const ASSETS = `${import.meta.env.BASE_URL}assets/exhibition/`;

/* Each attraction's art lives in public/assets/exhibition/<id>.* . A still is
   { kind: "image", src: `${ASSETS}<id>.webp`, alt }; a loop is
   { kind: "video", mp4, webm, poster, alt }. Cards without media show a
   striped booth panel in their tone. */
const ATTRACTIONS: Attraction[] = [
  {
    id: "national-gallery",
    title: "National Gallery",
    tag: "Digital Art Influencers",
    tone: "ruby",
    body: <p>Explore experimental digital artwork from Canadian creators.</p>,
  },
  {
    id: "idea-accelerator",
    title: "Idea Accelerator",
    tag: "Shoot a beam",
    tone: "gold",
    media: {
      kind: "video",
      mp4: `${ASSETS}idea-accelerator.mp4`,
      webm: `${ASSETS}idea-accelerator.webm`,
      poster: `${ASSETS}idea-accelerator-poster.webp`,
      alt: "A golden particle detector lit from within, beams of light igniting a constellation of sparks",
    },
    body: (
      <p>
        Energize your thought beam by sharing an observation. Spinning at the
        speed of light, different perspectives pull together as opposing ideas
        attract. When a conflicting insight collides with a cluster, the
        impact ignites a constellation of vibrant new connections.
      </p>
    ),
  },
  {
    id: "thought-garden",
    title: "Thought Garden",
    tag: "Plant a seed",
    tone: "teal",
    body: (
      <div className="exhibit-haiku">
        <p className="exhibit-haiku__line">Underground roots meet,</p>
        <p className="exhibit-haiku__line">Trees trade gifts beneath the soil,</p>
        <p className="exhibit-haiku__line">We grow together.</p>
        <p className="exhibit-haiku__author">GTL 6/2026</p>
      </div>
    ),
  },
  {
    id: "serious-games",
    title: "Serious Games Showcase",
    tag: "Play with purpose",
    tone: "electric",
    body: (
      <p>
        Bias Busting POVs invite visitors into interactive stories that confront
        hard realities, challenge assumptions, shift perspectives, and
        strengthen public education.
      </p>
    ),
  },
  {
    id: "sassy-games",
    title: "Sassy Games Spotlight",
    tag: "Play proud",
    tone: "portal",
    body: (
      <p>
        Join us as we welcome community leaders, proud players, allies,
        anonymous avatars, and anyone seeking a safe space for supportive
        conversations about gender and sexuality.
      </p>
    ),
  },
  {
    id: "radical-jester",
    title: "The Most Radical Jester",
    tag: "Truth to power",
    tone: "ruby",
    body: (
      <p>
        Speak truth to power, make light of a painful reality, or flip the
        script in your own twisted way.
      </p>
    ),
  },
  {
    id: "queen-of-the-night",
    title: "Queen of the Night",
    tag: "Your radiant reign",
    tone: "portal",
    body: (
      <p>
        Experience emotional liberation for one night only. Elusive, elegant,
        or intense. Flaunt forbidden feelings and do not excuse your beauty.
      </p>
    ),
  },
  {
    id: "gateway-portals",
    title: "Gateway Portals",
    tag: "Enter here",
    tone: "teal",
    body: <p>Enter artist-created worlds</p>,
  },
];

/* Muted, looping card art. Plays only while on screen, and not at all for
   visitors who asked for reduced motion (they get the poster). */
function LoopVideo({ media }: { media: Extract<Media, { kind: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className="midway-card__video"
      muted
      loop
      playsInline
      preload="metadata"
      poster={media.poster}
      aria-label={media.alt}
    >
      <source src={media.webm} type="video/webm" />
      <source src={media.mp4} type="video/mp4" />
    </video>
  );
}

function AttractionCard({ attraction, booth }: { attraction: Attraction; booth: number }) {
  const { title, tag, tone, media, body } = attraction;
  const titleId = `midway-${attraction.id}`;
  return (
    <article className={`midway-card midway-card--${tone}`} aria-labelledby={titleId}>
      <div className="midway-card__media">
        {media?.kind === "video" && <LoopVideo media={media} />}
        {media?.kind === "image" && (
          <img className="midway-card__img" src={media.src} alt={media.alt} loading="lazy" />
        )}
        {!media && (
          <div className="midway-card__booth" aria-hidden="true">
            <span className="midway-card__booth-no">
              Booth {String(booth).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
      <div className="midway-card__body">
        <span className="midway-card__tag">{tag}</span>
        <h3 id={titleId} className="midway-card__title">{title}</h3>
        <div className="midway-card__text">{body}</div>
      </div>
    </article>
  );
}

function PlayItem({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const detailId = `exhibit-play-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className={`exhibit-play ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="exhibit-play-toggle"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="exhibit-play-name">
          <span className="exhibit-play-title">{title}</span>
          {meta && (
            <>
              <span className="exhibit-play-sep" aria-hidden="true">·</span>
              <span className="exhibit-play-meta">{meta}</span>
            </>
          )}
        </span>
        <span aria-hidden="true" className="exhibit-play-arrow">
          {open ? "\u2212" : "+"}
        </span>
      </button>
      <div id={detailId} className="exhibit-play-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
