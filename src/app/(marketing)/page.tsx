import { Fragment } from 'react';

import Footer from '@/app/(marketing)/_components/footer';
import Hero from '@/app/(marketing)/_components/hero';
import Pricing from '@/app/(marketing)/_components/pricing';
import TrustedCompanies from '@/app/(marketing)/_components/trusted-companies';

export default function Page() {
  return (
    <Fragment>
      <Hero />
      <TrustedCompanies />
      <Pricing />
      <Footer />
    </Fragment>
  );
}
