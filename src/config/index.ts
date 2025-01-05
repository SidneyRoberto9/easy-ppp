import { Metadata } from 'next';

const SITE_CONFIG: Metadata = {
  title: {
    default: 'Easy PPP',
    template: `%s | Easy PPP`,
  },
  description:
    'Easy PPP is a powerful platform designed to help businesses optimize the pricing of their digital products based on regional purchasing power. By utilizing location-based pricing strategies and flexible promotional tools, the application enables creators to enhance accessibility, expand their global reach, and drive sales effectively.',
  icons: {
    icon: [
      {
        url: '/icons/icon.ico',
        href: '/icons/icon.ico',
      },
    ],
  },
  openGraph: {
    title: 'Easy PPP',
    description:
      'Easy PPP is a powerful platform designed to help businesses optimize the pricing of their digital products based on regional purchasing power. By utilizing location-based pricing strategies and flexible promotional tools, the application enables creators to enhance accessibility, expand their global reach, and drive sales effectively.',
    images: [
      {
        url: '/assets/home.png',
      },
    ],
  },
};

export { SITE_CONFIG };
