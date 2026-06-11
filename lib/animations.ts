// NeuraChat animation presets and shared Framer Motion utilities

// Spring animation presets
export const springs = {
  panel: { type: "spring", stiffness: 280, damping: 28, mass: 0.8 },
  popup: { type: "spring", stiffness: 380, damping: 30 },
  message: { type: "spring", stiffness: 200, damping: 25, mass: 0.6 },
  micro: { type: "spring", stiffness: 500, damping: 30 },
  wave: { type: "spring", stiffness: 120, damping: 18 },
} as const;

// Message entrance animation (staggered fadeUp + blur)
export const messageVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...springs.message, delay: Math.min(i * 0.06, 0.18) },
  }),
};

// Sidebar collapse/expand animation
export const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 0 },
};

// Command palette overlay animation
export const paletteVariants = {
  hidden: { opacity: 0, scale: 0.97, y: -16 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

// Model selector dropdown animation
export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

// Hover scale animation helper (for interactive cards/buttons)
export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: springs.micro },
  tap: { scale: 0.97, transition: springs.micro },
};

// Hover glow animation helper (accent glow on hover)
export const hoverGlow = {
  rest: { boxShadow: "0 0 0px rgba(124,106,255,0)" },
  hover: { boxShadow: "0 0 20px rgba(124,106,255,0.25)" },
};
