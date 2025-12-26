export const hexToRgba = (hex: string, alpha: number = 1): string => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    throw new Error("Invalid HEX color format");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (alpha < 0 || alpha > 1) {
    throw new Error("Alpha must be between 0 and 1");
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
