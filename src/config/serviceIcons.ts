import {
  Smile,
  Activity,
  Heart,
  Layers,
  Leaf,
  Baby,
  Scissors,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'smile', label: 'General dentistry', Icon: Smile },
  { key: 'activity', label: 'Implants / surgery', Icon: Activity },
  { key: 'heart', label: 'Aesthetics', Icon: Heart },
  { key: 'layers', label: 'Prosthetics', Icon: Layers },
  { key: 'leaf', label: 'Periodontics', Icon: Leaf },
  { key: 'baby', label: 'Pediatric', Icon: Baby },
  { key: 'scissors', label: 'Oral surgery', Icon: Scissors },
];

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SERVICE_ICONS.map(({ key, Icon }) => [key, Icon]),
);

export const DEFAULT_SERVICE_ICON = 'smile';
