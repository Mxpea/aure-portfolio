export const SECTIONS = ["hero", "works", "about", "contact", "links"] as const;

export type SectionId = (typeof SECTIONS)[number];

export const NAV_LINKS = [
  { name: "Works", href: "#works" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
  { name: "Links", href: "#links" },
] as const;
