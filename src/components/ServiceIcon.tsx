import React from 'react';
import { SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '../config/serviceIcons';

interface ServiceIconProps {
  iconKey: string;
  size?: number;
  className?: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({
  iconKey,
  size = 28,
  className = 'text-brand-cyan',
}) => {
  const Icon = SERVICE_ICON_MAP[iconKey] ?? SERVICE_ICON_MAP[DEFAULT_SERVICE_ICON];
  return <Icon size={size} className={className} />;
};

export default ServiceIcon;
