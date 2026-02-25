"use client";

import { useJobBoardState } from "../context";

export function Background() {
  const { config, isDarkBg } = useJobBoardState();

  const getTextureStyle = () => {
    const dotColor = isDarkBg ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
    const lineColor = isDarkBg ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const scanLineColor = isDarkBg
      ? "rgba(255,255,255,0.04)"
      : "rgba(0,0,0,0.05)";

    switch (config.texture) {
      case "dotted":
        return {
          backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
        };
      case "technical":
        return {
          backgroundImage: `
            linear-gradient(to right, ${lineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        };
      case "crt":
        return {
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, ${scanLineColor} 2px, ${scanLineColor} 4px)`,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-colors duration-500"
      style={{
        backgroundColor: config.backgroundColor,
        ...getTextureStyle(),
      }}
    />
  );
}
