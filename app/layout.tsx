import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
import '@fontsource/gelasio/latin-500.css';
import '@fontsource/gelasio/latin-600.css';
import '@fontsource/gelasio/latin-500-italic.css';
import '@fontsource-variable/commissioner';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { taverna } from '../content/taverna';
import { site } from '../lib/site';
import './tailwind.input.css';

// Absolute URLs only when the deployed URL is known at build time. Never fall back to localhost.
const title = `${taverna.name} — ${taverna.tagline}`;
const socialImage = site.url ? [{ url: `${site.url}/og.png`, width: 1200, height: 630, alt: `${taverna.name}: a shared meze table` }] : undefined;
const description = site.description || taverna.introduction;

export const metadata: Metadata = {
  title: { default: title, template: `%s — ${taverna.name}` },
  description,
  applicationName: site.name,
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    ...(site.url ? { url: `${site.url}/` } : {}),
    images: socialImage,
  },
  twitter: { card: socialImage ? 'summary_large_image' : 'summary' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7f0' },
    { media: '(prefers-color-scheme: dark)', color: '#101e2b' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <a className="absolute -top-16 left-4 z-[200] rounded-ui bg-accent px-4 py-2.5 font-semibold text-on-accent no-underline focus:top-3" href="#main">Skip to content</a>
          <SiteHeader />
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
