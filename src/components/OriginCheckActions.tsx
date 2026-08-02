"use client";

import { useState } from "react";

/**
 * Save-or-print and copy-as-text for a trade guide.
 *
 * Printing goes through the browser rather than a generated PDF file, and
 * that is the deliberate choice. A PDF sitting at its own address is a
 * second copy of the same page: search engines index it, the two compete
 * for the same question, and the weaker one drags the stronger down. The
 * page stays the single address for this content; the printout is a
 * convenience for somebody already reading it.
 *
 * The copy button exists because most people will not print anything. They
 * will paste the questions into notes and take them into a call, which is
 * exactly the use this page was built for.
 */
export function OriginCheckActions({
  printLabel,
  copyLabel,
  copiedLabel,
  copyText,
}: {
  printLabel: string;
  copyLabel: string;
  copiedLabel: string;
  copyText: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be refused (permissions, insecure context). Say
      // nothing and leave the label alone: the page is still readable and
      // an error toast here would be noise, not help.
    }
  };

  return (
    <div className="no-print mt-5 flex flex-wrap gap-2">
      <button type="button" onClick={() => window.print()} className="btn btn-quiet btn-press">
        {printLabel}
      </button>
      <button type="button" onClick={onCopy} className="btn btn-quiet btn-press">
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
