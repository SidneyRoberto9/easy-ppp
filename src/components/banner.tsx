import { Fragment } from 'react';

import { env } from '@/data/env/client';

interface BannerProps {
  canRemoveBranding: boolean;
  message: string;
  mappings: {
    coupon: string;
    discount: string;
    country: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    classPrefix?: string | null;
  };
}

const Banner = ({ message, mappings, customization, canRemoveBranding }: BannerProps) => {
  const prefix = customization.classPrefix ?? '';
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [Key, value]) => {
      return mappedMessage.replace(new RegExp(`{${Key}}`), value);
    },
    message.replace(/'/g, '&#39;'),
  );

  return (
    <Fragment>
      <style type="text/css">
        {`
          .${prefix}easy-ppp-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? 'position: sticky;' : ''}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}easy-ppp-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>

      <div className={`${prefix}easy-ppp-container ${prefix}easy-ppp-override`}>
        <span
          className={`${prefix}easy-ppp-message ${prefix}easy-ppp-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage,
          }}
        />
        {!canRemoveBranding && (
          <a className={`${prefix}easy-ppp-branding`} href={`${env.NEXT_PUBLIC_SERVER_URL}`}>
            Powered by Easy PPP
          </a>
        )}
      </div>
    </Fragment>
  );
};

export default Banner;
