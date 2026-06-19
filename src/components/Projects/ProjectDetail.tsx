import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FileText,
  CircleDot,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { featuredProject } from '@/data/mockData';
import type { ColumnId, ProjectRisk } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';
import { HealthBadge, PriorityChip, Avatar } from '@/components/UI/Badges';

const TABS = ['Overview', 'Tasks', 'Timeline', 'Documents', 'Risks', 'Team'] as const;
type Tab = (typeof TABS)[number];

const STATUS_META: Record<ColumnId, { icon: typeof CircleDot; className: string; label: string }> = {
  backlog: { icon: CircleDot, className: 'text-text3', label: 'Backlog' },
  doing: { icon: CircleDot, className: 'text-brand', label: 'Doing' },
  waiting: { icon: Clock, className: 'text-amber', label: 'Waiting' },
  done: { icon: CheckCircle2, className: 'text-green', label: 'Done' },
};

const RISK_DOT: Record<ProjectRisk['level'], string> = { high: 'bg-red', medium: 'bg-amber', low: 'bg-text3' };

function StatCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="px-4 py-3">
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function TasksSection() {
  return (
    <Card className="p-4">
      <Eyebrow>Tasks</Eyebrow>
      <div className="mt-3 flex flex-col divide-y divide-border">
        {featuredProject.tasks.map((t) => {
          const m = STATUS_META[t.status];
          const Icon = m.icon;
          return (
            <div key={t.id} className="flex items-center gap-3 py-2.5">
              <Icon size={16} className={m.className} />
              <span className={`flex-1 text-sm ${t.status === 'done' ? 'text-text2 line-through' : 'text-text'}`}>{t.title}</span>
              <span className="text-2xs text-text3">{m.label}</span>
              <PriorityChip priority={t.priority} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function DocumentsSection() {
  return (
    <Card className="p-4">
      <Eyebrow>Documents</Eyebrow>
      <div className="mt-3 flex flex-col gap-1">
        {featuredProject.documents.map((d) => (
          <button key={d.id} className="flex items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface2">
            <span className="grid size-8 place-items-center rounded-md bg-surface3 text-text2">
              <FileText size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-text">{d.name}</span>
              <span className="block truncate text-2xs text-text3">{d.meta}</span>
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function RisksSection() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5">
        <AlertTriangle size={14} className="text-amber" />
        <Eyebrow>Risks</Eyebrow>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {featuredProject.risks.map((r) => (
          <div key={r.id} className="flex items-start gap-2.5 rounded-md border border-border bg-surface2/60 p-2.5">
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${RISK_DOT[r.level]}`} />
            <span className="text-sm text-text2">{r.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TeamSection() {
  return (
    <Card className="p-4">
      <Eyebrow>Team</Eyebrow>
      <div className="mt-3 flex flex-col gap-1">
        {featuredProject.team.map((m, i) => (
          <div key={m.id} className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar initials={m.initials} index={i} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-text">{m.name}</span>
              <span className="block truncate text-2xs text-text3">{m.role}</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Overview() {
  const p = featuredProject;
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {/* Recent activity */}
      <Card className="p-4">
        <Eyebrow>Recent Activity</Eyebrow>
        <div className="mt-3 flex flex-col gap-3">
          {p.activity.map((a) => (
            <div key={a.id} className="flex gap-2.5">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand" />
              <div>
                <p className="text-sm text-text">{a.text}</p>
                <p className="text-2xs text-text3">{a.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI summary */}
      <Card className="border-brand/25 bg-brand-glow p-4">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand" />
          <Eyebrow className="text-brand/80">AI Summary</Eyebrow>
        </div>
        <p className="text-sm leading-relaxed text-text2">{p.aiSummary}</p>
      </Card>

      <TasksSection />
      <RisksSection />
      <DocumentsSection />
      <TeamSection />
    </div>
  );
}

export function ProjectDetail() {
  const [tab, setTab] = useState<Tab>('Overview');
  const p = featuredProject;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Breadcrumb */}
      <div className="mb-1 flex items-center gap-1.5 text-xs text-text3">
        <span>Projects</span>
        <ChevronRight size={13} />
        <span className="font-medium uppercase tracking-wide text-text2">{p.name}</span>
      </div>
      <h1 className="text-xl font-bold tracking-tight text-text">{p.name}</h1>

      {/* Stat strip */}
      <Card className="mt-4 grid grid-cols-2 divide-x divide-border md:grid-cols-4">
        <StatCell label="Project Health">
          <HealthBadge health={p.health} />
        </StatCell>
        <StatCell label="Progress">
          <div className="flex items-center gap-2">
            <span className="stat-number tnum text-sm text-text">{p.progress}%</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface3">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-purple" style={{ width: `${p.progress}%` }} />
            </div>
          </div>
        </StatCell>
        <StatCell label="Due Date">
          <span className="text-sm text-text">{p.dueDate}</span>
          <span className="ml-1.5 text-2xs text-text3">{p.daysLeft} days left</span>
        </StatCell>
        <StatCell label="Owner">
          <span className="flex items-center gap-2">
            <Avatar initials={p.owner.initials} size="sm" />
            <span className="text-sm text-text">{p.owner.name}</span>
          </span>
        </StatCell>
      </Card>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-0.5 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              '-mb-px shrink-0 border-b-2 px-3 py-2 text-sm transition-colors',
              tab === t ? 'border-brand font-medium text-text' : 'border-transparent text-text2 hover:text-text',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'Overview' && <Overview />}
        {tab === 'Tasks' && <TasksSection />}
        {tab === 'Documents' && <DocumentsSection />}
        {tab === 'Risks' && <RisksSection />}
        {tab === 'Team' && <TeamSection />}
        {tab === 'Timeline' && (
          <Card className="grid place-items-center p-10 text-sm text-text3">Timeline view — coming soon</Card>
        )}
      </div>
    </div>
  );
}
