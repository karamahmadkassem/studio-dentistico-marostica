import {
  Smiley,
  Pulse,
  Heart,
  Stack,
  Leaf,
  Baby,
  Scissors,
  Sparkle,
  Shield,
  TextAlignCenter,
  Moon,
  ClipboardText,
  Drop,
  Heartbeat,
  Bone,
  Diamond,
  Bed,
  type Icon,
} from '@phosphor-icons/react';

export const SERVICE_ICONS: { key: string; label: string; Icon: Icon }[] = [
  { key: 'clipboard-check', label: 'Odontoiatria generale', Icon: ClipboardText },
  { key: 'droplets', label: 'Igiene dentale', Icon: Drop },
  { key: 'heart-pulse', label: 'Cura gengive', Icon: Heartbeat },
  { key: 'activity', label: 'Endodonzia', Icon: Pulse },
  { key: 'bone', label: 'Implantologia', Icon: Bone },
  { key: 'layers', label: 'Protesi', Icon: Stack },
  { key: 'gem', label: 'Estetica dentale', Icon: Diamond },
  { key: 'scissors', label: 'Chirurgia orale', Icon: Scissors },
  { key: 'bed-double', label: 'Russamento / apnee', Icon: Bed },
  { key: 'smile', label: 'Sorriso / conservativa', Icon: Smiley },
  { key: 'sparkles', label: 'Sbiancamento', Icon: Sparkle },
  { key: 'heart', label: 'Estetica (legacy)', Icon: Heart },
  { key: 'leaf', label: 'Igiene orale (legacy)', Icon: Leaf },
  { key: 'shield', label: 'Prevenzione', Icon: Shield },
  { key: 'baby', label: 'Pedodonzia', Icon: Baby },
  { key: 'align', label: 'Ortodonzia', Icon: TextAlignCenter },
  { key: 'moon', label: 'Sonno (legacy)', Icon: Moon },
];

export const SERVICE_ICON_MAP: Record<string, Icon> = Object.fromEntries(
  SERVICE_ICONS.map(({ key, Icon }) => [key, Icon]),
);

export const DEFAULT_SERVICE_ICON = 'clipboard-check';
