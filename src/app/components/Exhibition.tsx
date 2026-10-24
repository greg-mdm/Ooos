import { CSSProperties, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
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
              <span className="exhibit-intro-card__tag"><Icon name="door" />Gateway Portals</span>
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
      <section className="exhibit-midway" aria-labelledby="midway-national-gallery">
        {/* The National Gallery leads the band (Greg, 2026-10-18): the host
            video edge to edge as a hero, its words set on the picture, then
            the painting with its text beside it, then the three media cards,
            then the programming. It is outside, in Toronto, so it gets the
            whole width. */}
        <GalleryHero />
        <div className="exhibit-band exhibit-midway__inner">
          <GalleryLot />
          {/* The three media cards on one row (Greg, 2026-10-18): the kayak
              ride in a tablet that only plays on RIDE (no autoplay; the ride
              flips perspective, so the visitor chooses it), then the two
              anatomy phones. Started, the ride takes the full row. */}
          <div className="exhibit-ride-row">
            <FeatureVideo clips={KAYAK_RIDE} />
            <AnatomyDisplay />
          </div>
          {/* "Scroll right up", Greg's turn on the barker's line (2026-10-13). */}
          <p className="exhibit-midway__eyebrow">Scroll right up</p>
          <h2 id="exhibit-midway-heading" className="exhibit-midway__heading">
            Interactive Programming
          </h2>
          {/* Three contrasts (Greg, 2026-10-16): each pair as a dichotomy on
              one ground, its two tags either side of a single seam.
              Descriptions stay folded until a visitor taps a title
              (progressive disclosure), so the band reads as a quiet
              playground, not a fairground of placards. */}
          <div className="exhibit-midway__stack">
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
  | { kind: "image"; src: string; alt: string; frame?: "tall" | "portrait" }
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
  tagIcon?: IconName;
  /* a drawn icon beside the tag where the line set has none (Greg,
     2026-10-22: Ionicons balloon-outline on Play proud) */
  tagGlyph?: ReactNode;
  titleIcon?: IconName;
  /* the small line under the toggle, per booth (Greg, 2026-10-19);
     "Read into it" where a booth has none of its own; it can carry an icon */
  hint?: ReactNode;
  /* the title as shown, where it carries more than text (the Ooo!
     wordmark); `title` stays the plain words */
  heading?: ReactNode;
  /* a drawn glyph on the round button in place of the plus or a line icon
     (Phosphor's, 2026-10-21); accent tints the button's glyph and the line
     under it */
  glyph?: ReactNode;
  accent?: "lime";
  /* a word on the round button in place of the plus (Greg, 2026-10-19:
     "YAAS!" on the Sassy Games booth); raised at rest, pressed while open */
  mark?: string;
};

/* the Sass logo, from Ionicons (logo-sass, v7.4.0, MIT licence,
   Copyright (c) 2015-present Ionic, https://ionic.io), cropped to the artwork;
   it reads as the word, so it names itself "Sass" */
