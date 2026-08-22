import {
  Smile,
  Activity,
  Heart,
  Layers,
  Leaf,
  Baby,
  Scissors,
  Sparkles,
  Shield,
  AlignCenter,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'smile', label: 'Conservativa', Icon: Smile },
  { key: 'sparkles', label: 'Sbiancamento', Icon: Sparkles },
  { key: 'activity', label: 'Implants / endodontics', Icon: Activity },
  { key: 'heart', label: 'Estetica', Icon: Heart },
  { key: 'layers', label: 'Protesi', Icon: Layers },
  { key: 'leaf', label: 'Igiene orale', Icon: Leaf },
  { key: 'shield', label: 'Prevenzione', Icon: Shield },
  { key: 'baby', label: 'Pedodonzia', Icon: Baby },
  { key: 'scissors', label: 'Chirurgia orale', Icon: Scissors },
  { key: 'align', label: 'Ortodonzia', Icon: AlignCenter },
];

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SERVICE_ICONS.map(({ key, Icon }) => [key, Icon]),
);

export const DEFAULT_SERVICE_ICON = 'smile';
