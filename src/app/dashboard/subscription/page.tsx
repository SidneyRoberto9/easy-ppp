import { Fragment } from 'react';
import { startOfMonth } from 'date-fns';

import { auth } from '@clerk/nextjs/server';
import { getUserSubscriptionTier } from '@/server/db/subscription';
import { getProductViewCount } from '@/server/db/productViews';
import { getProductCount } from '@/server/db/products';
import { createCustomerPortalSession } from '@/server/actions/stripe';
import { formatCompactNumber } from '@/lib/formatters';
import { subscriptionTiersInOrder, subscriptionTiers } from '@/data/subscription-tiers';
import { Progress } from '@/components/ui/progress';
import { CardTitle, CardHeader, CardDescription, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubscriptionPricingCard from '@/app/dashboard/_components/cards/subscription-pricing-card';

export default async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) {
    return redirectToSignIn();
  }

  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);
  const pricingViewCount = await getProductViewCount(userId, startOfMonth(new Date()));

  return (
    <Fragment>
      <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Monthly Usage</CardTitle>
              <CardDescription>
                {formatCompactNumber(pricingViewCount)} /{' '}
                {formatCompactNumber(tier.maxNumberOfVisits)} pricing page visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(pricingViewCount / tier.maxNumberOfVisits) * 100} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Number of Products</CardTitle>
              <CardDescription>
                {productCount} / {formatCompactNumber(tier.maxNumberOfProducts)} pricing page visits
                this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={(productCount / tier.maxNumberOfProducts) * 100} />
            </CardContent>
          </Card>
        </div>

        {tier != subscriptionTiers.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {tier.name} plan</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment method use the button
                below.
              </CardDescription>
              <CardContent>
                <form
                  action={async () => {
                    'use server';
                    await createCustomerPortalSession();
                  }}
                >
                  <Button variant="accent" className="text-lg rounded-lg" size="lg">
                    Manage Subscription
                  </Button>
                </form>
              </CardContent>
            </CardHeader>
          </Card>
        )}
      </div>
      <div className="grid-cols-2 lg:grid-cols-4 grid gap-4 max-w-screen-xl">
        {subscriptionTiersInOrder.map((t) => (
          <SubscriptionPricingCard key={t.name} currentTierName={tier.name} {...t} />
        ))}
      </div>
    </Fragment>
  );
}
