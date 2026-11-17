// The "open now" status. Zoned tests pass fixed instants, so they never depend on the
// test runner's clock or time zone.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { taverna } from '../content/taverna.ts';
import {
  describeState, formatTime, groupedHours, NEUTRAL_STATUS, openState, statusAt, toMinutes, validateHours,
  zonedNow, type Day, type OpeningHours,
} from '../lib/opening-hours.ts';

const hours = taverna.hours;
const at = (day: Day, time: string) => describeState(openState(day, toMinutes(time), hours));
const NY = 'America/New_York';

test('times format for people', () => {
  assert.equal(formatTime('17:00'), '5pm');
  assert.equal(formatTime('12:00'), '12pm');
  assert.equal(formatTime('00:00'), '12am');
  assert.equal(formatTime('21:30'), '9:30pm');
});

test('the week is grouped for the hours table', () => {
  assert.deepEqual(groupedHours(hours), [
    { label: 'Monday', hours: 'Closed' },
    { label: 'Tue – Thu', hours: '5pm – 10pm' },
    { label: 'Friday', hours: '5pm – 11pm' },
    { label: 'Saturday', hours: '12pm – 11pm' },
    { label: 'Sunday', hours: '12pm – 9pm' },
  ]);
});

test('before opening, exact opening, last open minute and exact closing', () => {
  assert.equal(at('Tuesday', '16:59'), 'Closed · opens today at 5pm');
  assert.equal(at('Tuesday', '17:00'), 'Open now · until 10pm');
  assert.equal(at('Tuesday', '21:59'), 'Open now · until 10pm');
  assert.equal(at('Tuesday', '22:00'), 'Closed · opens tomorrow at 5pm');
  assert.equal(at('Friday', '22:30'), 'Open now · until 11pm');
  assert.equal(at('Saturday', '11:59'), 'Closed · opens today at 12pm');
});

test('Monday is closed, and the next opening rolls from Sunday over Monday to Tuesday', () => {
  assert.equal(at('Monday', '00:00'), 'Closed · opens tomorrow at 5pm');
  assert.equal(at('Monday', '19:00'), 'Closed · opens tomorrow at 5pm');
  assert.equal(at('Sunday', '21:00'), 'Closed · opens Tuesday at 5pm');
  const state = openState('Sunday', toMinutes('23:30'), hours);
  assert.deepEqual(state, { open: false, next: { day: 'Tuesday', opens: '17:00', daysAhead: 2 } });
});

test('next-day rollover within the week', () => {
  assert.equal(at('Thursday', '23:00'), 'Closed · opens tomorrow at 5pm');
  assert.equal(at('Saturday', '23:00'), 'Closed · opens tomorrow at 12pm');
});

test('an entirely closed week never claims a next opening', () => {
  const closed: OpeningHours[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ day: day as Day }));
  assert.deepEqual(validateHours(closed), []);
  assert.deepEqual(openState('Wednesday', 600, closed), { open: false });
  assert.equal(describeState(openState('Wednesday', 600, closed)), 'Closed · see opening hours');
});

test('a single open day a week later is found', () => {
  const once: OpeningHours[] = hours.map(entry => entry.day === 'Wednesday' ? entry : { day: entry.day });
  assert.equal(describeState(openState('Wednesday', toMinutes('22:00'), once)), 'Closed · opens Wednesday at 5pm');
});

test('invalid hours name the day to fix', () => {
  const broken: OpeningHours[] = hours.map(entry => ({ ...entry }));
  broken[1] = { day: 'Tuesday', opens: '17:00' };
  broken[4] = { day: 'Friday', opens: '18:00', closes: '01:00' };
  broken[5] = { day: 'Saturday', opens: '12:00', closes: '24:00' };
  const problems = validateHours(broken).join('\n');
  assert.match(problems, /Tuesday: give both opens and closes/);
  assert.match(problems, /Friday: closes \(01:00\) must be later than opens/);
  assert.match(problems, /Saturday: closes "24:00" must be 24-hour/);
  assert.match(validateHours([...hours].reverse()).join('\n'), /Hours entry 1 should be Monday, not Sunday/);
  assert.match(validateHours(hours.slice(0, 6)).join('\n'), /Expected 7 days/);
});

test('absent or invalid time zones show the neutral label', () => {
  const instant = new Date(Date.UTC(2026, 6, 15, 23, 0));
  assert.deepEqual(statusAt(instant, '', hours), { text: NEUTRAL_STATUS });
  assert.deepEqual(statusAt(instant, 'Mars/Olympus_Mons', hours), { text: NEUTRAL_STATUS });
  assert.equal(zonedNow('Not/AZone', instant), null);
  assert.equal(NEUTRAL_STATUS, 'See opening hours.');
});

test('the local time is read in the taverna’s zone, not the runner’s', () => {
  // 2026-07-15 23:00 UTC is Wednesday 19:00 in New York (EDT, UTC−4).
  assert.deepEqual(zonedNow(NY, new Date(Date.UTC(2026, 6, 15, 23, 0))), { day: 'Wednesday', minutes: 19 * 60 });
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 6, 15, 23, 0)), NY, hours), { text: 'Open now · until 10pm', open: true });
  // 2026-07-14 02:30 UTC is still Monday 22:30 in New York.
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 6, 14, 2, 30)), NY, hours), { text: 'Closed · opens tomorrow at 5pm', open: false });
});

test('daylight-saving transitions in America/New_York', () => {
  // Spring forward: Sunday 8 March 2026 at 2am EST becomes 3am EDT.
  // Saturday 7 March 22:00 UTC is 17:00 EST (UTC−5).
  assert.deepEqual(zonedNow(NY, new Date(Date.UTC(2026, 2, 7, 22, 0))), { day: 'Saturday', minutes: 17 * 60 });
  // Sunday 8 March 16:00 UTC is 12:00 EDT (UTC−4): exactly opening time.
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 2, 8, 16, 0)), NY, hours), { text: 'Open now · until 9pm', open: true });
  // One minute earlier is 11:59 EDT.
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 2, 8, 15, 59)), NY, hours), { text: 'Closed · opens today at 12pm', open: false });
  // Fall back: Sunday 1 November 2026 at 2am EDT becomes 1am EST.
  // 16:00 UTC is 11:00 EST (UTC−5), so still closed; 17:00 UTC is 12:00 EST and open.
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 10, 1, 16, 0)), NY, hours), { text: 'Closed · opens today at 12pm', open: false });
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 10, 1, 17, 0)), NY, hours), { text: 'Open now · until 9pm', open: true });
  // Sunday closing at 21:00 EST is 02:00 UTC Monday.
  assert.deepEqual(statusAt(new Date(Date.UTC(2026, 10, 2, 2, 0)), NY, hours), { text: 'Closed · opens Tuesday at 5pm', open: false });
});
