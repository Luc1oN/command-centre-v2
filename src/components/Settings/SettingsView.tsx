import type { ReactNode } from 'react';
import { Sun, Moon, RefreshCw, Database, ExternalLink, Check } from 'lucide-react';
import { user } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';
import { Avatar } from '@/components/UI/Badges';
import { useUiStore } from '@/store/useUiStore';
import { useAppStore } from '@/store/useAppStore';

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3.5 first:border-t-0">
      <div className="min-w-0">
        <p className="text-sm text-text">{label}</p>
        {hint && <p className="text-2xs text-text3">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const taskCount = useAppStore((s) => s.tasks.length);
  const bucketCount = useAppStore((s) => s.buckets.length);
  const ready = useAppStore((s) => s.ready);
  const init = useAppStore((s) => s.init);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-text">Settings</h1>
        <p className="mt-0.5 text-sm text-text2">Appearance, account and data.</p>
      </div>

      {/* Account */}
      <Card className="mb-3 p-4">
        <Eyebrow>Account</Eyebrow>
        <div className="mt-3 flex items-center gap-3">
          <Avatar initials={user.initials} />
          <div>
            <p className="text-sm font-medium text-text">{user.fullName}</p>
            <p className="text-2xs text-text3">{user.role}</p>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="mb-3">
        <div className="px-4 pt-4">
          <Eyebrow>Appearance</Eyebrow>
        </div>
        <div className="mt-2">
          <Row label="Theme" hint="Switch between dark and light mode">
            <div className="inline-flex rounded-md border border-border bg-surface2 p-0.5">
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-colors ${
                  theme === 'light' ? 'bg-surface font-medium text-text shadow-sm' : 'text-text2'
                }`}
              >
                <Sun size={14} /> Light
              </button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm transition-colors ${
                  theme === 'dark' ? 'bg-surface font-medium text-text shadow-sm' : 'text-text2'
                }`}
              >
                <Moon size={14} /> Dark
              </button>
            </div>
          </Row>
        </div>
      </Card>

      {/* Data */}
      <Card className="mb-3">
        <div className="px-4 pt-4">
          <Eyebrow>Data &amp; Sync</Eyebrow>
        </div>
        <div className="mt-2">
          <Row label="Supabase" hint={ready ? 'Connected — changes save automatically' : 'Connecting…'}>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${ready ? 'text-green' : 'text-amber'}`}>
              <Database size={14} />
              {ready ? (
                <>
                  <Check size={13} /> Connected
                </>
              ) : (
                'Connecting'
              )}
            </span>
          </Row>
          <Row label="Stored data" hint="Loaded from your dashboard">
            <span className="tnum text-sm text-text2">
              {taskCount} tasks · {bucketCount} lists
            </span>
          </Row>
          <Row label="Refresh" hint="Re-fetch the latest from Supabase">
            <button
              onClick={() => init()}
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text"
            >
              <RefreshCw size={14} /> Reload
            </button>
          </Row>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div className="px-4 pt-4">
          <Eyebrow>About</Eyebrow>
        </div>
        <div className="mt-2">
          <Row label="Command Centre" hint="Personal operating system">
            <span className="text-xs text-text3">v0.1</span>
          </Row>
          <Row label="Source" hint="Luc1oN/command-centre-v2">
            <a
              href="https://github.com/Luc1oN/command-centre-v2"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text"
            >
              <ExternalLink size={14} /> GitHub
            </a>
          </Row>
        </div>
      </Card>
    </div>
  );
}
