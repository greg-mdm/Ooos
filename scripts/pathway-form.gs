/**
 * Ooo! pathway form: receives the "Open the pathway with a conversation"
 * enquiries from ooos.ca (src/app/components/PathwayModal.tsx), adds each
 * one as a row in this Google Sheet and emails it to greg@ooos.ca
 * (Greg, 2026-10-24).
 *
 * Setup, once:
 * 1. Make a new Google Sheet (for example "Ooo! Studio enquiries").
 * 2. Extensions > Apps Script. Replace the editor's contents with this file
 *    and save.
 * 3. Deploy > New deployment > type "Web app". Execute as: Me. Who has
 *    access: Anyone. Deploy, and allow the permissions it asks for (it
 *    writes to this Sheet and sends email as you).
 * 4. Copy the web app URL (it ends in /exec) and send it to Claude; it goes
 *    into PATHWAY_ENDPOINT in PathwayModal.tsx.
 *
 * After editing this script later, use Deploy > Manage deployments > Edit
 * > New version, so the same /exec URL keeps working.
 */

const NOTIFY = "greg@ooos.ca";
const SHEET_NAME = "Enquiries";
const HEADERS = ["Received", "Name", "Email", "Exploring", "Stage", "Timeline", "Budget", "Page"];
const MAX = 5000; // characters kept per field

function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return reply({ ok: false, error: "bad request" });
  }
  // the hidden field people never see; bots that fill it are dropped quietly
  if (data.website) return reply({ ok: true });

  const clip = (v) => String(v == null ? "" : v).trim().slice(0, MAX);
  const row = {
    name: clip(data.name),
    email: clip(data.email),
    exploring: clip(data.exploring),
    stage: clip(data.stage),
    timeline: clip(data.timeline),
    budget: clip(data.budget),
    page: clip(data.page),
  };
  if (!row.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) || !row.exploring) {
    return reply({ ok: false, error: "missing fields" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // a leading apostrophe keeps a typed "=" or "+" as text, never a formula
    const safe = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);
    sheet.appendRow([new Date(), row.name, row.email, row.exploring, row.stage, row.timeline, row.budget, row.page].map((v) => (typeof v === "string" ? safe(v) : v)));
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY,
    replyTo: row.email,
    subject: "Studio enquiry: " + row.name,
    body: [
      "A new enquiry came in through ooos.ca.",
      "",
      "Name: " + row.name,
      "Email: " + row.email,
      "Where they are: " + (row.stage || "(not given)"),
      "Timeline: " + (row.timeline || "(not given)"),
      "Budget: " + (row.budget || "(not given)"),
      "",
      "What they are exploring:",
      row.exploring,
      "",
      "Sent from: " + (row.page || "ooos.ca"),
      "Every enquiry is also in the Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    ].join("\n"),
  });

  return reply({ ok: true });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
