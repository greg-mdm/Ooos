import { Link } from "react-router-dom";

/**
 * International Non-Profit Network — standalone section.
 *
 * Pulled out of the CID page (CID.tsx) so the page reads more cohesively and the
 * data tools lead. Parked here intact; NOT currently rendered anywhere.
 *
 * TODO before re-use:
 *  - Add the Irish Chamber.
 *  - Simplify the naming (consistent "CanCham <Place>" style).
 *  - Decide its new home (its own route/section).
 *
 * Styles live in src/styles/site.css under `.cid-nonprofit` / `.cid-np-*`.
 */
export function NonProfitNetwork() {
  return (
    <section className="cid-nonprofit">
      <h2 className="cid-np-heading">International Non-Profit Network</h2>
      <p className="cid-np-subhead">Canadian Commerce. Global Engagement.</p>
      <div className="cid-np-grid">
        {[
          [
            ["Canadian Australian", "Chamber of Commerce", "l1"],
            ["CanCham", "Shanghai", "l2"],
            ["Canada China", "Business Council", "l1"],
            ["CanCham", "Hong Kong", "l2"],
            ["CanCham", "Vietnam", "l2"],
            ["CanCham", "Singapore", "l2"],
          ],
          [
            ["CanCham", "Mexico", "l2"],
            ["Southern Africa", "Chamber of Commerce", "l1"],
            ["Canada-Africa", "Chamber of Business", "l1"],
            ["Canada Ghana", "Chamber of Commerce", "l1"],
            ["CanCham", "Egypt", "l2"],
            ["Swedish Canadian", "Chamber of Commerce", "l1"],
            ["Canadian Slovenian", "Chamber of Commerce", "l1"],
          ],
        ].map((row, i) => (
          <div className="cid-np-row" key={i}>
            {row.map(([line1, line2, emph]) => (
              <div className="cid-np-item" key={line1 + line2}>
                <div className="cid-np-circle">
                  <span className={emph === "l1" ? "np-big" : "np-small"}>{line1}</span>
                  <span className={emph === "l2" ? "np-big" : "np-small"}>{line2}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="cid-np-foot">
        <span className="cid-np-brand">Radical Strategic Intelligence</span>
        <span className="cid-np-tag">Embrace the struggle</span>
        <span className="cid-np-tag">Drive joy</span>
        <Link className="cid-np-link" to="/exhibition">Explore the full network &rarr;</Link>
      </div>
    </section>
  );
}

export default NonProfitNetwork;
