import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from 'lucide-react';

import { auth } from '@clerk/nextjs/server';
import { canAccessAnalytics } from '@/server/permissions';
import { CHART_INTERVALS } from '@/server/db/productViews';
import { createURL } from '@/lib/utils';
import {
    DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import HasPermission from '@/components/has-permission';
import TimezoneDropdownMenuItem from '@/app/dashboard/_components/timezone-dropdown-menu-item';
import ProductDropdown from '@/app/dashboard/analytics/_components/product-dropdown';
import ViewsByPPPCard from '@/app/dashboard/analytics/_components/cards/view-by-ppp-card';
import ViewsByDayCard from '@/app/dashboard/analytics/_components/cards/view-by-day-card';
import ViewsByCountryCard from '@/app/dashboard/analytics/_components/cards/view-by-country-card';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) {
    return redirectToSignIn();
  }

  const sParams = await searchParams;

  const interval =
    CHART_INTERVALS[sParams.interval as keyof typeof CHART_INTERVALS] ?? CHART_INTERVALS.last7Days;
  const timezone = sParams.timezone || 'UTC';
  const productId = sParams.productId;

  return (
    <Fragment>
      <div className="mb-6 flex justify-between items-baseline">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link
                      href={createURL('/dashboard/analytics', sParams, {
                        interval: key,
                      })}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown userId={userId} selectedProductId={productId} searchParams={sParams} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {timezone}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={createURL('/dashboard/analytics', sParams, {
                      timezone: 'UTC',
                    })}
                  >
                    UTC
                  </Link>
                </DropdownMenuItem>
                <TimezoneDropdownMenuItem searchParams={sParams} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByPPPCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPermission>
    </Fragment>
  );
}
