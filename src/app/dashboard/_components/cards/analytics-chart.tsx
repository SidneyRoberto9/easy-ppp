import { CHART_INTERVALS, getViewsByDayChartData } from '@/server/db/productViews';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import ViewsByDayChart from '@/app/dashboard/analytics/_components/charts/view-by-day-chart';

interface ViewsByDayChartProps {
  userId: string;
}

const AnalyticsChart = async ({ userId }: ViewsByDayChartProps) => {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last30Days,
    timezone: 'UTC',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
