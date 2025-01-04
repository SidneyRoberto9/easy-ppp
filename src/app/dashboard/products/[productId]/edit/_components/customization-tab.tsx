import { notFound } from 'next/navigation';

import ProductCustomizationForm from '@/app/dashboard/_components/form/product-customization-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProductCustomization } from '@/server/db/products';
import { canCustomizeBanner, canRemoveBranding } from '@/server/permissions';

interface CustomizationTabProps {
  productId: string;
  userId: string;
}

const CustomizationTab = async ({ productId, userId }: CustomizationTabProps) => {
  const customization = await getProductCustomization({ productId, userId });

  if (customization == null) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={await canRemoveBranding(userId)}
          canCustomizeBanner={await canCustomizeBanner(userId)}
          customization={customization}
        />
      </CardContent>
    </Card>
  );
};

export default CustomizationTab;
