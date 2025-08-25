import * as React from "react";
import type { SVGProps } from "react";

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.625 4.75 7.598 2.433a2 2 0 0 0-1.506-.683H3.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h2.5m3.375-9.5H1.75m7.875 0h3.625a1 1 0 0 1 1 1v.5m0 5.75H12m0 0H9.75M12 12V9.75M12 12v2.25" />
    </svg>
  );
};
