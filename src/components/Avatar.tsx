import { avatarGradient, initials } from "../data/sampleData";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  gradient?: string;
}

export function Avatar({ name, size = "md", gradient }: AvatarProps) {
  return (
    <div
      className={`avatar avatar-${size}`}
      style={{ background: gradient ?? avatarGradient(name) }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
