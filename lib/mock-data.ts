import { AIModel, Conversation, Message } from './types'

// Helper to create dates relative to now
function daysAgo(days: number, hours = 0): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(date.getHours() - hours)
  return date
}

// Provider colors
export const PROVIDER_COLORS = {
  OpenAI: '#10A37F',
  NVIDIA: '#76B900',
  Mistral: '#FF7000',
  DeepSeek: '#4D6EF5',
  Alibaba: '#9B59B6',
  Google: '#EA4335',
  Anthropic: '#D4A574',
} as const

// ─── Mock AI Models ───────────────────────────────────────────────────────────

export const mockModels: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description:
      'Most capable GPT-4 model with vision, audio, and advanced reasoning. Optimized for speed and multimodal tasks.',
    contextWindow: 128000,
    parameters: '1.8T',
    reasoningScore: 92,
    codingScore: 90,
    strengths: ['Reasoning', 'Multimodal', 'Code', 'Analysis'],
    providerColor: PROVIDER_COLORS.OpenAI,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description:
      'Balanced intelligence and speed with exceptional coding, analysis, and nuanced instruction following.',
    contextWindow: 200000,
    parameters: '175B',
    reasoningScore: 91,
    codingScore: 94,
    strengths: ['Code', 'Analysis', 'Writing', 'Reasoning'],
    providerColor: PROVIDER_COLORS.Anthropic,
  },
  {
    id: 'claude-4-7-opus',
    name: 'Claude 4.7 Opus',
    provider: 'Anthropic',
    description:
      'Next-generation flagship model with state-of-the-art coding, advanced reasoning, and deep analysis capabilities.',
    contextWindow: 200000,
    parameters: '500B',
    reasoningScore: 96,
    codingScore: 97,
    strengths: ['Reasoning', 'Code', 'Math', 'Synthesis'],
    providerColor: PROVIDER_COLORS.Anthropic,
  },
  {
    id: 'nemotron-ultra',
    name: 'Nemotron Ultra',
    provider: 'NVIDIA',
    description:
      'NVIDIA flagship model built for complex reasoning, code generation, and enterprise-grade workflows.',
    contextWindow: 128000,
    parameters: '340B',
    reasoningScore: 88,
    codingScore: 91,
    strengths: ['Code', 'Reasoning', 'Enterprise', 'Math'],
    providerColor: PROVIDER_COLORS.NVIDIA,
    isNew: true,
  },
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral',
    description:
      'Frontier-class model with strong multilingual support, function calling, and code generation capabilities.',
    contextWindow: 128000,
    parameters: '123B',
    reasoningScore: 85,
    codingScore: 87,
    strengths: ['Multilingual', 'Code', 'Function Calling', 'Reasoning'],
    providerColor: PROVIDER_COLORS.Mistral,
  },
  {
    id: 'qwen3-coder',
    name: 'Qwen3 Coder',
    provider: 'Alibaba',
    description:
      'Specialized coding model from Alibaba Cloud with exceptional performance on code generation, debugging, and refactoring.',
    contextWindow: 131072,
    parameters: '32B',
    reasoningScore: 78,
    codingScore: 93,
    strengths: ['Code', 'Debugging', 'Refactoring', 'Math'],
    providerColor: PROVIDER_COLORS.Alibaba,
    isNew: true,
  },
  {
    id: 'deepseek-r2',
    name: 'DeepSeek R2',
    provider: 'DeepSeek',
    description:
      'Advanced reasoning model excelling at complex math, logical deduction, and step-by-step problem solving.',
    contextWindow: 128000,
    parameters: '671B',
    reasoningScore: 95,
    codingScore: 88,
    strengths: ['Reasoning', 'Math', 'Logic', 'Code'],
    providerColor: PROVIDER_COLORS.DeepSeek,
    isNew: true,
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description:
      'Google DeepMind flagship with native multimodality, long context, and state-of-the-art reasoning across domains.',
    contextWindow: 1000000,
    parameters: '1.5T',
    reasoningScore: 93,
    codingScore: 89,
    strengths: ['Multimodal', 'Long Context', 'Reasoning', 'Code'],
    providerColor: PROVIDER_COLORS.Google,
  },
  {
    id: 'llama-3-1-405b',
    name: 'Llama 3.1 405B',
    provider: 'NVIDIA',
    description:
      'Meta open-weight model hosted on NVIDIA infrastructure. Strong general-purpose capabilities with open research access.',
    contextWindow: 128000,
    parameters: '405B',
    reasoningScore: 84,
    codingScore: 83,
    strengths: ['Open Source', 'Reasoning', 'Code', 'General'],
    providerColor: PROVIDER_COLORS.NVIDIA,
  },
]

