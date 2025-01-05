import { Fragment } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowRightIcon } from 'lucide-react';

import { auth } from '@clerk/nextjs/server';
import { canAccessAnalytics } from '@/server/permissions';
import { getProducts } from '@/server/db/products';
import { Button } from '@/components/ui/button';
import HasPermission from '@/components/has-permission';
import ProductGrid from '@/app/dashboard/_components/product-grid';
import NoProducts from '@/app/dashboard/_components/no-products';
import AnalyticsChart from '@/app/dashboard/_components/cards/analytics-chart';

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) {
    return redirectToSignIn();
  }

  const products = await getProducts(userId);

  if (products.length === 0) {
    return <NoProducts />;
  }

  return (
    <Fragment>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link className="group flex gap-2 items-center hover:underline" href="/dashboard/products">
          Products
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>

      <ProductGrid products={products} />

      <h2 className="mb-6 text-3xl font-semibold flex justify-between mt-12">
        <Link href="/dashboard/analytics" className="flex gap-2 items-center hover:underline group">
          Analytics
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </h2>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <AnalyticsChart userId={userId} />
      </HasPermission>
    </Fragment>
  );
}
