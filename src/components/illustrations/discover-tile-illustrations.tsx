import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { DiscoverTileId } from "@/data/curated-media";

type IllustrationProps = {
  className?: string;
};

/* Brand palette */
const C = {
  ocean: "#1a6570",
  oceanDark: "#134952",
  oceanLight: "#e4f0f2",
  accent: "#c7674e",
  sand: "#faf6ef",
  ink: "#2a2418",
  muted: "#73695c",
  skin: "#f0c9a8",
  skinShadow: "#ddb896",
  vest: "#2d6a4f",
  vestPocket: "#1b4332",
  hat: "#c7674e",
  hatBrim: "#a85540",
  rod: "#3d3428",
  reel: "#1a6570",
  box: "#134952",
  boxLid: "#1a6570",
  foam: "#faf6ef",
  boot: "#2a2418",
} as const;

/** Bucket hat with neck flap — classic MY angler look */
function BucketHat({ cx, cy, flip }: { cx: number; cy: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s} 1)`}>
      <ellipse cx="0" cy="2" rx="17" ry="5" fill={C.hatBrim} />
      <path d="M-14 2 Q0 -10 14 2 L12 8 Q0 4 -12 8 Z" fill={C.hat} />
      <path d="M-10 8 Q0 14 10 8 L8 16 Q0 20 -8 16 Z" fill={C.hatBrim} opacity="0.85" />
    </g>
  );
}

/** Multi-pocket fishing vest */
function FishingVest({ x, y, w, h, color = C.vest }: { x: number; y: number; w: number; h: number; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={color} />
      <rect x={x + 3} y={y + 6} width={w * 0.38} height={h * 0.35} rx="2" fill={C.vestPocket} />
      <rect x={x + w * 0.55} y={y + 6} width={w * 0.38} height={h * 0.35} rx="2" fill={C.vestPocket} />
      <rect x={x + 3} y={y + h * 0.48} width={w * 0.38} height={h * 0.35} rx="2" fill={C.vestPocket} />
      <rect x={x + w * 0.55} y={y + h * 0.48} width={w * 0.38} height={h * 0.35} rx="2" fill={C.vestPocket} />
      <line x1={x + w / 2} y1={y + 2} x2={x + w / 2} y2={y + h - 2} stroke={C.foam} strokeWidth="1" opacity="0.4" />
    </g>
  );
}

/** Tackle / cooler box (鱼箱) */
function TackleBox({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="0" y="8" width="34" height="22" rx="4" fill={C.box} />
      <rect x="2" y="4" width="30" height="8" rx="3" fill={C.boxLid} />
      <rect x="6" y="6" width="22" height="3" rx="1" fill={C.accent} opacity="0.7" />
      <rect x="4" y="14" width="10" height="8" rx="1.5" fill={C.oceanLight} opacity="0.35" />
      <rect x="16" y="14" width="14" height="8" rx="1.5" fill={C.oceanLight} opacity="0.25" />
      <circle cx="17" cy="0" r="3" fill={C.muted} />
    </g>
  );
}

/** Fishing rod with reel */
function FishingRod({
  x1,
  y1,
  x2,
  y2,
  reelAt = 0.55,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  reelAt?: number;
}) {
  const rx = x1 + (x2 - x1) * reelAt;
  const ry = y1 + (y2 - y1) * reelAt;
  return (
    <g>
      <path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 8} ${x2} ${y2}`} stroke={C.rod} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx={rx} cy={ry} r="5.5" fill={C.reel} />
      <circle cx={rx} cy={ry} r="2.5" fill={C.oceanLight} />
      <path d={`M${x2} ${y2} L${x2 + 4} ${y2 - 6}`} stroke={C.muted} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

/** Rubber boot */
function RubberBoot({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <path
      d="M0 0 L6 0 L8 14 L-2 14 Z"
      fill={C.boot}
      transform={`translate(${x} ${y}) scale(${s} 1)`}
    />
  );
}

