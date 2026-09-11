import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jompancing — Malaysia fishing community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 45%, #134e4a 100%)",
          color: "white",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🎣
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            Jompancing
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Discover fishing spots across Malaysia
          </div>
          <div style={{ fontSize: 28, opacity: 0.88, maxWidth: 820 }}>
            Share hot spots, join activities, connect with anglers — Johor to Sabah.
          </div>
        </div>

        <div style={{ fontSize: 22, opacity: 0.75 }}>jompancing.my</div>
      </div>
    ),
    { ...size },
  );
}
