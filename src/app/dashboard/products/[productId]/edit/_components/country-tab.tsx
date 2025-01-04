import CountryDiscountsForm from '@/app/dashboard/_components/form/country-discounts-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductCountryGroups } from '@/server/db/products';

interface CountryTabProps {
  productId: string;
  userId: string;
}

const CountryTab = async ({ productId, userId }: CountryTabProps) => {
  const countryGroups = await getProductCountryGroups({
    productId,
    userId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for any specific parity
          country
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CountryDiscountsForm productId={productId} countryGroups={countryGroups} />
      </CardContent>
    </Card>
  );
};

export default CountryTab;