// ─── Mock Messages ────────────────────────────────────────────────────────────

function createMessage(
  id: string,
  role: 'user' | 'assistant',
  content: string,
  minutesAgo: number
): Message {
  const timestamp = new Date()
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)
  return { id, role, content, timestamp }
}

// ─── Mock Conversations ───────────────────────────────────────────────────────

const rawConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'React Server Components Architecture',
    modelId: 'gpt-4o',
    isPinned: true,
    createdAt: daysAgo(0, 3),
    updatedAt: daysAgo(0, 1),
    messages: [
      createMessage(
        'msg-1-1',
        'user',
        'Can you explain the mental model for React Server Components? I\'m confused about when to use "use client" vs keeping things on the server.',
        180
      ),
      createMessage(
        'msg-1-2',
        'assistant',
        'React Server Components (RSC) introduce a new mental model where components are server-first by default. Here\'s how to think about it:\n\n**Server Components** (default):\n- Run only on the server\n- Can directly access databases, file systems, and APIs\n- Cannot use hooks like useState or useEffect\n- Cannot attach event handlers\n- Their code never ships to the client bundle\n\n**Client Components** ("use client"):\n- Run on both server (for SSR) and client\n- Can use hooks, state, and effects\n- Can handle user interactions\n- Their code is included in the client bundle\n\n**Rule of thumb**: Start with Server Components. Only add "use client" when you need interactivity, browser APIs, or React hooks.',
        175
      ),
      createMessage(
        'msg-1-3',
        'user',
        'What about data fetching patterns? Should I use fetch in server components or still use React Query?',
        120
      ),
      createMessage(
        'msg-1-4',
        'assistant',
        'Great question. In the RSC model, data fetching changes significantly:\n\n**In Server Components**: Use `async/await` directly. You can fetch data at the component level without any library:\n\n```tsx\nasync function UserProfile({ id }: { id: string }) {\n  const user = await db.user.findUnique({ where: { id } })\n  return <div>{user.name}</div>\n}\n```\n\n**When to still use React Query/SWR**:\n- Client-side mutations with optimistic updates\n- Real-time data that needs polling or WebSocket sync\n- Infinite scroll / pagination with client state\n- Data that changes based on user interaction without navigation\n\nThe pattern is: fetch initial data on the server, hydrate to the client, and use React Query only for client-side state that needs reactivity.',
        115
      ),
    ],
  },
  {
    id: 'conv-2',
    title: 'Building a Custom Design System',
    modelId: 'claude-3-5-sonnet',
    isPinned: true,
    createdAt: daysAgo(0, 5),
    updatedAt: daysAgo(0, 2),
    messages: [
      createMessage(
        'msg-2-1',
        'user',
        'I want to build a design system with Tailwind CSS and Radix UI primitives. What architecture would you recommend?',
        300
      ),
      createMessage(
        'msg-2-2',
        'assistant',
        'Here\'s an architecture I\'d recommend for a Tailwind + Radix design system:\n\n**Layer Structure**:\n\n1. **Tokens Layer** (`tokens/`)\n   - CSS custom properties for colors, spacing, typography\n   - Dark/light theme definitions\n   - Animation timing presets\n\n2. **Primitives Layer** (`primitives/`)\n   - Thin wrappers around Radix UI components\n   - Add your styling conventions (CVA variants)\n   - Handle accessibility out of the box\n\n3. **Components Layer** (`components/`)\n   - Composed from primitives\n   - Business-logic aware\n   - App-specific patterns\n\n**Key tools**:\n- `class-variance-authority` (CVA) for variant management\n- `tailwind-merge` for class deduplication\n- `clsx` for conditional classes\n\nThis gives you unstyled accessibility from Radix, utility-first styling from Tailwind, and type-safe variants from CVA.',
        295
      ),
      createMessage(
        'msg-2-3',
        'user',
        'How should I handle the theme token system? CSS variables vs Tailwind config?',
        240
      ),
      createMessage(
        'msg-2-4',
        'assistant',
        'CSS custom properties are the way to go for theming. Here\'s why and how:\n\n**CSS Variables > Tailwind Config for themes**:\n- Runtime switchable (no rebuild needed)\n- Can be scoped to sub-trees\n- Work with any CSS property, not just Tailwind utilities\n- Composable with opacity modifiers\n\n**Implementation pattern**:\n\n```css\n:root {\n  --color-surface-1: 220 14% 10%;\n  --color-accent: 258 100% 71%;\n}\n\n[data-theme=\"light\"] {\n  --color-surface-1: 220 14% 98%;\n  --color-accent: 252 80% 62%;\n}\n```\n\nThen reference in Tailwind:\n```tsx\n<div className=\"bg-[hsl(var(--color-surface-1))]\">\n```\n\nOr extend your Tailwind theme to map these variables to semantic names. This approach scales well and supports runtime theme switching without any JS re-renders.',
        235
      ),
      createMessage(
        'msg-2-5',
        'user',
        'Perfect. What about animation tokens? Should those be CSS variables too?',
        180
      ),
      createMessage(
        'msg-2-6',
        'assistant',
        'For animations, I\'d use a hybrid approach:\n\n**CSS Variables for**:\n- Transition durations (`--duration-fast: 150ms`)\n- Easing curves (`--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)`)\n- These let you adjust timing globally\n\n**JavaScript constants for**:\n- Framer Motion spring configs (`{ stiffness: 300, damping: 30 }`)\n- Complex orchestration sequences\n- Gesture-driven animations\n\n**Recommended preset structure**:\n```typescript\nexport const springs = {\n  panel: { stiffness: 300, damping: 30 },\n  popup: { stiffness: 400, damping: 28 },\n  message: { stiffness: 260, damping: 25 },\n  micro: { stiffness: 500, damping: 30 },\n}\n```\n\nThis gives you the best of both worlds: CSS handles simple transitions, and Framer Motion handles physics-based springs and complex sequences.',
        175
      ),
    ],
  },
  {
    id: 'conv-3',
    title: 'Optimizing TypeScript Build Performance',
    modelId: 'deepseek-r2',
    isPinned: false,
    createdAt: daysAgo(1, 4),
    updatedAt: daysAgo(1, 2),
    messages: [
      createMessage(
        'msg-3-1',
        'user',
        'Our TypeScript project takes 45 seconds to type-check. The codebase is about 200k lines. What can we do?',
        1560
      ),
      createMessage(
        'msg-3-2',
        'assistant',
        'A 45-second type-check for 200k lines suggests some specific bottlenecks. Here\'s a systematic approach:\n\n**Quick Wins** (try first):\n1. Enable `skipLibCheck: true` — skips checking node_modules declarations\n2. Use project references (`composite: true`) to enable incremental builds across packages\n3. Check for deeply nested conditional types — these are exponential-time for the checker\n\n**Structural Improvements**:\n4. Split into project references (monorepo-style) so only changed packages re-check\n5. Avoid barrel files (`index.ts` re-exports) — they create import chains the checker must resolve\n6. Use `isolatedDeclarations: true` (TS 5.5+) for parallel declaration emit\n\n**Detection**:\n```bash\ntsc --diagnostics --extendedDiagnostics\n```\nThis shows time spent per phase. If "Check" dominates, it\'s type complexity. If "Program" dominates, it\'s file resolution.\n\n**The #1 culprit in most codebases**: Overly generic utility types composed 4-5 levels deep. Simplify those first.',
        1555
      ),
      createMessage(
        'msg-3-3',
        'user',
        'We have a lot of Zod schemas that infer types. Could that be contributing?',
        1500
      ),
      createMessage(
        'msg-3-4',
        'assistant',
        'Yes — Zod\'s `z.infer<typeof schema>` is a known contributor to slow type-checking in large codebases. Here\'s why and what to do:\n\n**Why Zod is expensive**:\n- Each `z.infer` triggers deep recursive type resolution\n- Chained methods (`.transform()`, `.refine()`, `.pipe()`) create nested conditional types\n- The compiler can\'t cache intermediate results across files\n\n**Mitigations**:\n\n1. **Extract explicit types alongside schemas**:\n```typescript\n// Instead of using z.infer everywhere:\nexport interface User {\n  id: string\n  name: string\n  email: string\n}\nexport const userSchema = z.object({...}) satisfies z.ZodType<User>\n```\n\n2. **Limit inference depth**: Avoid chaining more than 3-4 Zod methods\n\n3. **Lazy evaluation**: Use `z.lazy()` only when actually needed for recursion\n\n4. **Consider alternatives for pure validation**: If you don\'t need runtime validation everywhere, use plain TypeScript types and validate at boundaries only\n\nMeasure with `tsc --generateTrace ./trace` and inspect in `chrome://tracing` to see exactly which files/types are slowest.',
        1495
      ),
    ],
  },
  {
    id: 'conv-4',
    title: 'Deploying to Edge Functions',
    modelId: 'gemini-2-5-pro',
    isPinned: false,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    messages: [
      createMessage(
        'msg-4-1',
        'user',
        'What are the key constraints when deploying to edge functions vs traditional serverless?',
        4380
      ),
      createMessage(
        'msg-4-2',
        'assistant',
        'Edge functions have distinct constraints compared to traditional serverless (Lambda/Cloud Functions):\n\n**Runtime Limitations**:\n- No Node.js APIs (no `fs`, `path`, `child_process`)\n- Limited to Web Standard APIs (Fetch, Crypto, Streams)\n- Smaller memory limits (typically 128MB vs 10GB)\n- Shorter execution time (30s vs 15min)\n- No native modules or compiled binaries\n\n**Bundle Constraints**:\n- Strict size limits (1-10MB depending on provider)\n- Must tree-shake aggressively\n- Some npm packages won\'t work (anything using Node-specific APIs)\n\n**Benefits you gain**:\n- Sub-10ms cold starts (vs 100ms-1s for Lambda)\n- Global distribution (runs at 200+ PoPs)\n- Lower latency for users worldwide\n- Simpler pricing model\n\n**What works well at the edge**:\n- Auth/token validation\n- A/B testing / feature flags\n- API response transformation\n- Personalization headers\n- Rate limiting\n\n**What doesn\'t**:\n- Heavy computation\n- Database connections (use HTTP-based DB clients)\n- File processing\n- Long-running tasks',
        4375
      ),
      createMessage(
        'msg-4-3',
        'user',
        'Can I use Prisma at the edge?',
        4320
      ),
      createMessage(
        'msg-4-4',
        'assistant',
        'Yes, but with caveats. Prisma has evolved its edge story:\n\n**Prisma at the Edge (current state)**:\n\n1. **Prisma Accelerate** (recommended):\n   - HTTP-based connection pooler\n   - Works on all edge runtimes\n   - Adds ~10-20ms latency per query (connection pool overhead)\n   - Managed service with caching layer\n\n2. **Driver Adapters**:\n   - `@prisma/adapter-neon` for Neon (WebSocket)\n   - `@prisma/adapter-planetscale` for PlanetScale (HTTP)\n   - `@prisma/adapter-d1` for Cloudflare D1\n\n**Setup example (Neon)**:\n```typescript\nimport { PrismaNeon } from \'@prisma/adapter-neon\'\nimport { Pool } from \'@neondatabase/serverless\'\n\nconst pool = new Pool({ connectionString: env.DATABASE_URL })\nconst adapter = new PrismaNeon(pool)\nconst prisma = new PrismaClient({ adapter })\n```\n\n**Alternative**: For simple queries at the edge, consider using the database\'s HTTP API directly (Neon, Turso, PlanetScale all offer this) to avoid Prisma\'s bundle size (~200KB+).',
        4315
      ),
    ],
  },
  {
    id: 'conv-5',
    title: 'Animation Performance Best Practices',
    modelId: 'claude-3-5-sonnet',
    isPinned: false,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
    messages: [
      createMessage(
        'msg-5-1',
        'user',
        'My Framer Motion animations are causing jank on mobile. What should I check?',
        7500
      ),
      createMessage(
        'msg-5-2',
        'assistant',
        'Animation jank on mobile with Framer Motion usually comes from a few specific issues:\n\n**Top causes and fixes**:\n\n1. **Animating layout properties** (width, height, top, left):\n   - These trigger reflow → repaint → composite\n   - Fix: Use `transform` (x, y, scale, rotate) and `opacity` only\n   - Framer Motion maps `x`, `y`, `scale` to transforms automatically\n\n2. **Too many simultaneous animations**:\n   - Mobile GPUs have limited compositor layers\n   - Fix: Stagger animations, reduce concurrent animated elements\n   - Use `will-change: transform` sparingly (it allocates GPU memory)\n\n3. **AnimatePresence with complex exit animations**:\n   - Removing DOM nodes while animating is expensive\n   - Fix: Keep exit animations simple (opacity fade, short duration)\n\n4. **Large elements with `layout` prop**:\n   - Layout animations measure and animate between states\n   - Fix: Use `layoutId` only on small, isolated elements\n\n**Diagnostic steps**:\n```\nChrome DevTools → Performance tab → Record → Check for:\n- Long \"Recalculate Style\" blocks\n- \"Layout\" events during animation frames\n- Frame drops below 60fps\n```\n\n**Quick win**: Add `transform: translateZ(0)` or Framer Motion\'s `style={{ willChange: \"transform\" }}` to promote elements to their own compositor layer.',
        7495
      ),
      createMessage(
        'msg-5-3',
        'user',
        'What about the spring configs? Could overly bouncy springs cause issues?',
        7440
      ),
      createMessage(
        'msg-5-4',
        'assistant',
        'Yes, spring configuration directly impacts performance:\n\n**How springs affect performance**:\n- Lower damping = more oscillations = longer animation = more frames to render\n- Very low stiffness = slow convergence = animation runs for seconds\n- The spring solver runs every frame until the animation \"rests\"\n\n**Performance-optimized spring presets**:\n```typescript\n// Fast, minimal overshoot (best for mobile)\nconst snappy = { stiffness: 500, damping: 30 }\n\n// Smooth with slight bounce (good default)\nconst smooth = { stiffness: 300, damping: 28 }\n\n// Avoid on mobile:\nconst bouncy = { stiffness: 100, damping: 10 } // oscillates for 2+ seconds\n```\n\n**Rules of thumb**:\n- Keep `damping` above 20 for mobile\n- `stiffness` between 200-500 for responsive feel\n- Set `restDelta: 0.01` to stop the spring early when movement is imperceptible\n- Use `restSpeed: 0.01` to prevent lingering micro-oscillations\n\n**Pro tip**: On mobile, you can detect device performance and swap to simpler duration-based transitions:\n```typescript\nconst prefersReducedMotion = window.matchMedia(\'(prefers-reduced-motion: reduce)\').matches\n```',
        7435
      ),
    ],
  },
  {
    id: 'conv-6',
    title: 'Understanding Transformer Attention',
    modelId: 'deepseek-r2',
    isPinned: false,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(9),
    messages: [
      createMessage(
        'msg-6-1',
        'user',
        'Explain multi-head attention intuitively. I get single attention but not why we need multiple heads.',
        14000
      ),
      createMessage(
        'msg-6-2',
        'assistant',
        'Here\'s an intuitive way to understand multi-head attention:\n\n**Single attention head** = one \"question\" about the input:\n- It learns ONE type of relationship pattern\n- Example: \"which words are syntactically related to this word?\"\n\n**Multi-head attention** = asking MULTIPLE questions simultaneously:\n- Head 1: \"What\'s the syntactic subject of this verb?\"\n- Head 2: \"What coreferences point to this noun?\"\n- Head 3: \"What\'s the semantic role (agent, patient)?\"\n- Head 4: \"What positional patterns matter here?\"\n\n**Analogy**: Think of reading a sentence as a detective.\n- One detective only looks for WHO (subjects/objects)\n- Another only looks for WHEN (temporal relationships)\n- Another only looks for WHY (causal connections)\n- Together, they understand the full picture\n\n**Mechanically**:\n- Each head has its own Q, K, V projection matrices (smaller dimension)\n- They attend to the same input but in different learned subspaces\n- Their outputs are concatenated and projected back\n\n**Why it helps**: A single attention head with the same total parameters would create a blended, averaged pattern. Multiple smaller heads can each specialize in distinct linguistic or semantic features without interfering with each other.\n\nThe key insight: attention patterns are not universal. Different positions in a sequence need different types of context, and heads specialize to provide that diversity.',
        13995
      ),
      createMessage(
        'msg-6-3',
        'user',
        'Makes sense. How does this relate to the context window size?',
        13900
      ),
      createMessage(
        'msg-6-4',
        'assistant',
        'Context window and attention are deeply connected:\n\n**The computational relationship**:\n- Standard attention is O(n²) where n = sequence length (context window)\n- Each token attends to ALL other tokens\n- Doubling context window = 4x memory and compute\n\n**Why this matters for context windows**:\n- 4K context (GPT-3): ~16M attention computations per layer\n- 128K context (GPT-4o): ~16B attention computations per layer\n- 1M context (Gemini): ~1T attention computations per layer\n\n**How models handle long context**:\n\n1. **Sparse attention** (Mistral\'s sliding window):\n   - Each token only attends to nearby tokens + selected distant ones\n   - Reduces O(n²) to O(n·k) where k is window size\n\n2. **Multi-scale heads**:\n   - Some heads attend locally (syntax)\n   - Other heads attend globally (semantics)\n   - Naturally supports long-range dependencies\n\n3. **RoPE** (Rotary Position Embeddings):\n   - Encodes relative position in the attention computation\n   - Can extrapolate beyond training length\n   - Used by Llama, Qwen, and most modern models\n\n**The practical limit**: Even with optimizations, models struggle to equally attend to all parts of very long contexts. Information in the \"middle\" of long contexts is often less accurately recalled than the beginning or end.',
        13895
      ),
    ],
  },
]

export const mockConversations: Conversation[] = rawConversations.map(conv => ({
  ...conv,
  messages: conv.messages.map(msg => ({
    ...msg,
    modelId: conv.modelId,
    tokens: msg.tokens ?? Math.max(1, Math.round(msg.content.length / 4.2))
  }))
}))

