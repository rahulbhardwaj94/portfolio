"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  size = 16,
  ...rest
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

export const IconArrow: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const IconMail: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Icon>
);

export const IconGithub: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M9 19c-4 1-4-2-6-2" />
    <path d="M15 22v-3.6a3 3 0 0 0-.85-2.4c2.85-.32 5.85-1.4 5.85-6.3 0-1.25-.48-2.45-1.35-3.35.4-1.05.36-2.2-.1-3.25 0 0-1.1-.32-3.5 1.25a12 12 0 0 0-6.2 0C6.45 2.78 5.35 3.1 5.35 3.1c-.46 1.05-.5 2.2-.1 3.25A4.85 4.85 0 0 0 3.9 9.7c0 4.9 3 5.98 5.85 6.3a3 3 0 0 0-.85 2.4V22" />
  </Icon>
);

export const IconLinkedin: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M4 4h4v16H4zM6 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 8h4v2c.6-1.2 2.2-2.2 4-2.2 3 0 4 2 4 5V20h-4v-6c0-1.5-.5-2.6-2-2.6s-2 1.1-2 2.6V20h-4z" />
  </Icon>
);

export const IconX: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M4 4l16 16M20 4 4 20" />
  </Icon>
);

export const IconSound: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M4 9h4l5-4v14l-5-4H4zM17 8a5 5 0 0 1 0 8" />
  </Icon>
);

export const IconMute: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <path d="M4 9h4l5-4v14l-5-4H4zM22 9l-6 6M16 9l6 6" />
  </Icon>
);

export const IconLock: React.FC<IconProps> = (p) => (
  <Icon {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Icon>
);

export const StackGlyph: React.FC<{ name: string }> = ({ name }) => {
  const map: Record<string, React.ReactNode> = {
    NestJS: (
      <Icon size={18}>
        <path d="m12 3 8 4v10l-8 4-8-4V7zM12 7v10M4 7l8 4M20 7l-8 4" />
      </Icon>
    ),
    TypeScript: (
      <Icon size={18}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 11h6M12 11v7M16 15c.5 1.5 1.5 2 3 2s2-.6 2-1.5c0-2-5-1.5-5-3.5 0-1 1-1.5 2.2-1.5s2 .4 2.3 1.2" />
      </Icon>
    ),
    AWS: (
      <Icon size={18}>
        <path d="M3 12c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6" />
        <path d="m5 18 3-3M19 18l-3-3M9 15c2 1 4 1 6 0" />
      </Icon>
    ),
    Kubernetes: (
      <Icon size={18}>
        <path d="m12 3 9 5-2 9-7 4-7-4-2-9zM12 8v8M8 10l8 4M16 10l-8 4" />
      </Icon>
    ),
    Redis: (
      <Icon size={18}>
        <ellipse cx="12" cy="6" rx="9" ry="3" />
        <path d="M3 6v6c0 1.7 4 3 9 3s9-1.3 9-3V6M3 12v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />
      </Icon>
    ),
    MongoDB: (
      <Icon size={18}>
        <path d="M12 3c4 4 4 12 0 18M12 3c-4 4-4 12 0 18M12 3v18" />
      </Icon>
    ),
    MySQL: (
      <Icon size={18}>
        <ellipse cx="12" cy="7" rx="8" ry="3" />
        <path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M16 18l4 3M14 15v2" />
      </Icon>
    ),
    Node: (
      <Icon size={18}>
        <path d="m12 2 9 5.2v9.6L12 22l-9-5.2V7.2z" />
        <path d="M9 9v6c0 1 .5 1.5 1.5 1.5h3c1 0 1.5-.5 1.5-1.5V9" />
      </Icon>
    ),
  };
  return (
    (map[name] as React.ReactElement) || (
      <Icon size={18}>
        <circle cx="12" cy="12" r="8" />
      </Icon>
    )
  );
};
