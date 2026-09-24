import type { Icon, IconProps, IconWeight } from '@phosphor-icons/react';

export type { Icon, IconProps, IconWeight };

/** Default weight for public marketing UI */
export const PUBLIC_ICON_WEIGHT: IconWeight = 'duotone';

/** Default weight for admin / dense UI */
export const ADMIN_ICON_WEIGHT: IconWeight = 'regular';

export const publicIconProps = (overrides: IconProps = {}): IconProps => ({
  weight: PUBLIC_ICON_WEIGHT,
  ...overrides,
});

export const adminIconProps = (overrides: IconProps = {}): IconProps => ({
  weight: ADMIN_ICON_WEIGHT,
  ...overrides,
});
