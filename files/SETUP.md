# Command Centre — Build Setup Sequence

Everything below is in copy-paste order. Work top to bottom. Each
section says what it does and what you should see before moving on.

You'll be working in **Claude Code** on your Mac. Have the four files
from tonight ready (they're in your downloads):

- `types-index.ts`      → becomes `src/types/index.ts`
- `lib-supabase.ts`     → becomes `src/lib/supabase.ts`
- `store-useAppStore.ts`→ becomes `src/store/useAppStore.ts`
- `index.css`           → becomes `src/index.css` (replaces the default)

────────────────────────────────────────────────────────────
## 0. Prerequisite check
────────────────────────────────────────────────────────────

```bash
node --version
```

Must be **v18 or higher**. If lower or missing:
```bash
brew install node
```

────────────────────────────────────────────────────────────
## 1. Scaffold the project
────────────────────────────────────────────────────────────

```bash
npm create vite@latest command-centre -- --template react-ts
cd command-centre
npm install
```

Quick sanity check that it runs:
```bash
npm run dev
```
Open the printed URL (usually http://localhost:5173). You should see
the default Vite + React page. Press **Ctrl+C** to stop the server.

────────────────────────────────────────────────────────────
## 2. Install Tailwind CSS v4
────────────────────────────────────────────────────────────

```bash
npm install tailwindcss @tailwindcss/vite
```

Tailwind v4 uses a Vite plugin — no `tailwind.config.js`, no
`postcss.config.js`. All tokens live in `src/index.css` (the file
you already have).

────────────────────────────────────────────────────────────
## 3. Install app dependencies
────────────────────────────────────────────────────────────

```bash
npm install zustand
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install framer-motion
npm install lucide-react
```

What each is for:
- **zustand** — the store (file already written)
- **@dnd-kit/** — drag & drop for the board
- **framer-motion** — page transitions, card animations, modal sheets
- **lucide-react** — icon set

────────────────────────────────────────────────────────────
## 4. Configure the path alias `@/`
────────────────────────────────────────────────────────────

Your files import from `@/types`, `@/lib/supabase`, `@/store/...`.
Two files need editing.

### 4a. `tsconfig.json`
Add `baseUrl` and `paths` inside `compilerOptions`:

```jsonc
{
  "compilerOptions": {
    // ...existing options...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

If your scaffold split config into `tsconfig.app.json`, add the same
`baseUrl` + `paths` block there too.

### 4b. `vite.config.ts`
Replace the whole file with:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  // IMPORTANT for GitHub Pages: must match your repo name exactly
  base: '/Command-Centre/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

You may need the Node types for `path`:
```bash
npm install -D @types/node
```

────────────────────────────────────────────────────────────
## 5. Drop in the four foundation files
────────────────────────────────────────────────────────────

Create the folders and move the files in. From the project root:

```bash
mkdir -p src/types src/lib src/store
```

Then place each downloaded file (rename as you go):

```bash
# adjust the source path to wherever your downloads are
cp ~/Downloads/types-index.ts        src/types/index.ts
cp ~/Downloads/lib-supabase.ts        src/lib/supabase.ts
cp ~/Downloads/store-useAppStore.ts   src/store/useAppStore.ts
cp ~/Downloads/index.css              src/index.css
```

(Or just drag them into the right folders in your editor and rename.)

`src/index.css` REPLACES the default Vite one entirely.

Make sure `src/main.tsx` imports the CSS — it usually already has:
```ts
import './index.css';
```
If it says `import './App.css'` instead, change/add the index.css line.

────────────────────────────────────────────────────────────
## 6. First smoke test — wire the store to a throwaway App
────────────────────────────────────────────────────────────

Replace `src/App.tsx` with this temporary test to confirm the data
layer works end-to-end (loads your real tasks from Supabase):

```tsx
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const init = useAppStore((s) => s.init);
  const ready = useAppStore((s) => s.ready);
  const tasks = useAppStore((s) => s.tasks);
  const buckets = useAppStore((s) => s.buckets);

  useEffect(() => {
    init();
  }, [init]);

  if (!ready) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'DM Sans, sans-serif' }}>
      <h1>Command Centre — data layer test</h1>
      <p><strong>{tasks.length}</strong> tasks loaded from Supabase</p>
      <p><strong>{buckets.length}</strong> buckets: {buckets.map((b) => b.title).join(', ')}</p>
      <hr />
      <ul>
        {tasks.slice(0, 30).map((t) => (
          <li key={t.id}>
            [{t.cat}] {t.text} — <em>{t.pri}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Run it:
```bash
npm run dev
```

✅ **Success looks like:** "29 tasks loaded from Supabase" (or whatever
your current count is) and a list of your real tasks. If you see that,
the entire data layer — types, sync, store — is working. The hard part
is proven before any UI exists.

❌ If it says 0 tasks: open the browser console. Most likely a path
alias issue (step 4) or a typo in a filename. The `normalise()` layer
won't throw — it degrades to empty — so check the Network tab for the
Supabase request and confirm it returned your row.

────────────────────────────────────────────────────────────
## 7. (Optional now, needed later) shadcn/ui
────────────────────────────────────────────────────────────

We'll add this when we start building polished components (dialogs,
selects, dropdowns). You can run it tomorrow when we get there:

```bash
npx shadcn@latest init
```
Choose: New York style, Slate base colour, CSS variables yes.
Then add components as needed, e.g.:
```bash
npx shadcn@latest add dialog select dropdown-menu checkbox
```

Don't run this until we're building the components that use it — no
point cluttering the project early.

────────────────────────────────────────────────────────────
## 8. GitHub Pages deploy (when ready to ship)
────────────────────────────────────────────────────────────

```bash
npm install -D gh-pages
```

Add to `package.json` scripts:
```jsonc
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "deploy": "npm run build && gh-pages -d dist"
}
```

Then to publish:
```bash
npm run deploy
```

This builds to `dist/` and pushes it to the `gh-pages` branch — same
URL you have now (luc1on.github.io/Command-Centre). The `base` path in
vite.config.ts MUST match the repo name or assets 404.

────────────────────────────────────────────────────────────
## Order of play tomorrow
────────────────────────────────────────────────────────────

1. Steps 1–5  → project scaffolded, deps in, files placed (~10 min)
2. Step 6     → smoke test, confirm your tasks load (the big green light)
3. Come back to chat → we build components in this order:
   - Layout shell (Sidebar + Topbar + theme toggle)
   - Dashboard (Work + Personal views)
   - Task board (dnd-kit)
   - Card modal
   - Focus mode
   - Projects, check-in, recurring, brain dump

Each component reads from the store you already have. From here it's
pure UI — no more plumbing.