/** Angler body — head, hat, vest, arms, boots */
function AnglerFigure({
  cx,
  cy,
  hatFlip,
  vestColor,
  holdingRod,
}: {
  cx: number;
  cy: number;
  hatFlip?: boolean;
  vestColor?: string;
  holdingRod?: "left" | "right" | "none";
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy="52" rx="14" ry="4" fill={C.oceanDark} opacity="0.12" />
      <RubberBoot x={-10} y={38} />
      <RubberBoot x={4} y={38} flip />
      <rect x="-9" y="22" width="18" height="18" rx="5" fill={C.muted} opacity="0.5" />
      <FishingVest x={-11} y={8} w={22} h={26} color={vestColor} />
      <circle cx="0" cy="0" r="11" fill={C.skin} />
      <ellipse cx="0" cy="-2" rx="11" ry="5" fill={C.skinShadow} opacity="0.25" />
      <BucketHat cx={0} cy={-6} flip={hatFlip} />
      {holdingRod === "right" && (
        <FishingRod x1={8} y1={14} x2={28} y2={-18} reelAt={0.45} />
      )}
      {holdingRod === "left" && (
        <FishingRod x1={-8} y1={14} x2={-28} y2={-18} reelAt={0.45} />
      )}
      {/* Arms */}
      {holdingRod === "right" && (
        <>
          <path d="M8 14 Q16 10 14 4" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M-8 14 Q-14 18 -12 24" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {holdingRod === "left" && (
        <>
          <path d="M-8 14 Q-16 10 -14 4" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M8 14 Q14 18 12 24" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {holdingRod === "none" && (
        <>
          <path d="M-8 14 Q-14 8 -10 2" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M8 14 Q14 8 10 2" stroke={C.skin} strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  );
}

/** Two anglers chatting — forum */
export function ForumDiscoverIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <path d="M0 120 Q100 108 200 120 V160 H0 Z" fill={C.ocean} opacity="0.08" />
      <TackleBox x={78} y={108} scale={0.85} />
      <AnglerFigure cx={52} cy={72} hatFlip vestColor={C.ocean} holdingRod="right" />
      <AnglerFigure cx={148} cy={74} hatFlip={false} vestColor={C.vest} holdingRod="left" />
      {/* Leaning rods behind */}
      <FishingRod x1={24} y1={118} x2={18} y2={42} reelAt={0.6} />
      <FishingRod x1={176} y1={118} x2={182} y2={44} reelAt={0.6} />
      {/* Speech — fish talk */}
      <rect x="72" y="22" width="56" height="30" rx="12" fill="white" />
      <path d="M88 52 L82 60 L98 52 Z" fill="white" />
      <path d="M82 36 Q88 32 94 36" stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="88" cy="38" rx="6" ry="3" fill={C.ocean} opacity="0.5" />
      <path d="M94 38 L98 36" stroke={C.ocean} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="108" y="82" width="42" height="24" rx="10" fill={C.accent} />
      <path d="M118 82 L124 74 L128 82 Z" fill={C.accent} />
      <text x="115" y="98" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">
        Siakap?
      </text>
    </svg>
  );
}

/** Angler with map — map */
export function MapDiscoverIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <circle cx="160" cy="36" r="20" fill={C.accent} opacity="0.15" />
      {/* Folded map with jetty pin */}
      <rect x="58" y="28" width="84" height="64" rx="6" fill={C.sand} stroke={C.ocean} strokeWidth="2" />
      <path d="M66 76 Q86 58 102 66 T134 54 L138 80 L66 80 Z" fill={C.ocean} opacity="0.22" />
      <path d="M74 44 H126 M74 56 H114" stroke={C.oceanLight} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="108" cy="62" r="9" fill={C.ocean} opacity="0.15" />
      <circle cx="108" cy="62" r="4" fill={C.accent} />
      <path d="M108 58 L108 66 M104 62 L112 62" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Mini fish icon on map */}
      <path d="M78 48 Q84 44 90 48 Q84 52 78 48 Z" fill={C.accent} opacity="0.7" />
      <TackleBox x={28} y={108} scale={0.75} />
      <AnglerFigure cx={88} cy={108} vestColor={C.ocean} holdingRod="none" />
      {/* Rod over shoulder */}
      <FishingRod x1={100} y1={96} x2={36} y2={28} reelAt={0.35} />
      {/* Hands on map */}
      <circle cx="72" cy="98" r="4.5" fill={C.skin} />
      <circle cx="128" cy={98} r="4.5" fill={C.skin} />
    </svg>
  );
}

