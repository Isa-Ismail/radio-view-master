import React from "react";

interface Props {}

const Dot = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="9"
        stroke="#8E8E93"
        stroke-width="2"
      />
      <rect x="7" y="7" width="10" height="10" rx="5" fill="#8E8E93" />
    </svg>
  );
};

export default Dot;
