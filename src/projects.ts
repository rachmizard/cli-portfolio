// Project case-study data shown in the "Projects" file explorer.
// Double-clicking a project folder opens a ProjectWindow populated from here.

export interface StackGroup {
  label: string;
  items: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
  kind: "demo" | "source";
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  // Optional screenshot path under /public; null -> "preview not available" placeholder
  screenshot: string | null;
  summary: string;
  role: string;
  stack: StackGroup[];
  architecture: string[];
  features: string[];
  links: ProjectLink[];
}

export const PROJECTS: Record<string, Project> = {
  fintrack: {
    id: "fintrack",
    name: "FinTrack",
    tagline: "Personal finance tracker with a Telegram bot, built for Indonesian users",
    screenshot: null,
    summary:
      "FinTrack is a personal finance management web app designed for Indonesian users — track expenses, manage budgets, and record income through an intuitive web dashboard and a Telegram bot. It emphasizes simplicity, mobile-first design, and zero-cost, ad-free access.",
    role:
      "Product Owner & Squad Lead (Razim/Orkes). I direct development by writing detailed specs, breaking features into kanban tasks, and delegating implementation to a developer profile (Hermes agent). I review PRs, set priorities, and make architectural decisions — the brain to the developer's hands.",
    stack: [
      {
        label: "Frontend",
        items: ["Next.js 16 (App Router)", "React 19", "Tailwind CSS 4", "shadcn/ui", "GSAP", "Recharts"],
      },
      {
        label: "Backend",
        items: ["Next.js API Routes", "Drizzle ORM", "Turso (libSQL)", "Better Auth"],
      },
      {
        label: "Integrations",
        items: ["Telegram Bot", "Vercel Blob", "TanStack React Query", "TanStack React Table"],
      },
      {
        label: "Testing",
        items: ["Vitest", "Testing Library", "JSDOM"],
      },
    ],
    architecture: [
      "Route groups: (public)/ for landing & login, (app)/ for the authenticated dashboard with sidebar + mobile bottom nav",
      "Auth: Better Auth with session-based protection via an AuthGuard component",
      "Database: SQLite over Turso (libSQL), schema defined in src/lib/schema.ts",
      "State: TanStack Query with a factory-key pattern (src/lib/query-keys.ts)",
    ],
    features: [
      "Transaction tracking — CRUD for expenses/income with categories (makanan, transport, belanja, tagihan, hiburan, lainnya), merchants, dates, notes, and receipt attachments",
      "Receipt upload — bill/receipt images via Vercel Blob with AI-powered smart extraction of transaction data",
      "Telegram bot — track expenses by chatting, send receipt images, and pair accounts via chat, with a state machine for the multi-step extraction flow",
      "Budget management — set monthly budgets per category, view budget vs. actual, and track remaining balance",
      "Budget recommendations (Rekomendasi) — AI-driven suggestions from a dynamic questionnaire (income, savings target, debt, city, goals)",
      "Recurring transactions (Rutin) — templates for scheduled expenses (monthly/weekly/yearly) with auto/manual/reminder modes",
      "Partnerships — shared financial tracking for couples; create partnerships, invite members, and split shared vs. private transactions",
      "Pairing system — secure invite flow with expiring tokens, joinable via link or Telegram",
      "Interactive dashboard — GSAP-animated cards, Recharts category breakdowns, monthly summaries, spending trends, and a time-of-day greeting",
      "Mobile-responsive — bottom navbar on mobile, sidebar on desktop, with separate public and app layouts",
      "Landing page — hero, feature showcase, Telegram bot demo, dashboard preview, and CTA with GSAP scroll animations",
      "Authentication — Better Auth email/password, session management, and public vs. app route protection",
    ],
    links: [],
  },
};
