import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { RadioAd } from "./RadioAd";
import { AnatomyDisplay } from "./AnatomyDisplay";

export function Exhibition({ onSupport }: { onSupport: () => void }) {
  return (
    <div className="exhibit-scope">
      <section className="exhibit-event-banner" aria-label="Canadian Interactive Exhibition">
        <div className="container">
          <h1 className="exhibit-event-banner__title">Canadian Interactive Exhibition</h1>
        </div>
      </section>

      {/* The intro in clean areas (Greg, 2026-10-08: the top was messy
          from an earlier layout switch). The copy sits on the left in its
          reading measure. On the right, the two pictures: the Virtual Fair
          dice roll as a muted loop, and the matchmaking illustration the
          page already had. The two advantage boxes run full width beneath.
          On phones the areas stack: copy, loop, boxes, illustration (Greg,
          2026-10-08: the boxes go between the stacked video and image). */}
      <section className="exhibit-intro-section">
      <div className="exhibit-intro-row exhibit-intro-grid">
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
          {/* "Your mission deserves to be experienced!" and the "connects
              nonprofits" paragraph that followed it live on the matchmaking
              card now, the line as its title (2026-10-09) and the paragraph
              as its caption (Greg, 2026-10-08: it goes with the image, which
              shows the matching system). */}
          <h3 className="exhibit-match-lead">
            Transform your cause into an interactive experience
          </h3>
          <ul className="exhibit-match-bullets">
            <li>User-friendly platform architecture</li>
            <li>Donation station for every cause</li>
            <li>Tip trays tagged to artists</li>
            <li>Plug-ins, embed tools, and gateway nodes</li>
          </ul>
          {/* The two advantage boxes, stacked under the copy (Greg,
              2026-10-09), so the left column stands level with the group
              of three on the right. */}
          <div className="exhibit-match-table exhibit-match-table--stack">
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
          {/* Two portrait videos in the same format, side by side, each a
              finished asset shown whole at its own 9:16 with the frame formed
              around it (Greg, 2026-10-09). Left, the water loop: the figure
              blinks, the corridor floods. Right, the brick wall still; tapped,
              it plays the portal entrance once and rests on its last frame,
              the rainbow room, where a text overlay will go later. */}
          <div className="exhibit-intro-cards">
          <figure className="exhibit-intro-card exhibit-intro-card--teal exhibit-intro-slot--left">
            {/* the heading on a panel across the top, matching the right
                card's band (Greg, 2026-10-13); the panel sits above the video
                rather than over it, so her head is never under it. The pill
                and the description stay beneath the video (Greg, 2026-10-11). */}
            <div className="exhibit-intro-card__media exhibit-intro-card__media--portrait exhibit-intro-card__media--banded">
              <span className="exhibit-intro-card__band"><span className="exhibit-intro-card__title">Enter artist-created worlds</span></span>
              <LoopVideo media={PORTALS_INTRO} />
            </div>
            <figcaption className="exhibit-intro-card__cap">
              <span className="exhibit-intro-card__tag">Gateway Portals</span>
              <span className="exhibit-intro-card__sub">Inspire change with eye-opening experiences</span>
            </figcaption>
          </figure>
          <figure className="exhibit-intro-card exhibit-intro-card--portal exhibit-intro-slot--right">
            {/* the pill stays at the top of this video, on a backing band
                (Greg, 2026-10-11); its description stays at the foot, so the
                visitor reads and watches one video at a time */}
            <div className="exhibit-intro-card__media exhibit-intro-card__media--portrait">
              <TapVideo media={PORTAL_ENTRANCE} />
              <span className="exhibit-intro-card__band"><span className="exhibit-intro-card__tag">Fun fundraising: game on</span></span>
            </div>
            <figcaption className="exhibit-intro-card__cap">
              {/* Greg's caption (2026-10-10), replacing "Enter here / Tap the
                  wall to open the portal" */}
              <span className="exhibit-intro-card__title">Invite donors into your world with characters, quests, and rewards</span>
            </figcaption>
          </figure>
          {/* The matchmaking band under the two videos, the three locked as
              one group beside the copy (Greg, 2026-10-09). The Matchmaking
              pill sits over the picture, and "Your mission deserves to be
              experienced!" is the heading on the text side, over the
              "connects nonprofits" paragraph (Greg, 2026-10-08: it goes
              with the image, which shows the matching system). */}
          <figure className="exhibit-intro-match">
            <div className="exhibit-intro-match__pic">
              <img
                className="exhibit-intro-match__img"
                src={`${import.meta.env.BASE_URL}assets/images/matchmaking-1200.webp`}
                alt="Artist and nonprofit matchmaking: people connected through a central hub"
                width="1200"
                height="800"
                loading="lazy"
              />
              <span className="exhibit-intro-card__tag exhibit-intro-match__tag">Matchmaking</span>
            </div>
            <figcaption className="exhibit-intro-match__cap">
              <h3 className="exhibit-intro-match__title">Your mission deserves to be experienced!</h3>
              <p className="exhibit-intro-match__text">
                <span className="exhibit-sb">Ooo Digital Media Studio</span> connects nonprofits with interactive
                artists who share common values and goals, guiding each team to
                harmonize complementary creative and technical skills.
              </p>
            </figcaption>
          </figure>
          </div>
      </div>

      {/* Interactive Programming: a gallery spread and three contrasts on a
          night-sky band (Greg, 2026-10-16: an immersive digital playground,
          not a local fair). The Idea Accelerator plays a short muted loop;
          attractions without art hold a quiet slot. Add an attraction's art
          by filling in its `media` entry in ATTRACTIONS. */}
      <section className="exhibit-midway" aria-labelledby="exhibit-midway-heading">
        <div className="exhibit-band exhibit-midway__inner">
          {/* The kayak ride, widescreen, above the phones (Greg, 2026-10-13):
              scene one into the tunnel, scene two past the portal, played
              as one run. */}
          <FeatureVideo clips={KAYAK_RIDE} />
          {/* The anatomy display, above "Scroll right up" (Greg, 2026-10-12). */}
          <AnatomyDisplay />
          {/* "Scroll right up", Greg's turn on the barker's line (2026-10-13). */}
          <p className="exhibit-midway__eyebrow">Scroll right up</p>
          <h2 id="exhibit-midway-heading" className="exhibit-midway__heading">
            Interactive Programming
          </h2>
          {/* The programming reads as one spread and three contrasts (Greg,
              2026-10-16): the National Gallery first, two featured pieces
              side by side; then each remaining pair as a dichotomy on one
              ground, its two tags either side of a single seam. Descriptions
              stay folded until a visitor taps a title (progressive
              disclosure), so the band reads as a quiet playground, not a
              fairground of placards. */}
          <div className="exhibit-midway__stack">
            <GallerySpread />
            {PAIRS.map((pair) => (
              <DichotomyPair key={pair.id} pair={pair} />
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
  | { kind: "video"; mp4: string; webm: string; poster: string; alt: string; focus?: "bottom" }
  | { kind: "image"; src: string; alt: string; frame?: "tall" }
  /* a still that, when touched, blurs like frosted glass into a second
     still: src at rest, touched on hover, focus or tap */
  | { kind: "touch"; src: string; alt: string; touched: string; touchedAlt: string };

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
   quiet slot in their tone. */
const ATTRACTIONS: Attraction[] = [
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
    /* Greg's photo (2026-10-07): public/assets/exhibition/Leaf Silhoutte -
       Stage Light.heic, a monstera leaf under a single stage light. Decoded
       from HEIC and cut to the slot's 16:9 across the full width, placed over
       the lit heart of the leaf (3024x1701 from y=560), as a 1280x720 WebP. */
    media: {
      kind: "touch",
      src: `${ASSETS}thought-garden.webp`,
      alt: "A monstera leaf beaded with water, lit by a single stage light against black",
      /* Greg's second photo (Touch Leaf - White Male.heic): his own hand
         holding the leaf, cut the same way from y=1700. Touching the leaf
         blurs it into this one. A later idea, after the Red Cross CPR
         demonstration, swaps the skin tone of the hand; the touched image
         is one field so that can grow into a set. */
      touched: `${ASSETS}thought-garden-touch.webp`,
      touchedAlt: "A hand reaches up and holds the lit monstera leaf",
    },
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
    /* Greg's "Radical Jester.png" (SPRINT 6, 2026-10-12): an iridescent
       jester mask beside the book "The Most Radical Gesture", on glitter;
       sized to the tulip's shape, so the two share one tall frame */
    media: {
      kind: "image",
      src: `${ASSETS}the-most-radical-jester-tall.webp`,
      alt: "An iridescent jester mask with violet eyes beside the book The Most Radical Gesture, on a field of glitter",
      frame: "tall",
    },
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
    /* Greg's "tulip indigo.jpg" (SPRINT 6, 2026-10-08), a portrait of one
       indigo tulip, whole: this booth's frame is tall for it (Greg,
       2026-10-11: the horizontal frame did not suit it) */
    media: {
      kind: "image",
      src: `${ASSETS}queen-of-the-night-tall.webp`,
      alt: "A single indigo tulip, its petals closed, velvet-dark against a soft green",
      frame: "tall",
    },
    body: (
      <p>
        Experience emotional liberation for one night only. Elusive, elegant,
        or intense. Flaunt forbidden feelings and do not excuse your beauty.
      </p>
    ),
  },
];

/* The National Gallery spread: two featured pieces from Canadian creators,
   shown side by side at the top of the programming (Greg, 2026-10-16: two
   feature pieces to come). Fill each slot's `media` when the art lands in
   public/assets/exhibition/; until then the slot holds a quiet panel. */
type GalleryPiece = { id: string; title: string; credit?: string; media?: Media };
/* Greg's "Shadow" (IMG_2568, 2026-10-17): the Shadow Flash painting, then
   its digital rendering in a silver corridor (Greg's pick, 2026-10-17).
   Both cut to the tall frame (1150 x 1592) from the originals in this
   folder. The violet-corridor rendering is cut too
   (national-gallery-shadow-violet.webp) if the pair should swap. */
const GALLERY: GalleryPiece[] = [
  {
    id: "shadow-painting",
    title: "Shadow Flash",
    credit: "The painting",
    media: {
      kind: "image",
      src: `${ASSETS}national-gallery-shadow-painting.webp`,
      alt: "A shrouded white figure outlined in black, painted in thick strokes over a pink, blue and violet field",
      frame: "tall",
    },
  },
  {
    id: "shadow-silver",
    title: "Shadow, rendered",
    credit: "The digital transformation",
    media: {
      kind: "image",
      src: `${ASSETS}national-gallery-shadow-silver.webp`,
      alt: "The same shrouded figure as liquid chrome, its cape flaring pink and blue in a white-silver corridor",
      frame: "tall",
    },
  },
];

/* The three contrasts, each a pair of attractions that are two answers to
   one question (Greg, 2026-10-16): the beam and the seed; purpose and
   pride; the jester and the queen. The order here is the order on the page. */
type Pair = { id: string; a: string; b: string; question: string };
const PAIRS: Pair[] = [
  { id: "beam-seed", a: "idea-accelerator", b: "thought-garden", question: "Spark it, or grow it" },
  { id: "purpose-pride", a: "serious-games", b: "sassy-games", question: "Play with purpose, or play proud" },
  { id: "jester-queen", a: "radical-jester", b: "queen-of-the-night", question: "Two ways to face the night" },
];

/* The water loop for the intro's left card (Greg, 2026-10-09): two of his
   portrait clips composed into one. "Blinking POV - CIX" opens it, the
   cyclops figure blinking in the neon corridor; "rushing-water-hallway"
   follows, the corridor flooding toward the viewer. A short dissolve joins
   them and the last half second dissolves into the first, so it loops
   without a jump. 720 x 1280, muted, 9.5 seconds; the poster is his
   "purple-eye-water-corridor" still. The brick wall and the rainbow room
   that closed the first cut are the right card's video now. Masters in
   SPRINT 6. */
const PORTALS_INTRO: Extract<Media, { kind: "video" }> = {
  kind: "video",
  mp4: `${ASSETS}gateway-portals-intro.mp4`,
  webm: `${ASSETS}gateway-portals-intro.webm`,
  poster: `${ASSETS}gateway-portals-intro-poster.webp`,
  alt: "A figure with one violet eye blinks in a neon corridor, and water floods the corridor toward you",
};

/* The portal entrance for the intro's right card: Greg's "Portals - Short
   Clip" at the same 720 x 1280, played once on a tap and left on its last
   frame, the rainbow room, which is the ground a text overlay will sit on
   later. At rest the card shows his brick wall still (SPRINT 6/Brick Wall -
   media-1791583639120.png) with its three neon buttons. */
const PORTAL_ENTRANCE: Extract<Media, { kind: "video" }> = {
  kind: "video",
  mp4: `${ASSETS}gateway-portal-entrance.mp4`,
  webm: `${ASSETS}gateway-portal-entrance.webm`,
  poster: `${ASSETS}gateway-portal-wall.webp`,
  alt: "A brick wall with three neon buttons, Donate, Play Again and Next Booth. Tapped, the CIX sign appears on the wall and a silhouette walks into a rainbow-lit room",
};

/* Tap to play: the still shows at rest; a tap plays the clip once, and it
   rests on its last frame. Another tap plays it again from the start.
   Keyboard and screen readers get a button that says what it does. */
function TapVideo({ media }: { media: Extract<Media, { kind: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"rest" | "playing" | "done">("rest");
  const play = () => {
    const v = ref.current;
    if (!v) return;
    if (v.ended || state === "done") v.currentTime = 0;
    void v.play().catch(() => {});
  };
  return (
    <button
      type="button"
      className={`exhibit-tap${state !== "rest" ? " is-played" : ""}`}
      onClick={play}
      aria-label={state === "rest" ? "Tap to open the portal" : "Play the portal again"}
    >
      <video
        ref={ref}
        className="exhibit-tap__video"
        muted
        playsInline
        preload="metadata"
        poster={media.poster}
        aria-label={media.alt}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate noremoteplayback"
        onPlay={() => setState("playing")}
        onEnded={() => setState("done")}
      >
        <source src={media.webm} type="video/webm" />
        <source src={media.mp4} type="video/mp4" />
      </video>
    </button>
  );
}

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
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload noplaybackrate noremoteplayback"
      style={media.focus ? { objectPosition: `50% ${media.focus === "bottom" ? "100%" : "50%"}` } : undefined}
    >
      <source src={media.webm} type="video/webm" />
      <source src={media.mp4} type="video/mp4" />
    </video>
  );
}

/* The featured ride at the top of the midway: Greg's kayak run, two clips
   played as one ride (2026-10-13). Scene one, the kayak entering the
   tunnel of stars toward the ENTER portal; scene two, what is past it.
   Both files are shown whole at 16:9 in one wide frame: the two <video>
   elements sit stacked and only the playing one shows, so the cut from
   one to the next is a swap, not a reload. The ride starts muted on its
   own when it scrolls into view, like the loops, runs scene one into
   scene two and back around, and keeps the browser's controls so a
   visitor can unmute or scrub. Each clip fades up from black, so a frame
   from inside each (captured in the browser) is its poster. No webm yet. */
type Clip = { mp4: string; poster: string; alt: string };
const KAYAK_RIDE: Clip[] = [
  {
    mp4: `${ASSETS}kayak%20enter%20tunnel.mp4`,
    poster: `${ASSETS}kayak-enter-tunnel-poster.jpg`,
    alt: "From the bow of a red kayak with a maple leaf badge, gliding through a tunnel of streaking stars toward a round portal marked ENTER",
  },
  {
    /* Greg's edited cut of scene two (2026-10-13), the dice morph trimmed
       out; moved here from SPRINT 6 under a short name */
    mp4: `${ASSETS}kayak-scene-2.mp4`,
    poster: `${ASSETS}kayak-scene-2-poster.jpg`,
    alt: "Scene two, past the portal: rushing down a tunnel of glowing violet glass tiles, loose tiles tumbling past in streaks of cyan and pink light",
  },
];

function FeatureVideo({ clips }: { clips: Clip[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const figRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const inView = useRef(false);

  // play the active clip while the frame is in view; pause it when not
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        const el = refs.current[active];
        if (!el) return;
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(fig);
    return () => io.disconnect();
  }, [active]);

  // when the active clip ends, hand off to the next one from its start; it
  // was playing a moment ago, so the visitor is watching: play on
  const next = (i: number) => {
    const n = (i + 1) % clips.length;
    const el = refs.current[n];
    setActive(n);
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  return (
    <figure ref={figRef} className="exhibit-feature">
      {clips.map((c, i) => (
        <video
          key={c.mp4}
          ref={(el) => { refs.current[i] = el; }}
          className={`exhibit-feature__video${i === active ? " is-active" : ""}`}
          controls
          muted
          playsInline
          preload={i === 0 ? "metadata" : "auto"}
          poster={c.poster}
          aria-label={c.alt}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback"
          onEnded={() => next(i)}
        >
          <source src={c.mp4} type="video/mp4" />
        </video>
      ))}
    </figure>
  );
}

/* Touch to reveal: the resting still blurs away like frosted glass and the
   touched still clears in its place. Hover does it on a mouse; a tap
   toggles it and keeps it (aria-pressed); keyboard focus does it too.
   Both images load up front (not lazily), so the second is ready the
   moment the leaf is touched. */
function TouchImage({ media }: { media: Extract<Media, { kind: "touch" }> }) {
  const [touched, setTouched] = useState(false);
  return (
    <button
      type="button"
      className={`midway-card__touch${touched ? " is-touched" : ""}`}
      onClick={() => setTouched((t) => !t)}
      aria-pressed={touched}
      aria-label={touched ? `${media.touchedAlt}. Release the leaf` : `${media.alt}. Touch the leaf`}
      title={touched ? "Release" : "Touch the leaf"}
    >
      <img className="midway-card__img midway-card__touch-img midway-card__touch-img--rest" src={media.src} alt="" decoding="async" />
      <img className="midway-card__img midway-card__touch-img midway-card__touch-img--touched" src={media.touched} alt="" decoding="async" />
    </button>
  );
}

function GallerySpread() {
  return (
    <section className="dicho dicho--gallery dicho--tall" aria-labelledby="midway-national-gallery">
      <header className="dicho__head">
        <span className="dicho__tag dicho__tag--a">Digital Art Influencers</span>
        <h3 id="midway-national-gallery" className="dicho__title">National Gallery</h3>
        <span className="dicho__question">Experimental digital artwork from Canadian creators</span>
      </header>
      <div className="dicho__sides">
        {GALLERY.map((piece, i) => (
          <figure key={piece.id} className="gallery-piece">
            <div className={`midway-card__media${piece.media?.kind === "image" && piece.media.frame === "tall" ? " midway-card__media--tall" : ""}`}>
              {piece.media?.kind === "video" && <LoopVideo media={piece.media} />}
              {piece.media?.kind === "image" && (
                <img className="midway-card__img" src={piece.media.src} alt={piece.media.alt} loading="lazy" />
              )}
              {!piece.media && (
                <div className="midway-card__slot" aria-hidden="true">
                  <span className="midway-card__slot-no">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
            </div>
            <figcaption className="gallery-piece__cap">
              <span className="gallery-piece__title">{piece.title}</span>
              {piece.credit && <span className="gallery-piece__credit">{piece.credit}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* One contrast on one ground: the two tags either side of a seam, then the
   two attractions side by side (stacked on a phone). The ground runs from
   the first attraction's tone to the second's. */
function DichotomyPair({ pair }: { pair: Pair }) {
  const a = ATTRACTIONS.find((x) => x.id === pair.a);
  const b = ATTRACTIONS.find((x) => x.id === pair.b);
  if (!a || !b) return null;
  const tall = a.media?.kind === "image" && a.media.frame === "tall";
  return (
    <section
      className={`dicho${tall ? " dicho--tall" : ""}`}
      role="group"
      aria-label={`${a.title} and ${b.title}`}
      style={{ "--tone-a": TONES[a.tone], "--tone-b": TONES[b.tone] } as CSSProperties}
    >
      <header className="dicho__head">
        <span className="dicho__tag dicho__tag--a">{a.tag}</span>
        <span className="dicho__slash" aria-hidden="true" />
        <span className="dicho__tag dicho__tag--b">{b.tag}</span>
        <span className="dicho__question">{pair.question}</span>
      </header>
      <div className="dicho__sides">
        <AttractionCard attraction={a} side="a" />
        <AttractionCard attraction={b} side="b" />
      </div>
    </section>
  );
}

const TONES: Record<Tone, string> = {
  ruby: "#822F00",
  gold: "#F0C040",
  teal: "#008080",
  portal: "#4B00B6",
  electric: "#5B04DE",
};

/* An attraction: its art, then its title as a button. The description stays
   folded until the title is tapped (Greg, 2026-10-16: show nothing until
   tapped), and folds again on a second tap. */
function AttractionCard({ attraction, side }: { attraction: Attraction; side: "a" | "b" }) {
  const { title, tone, media, body } = attraction;
  const [open, setOpen] = useState(false);
  const titleId = `midway-${attraction.id}`;
  const textId = `${titleId}-text`;
  return (
    <article className={`midway-card midway-card--${tone} midway-card--${side}${open ? " is-open" : ""}`} aria-labelledby={titleId}>
      <div className={`midway-card__media${media?.kind === "image" && media.frame === "tall" ? " midway-card__media--tall" : ""}`}>
        {media?.kind === "video" && <LoopVideo media={media} />}
        {media?.kind === "image" && (
          <img className="midway-card__img" src={media.src} alt={media.alt} loading="lazy" />
        )}
        {media?.kind === "touch" && <TouchImage media={media} />}
        {!media && <div className="midway-card__slot" aria-hidden="true" />}
      </div>
      <div className="midway-card__body">
        <h3 id={titleId} className="midway-card__title">
          <button
            type="button"
            className="midway-card__toggle"
            aria-expanded={open}
            aria-controls={textId}
            onClick={() => setOpen((v) => !v)}
          >
            <span>{title}</span>
            <span className="midway-card__mark" aria-hidden="true">{open ? "\u2212" : "+"}</span>
          </button>
        </h3>
        <div id={textId} className="midway-card__text" hidden={!open}>{body}</div>
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
