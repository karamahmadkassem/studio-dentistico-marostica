import React from 'react';
import type { OpeningHoursRow } from '../lib/openingHoursDisplay';

interface OpeningHoursListProps {
  rows: OpeningHoursRow[];
  className?: string;
  labelClassName?: string;
  hoursClassName?: string;
}

const OpeningHoursList: React.FC<OpeningHoursListProps> = ({
  rows,
  className = '',
  labelClassName = 'text-ink-muted',
  hoursClassName = 'text-ink-muted',
}) => (
  <div className={`space-y-1 ${className}`}>
    {rows.map(({ label, hours }) => (
      <div key={label} className="grid grid-cols-[minmax(9rem,auto)_1fr] gap-x-[1.05rem]">
        <span className={labelClassName}>{label}</span>
        <span className={hoursClassName}>{hours}</span>
      </div>
    ))}
  </div>
);

export default OpeningHoursList;
