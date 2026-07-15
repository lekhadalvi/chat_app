import Image from "next/image";
import { cn } from "@/lib/cn";
import type { AvatarTone } from "@/types";

const TONE_CLASS: Record<AvatarTone, string> = {
  pink: "bg-brand-pink",
  yellow: "bg-brand-yellow",
  mint: "bg-[#7ef0c4]",
  sky: "bg-[#7ec8f0]",
  lilac: "bg-[#c9a7ff]",
  ink: "bg-ink text-white",
};

const SIZE_CLASS = {
  sm: "size-10 text-lg",
  md: "size-12 text-xl",
  lg: "size-14 text-2xl",
} as const;

export interface AvatarProps {
  emoji: string;
  tone?: AvatarTone;
  imageUrl?: string;
  alt?: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export function Avatar({
  emoji,
  tone = "pink",
  imageUrl,
  alt = "",
  size = "md",
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full ink-border ink-shadow-sm select-none",
        TONE_CLASS[tone],
        SIZE_CLASS[size],
        className
      )}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} fill sizes="56px" className="object-cover" />
      ) : (
        <span aria-hidden="true">{emoji}</span>
      )}
    </span>
  );
}
