import { notFound } from 'next/navigation';

import PageWithBackButton from '@/app/dashboard/_components/page-with-back-button';
import CountryTab from '@/app/dashboard/products/[productId]/edit/_components/country-tab';
import CustomizationTab from '@/app/dashboard/products/[productId]/edit/_components/customization-tab';
import DetailsTab from '@/app/dashboard/products/[productId]/edit/_components/details-tab';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProduct } from '@/server/db/products';
import { auth } from '@clerk/nextjs/server';
import { TabsContent } from '@radix-ui/react-tabs';

export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) {
    return redirectToSignIn();
  }

  const { productId } = await params;

  const product = await getProduct({ userId, id: productId });

  if (product == null) {
    return notFound();
  }

  return (
    <PageWithBackButton backButtonHref="/dashboard/products" title="Edit Product">
      <Tabs defaultValue={'details'}>
        <TabsList className="bg-background/60 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="country">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="country">
          <CountryTab productId={productId} userId={userId} />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationTab productId={productId} userId={userId} />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  );
}
