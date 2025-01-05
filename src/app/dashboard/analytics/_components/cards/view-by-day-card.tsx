import { getViewsByDayChartData } from '@/server/db/productViews';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import ViewsByDayChart from '@/app/dashboard/analytics/_components/charts/view-by-day-chart';

type ViewsByDayCardProps = Parameters<typeof getViewsByDayChartData>[0];

const ViewsByDayCard = async (props: ViewsByDayCardProps) => {
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
};

export default ViewsByDayCard;
