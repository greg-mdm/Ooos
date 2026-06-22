import { useState } from "react";
import { AuroraField } from "./AuroraField";
import "../../styles/ooodivisions2.css";

// ----- data -----------------------------------------------------------------
type Tone = "sun" | "ruby" | "teal" | "indigo";
type Pill = { label: string; tone: Tone };
type Key = { text: string; bg: string; shadow: string };
type Division = {
  mod: "mic" | "cid" | "ra";
  name: string;
  kind: string;
  keys: Key[];
  /** each entry is one pill, or an array of pills rendered side-by-side on one row */
  products: (Pill | Pill[])[];
  services: (Pill | Pill[])[];
};

const grad = (a: string, b: string, c: string) =>
  `radial-gradient(135% 165% at 50% -34%,${a} 0%,${b} 42%,${c} 100%)`;

// shared key lighting (top key brightest, fading down)
const LIT_A: Key = { text: "", bg: grad("rgb(137,119,162)", "rgb(44,28,86)", "rgb(15,9,29)"), shadow: "0 14px 32px rgba(8,2,24,0.29)" };
const LIT_B: Key = { text: "", bg: grad("rgb(121,105,144)", "rgb(34,21,68)", "rgb(12,7,23)"), shadow: "0 12px 28px rgba(8,2,24,0.25)" };
const LIT_C: Key = { text: "", bg: grad("rgb(104,90,124)", "rgb(24,14,50)", "rgb(8,5,17)"), shadow: "0 10px 25px rgba(8,2,24,0.22)" };

const DIVISIONS: Division[] = [
  {
    mod: "mic",
    name: "Media, Information and Culture (MIC)",
    kind: "OBJECTIVES",
    keys: [
      { ...LIT_A, text: "Connect cultural industries with advances in digital technologies" },
      { ...LIT_B, text: "Make unique interactive digital experiences accessible to the public" },
      { ...LIT_C, text: "Offer expert resources for creative digital strategy. Publish guidelines for A.I. management." },
    ],
    products: [
      { label: "Storytelling", tone: "sun" },
      { label: "Community resources", tone: "sun" },
      { label: "Virtual events", tone: "sun" },
      { label: "Chatbot solutions", tone: "sun" },
    ],
    services: [
      { label: "Strategic planning", tone: "indigo" },
      { label: "Ad Localization", tone: "indigo" },
      [{ label: "SEO", tone: "indigo" }, { label: "UX testing", tone: "indigo" }],
    ],
  },
  {
    mod: "cid",
    name: "Canadian Innovation Dimension (CID)",
    kind: "STRATEGIES",
    keys: [
      { bg: grad("rgb(174,153,201)", "rgb(70,46,134)", "rgb(24,16,46)"), shadow: "0 19px 42px rgba(8,2,24,0.38)", text: "Energize economic expansion. Integrate verified data sources. Empower inclusive growth." },
      { bg: grad("rgb(152,133,179)", "rgb(54,35,104)", "rgb(18,12,35)"), shadow: "0 16px 36px rgba(8,2,24,0.32)", text: "Gather collective intelligence. Build global partnerships. Boost business confidence." },
      { bg: grad("rgb(126,110,151)", "rgb(37,23,74)", "rgb(13,8,25)"), shadow: "0 13px 30px rgba(8,2,24,0.27)", text: "Design tools to support applied research experiments. Direct digital innovation projects." },
    ],
    products: [
      { label: "Strategic intelligence", tone: "sun" },
      { label: "Workshops", tone: "sun" },
      { label: "Experiments", tone: "sun" },
      { label: "Research design", tone: "sun" },
    ],
    services: [
      { label: "Market research", tone: "indigo" },
      { label: "Sector support", tone: "indigo" },
      { label: "Internationalization", tone: "indigo" },
    ],
  },
  {
    mod: "ra",
    name: "Reclaiming Agency",
    kind: "TACTICS",
    keys: [
      { ...LIT_A, text: "Investigate issues, inform decision-making, and support community action" },
      { ...LIT_B, text: "Help protect people and improve policies. Advance a new era for creative workers." },
      { ...LIT_C, text: "Gain strength in numbers: increase collective bargaining power." },
    ],
    products: [
      { label: "Data distribution", tone: "sun" },
      { label: "Expert analysis", tone: "sun" },
      { label: "Compliance training", tone: "sun" },
    ],
    services: [
      { label: "Confidential consulting", tone: "indigo" },
      { label: "Advocacy", tone: "indigo" },
      { label: "Dark-pattern defense", tone: "indigo" },
    ],
  },
];

// ----- pieces ---------------------------------------------------------------
function PillTag({ pill }: { pill: Pill }) {
  return <span className={`ood-pill ood-pill--${pill.tone}`}>{pill.label}</span>;
}

function PillList({ items }: { items: (Pill | Pill[])[] }) {
  return (
    <div className="ood-pills">
      {items.map((item, i) =>
        Array.isArray(item) ? (
          <div className="ood-pillrow" key={i}>
            {item.map((p, j) => (
              <PillTag key={j} pill={p} />
            ))}
          </div>
        ) : (
          <PillTag key={i} pill={item} />
        )
      )}
    </div>
  );
}

function ProductsKey({ d }: { d: Division }) {
  return (
    <li className="ood-key-wrap">
      {/* two carved silver "dice" — each owns its own pills (products = Sunshine,
          services = Indigo), so the two sets never mix */}
      <div className="ood-dice">
        <div className="ood-diecell">
          <p className="ood-die-h">Digital<br />Products</p>
          <div className="ood-die has-img">
            <div className="ood-die-face">
              <PillList items={d.products} />
            </div>
          </div>
        </div>
        <div className="ood-diecell">
          <p className="ood-die-h">Studio<br />Services</p>
          <div className="ood-die has-img">
            <div className="ood-die-face">
              <PillList items={d.services} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

// ----- section --------------------------------------------------------------
export function OooDivisions() {
  const [lit, setLit] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setLit((s) => ({ ...s, [id]: !s[id] }));

  return (
    <section className="ood" aria-label="Ooo Divisions">
      <AuroraField className="ood-bg" />
      <div className="ood-scrim" aria-hidden="true" />
      <div className="ood-inner">
        <h2 className="ood-title">Ooo Divisions</h2>
        <div className="ood-stage">
          <div className="ood-pool" aria-hidden="true" />
          <div className="ood-floor" aria-hidden="true" />
          <div className="ood-grid">
            {DIVISIONS.map((d) => (
              <div key={d.mod} className={`ood-col ood-col--${d.mod}`}>
                <div className="ood-head">
                  <h3 className="ood-name">{d.name}</h3>
                  <p className="ood-kind">{d.kind}</p>
                </div>
                <ul className="ood-keys">
                  {d.keys.map((k, i) => {
                    const id = `${d.mod}-${i}`;
                    const on = !!lit[id];
                    return (
                      <li className="ood-key-wrap" key={id} style={{ filter: `drop-shadow(${k.shadow})` }}>
                        <button
                          type="button"
                          className={`ood-key${on ? " is-on" : ""}`}
                          aria-pressed={on}
                          onClick={() => toggle(id)}
                          style={{ background: k.bg }}
                        >
                          <span className="ood-label">{k.text}</span>
                        </button>
                      </li>
                    );
                  })}
                  <ProductsKey d={d} />
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OooDivisions;
