<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — next dev (Turbopack). Regenerates the block above; commit it, don't fight it.
- `npm run lint` — eslint (flat config, lints whole repo). **Currently exits 1**: pre-existing `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`. Not your regression; don't silently rewrite vendored shadcn files to fix it.
- No test suite and no typecheck script. Typecheck with `npx tsc --noEmit` (passes today).
- Verify with `npx tsc --noEmit` then `npm run lint`. `npm run build` works but is slow; use only when dev-server behavior matters.

## Stack facts that will trip you up

- **Next 16.4.5 / React 19.3 / TS strict.** See the block at top for docs location.
- **React Compiler is on** (`reactCompiler: true` in `next.config.ts`). Keep render functions pure; don't add manual `memo`/`useMemo`/`useCallback`.
- **`cacheComponents: true`** — Next's caching/async-component model differs from older Next. Check `node_modules/next/dist/docs/` before adding data fetching or route handlers.
- **Tailwind CSS v4, no `tailwind.config`.** Theme/tokens live in `src/app/globals.css` (`@theme`, CSS variables). CSS is wired via the `@tailwindcss/turbopack` loader rule in `next.config.ts` — don't add a config file.
- **shadcn style is `base-nova`** (`components.json`): components build on `@base-ui/react`, **not Radix**. Don't paste Radix-based shadcn snippets from older tutorials. Add components with `npx shadcn add <name>`; existing files under `src/components/ui/` are vendored output.
- **`cn` comes from the `cn` npm package** — `src/lib/utils.ts` is just `export { cn } from "cn"`. Don't replace it with the clsx/tailwind-merge recipe.
- Path alias `@/*` → `./src/*`. App Router entrypoints are `src/app/layout.tsx` and `src/app/page.tsx` (README still says `app/page.tsx` — trust the code).

## Repo state

Early scaffold: single `Initial commit from Create Next App`, with shadcn init applied on top (uncommitted at time of writing). No CI, no `.env`, no formatter — eslint + tsc are the only automated checks. README is stock boilerplate.
