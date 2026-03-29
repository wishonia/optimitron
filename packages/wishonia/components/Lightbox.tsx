/**
 * Fullscreen image lightbox overlay.
 */

"use client";

import { useEffect } from "react";

export function Lightbox(
  { src, alt, onClose }: { src: string; alt?: string; onClose: () => void }
): React.JSX.Element {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Expanded image"}
      style={{
        position: "fixed", inset: 0, zIndex: 10001,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(15,15,20,0.9)",
          color: "#fff",
          fontSize: 24,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <div
        onClick={(event) => event.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          style={{
            maxWidth: "90vw", maxHeight: "90vh",
            borderRadius: 8,
            filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))",
          }}
        />
        {alt && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {alt}
          </div>
        )}
      </div>
    </div>
  );
}
