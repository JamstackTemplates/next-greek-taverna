'use client';

import { useEffect, useState } from 'react';
import { taverna } from '../content/taverna';
import { NEUTRAL_STATUS, statusAt } from '../lib/opening-hours';
import { site } from '../lib/site';

/**
 * "Open now · until 10pm" / "Closed · opens Tuesday at 5pm". The static HTML (and the page before
 * hydration, without JavaScript, or without a valid time zone) says only "See opening hours.";
 * the browser computes the live state in the taverna's own time zone and refreshes it every minute.
 * It links to the hours in Find us.
 */
export function OpenStatus({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<{ text: string; open?: boolean } | null>(null);

  useEffect(() => {
    const update = () => setStatus(statusAt(new Date(), site.timeZone, taverna.hours));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <a href="#hours" className={`inline-flex items-center gap-2 font-semibold text-ink no-underline hover:text-link ${className}`}
      data-open={status?.open === undefined ? undefined : String(status.open)}>
      <span className="status-dot" aria-hidden="true" />
      <span role="status" aria-live="polite">{status?.text ?? NEUTRAL_STATUS}</span>
    </a>
  );
}
