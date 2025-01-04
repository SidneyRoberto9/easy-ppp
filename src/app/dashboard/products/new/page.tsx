import ProductDetailsForm from '@/app/dashboard/_components/form/product-details-form';
import PageWithBackButton from '@/app/dashboard/_components/page-with-back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <PageWithBackButton backButtonHref="/dashboard/products" title="Create Product">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDetailsForm />
        </CardContent>
      </Card>
    </PageWithBackButton>
  );
}
