import { insights, projects } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';
import { MetricCard } from '@/components/UI/MetricCard';
import { Sparkline } from '@/components/UI/Charts';
import { HealthBadge } from '@/components/UI/Badges';

const BAR_BG: Record<string, string> = {
  brand: 'bg-brand',
  purple: 'bg-purple',
  amber: 'bg-amber',
  text3: 'bg-text3',
};

export function InsightsView() {
  const maxCat = Math.max(...insights.hoursByCategory.map((c) => c.value));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-text">Insights</h1>
        <p className="mt-0.5 text-sm text-text2">How your work is trending — signal, not decoration.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {insights.headlineKpis.map((k) => {
          const delta = parseFloat(k.delta);
          return <MetricCard key={k.label} label={k.label} value={k.value} delta={delta} deltaLabel="vs last month" />;
        })}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {/* Completion trend */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <Eyebrow>Weekly Completion Trend</Eyebrow>
            <span className="text-xs font-medium text-green">Trending up</span>
          </div>
          <div className="mt-4">
            <Sparkline data={insights.completionTrend} className="text-brand" width={640} height={120} />
          </div>
        </Card>

        {/* Hours by category */}
        <Card className="p-4">
          <Eyebrow>Hours by Category</Eyebrow>
          <div className="mt-4 flex flex-col gap-3">
            {insights.hoursByCategory.map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-text2">{c.label}</span>
                  <span className="tnum text-text3">{c.value}h</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface3">
                  <div className={`h-full rounded-full ${BAR_BG[c.color] ?? 'bg-brand'}`} style={{ width: `${(c.value / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects health table */}
      <Card className="mt-3 p-4">
        <Eyebrow>Projects Health</Eyebrow>
        <div className="mt-3 flex flex-col divide-y divide-border">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5">
              <span className="flex-1 truncate text-sm text-text">{p.name}</span>
              <div className="hidden w-40 items-center gap-2 sm:flex">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface3">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand to-purple" style={{ width: `${p.progress}%` }} />
                </div>
                <span className="tnum w-9 text-right text-2xs text-text3">{p.progress}%</span>
              </div>
              <span className="w-24 text-right">
                <HealthBadge health={p.health} />
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
