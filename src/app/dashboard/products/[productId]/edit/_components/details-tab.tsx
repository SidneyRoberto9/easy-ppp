import ProductDetailsForm from '@/app/dashboard/_components/form/product-details-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/schemas/products';

interface DetailsTabsProps {
  product: Product;
}

const DetailsTab = ({ product }: DetailsTabsProps) => {
  return (
    <Card>
      <CardHeader className="text-xl">Product Details</CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
