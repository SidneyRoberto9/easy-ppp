import { getViewsByPPPChartData } from '@/server/db/productViews';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import ViewsByPPPChart from '@/app/dashboard/analytics/_components/view-by-ppp-chart';

type ViewsByPPPCardProps = Parameters<typeof getViewsByPPPChartData>[0];

const ViewsByPPPCard = async (props: ViewsByPPPCardProps) => {
  const chartData = await getViewsByPPPChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per PPP Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByPPPChart chartData={chartData} />
      </CardContent>
    </Card>
  );
};

export default ViewsByPPPCard;