/** Tackle shop — shop */
export function ShopDiscoverIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      {/* Shop front */}
      <path d="M28 52 H172 L162 72 H38 Z" fill={C.accent} />
      <path d="M38 72 H162 V88 H38 Z" fill={C.ocean} />
      <text x="52" y="84" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui,sans-serif" opacity="0.9">
        TACKLE
      </text>
      <rect x="38" y="88" width="124" height="6" rx="2" fill={C.muted} opacity="0.3" />
      {/* Rod rack */}
      <rect x="44" y="48" width="4" height="52" rx="1" fill={C.rod} />
      <rect x="56" y="44" width="4" height="56" rx="1" fill={C.rod} />
      <rect x="68" y="50" width="4" height="50" rx="1" fill={C.rod} />
      <circle cx="46" cy="46" r="3" fill={C.accent} />
      <circle cx="58" cy="42" r="3" fill={C.oceanLight} />
      <circle cx="70" cy="48" r="3" fill={C.accent} />
      {/* Reels on shelf */}
      <circle cx="90" cy="78" r="6" fill={C.reel} />
      <circle cx="90" cy="78" r="2.5" fill={C.oceanLight} />
      <circle cx="106" cy="80" r="5" fill={C.reel} />
      <circle cx="106" cy="80" r="2" fill={C.oceanLight} />
      {/* Tackle boxes row */}
      <TackleBox x={48} y={98} scale={0.7} />
      <TackleBox x={82} y={100} scale={0.65} />
      <TackleBox x={114} y={98} scale={0.7} />
      {/* Lures hanging */}
      <ellipse cx="134" cy="68" rx="7" ry="4" fill={C.accent} />
      <path d="M134 72 L134 78" stroke={C.muted} strokeWidth="1" />
      <ellipse cx="148" cy="72" rx="5" ry="3" fill={C.ocean} />
      {/* Vest & hat on display */}
      <FishingVest x={138} y={94} w={18} h={22} color={C.vest} />
      <BucketHat cx={147} cy={88} />
      {/* Shopkeeper angler */}
      <circle cx="168" cy="108" r="9" fill={C.skin} />
      <BucketHat cx={168} cy={100} flip />
      <FishingVest x={158} y={114} w={20} h={22} color={C.ocean} />
    </svg>
  );
}

/** Fishing guide — guide */
export function GuideDiscoverIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      {/* Open guide book */}
      <path
        d="M38 40 C38 40 62 32 100 40 C138 32 162 40 162 40 V108 C138 100 100 108 100 108 C100 108 62 100 38 108 Z"
        fill={C.sand}
        stroke={C.ocean}
        strokeWidth="2"
      />
      <line x1="100" y1="40" x2="100" y2="108" stroke={C.ocean} strokeWidth="1.5" />
      {/* Fish species chart */}
      <path d="M52 58 Q68 48 84 58 Q68 68 52 58 Z" fill={C.ocean} opacity="0.55" />
      <circle cx="80" cy="56" r="2" fill={C.ink} />
      <path d="M48 62 L44 58" stroke={C.ocean} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M56 72 Q64 68 72 72" stroke={C.muted} strokeWidth="1.5" fill="none" />
      <path d="M56 80 Q64 76 68 80" stroke={C.muted} strokeWidth="1.5" fill="none" />
      {/* Rod diagram on right page */}
      <path d="M112 52 L140 52" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M112 64 L136 64" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M112 74 L132 74" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M112 84 L128 84" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="144" cy="52" r="5" fill={C.reel} />
      {/* Angler reading — full gear */}
      <AnglerFigure cx={100} cy={118} vestColor={C.vest} holdingRod="none" />
      <FishingRod x1={68} y1={130} x2={44} y2={72} reelAt={0.5} />
      <TackleBox x={132} y={118} scale={0.6} />
      {/* Compass badge */}
      <circle cx="156" cy="44" r="12" fill={C.accent} />
      <path d="M156 36 L160 48 L156 44 L152 48 Z" fill="white" />
    </svg>
  );
}

export const DISCOVER_ILLUSTRATIONS: Record<
  DiscoverTileId,
  ComponentType<IllustrationProps>
> = {
  forum: ForumDiscoverIllustration,
  map: MapDiscoverIllustration,
  shop: ShopDiscoverIllustration,
  guide: GuideDiscoverIllustration,
};
