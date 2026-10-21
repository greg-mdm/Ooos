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
  titleIcon?: IconName;
  /* the small line under the toggle, per booth (Greg, 2026-10-19);
     "Read into it" where a booth has none of its own; it can carry an icon */
  hint?: ReactNode;
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
    tagIcon: "dice",
    titleIcon: "alert",
    hint: "Try your luck",
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
    /* the Sass logo stands in for the word (Greg, 2026-10-20) */
    hint: <><SassMark /> en masse</>,
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
/* `head`: the title sits on its own card above the picture, the name in
   big type with the symbol, and the caption beneath carries only the
   byline, the way a museum label hangs under a painting (Greg,
   2026-10-18). `crop: "bottom"` anchors the picture to its foot so the
   top is what gets cut. */
type GalleryPiece = { id: string; title?: string; tag?: string; credit?: ReactNode; line?: string; share?: boolean; bid?: boolean; head?: boolean; crop?: "bottom"; icon?: IconName; media?: Media };

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
/* Greg's "Shadow" (IMG_2568, 2026-10-17): the Shadow Flash painting, then
   its digital rendering in a silver corridor (Greg's pick, 2026-10-17).
   Both cut to the tall frame (1150 x 1592) from the originals in this
   folder. The violet-corridor rendering is cut too
   (national-gallery-shadow-violet.webp) if the pair should swap. */
