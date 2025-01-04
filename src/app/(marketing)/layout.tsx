import { PropsWithChildren } from 'react';

import Navbar from '@/app/(marketing)/_components/navbar';

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <div className="selection:bg-[hsl(320,65%,52%,20%)]">
      <Navbar />
      {children}
    </div>
  );
}
