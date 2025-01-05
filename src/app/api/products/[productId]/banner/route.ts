import { createElement } from 'react';
import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import { canShowDiscountBanner, canRemoveBranding } from '@/server/permissions';
import { createProductView } from '@/server/db/productViews';
import { getProductForBanner } from '@/server/db/products';
import { env } from '@/data/env/server';
import Banner from '@/components/banner';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  const headersMap = await headers();
  const requestingUrl = headersMap.get('referer') || headersMap.get('origin');

  const countryCode = getCountryCode(request);

  if (requestingUrl == null || countryCode == null) {
    return notFound();
  }

  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    url: requestingUrl,
  });

  if (product == null) {
    return notFound();
  }

  const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

  await createProductView({
    productId: product.id,
    countryId: country?.id,
    userId: product.clerkUserId,
  });

  if (!canShowBanner || country == null || discount == null) {
    return notFound();
  }

  const response = await getJavaScript(
    product,
    country,
    discount,
    await canRemoveBranding(product.clerkUserId),
  );

  return new Response(response, { headers: { 'content-type': 'text/javascript' } });
}

const getCountryCode = (request: NextRequest) => {
  const geo = (request as any).geo;

  if (geo?.country != null) {
    return geo.country;
  }

  if (process.env.NODE_ENV === 'development') {
    return env.TEST_COUNTRY_CODE;
  }
};

const getJavaScript = async (
  product: {
    customization: {
      locationMessage: string;
      bannerContainer: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      isSticky: boolean;
      classPrefix?: string | null;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean,
) => {
  const { renderToStaticMarkup } = await import('react-dom/server');

  return `
    const banner = document.createElement("div");
    banner.innerHTML = '${renderToStaticMarkup(
      createElement(Banner, {
        message: product.customization.locationMessage,
        mappings: {
          country: country.name,
          coupon: discount.coupon,
          discount: (discount.percentage * 100).toString(),
        },
        customization: product.customization,
        canRemoveBranding,
      }),
    )}';
    document.querySelector("${product.customization.bannerContainer}").prepend(...banner.children);
  `.replace(/(\r\n|\n|\r)/g, '');
};
