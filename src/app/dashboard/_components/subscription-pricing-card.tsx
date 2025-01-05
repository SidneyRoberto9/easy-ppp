import Feature from '@/app/(marketing)/_components/feature';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TierNames, subscriptionTiersInOrder } from '@/data/subscription-tiers';
import { formatCompactNumber } from '@/lib/formatters';
import { createCancelSession, createCheckoutSession } from '@/server/actions/stripe';

type SubscriptionPricingCardProps = (typeof subscriptionTiersInOrder)[number] & {
  currentTierName: TierNames;
};

const SubscriptionPricingCard = ({
  name,
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
  currentTierName,
}: SubscriptionPricingCardProps) => {
  const isCurrent = currentTierName === name;
  const action = name === 'Free' ? createCancelSession : createCheckoutSession.bind(null, name);

  return (
    <Card>
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">${priceInCents / 100} /mo</CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfProducts)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async () => {
            'use server';
            await action();
          }}
        >
          <Button disabled={isCurrent} className="text-lg w-full rounded-lg" size="lg">
            {isCurrent ? 'Current' : 'Swap'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {`${maxNumberOfProducts} ${maxNumberOfProducts === 1 ? 'product' : 'products'}`}
        </Feature>
        <Feature>PPP Discounts</Feature>
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPricingCard;
