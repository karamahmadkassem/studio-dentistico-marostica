import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchOpeningHoursPublic } from '../lib/api';
import { formatOpeningHoursLines, isDayClosedFromHours, normalizeOpeningHours } from '../lib/openingHoursDisplay';
import type { OpeningHour } from '../types/database';

export function useOpeningHours() {
  const { language, t } = useLanguage();
  const [hours, setHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    fetchOpeningHoursPublic()
      .then(setHours)
      .catch(() => setHours([]));
  }, []);

  const lang = language === 'it' ? 'it' : 'en';

  const lines = useMemo(() => {
    if (hours.length >= 7) {
      return formatOpeningHoursLines(normalizeOpeningHours(hours), lang);
    }
    return [
      String(t('contact.info.hoursWeek')),
      String(t('contact.info.hoursSat')),
      String(t('contact.info.hoursSun')),
    ];
  }, [hours, lang, t]);

  const isDayClosed = (date: Date) => isDayClosedFromHours(hours, date);

  return { hours, lines, isDayClosed };
}
