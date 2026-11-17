// Opening hours and the "open now" status. Pure functions with no imports, so they are unit tested
// directly and the browser only supplies the current instant and the taverna's IANA time zone.
//
// The model is deliberately simple: at most one same-day interval per day ("17:00"–"22:00").
// Overnight ranges (closing after midnight) and split days (lunch and dinner) are rejected by
// `validateHours` rather than interpreted wrongly. To support them, extend the `OpeningHours` type,
// `openState`, the structured data in lib/structured-data.ts and the tests together.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

/** Every day of the week, Monday first. Hours are listed in this order. */
export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface OpeningHours {
  /** The weekday these hours apply to. Each day appears exactly once, Monday first. */
  day: Day;
  /** 24-hour "HH:MM" local time when the doors open, e.g. "17:00". Omit both times for a closed day. */
  opens?: string;
  /** 24-hour "HH:MM" local time when the taverna closes, later than `opens` on the same day. */
  closes?: string;
}

/** Shown before the browser knows the time, without JavaScript, and when no valid zone is set. */
export const NEUTRAL_STATUS = 'See opening hours.';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "07:30" → "7:30am", "17:00" → "5pm", "12:00" → "12pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** True when the entry has both times (an open day). */
export function isOpenDay(entry: OpeningHours): entry is OpeningHours & { opens: string; closes: string } {
  return Boolean(entry.opens && entry.closes);
}

/** "5pm – 10pm" or "Closed". */
export function formatHours(entry: OpeningHours): string {
  return isOpenDay(entry) ? `${formatTime(entry.opens)} – ${formatTime(entry.closes)}` : 'Closed';
}

/** Consecutive days with the same hours, e.g. [{ label: 'Tue – Thu', hours: '5pm – 10pm' }]. */
export function groupedHours(hours: readonly OpeningHours[]): { label: string; hours: string }[] {
  const groups: { days: Day[]; hours: string }[] = [];
  for (const entry of hours) {
    const text = formatHours(entry);
    const last = groups.at(-1);
    if (last && last.hours === text) last.days.push(entry.day);
    else groups.push({ days: [entry.day], hours: text });
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    hours: group.hours,
  }));
}

/**
 * Problems with a week of hours, each naming the day to fix. Empty when valid:
 * every weekday once, in order; both times or neither; strict "00:00"–"23:59"; closing after opening.
 */
export function validateHours(hours: readonly OpeningHours[]): string[] {
  const problems: string[] = [];
  if (hours.length !== 7) problems.push(`Expected 7 days of hours, Monday to Sunday, but found ${hours.length}.`);
  hours.forEach((entry, index) => {
    const expected = DAYS[index];
    if (entry.day !== expected) problems.push(`Hours entry ${index + 1} should be ${expected ?? 'removed'}, not ${entry.day}.`);
    const { opens, closes } = entry;
    if (Boolean(opens) !== Boolean(closes)) {
      problems.push(`${entry.day}: give both opens and closes, or neither for a closed day.`);
      return;
    }
    if (!opens || !closes) return;
    for (const [field, value] of [['opens', opens], ['closes', closes]] as const) {
      if (!TIME.test(value)) problems.push(`${entry.day}: ${field} "${value}" must be 24-hour "HH:MM" between 00:00 and 23:59.`);
    }
    if (TIME.test(opens) && TIME.test(closes) && toMinutes(closes) <= toMinutes(opens)) {
      problems.push(`${entry.day}: closes (${closes}) must be later than opens (${opens}) on the same day; overnight hours are not supported.`);
    }
  });
  return problems;
}

export type OpenState =
  | { open: true; closes: string }
  | { open: false; next?: { day: Day; opens: string; daysAhead: number } };

/**
 * Whether the taverna is open at a local weekday and minute. Open from the opening minute,
 * closed from the closing minute. When closed, `next` is the next opening within a week.
 */
export function openState(day: Day, minutes: number, hours: readonly OpeningHours[]): OpenState {
  const today = hours.find(entry => entry.day === day);
  if (today && isOpenDay(today) && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return { open: true, closes: today.closes };
  }
  const start = DAYS.indexOf(day);
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    const entry = hours.find(item => item.day === candidate);
    if (!entry || !isOpenDay(entry)) continue;
    if (daysAhead === 0 && minutes >= toMinutes(entry.opens)) continue;
    return { open: false, next: { day: candidate, opens: entry.opens, daysAhead } };
  }
  return { open: false };
}

/** "Open now · until 10pm", "Closed · opens today at 5pm", "Closed · opens Tuesday at 5pm". */
export function describeState(state: OpenState): string {
  if (state.open) return `Open now · until ${formatTime(state.closes)}`;
  if (!state.next) return 'Closed · see opening hours';
  const when = state.next.daysAhead === 0 ? 'today' : state.next.daysAhead === 1 ? 'tomorrow' : state.next.day;
  return `Closed · opens ${when} at ${formatTime(state.next.opens)}`;
}

/**
 * Local weekday and minutes after midnight at `date` in an IANA time zone, or null when the zone is
 * missing or not recognised. Daylight-saving changes are handled by Intl.
 */
export function zonedNow(timeZone: string, date: Date): { day: Day; minutes: number } | null {
  if (!timeZone) return null;
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(date);
  } catch {
    return null;
  }
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  const hour = Number(part('hour'));
  const minute = Number(part('minute'));
  if (!DAYS.includes(day) || !Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  return { day, minutes: hour * 60 + minute };
}

/**
 * The status line for an instant: open/closed text and whether it is open, or the neutral label
 * (`open: undefined`) when the zone is missing or invalid. Never called at build time.
 */
export function statusAt(date: Date, timeZone: string, hours: readonly OpeningHours[]): { text: string; open?: boolean } {
  const now = zonedNow(timeZone, date);
  if (!now) return { text: NEUTRAL_STATUS };
  const state = openState(now.day, now.minutes, hours);
  return { text: describeState(state), open: state.open };
}
