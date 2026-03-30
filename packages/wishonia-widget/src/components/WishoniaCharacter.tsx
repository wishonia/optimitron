import type { Expression } from "../types";
import { useWishoniaAnimator } from "../hooks/useWishoniaAnimator";
import {
  getCharacterHeadSpriteNames,
  getSpriteUrl,
} from "../core/sprite-loader";

export interface WishoniaCharacterProps {
  /** Width in pixels (default 140) */
  size?: number;
  /** AnalyserNode for audio-driven lip-sync */
  analyserNode?: AnalyserNode | null;
  /** Facial expression */
  expression?: Expression;
  /** Body pose (default "idle") */
  bodyPose?: string;
  /** Base path for sprite assets (must end with /) */
  spritePath?: string;
  /** Sprite file format */
  spriteFormat?: "webp" | "png";
  /** Additional className for the container */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export function WishoniaCharacter({
  size = 140,
  analyserNode,
  expression,
  bodyPose,
  spritePath = "/sprites/wishonia/",
  spriteFormat = "png",
  className,
  onClick,
}: WishoniaCharacterProps) {
  const {
    headName,
    bodySrc,
  } = useWishoniaAnimator({
    analyserNode,
    expression,
    bodyPose,
    spritePath,
    spriteFormat,
  });
  const activeExpression = expression ?? "neutral";
  const headNames = getCharacterHeadSpriteNames(activeExpression);
  const visibleHeadNames = headNames.includes(headName)
    ? headNames
    : [headName, ...headNames];
  const anchorHeadSrc = getSpriteUrl(
    visibleHeadNames[0] ?? headName,
    spritePath,
    spriteFormat,
  );

  const bodyHeight = Math.round(size * 0.57); // body is ~57% of total height

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size * 1.57,
        cursor: onClick ? "pointer" : undefined,
        transform: "scaleX(-1)",
      }}
      onClick={onClick}
    >
      {/* Head — bobs gently */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "95%",
          margin: "0 auto",
          animation: "wishonia-bob 7s ease-in-out alternate infinite",
        }}
      >
        <img
          src={anchorHeadSrc}
          alt=""
          style={{
            display: "block",
            width: "100%",
            visibility: "hidden",
            pointerEvents: "none",
          }}
          draggable={false}
        />
        {visibleHeadNames.map((name) => {
          const src = getSpriteUrl(name, spritePath, spriteFormat);
          return (
            <img
              key={name}
              src={src}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                display: "block",
                width: "100%",
                opacity: name === headName ? 1 : 0,
                pointerEvents: "none",
              }}
              draggable={false}
            />
          );
        })}
      </div>

      {/* Body — static below head */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: -12,
          maxHeight: bodyHeight,
          overflow: "hidden",
        }}
      >
        <img
          src={bodySrc}
          alt=""
          style={{ display: "block", width: "100%" }}
          draggable={false}
        />
      </div>
    </div>
  );
}
