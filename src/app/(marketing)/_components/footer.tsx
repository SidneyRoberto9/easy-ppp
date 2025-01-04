import Link from 'next/link';

import FooterLinkGroup from '@/app/(marketing)/_components/footer-link-group';
import BrandLogo from '@/components/brand-logo';

const Footer = () => {
  return (
    <footer className="container pt-16 pb-8 flex flex-col sm:flex-row gap-8 sm:gap-4 justify-between items-start">
      <Link href="/">
        <BrandLogo />
      </Link>
      <div className="flex flex-col sm:flex-row gap-8">
        <FooterLinkGroup
          title="Help"
          links={[
            { label: 'PPP Discounts', href: '#' },
            { label: 'Discount API', href: '#' },
          ]}
        />
        <FooterLinkGroup
          title="Solutions"
          links={[
            { label: 'Newsletter', href: '#' },
            { label: 'SaaS Business', href: '#' },
            { label: 'Online Courses', href: '#' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-8">
        <FooterLinkGroup title="Features" links={[{ label: 'PPP Discounts', href: '#' }]} />
        <FooterLinkGroup
          title="Tools"
          links={[
            { label: 'Salary Converter', href: '#' },
            { label: 'Coupon Generator', href: '#' },
            { label: 'Stripe App', href: '#' },
          ]}
        />
        <FooterLinkGroup
          title="Company"
          links={[
            { label: 'Affiliate', href: '#' },
            { label: 'Twitter', href: '#' },
            { label: 'Terms of Service', href: '#' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-8">
        <FooterLinkGroup
          title="Integrations"
          links={[
            { label: 'Lemon Squeezy', href: '#' },
            { label: 'Gumroad', href: '#' },
            { label: 'Stripe', href: '#' },
            { label: 'Chargebee', href: '#' },
            { label: 'Paddle', href: '#' },
          ]}
        />
        <FooterLinkGroup
          title="Tutorials"
          links={[
            { label: 'Any Website', href: '#' },
            { label: 'Lemon Squeezy', href: '#' },
            { label: 'Gumroad', href: '#' },
            { label: 'Stripe', href: '#' },
            { label: 'Chargebee', href: '#' },
            { label: 'Paddle', href: '#' },
          ]}
        />
      </div>
    </footer>
  );
};

export default Footer;
