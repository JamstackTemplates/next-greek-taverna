import type { Metadata } from 'next';
import { EmptyPlate } from '../components/courtyard';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pb-(--space-section)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" kicker="404" title="This plate isn’t on the table." aside={<EmptyPlate className="w-44" />}>
        <p>The link may be out of date, or the page may have moved. Try one of these:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">Menu</SiteLink></li>
        <li><SiteLink href="/contact/" className="text-link">Contact</SiteLink></li>
      </ul>
    </section>
  );
}
