import { useEffect } from 'react';
import { useHud } from '@/store';
import { useAppStore } from '@/store/useAppStore';
import { ParticleField } from '@/components/ParticleField';
import { Header } from '@/components/Header';
import { Pomodoro } from '@/components/Pomodoro';
import { BoardDonut } from '@/components/BoardDonut';
import { BookmarkDock } from '@/components/BookmarkDock';
import { Workspace } from '@/components/Workspace';
import { WeeklyChart } from '@/components/WeeklyChart';
import { ActivityFeed } from '@/components/ActivityFeed';

export default function App() {
  // Load real Supabase data (tasks, buckets, projects, notes) once
  const initData = useAppStore((s) => s.init);
  useEffect(() => {
    initData();
  }, [initData]);

  // Master 1s tick: drives clock-independent momentum + pomodoro countdown
  useEffect(() => {
    const id = setInterval(() => useHud.getState().tick(), 1000);
    return () => clearInterval(id);
  }, []);

  // Any user activity keeps momentum out of the idle state (throttled)
  useEffect(() => {
    let last = 0;
    const onAct = () => {
      const now = Date.now();
      if (now - last > 5000) {
        last = now;
        useHud.getState().registerInteraction();
      }
    };
    window.addEventListener('pointerdown', onAct);
    window.addEventListener('keydown', onAct);
    return () => {
      window.removeEventListener('pointerdown', onAct);
      window.removeEventListener('keydown', onAct);
    };
  }, []);

  return (
    <div className="grid-bg relative flex min-h-screen flex-col gap-3 p-3 lg:h-screen lg:gap-4 lg:overflow-hidden lg:p-4">
      <ParticleField />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 lg:gap-4">
        <Header />

        <div className="flex min-h-0 flex-1 gap-4">
          {/* Left sidebar — laptop / desktop only */}
          <aside className="hidden w-[300px] shrink-0 flex-col gap-4 overflow-y-auto pr-0.5 lg:flex xl:w-[320px]">
            <Pomodoro />
            <BoardDonut />
            <BookmarkDock />
          </aside>

          {/* Center workspace: Board / Projects / Brain Dump */}
          <Workspace />

          {/* Right sidebar — large screens only */}
          <aside className="hidden w-[320px] shrink-0 flex-col gap-4 xl:flex">
            <WeeklyChart />
            <ActivityFeed />
          </aside>
        </div>
      </div>
    </div>
  );
}
