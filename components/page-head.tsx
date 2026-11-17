import type { ReactNode } from 'react';
import { Brushstroke } from './icons';

/** Heading block for inner pages: a small-caps kicker, a Gelasio title, a lede and the brushstroke. */
export function PageHead({ kicker, title, children, id, aside }: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional drawing beside the heading on wider screens. */
  aside?: ReactNode;
}) {
  return (
    <header className="wrap grid items-end gap-6 pt-[clamp(2.25rem,5vw,4rem)] pb-[clamp(1.25rem,3vw,2rem)] md:grid-cols-[1fr_auto]">
      <div>
        <p className="kicker">{kicker}</p>
        <h1 id={id} className="mt-3 max-w-[20ch] text-[clamp(2.3rem,5.5vw,3.9rem)]">{title}</h1>
        <Brushstroke className="mt-4" />
        {children ? <div className="mt-5 max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted">{children}</div> : null}
      </div>
      {aside ? <div className="max-md:hidden">{aside}</div> : null}
    </header>
  );
}
