import { formatAddress, publicLinks, taverna, telHref } from '../content/taverna';
import { footerNavigation } from '../lib/navigation';
import { SiteLink } from './site-link';

/** Unboxed footer: one cobalt rule, compact address and contact, links and the credit. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const tel = telHref();
  return (
    <footer className="site-footer mt-16">
      <div className="wrap border-t-[3px] border-accent pt-8 pb-10">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-display text-[1.35rem] font-semibold">{taverna.name}</p>
            <address className="mt-1 text-[.95rem] leading-relaxed text-muted not-italic">
              {formatAddress()}<br />
              <SiteLink href="/#find-us" className="text-link">Opening hours &amp; directions</SiteLink>
              {' · '}<a className="text-link" href={`mailto:${taverna.email}`}>{taverna.email}</a>
              {tel ? <>{' · '}<a className="text-link figures" href={tel}>{taverna.phone}</a></> : null}
            </address>
          </div>
          <nav aria-label="Footer" className="md:justify-self-end">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[.95rem] font-semibold">
              {footerNavigation(taverna.terrace.enabled).map(item => (
                <li key={item.href}><SiteLink href={item.href} className="text-ink no-underline hover:text-link hover:underline">{item.label}</SiteLink></li>
              ))}
              {publicLinks.map(link => (
                <li key={link.url}><a className="text-ink no-underline hover:text-link hover:underline" href={link.url} rel="me noopener">{link.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-rule pt-4 text-[.85rem] text-muted">
          <span>© {year} {taverna.name} · {taverna.tagline}</span>
          <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-link hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
        </p>
      </div>
    </footer>
  );
}
