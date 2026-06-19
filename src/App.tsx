import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Layout/Sidebar';
import { TopBar } from '@/components/Layout/TopBar';
import { IntelligenceRail } from '@/components/Layout/IntelligenceRail';
import { TodayView } from '@/components/Today/TodayView';
import { TasksView } from '@/components/Tasks/TasksView';
import { ProjectDetail } from '@/components/Projects/ProjectDetail';
import { InsightsView } from '@/components/Insights/InsightsView';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { AIAssistant } from '@/components/AI/AIAssistant';
import { FocusMode } from '@/components/Focus/FocusMode';
import { CommandPalette } from '@/components/CommandPalette';
import { Placeholder } from '@/components/UI/Placeholder';
import { MobileHome } from '@/components/Mobile/MobileHome';
import { BottomTabs } from '@/components/Mobile/BottomTabs';
import type { MobileTab } from '@/components/Mobile/BottomTabs';
import { MobileMore } from '@/components/Mobile/MobileMore';
import { personalNav } from '@/data/mockData';
import type { ScreenId } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const initStore = useAppStore((s) => s.init);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [screen, setScreen] = useState<ScreenId>('today');
  const [focusActive, setFocusActive] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // Load real data from Supabase once on mount
  useEffect(() => {
    initStore();
  }, [initStore]);

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // ⌘K / Ctrl-K toggles the command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigate = (id: ScreenId) => {
    if (id === 'focus') {
      setFocusActive(true);
      return;
    }
    setScreen(id);
  };

  const startFocus = () => setFocusActive(true);
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const renderScreen = () => {
    switch (screen) {
      case 'today':
        return <TodayView onStartFocus={startFocus} />;
      case 'tasks':
        return <TasksView />;
      case 'projects':
        return <ProjectDetail />;
      case 'insights':
        return <InsightsView />;
      case 'calendar':
        return <CalendarView />;
      case 'ai':
        return <AIAssistant />;
      default: {
        const item = personalNav.find((n) => n.id === screen);
        return item ? <Placeholder icon={item.icon} title={item.label} /> : <TodayView onStartFocus={startFocus} />;
      }
    }
  };

  const mobileTab: MobileTab =
    screen === 'tasks' ? 'tasks' : screen === 'projects' ? 'projects' : screen === 'calendar' ? 'calendar' : screen === 'today' ? 'home' : 'more';

  const onMobileTab = (t: MobileTab) => {
    if (t === 'home') setScreen('today');
    else if (t === 'tasks') setScreen('tasks');
    else if (t === 'projects') setScreen('projects');
    else if (t === 'calendar') setScreen('calendar');
    else setMoreOpen(true);
  };

  return (
    <div className="h-screen bg-bg font-sans text-text">
      {/* Focus Mode takes over the whole screen */}
      <AnimatePresence>{focusActive && <FocusMode onEnd={() => setFocusActive(false)} />}</AnimatePresence>

      {/* ─── Desktop ─── */}
      <div className="hidden h-screen lg:flex">
        <Sidebar current={screen} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar current={screen} onNavigate={navigate} onOpenPalette={() => setPaletteOpen(true)} />
          <div className="flex min-h-0 flex-1">
            <main className="flex-1 overflow-y-auto p-6">{renderScreen()}</main>
            {screen === 'today' && <IntelligenceRail />}
          </div>
        </div>
      </div>

      {/* ─── Mobile ─── */}
      <div className="flex h-screen flex-col lg:hidden">
        <div className="flex-1 overflow-y-auto">
          {screen === 'today' ? <MobileHome onStartFocus={startFocus} /> : <div className="p-4 pb-24">{renderScreen()}</div>}
        </div>
        <BottomTabs current={mobileTab} onChange={onMobileTab} />
        <AnimatePresence>
          {moreOpen && (
            <MobileMore
              onClose={() => setMoreOpen(false)}
              onNavigate={navigate}
              onStartFocus={startFocus}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Command palette (shared) */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
        onStartFocus={startFocus}
      />
    </div>
  );
}
