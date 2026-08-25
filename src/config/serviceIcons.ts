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
  Moon,
  ClipboardCheck,
  Droplets,
  HeartPulse,
  Bone,
  Gem,
  BedDouble,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICONS: { key: string; label: string; Icon: LucideIcon }[] = [
  { key: 'clipboard-check', label: 'Odontoiatria generale', Icon: ClipboardCheck },
  { key: 'droplets', label: 'Igiene dentale', Icon: Droplets },
  { key: 'heart-pulse', label: 'Cura gengive', Icon: HeartPulse },
  { key: 'activity', label: 'Endodonzia', Icon: Activity },
  { key: 'bone', label: 'Implantologia', Icon: Bone },
  { key: 'layers', label: 'Protesi', Icon: Layers },
  { key: 'gem', label: 'Estetica dentale', Icon: Gem },
  { key: 'scissors', label: 'Chirurgia orale', Icon: Scissors },
  { key: 'bed-double', label: 'Russamento / apnee', Icon: BedDouble },
  { key: 'smile', label: 'Sorriso / conservativa', Icon: Smile },
  { key: 'sparkles', label: 'Sbiancamento', Icon: Sparkles },
  { key: 'heart', label: 'Estetica (legacy)', Icon: Heart },
  { key: 'leaf', label: 'Igiene orale (legacy)', Icon: Leaf },
  { key: 'shield', label: 'Prevenzione', Icon: Shield },
  { key: 'baby', label: 'Pedodonzia', Icon: Baby },
  { key: 'align', label: 'Ortodonzia', Icon: AlignCenter },
  { key: 'moon', label: 'Sonno (legacy)', Icon: Moon },
];

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  SERVICE_ICONS.map(({ key, Icon }) => [key, Icon]),
);

export const DEFAULT_SERVICE_ICON = 'clipboard-check';

