import { Fragment } from 'react';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import { auth } from '@clerk/nextjs/server';
import { getProducts } from '@/server/db/products';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/app/dashboard/_components/product-grid';
import NoProducts from '@/app/dashboard/_components/no-products';

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
      <h1 className="mb-6 text-3xl font-semibold flex justify-between">
        Products
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" /> New Product
          </Link>
        </Button>
      </h1>
      <ProductGrid products={products} />
    </Fragment>
  );
}