const GALLERY: GalleryPiece[] = [
  /* the painting as before (Greg, 2026-10-18): the picture whole in its
     frame, nothing laid over it, its title and credit beneath */
  {
    id: "shadow-painting",
    title: "Shadow",
    head: true,
    /* the original subtitle (Greg, 2026-10-20) */
    credit: <>Title: <em>Shadow</em>. Artist: McCormack<br />From the series &lsquo;Canvases of Old Dreams,&rsquo; a collection of abstract artworks.</>,
    media: {
      kind: "image",
      src: `${ASSETS}national-gallery-shadow-painting.webp`,
      alt: "A shrouded white figure outlined in black, painted in thick strokes over a pink, blue and violet field",
      frame: "tall",
    },
  },
  /* the two renderings (Greg, 2026-10-18): the silver corridor rendering
     second, beside the original, with a Share link; the card portrait cut
     from the approved still third, with the approved line and the bid */
  {
    id: "shadow-silver",
    title: "Shadow Twin",
    icon: "shapes",
    credit: "Digitized by Ooo!",
    crop: "bottom",
    media: {
      kind: "image",
      src: `${ASSETS}national-gallery-shadow-silver.webp`,
      alt: "The same shrouded figure as liquid chrome, its cape flaring pink and blue in a white-silver corridor",
      frame: "tall",
    },
  },
  {
    id: "shadow-card",
    line: "Shadow searches for home",
    bid: true,
    media: {
      kind: "image",
      src: `${ASSETS}shadow-card-tall.webp`,
      alt: "Shadow, a white sheet ghost with violet eyes and colour soaking up its hem, on the rainy plaza",
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

/* Three cards, darker to lighter left to right (Greg, 2026-10-18): the
   picture whole at the top of each, nothing over it, the text in the card
   beneath in one format; the third card's line sits over its picture and
   the bid, the main call, takes the card body in large Poppins. */
function GalleryLot() {
  return (
    <section className="dicho dicho--gallery lot-spread" aria-labelledby="lot-title">
      <div className="lot-spread__row">
        {GALLERY.map((piece, i) => (
          <figure key={piece.id} className={`lot-spread__piece lot-spread__piece--${i + 1}`}>
            {piece.head && piece.title && (
              <header className="lot-spread__head">
                {/* icon first, then the name, on both cards (Greg, 2026-10-18) */}
                <span id={piece.id === "shadow-painting" ? "lot-title" : undefined} className="gallery-piece__title lot-spread__title-big">
                  <Icon name={piece.icon ?? "venn"} />
                  <span className="lot-spread__name">{piece.title}</span>
                </span>
              </header>
            )}
            <div className="lot-spread__pic">
              {piece.media?.kind === "image" && (
                <img className={`lot-spread__img${piece.crop === "bottom" ? " lot-spread__img--bottom" : ""}`} src={piece.media.src} alt={piece.media.alt} loading="lazy" />
              )}
              {piece.line && <span className="lot-spread__line">{piece.line}</span>}
            </div>
            <figcaption className="lot-spread__cap">
              {piece.title && !piece.head && <span id={piece.id === "shadow-painting" ? "lot-title" : undefined} className="gallery-piece__title"><Icon name={piece.icon ?? "venn"} /><span className="lot-spread__name">{piece.title}</span>{piece.tag && <span className="lot-spread__tag">{piece.tag}</span>}</span>}
              {piece.credit && <span className={`gallery-piece__credit${piece.head ? " lot-spread__byline" : ""}`}>{piece.credit}</span>}
              {piece.share && <ShareLink />}
              {piece.bid && <BidButton />}
            </figcaption>
          </figure>
        ))}
      </div>
      <LotDetails />
    </section>
  );
}

/* Share: the page's own share sheet where there is one (phones, Safari,
   Edge); elsewhere the link is copied and the label says so for a moment. */
function ShareLink() {
  const [done, setDone] = useState(false);
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#midway-national-gallery`;
    const data = { title: "Shadow, rendered", url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url);
      setDone(true); window.setTimeout(() => setDone(false), 1800);
    } catch { /* the visitor closed the sheet */ }
  };
  return (
    <button type="button" className="lot-spread__share" onClick={share} aria-live="polite">
      {done ? "Link copied" : "Share"}
    </button>
  );
}

/* The gold button under the campaign card: "Adopt a hero" (Greg,
   2026-10-18), the line that goes with Shadow searching for a home. */
function BidButton() {
  const closed = Date.now() >= AUCTION_CLOSE.getTime();
  return closed ? (
    <span className="lot__closed lot-spread__bid">Bidding closed</span>
  ) : (
    <a className="lot__cta lot-spread__bid" href={BID_FORM_URL} target="_blank" rel="noopener noreferrer">
      Adopt a hero
    </a>
  );
}

/* The lot: Shadow is looking for a home. Bids go to the standalone Wix
   form on Slow Stream (Greg's back office, 2026-10-17); this panel is the
   front door. The auction runs October 20 to November 20, 2026, closing
   11:59 PM ET (Greg, 2026-10-18: pushed from the 15th while the page is
   set up); after the close the buttons give way to a closed line. Framing
   is quoted to the winner. The artist note stays folded. */
const BID_FORM_URL = "https://greg31122.wixforms.com/f/7517118600616870916";
const AUCTION_CLOSE = new Date("2026-11-21T04:59:00Z"); // Nov 20, 11:59 PM ET

/* The auction widget on Shadow's pink brick picture (Greg, 2026-10-18):
   the event name, the bid button and the dates, in the upper right on the
   dark pool. */
function AuctionWidget() {
  const closed = Date.now() >= AUCTION_CLOSE.getTime();
  return (
    <div className="lot__art-widget">
      <span className="lot__art-widget__name">Live Art Auction</span>
      {closed ? (
        <span className="lot__closed lot__art-widget__cta">Bidding closed</span>
      ) : (
        <a className="lot__cta lot__art-widget__cta" href={BID_FORM_URL} target="_blank" rel="noopener noreferrer">
          Place a bid
        </a>
      )}
      <span className="lot__art-widget__dates">[October 20 &ndash;<br />November 20, 2026]</span>
    </div>
  );
}

/* The artist's answers, Greg's text (2026-10-20), quotes balanced per answer; each opens on
   its first word, inside About the artist. */
const ARTIST_QA: { q: string; a: ReactNode }[] = [
  { q: "When?", a: <>&ldquo;Started painting at the age of 18. I remember it was in the fall&hellip; It was 20 years ago this season.&rdquo;</> },
  { q: "How?", a: <>&ldquo;I used to make my own homemade canvases from pillow slips. My hack was to prime with a few coats and stretch by hand.&rdquo;</> },
  { q: "Why?", a: <>Had a lot of emotional hardships growing up in foster homes. I channelled my highs and lows and expressed my creativity using vibrant colours, mixing my techniques with different styles.</> },
  { q: "Where?", a: <>&ldquo;Toronto is home. I don&rsquo;t know if you&rsquo;ve ever thought about it, but sometimes I feel like the earth is in the middle of nowhere.&rdquo;</> },
  { q: "When?", a: <>&ldquo;I&rsquo;ve had questions about reality throughout my life, but after settling into a sober lifestyle, I struggled and searched for meaning.&rdquo;</> },
  { q: "What?", a: <>&ldquo;Everyone sees different things&hellip;&rdquo;</> },
];

/* Two columns (Greg, 2026-10-20): the Live Art Auction picture with the
   bid terms under it on the left; About the artist on the right, open,
   the artist's photo a thumbnail beside it (2026-10-21), its answers
   folded on their first words. */
function LotDetails() {
  const [open, setOpen] = useState(true);
  return (
    <div className="lot lot--painting">
      <div className="lot__col lot__col--auction">
        {/* Shadow on the real pink brick, the auction widget on it (Greg,
            2026-10-18): a dark pool behind the widget that fades before it
            reaches her. The page serves a 960 px JPEG made from his
            card-size PNG, which stays in the folder as the source. */}
        <figure className="lot__art">
          <img
            className="lot__art-img"
            src={`${ASSETS}shadow-pink-brick-card.jpg`}
            alt="Shadow, the white ghost with violet eyes, floating over a parkette of pink and purple brick scattered with yellow leaves"
            width="960"
            height="1200"
            loading="lazy"
          />
          <AuctionWidget />
        </figure>
        <p className="lot__terms">
          <span>Opening bid $200 CAD</span>
          <span aria-hidden="true">·</span>
          <span>Highest bid at close wins</span>
        </p>
        <p className="lot__fine">Framing is separate; options are quoted to the winner. Pickup in Toronto or shipping at cost.</p>
      </div>
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
        <span className="dicho__tag dicho__tag--a">{a.tagIcon && <Icon name={a.tagIcon} />}{a.tag}</span>
        <span className="dicho__slash" aria-hidden="true" />
        <span className="dicho__tag dicho__tag--b">{b.tagIcon && <Icon name={b.tagIcon} />}{b.tag}</span>
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
            <span className="midway-card__label">{title}</span>
            {/* the glyph is the button (Greg, 2026-10-17): raised at rest,
                pressed in while the description is open */}
            <span className="midway-card__ctl">
              <span className={`midway-card__mark${attraction.titleIcon ? " midway-card__mark--glyph" : ""}${attraction.mark ? " midway-card__mark--word" : ""}`} aria-hidden="true">
                {attraction.titleIcon ? <Icon name={attraction.titleIcon} /> : attraction.mark ? attraction.mark : open ? "\u2212" : "+"}
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
