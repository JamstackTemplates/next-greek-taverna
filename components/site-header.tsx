import { DarkModeToggle } from 'jamstacks';
import { taverna } from '../content/taverna';
import { headerNavigation } from '../lib/navigation';
import { SiteLink } from './site-link';

/** Compact utility header: two-line wordmark, Menu · Terrace · Contact and the theme toggle. */
export function SiteHeader() {
  const navigation = headerNavigation(taverna.terrace.enabled);
  return (
    <header className="site-header sticky top-0 z-50 border-b border-rule bg-bg/90 backdrop-blur-sm">
      <div className="wrap flex min-h-(--header-h) items-center justify-between gap-2 sm:gap-4">
        <SiteLink href="/" className="group flex min-w-0 items-center gap-2.5 text-ink no-underline">
          <svg className="size-8 flex-none max-sm:hidden" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
            <circle cx="20" cy="20" r="17" fill="var(--plate)" stroke="var(--accent)" strokeWidth="3" />
            <circle cx="20" cy="20" r="11.5" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="1 3.2" strokeLinecap="round" />
            <path d="M20 13 C25 13 27 18 26 22 C25 27 22 28 20 28 C17 28 14 26 14 21 C14 17 16 13 20 13 Z" fill="var(--lemon)" />
            <path d="M20 13 C20 10 22 8 25 8" fill="none" stroke="var(--olive)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="grid leading-none">
            <span className="font-display text-[1.06rem] font-semibold whitespace-nowrap sm:text-[1.3rem]">{taverna.name}</span>
            <span className="mt-1 text-[.6rem] font-semibold tracking-[.18em] whitespace-nowrap text-olive uppercase sm:text-[.68rem]">{taverna.tagline}</span>
          </span>
        </SiteLink>
        <div className="flex items-center gap-1 sm:gap-3 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent={item.href.includes('#') ? undefined : 'section'}
                    className="inline-block px-1.5 py-2 text-[.88rem] font-semibold text-muted no-underline transition-colors hover:text-link aria-[current]:text-ink aria-[current]:underline aria-[current]:decoration-accent aria-[current]:decoration-2 aria-[current]:underline-offset-8 xs:px-2 sm:px-3 sm:text-[.95rem]">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}
