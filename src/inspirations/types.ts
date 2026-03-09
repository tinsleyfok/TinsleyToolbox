import type { LazyExoticComponent, ComponentType } from "react";

export interface PaletteColors {
  label: string;
  value: string;
}

export interface PaletteMode {
  screenshot: string;
  colors: PaletteColors[];
}

export interface Inspiration {
  id: string;
  title: string;
  description: string;
  source: string;
  group: string;
  media?: string;
  image?: string;
  component?: LazyExoticComponent<ComponentType>;
  palette?: {
    light: PaletteMode;
    dark: PaletteMode;
  };
}
