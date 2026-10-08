/* The CID division card: the CID emblem at rest, and nothing else.

   The emblem is Greg's "CID Seal - Emblem Display" (SPRINT 6, 2026-10-07),
   the seal on display in its dark teal hall, cut square around the seal
   for the card (brand/cid-emblem-800.webp). It is the new CID logo and
   replaces every earlier version (Greg, 2026-10-08).

   Retired from this card the same day: the corner buttons that swapped in
   the Canadian Quadrant seal (maple leaf) and the Marine Squadron seal
   (octopus), with Font Awesome brand marks. Their filtering had become
   unpredictable. The three tiles stay in public/assets/brand
   (cid-seal-640.webp, cid-seal-canada-640.webp, cid-seal-marine-640.webp)
   for market-specific details later, and the swap mechanics are in this
   file's history before this change. */

const BASE = import.meta.env.BASE_URL;
const EMBLEM = `${BASE}assets/brand/cid-emblem-800.webp`;

/* resetSignal is kept so the Spirit block under the card can go on
   signalling a return to rest; with one face there is nothing to reset */
export function CidSealCard({ resetSignal: _resetSignal = 0 }: { resetSignal?: number }) {
  return (
    <div className="ot-div__art ot-seal">
      <img
        className="ot-seal__face ot-seal__face--on"
        src={EMBLEM}
        alt=""
        width="800"
        height="800"
        loading="lazy"
      />
    </div>
  );
}
