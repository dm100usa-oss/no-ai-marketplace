"use client";

import { useEffect } from "react";

/**
 * Site-wide soft protection for images, icons and logos.
 *
 * Blocks the easy ways to grab a file: right-click "save image", drag-to-
 * desktop, and the long-press "save" popup on mobile. This does not (and
 * cannot) stop screenshots — no website can. It only removes the casual
 * save paths so images are not lifted with a single click.
 *
 * Runs once on mount, cleans up on unmount. Only cancels the default menu
 * when the target is an image, so text selection and normal right-click on
 * the rest of the page keep working.
 */
export function ImageGuard() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && el.tagName === "IMG") e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && el.tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