function SassMark() {
  return (
    <svg className="midway-card__sass" viewBox="0 80 512 352" role="img" aria-label="Sass" fill="currentColor">
      <path d="M511.78 328.07c-1.47-11.92-7.51-22.26-18-30.77a3.58 3.58 0 00-.43-.44l-.53-.38-.17-.12-5.57-4-.19-.14-.71-.5a3.5 3.5 0 00-.83-.35c-17.62-10.49-46.79-17.84-91.42-2.09-10.65-17.92-11.86-32.28-4.73-54.28 1.27-3.83.09-6.36-3.71-8-7.64-3.25-18.1-1.59-25.52.37-3.46.9-5.54 2.86-6.2 5.83-4.7 22-18.36 42.1-31.57 61.5l-.78 1.14c-8.14-17.26-6.45-30.63-.78-47.38 1.13-3.34.24-5.56-2.89-7.22-8.74-4.51-21.85-1.41-27.07.13-6.62 1.93-13.72 19.82-21.65 41.24-2 5.39-3.72 10-4.75 12.15-2.45 5-4.79 10.7-7.27 16.75-5.6 13.69-11.91 29.1-20.93 38.78-3.28-7.25 1.88-18.68 6.89-29.77 5.93-13.11 11.53-25.5 5.08-33.41a11.82 11.82 0 00-8.33-4.32 13.26 13.26 0 00-6.15 1c.67-5.65.7-10.11-.95-15.5-2.36-7.69-8.49-12-16.93-11.77-19.22.56-35.48 14.88-45.75 26.8-6.84 8-22 14.1-35.31 19.45-5.26 2.23-10.26 4.23-14.43 6.23-6.65-5.62-15.1-11.29-24-17.28-25-16.78-53.33-35.81-54.31-61.61-1.4-38.11 42-65.14 79.88-84.43 28.71-14.6 53.67-24.28 76.31-29.57 31.8-7.43 58.66-5.93 79.82 4.44 11.58 5.67 17 18 13.56 30.68-9 32.95-46.29 55.53-78.18 65.69-19.21 6.12-35.56 8.68-50 7.84-18.1-1.05-32.88-10.13-39.2-14a21.18 21.18 0 00-3.2-1.8l-.29-.07a3.21 3.21 0 00-3.19 1c-1.3 1.55-.84 4-.37 5.24 6.15 16.07 18.85 26.22 37.74 30.17a92.09 92.09 0 0018.78 1.79c44.21 0 100.62-25.49 121.34-46.48 14.13-14.3 24.42-29 28.68-54.35 4.45-26.55-13.55-45-31.89-53.5-44.57-20.57-95.19-12.44-129.81-2-40.5 12.21-82.4 34.41-114.94 60.93-40.12 32.67-54.62 63-43.12 90.25 11.81 27.93 40.61 45.4 68.46 62.3 9 5.45 17.56 10.64 25.27 16-2.32 1.13-4.69 2.28-7.1 3.43-23.38 11.33-49.9 24.08-64.61 45.15-10.68 15.35-12.68 30.63-5.94 45.42 3.6 7.87 10 13.21 18.89 15.87A50 50 0 0053 432c17.31 0 36.36-7 46.73-13.47 18.32-11.5 30.19-26.94 35.29-45.89 4.54-16.86 3.45-33.61-3.15-48.56l22.45-11.32c-10.83 36-2.53 57.5 6.59 69.36 3.36 4.37 9.42 7 16.19 7.12s13-2.43 16.52-6.77c6.66-8.25 11.58-17.9 16.11-27.55-.24 6.3.06 12.68 2.21 18.09 1.93 4.87 5.11 8.1 9.21 9.34 4.36 1.33 9.47.21 14.39-3.15 22.17-15.17 37.33-51.58 49.51-80.85 1.73-4.16 3.39-8.16 5-11.9a152.5 152.5 0 0012.5 31.07c1.18 2.14 1.08 3.08-.52 4.84-2.41 2.64-5.77 5.83-9.33 9.21-10.78 10.23-24.2 23-26 34.23-.7 4.5 2.4 8.6 7.21 9.53 14.47 2.88 31.9-1.33 46.64-11.25 13.4-9 18.44-21.55 15-37.19-3.33-15.06 4.27-33.76 22.59-55.62 3 12.53 7 22.66 12.52 31.53l-.15.12c-13.34 11.65-31.62 27.6-28.78 46.95a13.35 13.35 0 005.58 9.22 14.22 14.22 0 0011.2 2.06c17.47-3.67 30.62-11.06 40.18-22.57s6.07-24.27 2.85-34.17c25-6.78 47.26-6.61 68.1.5 11.7 4 20.09 10.57 24.93 19.64 6.09 11.41 2.8 21.94-9.29 29.65-3.71 2.37-5.5 3.82-5.61 5.65a2.65 2.65 0 001 2.23c1.4 1.15 5.72 3.15 15.49-3 9-5.65 14.28-13.34 15.63-23a39 39 0 00-.01-8.01zm-399.73 25.06l-.1 1.28c-1.56 14.64-9 27.4-22.15 38-8.26 6.66-17.23 10.75-25.25 11.53-5.6.54-9.67-.22-12.09-2.27-1.81-1.53-2.78-3.82-3-7-1.64-25.48 38.32-50.8 60.81-59.13a51.39 51.39 0 011.78 17.59zm102.35-71.86c-3.7 21.09-14.49 60.9-31.45 76.35-.81.74-1.49 1-1.8.93s-.55-.44-.8-1c-5.66-13.12-3.57-35.28 5-52.69 6.59-13.42 16-22.31 26.52-25a5.29 5.29 0 011.34-.19 1.58 1.58 0 011 .27 1.64 1.64 0 01.19 1.33zm83.49 76.88c-3.19 3.33-7.56 2.88-6.53 1.66l16.24-17.24c-1.31 5.93-5.18 10.84-9.71 15.58zm67.37-14.91a14.07 14.07 0 01-4.93 1.39c-.46-9.07 8.33-19.28 17-26.09 2.33 9.46-2.44 19.46-12.07 24.7z" />
    </svg>
  );
}

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
    hint: "See what sparks",
    glyph: <SparklesIcon />,
    tagIcon: "beam",
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
    tagIcon: "seed",
    hint: "Dig deeper",
    /* git-merge with "Dig deeper" (Greg, 2026-10-24), in place of the plus */
    glyph: <GitMergeIcon />,
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
    /* the description (Greg, 2026-10-22), the haiku kept beneath it in
       smaller type */
    body: (
      <>
        <p>
          Cultivate common ground by sharing a hope, fear, worry, or wish.
          Leave a worry behind and find new connections ahead. What matters to
          you? Discover how your concerns intersect with others.
        </p>
        <div className="exhibit-haiku exhibit-haiku--small">
          <p className="exhibit-haiku__line">Underground roots meet,</p>
          <p className="exhibit-haiku__line">Trees trade gifts beneath the soil,</p>
          <p className="exhibit-haiku__line">We grow together.</p>
          <p className="exhibit-haiku__author">GTL 6/2026</p>
        </div>
      </>
    ),
  },
  {
    id: "serious-games",
    title: "Serious Games Showcase",
    tag: "Play with purpose",
    tagIcon: "dice",
    /* hand-heart with "Play with your heart" (Greg, 2026-10-21) */
    glyph: <PhosphorIcon name="hand-heart" />,
    hint: "Play with your heart",
    tone: "electric",
    /* Greg's "double sixes.png" (2026-10-17): two neon dice on a glass
       board, the board cut to the Sassy photo's portrait so the two
       sides match (Greg: crop the board, not the person) */
    media: {
      kind: "image",
      src: `${ASSETS}serious-games.webp`,
      alt: "Two glowing dice, yellow and pink, showing double sixes on a violet glass board",
      frame: "portrait",
    },
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
    tagGlyph: <BalloonIcon />,
    /* the Sass logo stands in for the word (Greg, 2026-10-20) */
    hint: <><SassMark /> <span className="midway-card__hint-keep">en masse</span></>,
    mark: "Yaas!",
    tone: "portal",
    /* Greg's "SASSY GAMES.jpg" (2026-10-17): a performer mid-song under
       violet light, the crowd's hands up; shown whole (Greg: do not crop) */
    media: {
      kind: "image",
      src: `${ASSETS}sassy-games.webp`,
      alt: "A performer in a sequinned gown sings under violet light as the crowd reaches up",
      frame: "portrait",
    },
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
    /* the name on top, the cry below the image with the Ooo! wordmark
       (Greg, 2026-10-21) */
    title: "Ooo! Somebody stop me",
    heading: <><img className="midway-card__wordmark" src={`${import.meta.env.BASE_URL}assets/brand/ooo-wordmark-white-transparent.png`} alt="Ooo!" width="1772" height="655" /> Somebody stop me</>,
    tag: "The Most Radical Jester",
    hint: <><em>Is</em> it jest a joke?</>,
    /* The Mask's happy mask in the film's green beside its catchphrase (Greg,
       2026-10-21); the mask is the subject, the line makes it the film */
    glyph: <PhosphorIcon name="mask-happy" />,
    accent: "lime",
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
    /* the name on top, the line below the image, the tulip on the button
       (Greg, 2026-10-21) */
    title: "Your radiant reign",
    tag: "Queen of the Night",
    glyph: <PhosphorIcon name="flower-tulip" />,
    hint: "Make room to bloom",
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
/* `head`: the title sits on its own card above the picture, the name in
   big type with the symbol, and the caption beneath carries only the
   byline, the way a museum label hangs under a painting (Greg,
   2026-10-18). `crop: "bottom"` anchors the picture to its foot so the
   top is what gets cut. */


/* The approved main video (Greg's "Shadow LEAKED - Preview 1.mp4",
   2026-10-17): Shadow and kin on the rainy plaza, 5 seconds, transcoded
   to H.264 and VP9 for the web, muted loop; its poster is the "Hopeful
   Shadow - FINAL ART" still. Featured across the top of the gallery
   spread with the approved line. */
const SHADOW_HOST: Extract<Media, { kind: "video" }> = {
  kind: "video",
  mp4: `${ASSETS}shadow-host.mp4`,
  webm: `${ASSETS}shadow-host.webm`,
  poster: `${ASSETS}shadow-host-poster.webp`,
  alt: "Shadow, a white sheet ghost, stands on a rainy Toronto plaza of painted lines and looks around; a small hooded kin trails far behind with bubbles",
};
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
/* `once`: play through a single time when it comes into view and hold the
   last frame (the hero: Shadow turns, turns back, and stays). */
function LoopVideo({ media, once = false }: { media: Extract<Media, { kind: "video" }>; once?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { if (!(once && el.ended)) el.play().catch(() => {}); }
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return (
    <video
      ref={ref}
      className="midway-card__video"
      muted
      loop={!once}
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
/* The START card's picture: the ride's opening frame from the mouth of the
   tunnel, cut tall (3:4) around the ENTER portal so the tablet shows the
   portal whole (Greg, 2026-10-18). The 16:9 poster is the same frame. */
const RIDE_POSTER_TALL = `${ASSETS}kayak-enter-tunnel-tall.jpg`;
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
  const [started, setStarted] = useState(false);

  // START: the visitor chooses the ride; nothing moves before that
  const start = () => {
    setStarted(true);
    window.setTimeout(() => {
      const el = refs.current[0];
      if (el) { el.currentTime = 0; el.play().catch(() => {}); }
      figRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };
  const stop = () => {
    refs.current.forEach((v) => { if (v) { v.pause(); v.currentTime = 0; } });
    setActive(0);
    setStarted(false);
  };

  // when the active clip ends, hand off to the next one from its start
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
    <figure ref={figRef} className={`exhibit-feature${started ? " is-open" : ""}`}>
            {!started && (
        <div className="ride-tablet">
          <button type="button" className="ride-start ride-tablet__screen" onClick={start} aria-label="Ride: play the kayak video">
            <img className="ride-start__poster" src={RIDE_POSTER_TALL} alt="" />
            <span className="ride-start__label"><Icon name="coaster" /><span>Ride</span></span>
          </button>
          <span className="ride-tablet__chin" aria-hidden="true"><span className="ride-tablet__key" /></span>
        </div>
      )}
      {started && clips.map((c, i) => (
        <video
          key={c.mp4}
          ref={(el) => { refs.current[i] = el; }}
          className={`exhibit-feature__video${i === active ? " is-active" : ""}`}
          controls
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
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
      {started && (
        <button type="button" className="ride-exit" onClick={stop}>Exit ride</button>
      )}
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

/* Heading glyphs (Greg, 2026-10-17): simple open-source-style line icons,
   drawn inline so they take the heading's colour. 24-unit grid, 2px
   stroke, round joins. */
type IconName = "alert" | "dice" | "venn" | "shapes" | "door" | "beam" | "seed" | "coaster";
const ICON_PATHS: Record<IconName, ReactNode> = {
  /* after Ionicons' shapes-outline (MIT): a triangle over a circle, for
     the rendered twin (Greg, 2026-10-18) */
  shapes: (
    <>
      <path d="M3.5 16.5L10.5 4l7 12.5z" />
      <circle cx="15.5" cy="15.5" r="5" />
    </>
  ),
  alert: (
    <>
      <path d="M8.2 3h7.6l5.2 5.2v7.6L15.8 21H8.2L3 15.8V8.2L8.2 3z" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </>
  ),
  dice: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  venn: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
      <path d="M12 6.8a6 6 0 0 1 0 10.4a6 6 0 0 1 0-10.4z" fill="currentColor" stroke="none" />
    </>
  ),
  door: (
    <>
      <path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21" />
      <path d="M3.5 21h17" />
      <circle cx="14.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  beam: (
    <>
      <path d="M13 2.5L5 13.5h6l-1 8 9-12h-6l1-7z" />
    </>
  ),
  coaster: (
    <>
      <path d="M2 18c3-6 6-9 9-9 2.5 0 3.5 2 2.5 4s-3 2.5-4 1 .5-4 3-6c3-2.5 6.5-2 9.5 1" />
      <path d="M4 21v-5M9 21v-7M14 21v-6M19 21v-8" />
      <rect x="15.5" y="7" width="3.5" height="2.4" rx="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  seed: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4.5 3-7.5 8-7.5 0 4.5-3 7.5-8 7.5z" />
      <path d="M12 13c0-3.5-2.4-6-6.5-6 0 3.5 2.4 6 6.5 6z" />
    </>
  ),
};
/* Two Phosphor icons (Greg, 2026-10-21), from phosphor-icons/core at
   2b75f3a: mask-happy (duotone) for the Jester, after The Mask's
   catchphrase beside it, hand-heart (regular) for Serious Games, and
   flower-tulip (regular) for Queen of the Night.
   Phosphor Icons, MIT License, Copyright (c) 2023 Phosphor Icons. */
function PhosphorIcon({ name }: { name: "mask-happy" | "hand-heart" | "flower-tulip" }) {
  return (
    <svg className="hicon phicon" viewBox="0 0 256 256" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
      {name === "mask-happy" ? (
        <>
          <path d="M216,48v55.77C216,174.6,176.6,232,128,232S40,174.6,40,103.79V48a8,8,0,0,1,10.89-7.47C66,46.41,95.11,55.71,128,55.71s62-9.3,77.11-15.16A8,8,0,0,1,216,48Z" opacity="0.2" />
          <path d="M217,34.8a15.94,15.94,0,0,0-14.82-1.71C188.15,38.55,159.82,47.71,128,47.71S67.84,38.55,53.79,33.09A16,16,0,0,0,32,48v55.77c0,35.84,9.65,69.65,27.18,95.18,18.16,26.46,42.6,41,68.82,41s50.66-14.57,68.82-41C214.35,173.44,224,139.63,224,103.79V48A16,16,0,0,0,217,34.8Zm-9,69c0,32.64-8.66,63.23-24.37,86.13C168.54,211.9,148.79,224,128,224s-40.54-12.1-55.63-34.08C56.66,167,48,136.43,48,103.79V48c15.11,5.87,45.58,15.71,80,15.71S192.9,53.87,208,48v55.81Zm-18,18.87A8,8,0,1,1,178,133.33c-2.68-3-8.85-5.33-14-5.33s-11.36,2.34-14,5.33A8,8,0,1,1,138,122.66c5.71-6.38,16.14-10.66,26-10.66S184.25,116.28,190,122.66ZM92,128c-5.19,0-11.36,2.34-14,5.33A8,8,0,1,1,66,122.66C71.75,116.28,82.18,112,92,112s20.25,4.28,26,10.66A8,8,0,1,1,106,133.33C103.36,130.34,97.19,128,92,128Zm76.45,45.19a52.9,52.9,0,0,1-80.9,0A8,8,0,1,1,99.72,162.8a36.89,36.89,0,0,0,56.56,0,8,8,0,0,1,12.17,10.39Z" />
        </>
      ) : name === "flower-tulip" ? (
        <path d="M208,48a87.48,87.48,0,0,0-35.36,7.43c-15.1-25.37-39.92-38-41.06-38.59a8,8,0,0,0-7.16,0c-1.14.58-26,13.22-41.06,38.59A87.48,87.48,0,0,0,48,48a8,8,0,0,0-8,8V96a88.11,88.11,0,0,0,80,87.63v35.43L83.58,200.84a8,8,0,1,0-7.16,14.32l48,24a8,8,0,0,0,7.16,0l48-24a8,8,0,0,0-7.16-14.32L136,219.06V183.63A88.11,88.11,0,0,0,216,96V56A8,8,0,0,0,208,48ZM120,167.56A72.1,72.1,0,0,1,56,96V64.44A72.1,72.1,0,0,1,120,136Zm8-68.2A88.4,88.4,0,0,0,97.36,63.19c9.57-15.79,24-25.9,30.64-30,6.65,4.08,21.08,14.19,30.64,30A88.46,88.46,0,0,0,128,99.36ZM200,96a72.1,72.1,0,0,1-64,71.56V136a72.1,72.1,0,0,1,64-71.56Z" />
      ) : (
        <path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z" />
      )}
    </svg>
  );
}

/* Ionicons balloon-outline (v7.4.0, MIT licence, Copyright (c) 2015-present
   Ionic, https://ionic.io), paths verbatim, for the Play proud tag */
function BalloonIcon() {
  return (
    <svg className="hicon" viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path d="M414.11 153.82C429.66 264.4 345.85 357.09 282.54 366s-169.48-57.5-185-167.68a159.82 159.82 0 11316.53-44.49z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32" /><path d="M236.06 308.05c-32.83-13-67.08-43.1-82.27-85.46M367.7 495.78c-32.83-13-63.31-40.06-78.5-82.41" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" /><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M266.71 368.21l-9.17 49.61 63.31-8.9-22.49-45.16-31.65 4.45z" />
    </svg>
  );
}

/* Ionicons sparkles-outline (v7.4.0, MIT, as above), paths verbatim, on the
   Idea Accelerator button beside "See what sparks" (Greg, 2026-10-22) */
function SparklesIcon() {
  return (
    <svg className="hicon" viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false">
      <path d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0l-43.52 113.14a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17zM108 68L88 16 68 68 16 88l52 20 20 52 20-52 52-20-52-20zM426.67 117.33L400 48l-26.67 69.33L304 144l69.33 26.67L400 240l26.67-69.33L496 144l-69.33-26.67z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </svg>
  );
}

/* Ionicons git-merge-outline (v7.4.0, MIT, as above), shapes verbatim, on
   the Thought Garden button beside "Dig deeper" (Greg, 2026-10-24) */
function GitMergeIcon() {
  return (
    <svg className="hicon" viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
        <circle cx="129" cy="96" r="48" /><circle cx="129" cy="416" r="48" /><path d="M129 144v224" /><circle cx="385" cy="288" r="48" /><path d="M129 144c0 96 112 144 208 144" />
      </g>
    </svg>
  );
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg className="hicon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICON_PATHS[name]}
    </svg>
  );
}

/* The hero: the host loop edge to edge, the gallery's words set on the
   picture's lower right (Shadow stands at the left), over a soft scrim. */
function GalleryHero() {
  return (
    <figure className="gallery-hero">
      <div className="gallery-hero__media">
        <LoopVideo media={SHADOW_HOST} once />
      </div>
      <figcaption className="gallery-hero__words">
        <span className="gallery-hero__tag">Digital Art Influencers</span>
        <h3 id="midway-national-gallery" className="gallery-hero__title">National Gallery</h3>
      </figcaption>
      {/* the host's name card (Greg, 2026-10-19): a near-black disc at the
          lower left, on the plaza, clear of Shadow, read like a credit, the
          character's name as the title and her role beneath. A child of the
          hero so it is placed against the picture, not the words column. The
          studio name is never set in caps (site convention): the wordmark
          carries it, the role after it takes the small caps. */}
      <span className="gallery-hero__disc">
        <span className="gallery-hero__disc-name">Shadow</span>
        <span className="gallery-hero__cap gallery-hero__disc-role">
          <img className="gallery-hero__wordmark" src={`${import.meta.env.BASE_URL}assets/brand/ooo-wordmark-white-transparent.png`} alt="Ooo!" />
          <span>Halloween host</span>
        </span>
      </span>
    </figure>
  );
}

/* The Shadow print (Greg, 2026-10-24): the framed print for sale where the
   painting and its twin hung, one card across two columns with the three
   approved room mockups (Artlist 4K upscales, the original painting set in
   each frame). The order button links the Wix store's product page; until
   the Slow Stream store is published and the product visible, PRINT.url is
   empty and the button shows without a link. */
const PRINT = {
  url: "",
  name: "Framed Art Print",
  size: "12 \u00d7 16 in, black wood frame",
  price: "CA$69",
  shots: [
    { src: `${ASSETS}shadow-print-marble.jpg`, alt: "Shadow framed in black on a dark marble wall above a marble console, a brass lamp and a silver vase beside it" },
    { src: `${ASSETS}shadow-print-gallery.jpg`, alt: "Shadow framed in black on a pale gallery wall, an arched hallway to the left" },
    { src: `${ASSETS}shadow-print-studio.jpg`, alt: "Shadow framed in black on a white studio wall between a wooden easel and a paint-covered worktable" },
  ],
};

/* Art on Demand (Greg, 2026-10-24): the Live Art Auction card reworked
   beside the print, Shadow still floating over her shadow; the line on top,
   the name under her, and Adopt a hero opening the print's product page
   (until PRINT.url is set it brings the print card into view). */
function AdoptCard() {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    if (PRINT.url) return;
    e.preventDefault();
    document.getElementById("lot-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="lot-auction lot-spread__adopt">
      <div className="lot-auction__card">
        <p className="lot-auction__kicker">Shadow searches for home</p>
        <div className="lot-auction__stage">
          <span className="lot-auction__shadow" aria-hidden="true" />
          <img
            className="lot-auction__ghost"
            src={`${ASSETS}live-auction-shadow.webp`}
            alt="Shadow, the white ghost with violet eyes, floating"
            width="306"
            height="532"
          />
        </div>
        <p className="lot-auction__title">Art on Demand</p>
        <a className="lot-auction__bid" href={PRINT.url || "#lot-title"} onClick={go} {...(PRINT.url ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          Adopt a hero
        </a>
      </div>
    </div>
  );
}

function ShadowPrintCard() {
  const [shot, setShot] = useState(0);
  const cta = "Order the print";
  return (
    <article className="lot-spread__piece lot-spread__piece--print">
      <header className="lot-spread__head">
        <span id="lot-title" className="gallery-piece__title lot-spread__title-big">
          <Icon name="venn" />
          <span className="lot-spread__name">Shadow</span>
        </span>
        <span className="print-card__tag">From &lsquo;Canvases of Old Dreams,&rsquo; a collection of abstract artworks.</span>
      </header>
      <div className="print-card__stage">
        <img className="print-card__img" src={PRINT.shots[shot].src} alt={PRINT.shots[shot].alt} />
      </div>
      <div className="print-card__thumbs" role="group" aria-label="Views of the framed print">
        {PRINT.shots.map((v, i) => (
          <button key={v.src} type="button" className="print-card__thumb" aria-pressed={i === shot} aria-label={`View ${i + 1}`} onClick={() => setShot(i)}>
            <img src={v.src} alt="" loading="lazy" />
          </button>
        ))}
        <span className="print-card__artist">Artist: McCormack</span>
      </div>
      <div className="print-card__body">
        <div className="print-card__about">
          <span className="print-card__name">{PRINT.name}</span>
          <p className="print-card__desc">Collect Shadow in physical form: this black wooden frame holds a vibrant painting digitally remixed by the artist, printed on museum-quality matte paper.</p>
        </div>
        <div className="print-card__buy">
          <span className="print-card__price">{PRINT.price}</span>
          <span className="print-card__size">{PRINT.size}</span>
          {PRINT.url ? (
            <a className="lot__cta print-card__cta" href={PRINT.url} target="_blank" rel="noopener noreferrer">{cta}</a>
          ) : (
            <span className="lot__cta print-card__cta" aria-disabled="true">{cta}</span>
          )}
        </div>
      </div>
    </article>
  );
}

/* Three cards, darker to lighter left to right (Greg, 2026-10-18): the
   picture whole at the top of each, nothing over it, the text in the card
   beneath in one format; the third card's line sits over its picture and
   the bid, the main call, takes the card body in large Poppins. */
function GalleryLot() {
  return (
    <section className="dicho dicho--gallery lot-spread" aria-labelledby="lot-title">
      <div className="lot-spread__row">
        <ShadowPrintCard />
        <AdoptCard />
      </div>
      <LotDetails />
    </section>
  );
}

/* The artist's answers, Greg's text (2026-10-20), quotes balanced per answer; each opens on
   its first word, inside About the artist. */
const ARTIST_QA: { q: string; a: ReactNode }[] = [
  { q: "When?", a: <>&ldquo;Started painting at the age of 18. I remember it was in the fall&hellip; It was 20 years ago this season.&rdquo;</> },
  { q: "How?", a: <>&ldquo;I used to make my own homemade canvases from pillow slips. My hack was to prime with a few coats and stretch by hand.&rdquo;</> },
  { q: "Why?", a: <>&ldquo;Growing up in foster homes and being away from family meant facing many emotional hardships. I poured the highs and lows of those experiences into my art, painting with vibrant colours and mixing various styles and techniques.&rdquo;</> },
  { q: "Where?", a: <>&ldquo;I grew up moving around the GTA, spent my teenage years in Ajax, and now call Toronto home&hellip; Sometimes I find myself wondering where we are, like the earth itself is in the middle of nowhere. It&rsquo;s a feeling that fills me with questions, and a sense that we&rsquo;re all a little lost in space. This uncertainty might spill into my canvases.&rdquo;</> },
  { q: "When?", a: <>&ldquo;I&rsquo;ve had questions about reality throughout my life, but after settling into a sober lifestyle, I struggled and searched for meaning.&rdquo;</> },
  { q: "What?", a: <>&ldquo;Everyone sees different things&hellip;&rdquo;</> },
];

/* About the artist, open, the artist's photo a thumbnail beside it
   (2026-10-21), its answers folded on their first words; on its own since
   the auction was cancelled (Greg, 2026-10-24: Art on Demand replaced it) */
function LotDetails() {
  const [open, setOpen] = useState(true);
  return (
    <div className="lot lot--painting">
      <div className="lot__col lot__col--artist">
        <div className="lot__about">
          {/* the artist's photo as a thumbnail beside the heading, so the
              artwork leads (Greg, 2026-10-21); the page serves an 800 px
              JPEG made from his "McCormack - Abstract Artist - 2026.jpg" */}
          <div className="lot__about-head">
          <img
            className="lot__artist"
            src={`${ASSETS}mccormack-artist.jpg`}
            alt="Portrait of the artist McCormack in saturated, painterly colour: dark tousled hair, a short beard and a light blue T-shirt"
            width="88"
            height="88"
            loading="lazy"
          />
          <button
            type="button"
            className="lot__toggle"
            aria-expanded={open}
            aria-controls="lot-about"
            onClick={() => setOpen((v) => !v)}
          >
            <span>About the artist</span>
            <span className="midway-card__mark" aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
          </div>
          <div id="lot-about" className="lot__text" hidden={!open}>
            {ARTIST_QA.map((item, i) => (
              <details key={i} className="lot__qa">
                <summary className="lot__q">{item.q}</summary>
                <p className="lot__a">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* The character, the campaign's digital side (not for sale): the card
   portrait and the one approved line. */

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
        <span className="dicho__tag dicho__tag--a">{a.tagGlyph ?? (a.tagIcon && <Icon name={a.tagIcon} />)}{a.tag}</span>
        <span className="dicho__slash" aria-hidden="true" />
        <span className="dicho__tag dicho__tag--b">{b.tagGlyph ?? (b.tagIcon && <Icon name={b.tagIcon} />)}{b.tag}</span>
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
      <div className={`midway-card__media${media?.kind === "image" && media.frame ? ` midway-card__media--${media.frame}` : ""}`}>
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
            <span className={`midway-card__label${attraction.heading ? " midway-card__label--wrap" : ""}`}>{attraction.heading ?? title}</span>
            {/* the glyph is the button (Greg, 2026-10-17): raised at rest,
                pressed in while the description is open */}
            <span className={`midway-card__ctl${attraction.accent ? ` midway-card__ctl--${attraction.accent}` : ""}`}>
              <span className={`midway-card__mark${attraction.titleIcon || attraction.glyph ? " midway-card__mark--glyph" : ""}${attraction.mark ? " midway-card__mark--word" : ""}`} aria-hidden="true">
                {attraction.glyph ? attraction.glyph : attraction.titleIcon ? <Icon name={attraction.titleIcon} /> : attraction.mark ? attraction.mark : open ? "\u2212" : "+"}
              </span>
              <span className="midway-card__hint">{attraction.hint ?? "Read into it"}</span>
            </span>
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
