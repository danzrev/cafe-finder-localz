import type { OpeningHours } from '@cafefinder/shared';

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

/** Convert a "HH:mm" 24h string to 12-hour display, e.g. "5:00 PM". */
function to12h(time: string): string {
  const [rawH, rawM] = time.split(':').map(Number);
  const hour = rawH % 12 === 0 ? 12 : rawH % 12;
  const suffix = rawH >= 12 ? 'PM' : 'AM';
  return `${hour}:${String(rawM).padStart(2, '0')} ${suffix}`;
}

export interface DayRow {
  key: string;
  label: string;
  value: string | null;
}

/** Flatten openingHours into ordered rows for display. */
export function openingHoursRows(hours: OpeningHours | null | undefined): DayRow[] {
  if (!hours) return [];
  return DAY_ORDER.map((day) => {
    const slot = hours[day];
    return {
      key: day,
      label: DAY_LABELS[day],
      value: slot ? `${to12h(slot.open)} – ${to12h(slot.close)}` : null,
    };
  });
}

/** Nice display for a single time range. */
export function formatRange(open: string, close: string): string {
  return `${to12h(open)} – ${to12h(close)}`;
}