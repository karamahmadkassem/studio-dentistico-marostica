import React from 'react';
import { SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '../config/serviceIcons';
import { PUBLIC_ICON_WEIGHT } from './ui/Icon';

interface ServiceIconProps {
  iconKey: string;
  size?: number;
  className?: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({
  iconKey,
  size = 28,
  className = 'icon-duotone-brand text-brand-cyan',
}) => {
  const Icon = SERVICE_ICON_MAP[iconKey] ?? SERVICE_ICON_MAP[DEFAULT_SERVICE_ICON];
  return <Icon size={size} weight={PUBLIC_ICON_WEIGHT} className={className} />;
};

export default ServiceIcon;
