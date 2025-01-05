import { getViewsByCountryChartData } from '@/server/db/productViews';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import ViewsByCountryChart from '@/app/dashboard/analytics/_components/view-by-country-chart';

type ViewsByCountryCardProps = Parameters<typeof getViewsByCountryChartData>[0];

const ViewsByCountryCard = async (props: ViewsByCountryCardProps) => {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
};

export default ViewsByCountryCard;
