'use client';

import { YAxis, XAxis, BarChart, Bar } from 'recharts';

import { formatCompactNumber } from '@/lib/formatters';
import { ChartTooltipContent, ChartTooltip, ChartContainer } from '@/components/ui/chart';

interface ViewsByPPPChartProps {
  chartData: { pppName: string; views: number }[];
}

const ViewsByPPPChart = ({ chartData }: ViewsByPPPChartProps) => {
  const chartConfig = {
    views: {
      label: 'Visitors',
      color: 'hsl(var(--accent))',
    },
  };

  if (chartData.length === 0) {
    return (
      <p className="flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px]">
        No data available
      </p>
    );
  }

  const data = chartData.map((d) => ({
    ...d,
    pppName: d.pppName.replace('Parity Group: ', ''),
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="pppName" tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
};

export default ViewsByPPPChart;
