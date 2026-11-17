import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { EmptyPlate } from '../../components/courtyard';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { taverna, telHref } from '../../content/taverna';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Enquiries',
  description: `${taverna.contact.heading} for ${taverna.name}.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'font-display text-[1.25rem] font-semibold';

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const { contact } = taverna;
  const tel = telHref();
  return (
    <>
      <PageHead kicker="Contact" title={contact.heading}>
        <p>{contact.introduction}</p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(2rem,5vw,4rem)] pt-4 pb-(--space-section) lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={taverna.email} />
          ) : (
            <div className="grid justify-items-start gap-4 border-t-[3px] border-accent bg-surface p-[clamp(1.5rem,4vw,2.5rem)]">
              <EmptyPlate className="w-20" />
              <h2 className="text-[clamp(1.6rem,3vw,2.1rem)]">Email us with your enquiry.</h2>
              <p className="max-w-[34rem] text-muted">Include the details listed on this page and we’ll reply to say what we can do.</p>
              <p><a className="button" href={`mailto:${taverna.email}?subject=${encodeURIComponent('Table enquiry')}`}>Email {taverna.email}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-display text-[1.35rem] wrap-anywhere"><a className="text-link" href={`mailto:${taverna.email}`}>{taverna.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={taverna.email} /></p>

          {tel ? (
            <>
              <h2 className={`mt-5 ${subhead}`}>Phone</h2>
              <p><a className="text-link figures" href={tel}>{taverna.phone}</a></p>
              <p className="text-[.92rem] text-muted">For anything time-sensitive, please call.</p>
            </>
          ) : null}

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 border-t border-rule pt-2.5 text-muted">
            {contact.usefulToInclude.map(tip => (
              <li key={tip} className="relative pl-5 before:absolute before:top-[.6em] before:left-0 before:size-2 before:rounded-full before:border-[1.5px] before:border-accent">{tip}</li>
            ))}
          </ul>
          <p className="mt-5 border-l-[3px] border-olive pl-3 text-[.95rem]">{contact.confirmationNote}</p>
        </aside>
      </div>
    </>
  );
}
