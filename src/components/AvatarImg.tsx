import { useState, type CSSProperties } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
};

/** Avatar `<img>` with a gradient fallback if the URL fails (network, block, expiry). */
export function AvatarImg({ src, alt = "", className = "", style }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className={`inline-block rounded-full bg-gradient-to-br from-amber-400 to-rose-500 object-cover ${className}`}
        style={style}
        aria-hidden
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
