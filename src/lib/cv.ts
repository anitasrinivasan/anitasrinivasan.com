import fs from 'node:fs';
import path from 'node:path';

const cvDir = path.resolve('public/cv');

export interface CvInfo {
  /** URL-encoded public path, e.g. "/cv/Anita%20Srinivasan%20CV.pdf" */
  url: string;
  /** Original filename on disk */
  filename: string;
}

let cached: CvInfo | null | undefined;

// encodeURIComponent over-encodes (e.g. "," -> "%2C"), which the dev server's
// static middleware doesn't decode. Encode only what's structurally unsafe in
// a URL path: encodeURI handles spaces/%, then escape "#" and "?" manually.
function encodePathSegment(name: string): string {
  return encodeURI(name).replace(/#/g, '%23').replace(/\?/g, '%3F');
}

export function getCv(): CvInfo | null {
  if (cached !== undefined && import.meta.env.PROD) return cached;

  let entries: string[] = [];
  try {
    entries = fs.readdirSync(cvDir);
  } catch {
    // Folder missing entirely — treat as "no CV yet"
  }

  const pdfs = entries
    .filter((f) => !f.startsWith('.') && f.toLowerCase().endsWith('.pdf'))
    .sort();

  if (pdfs.length > 1) {
    console.warn(
      `[cv] Found ${pdfs.length} PDFs in public/cv/ (${pdfs.join(', ')}). ` +
        `Using "${pdfs[0]}". Keep exactly one PDF in that folder.`
    );
  }

  if (pdfs.length && /[#?%]/.test(pdfs[0])) {
    console.warn(
      `[cv] "${pdfs[0]}" contains "#", "?" or "%", which breaks the file's URL. ` +
        `Rename the PDF without those characters.`
    );
  }

  cached = pdfs.length
    ? { url: `/cv/${encodePathSegment(pdfs[0])}`, filename: pdfs[0] }
    : null;

  return cached;
}
