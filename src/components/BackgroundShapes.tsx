import React from "react";

export default function BackgroundShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="85" cy="15" r="35" fill="url(#bg-gradient)" />
        <circle cx="15" cy="85" r="25" fill="url(#bg-gradient)" />
      </svg>
    </div>
  );
}
