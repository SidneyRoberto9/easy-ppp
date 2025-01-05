import { SignUpButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { formatCompactNumber } from '@/lib/formatters';
import { subscriptionTiersInOrder } from '@/data/subscription-tiers';
import {
    CardTitle, CardHeader, CardFooter, CardDescription, CardContent, Card
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Feature from '@/app/(marketing)/_components/feature';

type PricingCardProps = (typeof subscriptionTiersInOrder)[number];

const PricingCard = ({
  name,
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
}: PricingCardProps) => {
  const isMostPopular = name === 'Standard';

  return (
    <Card
      className={cn(
        'relative shadow-none rounded-2xl overflow-hidden',
        isMostPopular ? 'border-accent border-2' : 'border-none',
      )}
    >
      {isMostPopular && (
        <div className="absolute top-24 rotate-45 origin-top-right -right-8 bg-accent text-accent-foreground  py-1 px-10">
          Most Popular
        </div>
      )}
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">${priceInCents / 100} /mo</CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfProducts)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button
            className="text-lg w-full rounded-lg"
            variant={isMostPopular ? 'accent' : 'default'}
          >
            Get Started
          </Button>
        </SignUpButton>
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

export default PricingCard;
