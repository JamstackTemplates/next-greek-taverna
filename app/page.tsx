import type { Metadata } from 'next';
import { Courtyard } from '../components/courtyard';
import { GoogleMap } from '../components/google-map';
import { AmenityIcon, ArrowIcon, Brushstroke, DishGlyph } from '../components/icons';
import { OpenStatus } from '../components/open-status';
import { SharedTable } from '../components/shared-table';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { menu } from '../content/menu';
import { formatAddress, taverna, telHref } from '../content/taverna';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { formatHours } from '../lib/opening-hours';
import { absoluteUrl, menuAnchor } from '../lib/paths';
import { jsonLd, restaurantStructuredData } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

export default function HomePage() {
  const { address, terrace } = taverna;
  const tel = telHref();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(restaurantStructuredData()) }} />

      {/* Welcome: what it serves and where to go, with the shared table as the foundation. */}
      <section id="welcome" aria-labelledby="welcome-title" className="overflow-x-clip pt-[clamp(1.75rem,4vw,3rem)]">
        <div className="wrap">
          <p className="kicker">{taverna.tagline} · {address.locality}</p>
          <h1 id="welcome-title" className="mt-2.5 text-[clamp(2.35rem,5.6vw,4.6rem)] leading-[1.04]">Good things belong in the middle.</h1>
          <div className="mt-5 grid gap-x-10 gap-y-5 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="max-w-[36rem] text-[clamp(1.05rem,1.5vw,1.2rem)] text-muted">{taverna.introduction}</p>
              <p className="mt-5 flex flex-wrap gap-3">
                <SiteLink href="/menu/" className="button">See the menu</SiteLink>
                <SiteLink href="/contact/" className="button button-ghost">Enquire about a table</SiteLink>
              </p>
            </div>
            <div className="grid gap-1.5 text-[.98rem] lg:col-span-5 lg:border-l lg:border-rule lg:pl-8">
              <OpenStatus />
              <p>
                <span className="font-semibold">{address.street}</span><br />
                <span className="text-muted">{address.locality}, {address.region} {address.postalCode}</span>
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                <SiteLink href="/#find-us" className="text-link">Find us</SiteLink>
                {tel ? <a className="text-link figures" href={tel}>{taverna.phone}</a> : null}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-[clamp(1.25rem,3vw,2rem)] w-[min(100%-2*var(--gutter),86rem)]">
          <SharedTable />
        </div>
      </section>

      {/* Find us, straight after the welcome */}
      <section id="find-us" aria-labelledby="find-us-title" className="wrap section-y">
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="find-us-title" className="section-title">Find us</h2>
            <p className="mt-4 font-display text-[1.3rem] leading-snug font-semibold">{address.street}</p>
            <p className="text-[1.1rem]">{address.locality}, {address.region} {address.postalCode}</p>
            {address.note ? <p className="mt-3 max-w-[30rem] border-l-[3px] border-olive pl-3 text-[.95rem] text-muted">{address.note}</p> : null}
            <p className="mt-6 flex flex-wrap gap-3">
              <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <ArrowIcon /></a>
              <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
            </p>
            {taverna.directions.length ? (
              <>
                <h3 className="mt-8 text-[1.3rem]">Getting here</h3>
                <ul className="mt-3 grid gap-2.5">
                  {taverna.directions.map(line => (
                    <li key={line} className="border-t border-rule pt-2.5 text-muted">{line}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <div id="hours" className="lg:col-span-3">
            <h3 className="text-[1.3rem]">Opening hours</h3>
            <table className="mt-3 w-full text-[.98rem]">
              <tbody>
                {taverna.hours.map(entry => (
                  <tr key={entry.day} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-3 text-left font-medium">{entry.day}</th>
                    <td className="py-2 text-right figures text-muted">{formatHours(entry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TimeZoneNote />
            {taverna.notice ? <p className="mt-3 border-l-[3px] border-accent pl-3 text-[.95rem]">{taverna.notice}</p> : null}
            <p className="mt-3 text-[.85rem] text-muted">These are the taverna’s hours. They don’t promise a table, the terrace or a last kitchen order.</p>
          </div>

          <div className="lg:col-span-4">
            <GoogleMap className="h-full min-h-[22rem] print:hidden" />
          </div>
        </div>
      </section>

      {terrace.enabled ? (
        <section id="terrace" aria-labelledby="terrace-title" className="bg-surface-alt/70 py-(--space-section)">
          <div className="wrap grid items-center gap-x-12 gap-y-8 md:grid-cols-2">
            <Courtyard className="max-w-[36rem]" />
            <div>
              <p className="kicker">Outside</p>
              <h2 id="terrace-title" className="section-title mt-2">{terrace.title}</h2>
              <p className="mt-4 max-w-(--measure) text-[1.1rem]">{terrace.description}</p>
              <ul className="mt-6 grid gap-0 border-t border-rule">
                {[terrace.seasonNote, terrace.seatingNote, terrace.weatherNote].map(note => (
                  <li key={note} className="flex items-center gap-3 border-b border-rule py-2.5">
                    <span className="size-2 flex-none rounded-full bg-olive" aria-hidden="true" />{note}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-muted">{terrace.enquiryNote}</p>
              <p className="mt-5"><SiteLink href="/contact/" className="button">Ask about the terrace</SiteLink></p>
            </div>
          </div>
        </section>
      ) : null}

      {/* How we share: one narrow passage and the menu by section */}
      <section id="how-we-share" aria-labelledby="how-we-share-title" className="wrap section-y">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
          <div>
            <p className="kicker">At the table</p>
            <h2 id="how-we-share-title" className="section-title mt-2">How we share</h2>
            <Brushstroke className="mt-4" />
            <dl className="mt-6 grid gap-5">
              {taverna.amenities.map(amenity => (
                <div key={amenity.id} id={amenity.id} className="grid grid-cols-[auto_1fr] gap-x-4">
                  <AmenityIcon name={amenity.icon} className="row-span-2 size-9" />
                  <dt className="font-display text-[1.2rem] font-semibold">{amenity.title}</dt>
                  <dd className="text-muted">{amenity.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <nav aria-labelledby="sections-title">
            <h3 id="sections-title" className="text-[1.3rem]">The menu, plate by plate</h3>
            <ol className="mt-3 border-t-[3px] border-accent">
              {menu.sections.map(section => (
                <li key={section.id} className="border-b border-rule">
                  <SiteLink href={menuAnchor(section.id)} className="group grid grid-cols-[auto_1fr] items-center gap-x-4 py-3.5 text-ink no-underline">
                    <DishGlyph art={section.items[0]?.art ?? 'dip'} className="row-span-2 size-9" />
                    <span className="font-display text-[1.25rem] font-semibold group-hover:text-link group-hover:underline">{section.title}</span>
                    <span className="text-[.95rem] text-muted">{section.description}</span>
                  </SiteLink>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section id="kitchen" aria-labelledby="kitchen-title" className="wrap pb-(--space-section)">
        <div className="max-w-[44rem] border-t border-rule pt-10">
          <h2 id="kitchen-title" className="text-[clamp(1.5rem,2.6vw,1.9rem)]">A little about the kitchen</h2>
          {taverna.story.map(paragraph => <p key={paragraph} className="mt-3 text-muted">{paragraph}</p>)}
        </div>
      </section>

      <section id="before-you-come" aria-labelledby="faq-title" className="wrap pb-(--space-section)">
        <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="kicker">Questions</p>
            <h2 id="faq-title" className="section-title mt-2">Before you come</h2>
          </div>
          <div className="border-t-[3px] border-accent">
            {taverna.faqs.map(faq => (
              <details key={faq.id} id={`faq-${faq.id}`} className="faq border-b border-rule">
                <summary className="flex items-center justify-between gap-4 py-4 font-display text-[1.15rem] font-semibold">{faq.question}</summary>
                <p className="max-w-(--measure) pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" aria-labelledby="enquire-title" className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-rule py-8">
          <div>
            <h2 id="enquire-title" className="text-[clamp(1.5rem,2.6vw,1.9rem)]">{taverna.contact.heading}</h2>
            <p className="mt-1 text-muted">{taverna.contact.introduction}</p>
          </div>
          <SiteLink href="/contact/" className="button">Enquire about a table</SiteLink>
        </div>
      </section>
    </>
  );
}
