import { PropsWithChildren } from 'react';

import Navbar from '@/app/dashboard/_components/navbar';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-accent/5 min-h-screen">
      <Navbar />
      <div className="container py-6">{children}</div>
    </div>
  );
}
