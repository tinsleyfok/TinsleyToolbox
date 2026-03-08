import type { LazyExoticComponent, ComponentType } from "react";

export interface Inspiration {
  id: string;
  title: string;
  description: string;
  source: string;
  group: string;
  media?: string;
  component?: LazyExoticComponent<ComponentType>;
}
