import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Matches public/icon.svg — PNG for favicon, Apple touch, PWA. */
export default function Icon() {
  return new ImageResponse(
    (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#134e4a" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="96" fill="url(#bg)" />
        <g
          fill="none"
          stroke="#ffffff"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M128 256c32-72 96-112 168-112 56 0 104 24 136 64" />
          <path d="M384 208c-24 88-96 152-192 160-48 4-96-8-128-32" />
          <path d="M168 280l-40 48M200 248l-56 8" />
          <circle cx="312" cy="220" r="16" fill="#ffffff" stroke="none" />
        </g>
      </svg>
    ),
    { ...size },
  );
}
