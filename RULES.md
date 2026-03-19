# Portfolio Design Guidelines & Rules

This project adheres to a **"Vibrant & Block-based" (Neo-Brutalist)** UI/UX design philosophy. When adding new pages or components, strict adherence to these rules ensures visual consistency and structural coherence throughout the portfolio ecosystem.

## 1. Core Philosophy
- **High Contrast:** Elements must stand out intensely against the background.
- **Geometric & Structural:** Favor sharp edges, square containers, and visible structural lines over soft rounded corners and blurred drop-shadows.
- **Bold Aesthetics:** Utilize heavy font weights and highly saturated accent colors for maximum visual emphasis.

## 2. Typography
- **Primary Font:** `Space Grotesk` (configured globally via Next.js `next/font/google`).
- **Headers:** Use heavy font weights (`font-black`, `font-bold`). Apply `uppercase` and `tracking-[widest|tight]` styling for hierarchical accents.
- **Colors:** 
  - Primary text: `text-zinc-900` (light mode) / `text-zinc-50` (dark mode). 
  - Secondary/metadata text: `text-zinc-600` / `text-zinc-400`.

## 3. Color System
- **Backgrounds:** `bg-zinc-50` for light mode bodies, `bg-zinc-950` for dark mode bodies.
- **Canvas/Structure:** Blocks default to `bg-white` (light) and `bg-zinc-900` (dark).
- **Borders:** Structural borders use `border-zinc-900` (light) and `border-zinc-100` (dark).
- **Accents:** Use vibrant, highly-saturated colors (`emerald-500`, `blue-600`, `purple-500`, `rose-500`, `amber-500`) for hierarchy, interaction states, and solid shadows. Do not use soft or muted generic transparent CSS gradients.

## 4. Components & Blocks
All structural containers (cards, grid items, dashboard widgets) must follow this pattern:
- **Borders:** Standardize on bold outlines like `border-2`, `border-4` or structural separators like `border-b-4`.
- **Shadows (Neo-Brutalist):** Use hard, zero-blur pixel offsets.
  - *Standard example:* `shadow-[6px_6px_0_0_#18181b]` dark mode `shadow-[6px_6px_0_0_#fafafa]`
  - *Colored example:* `shadow-[8px_8px_0_0_#3B82F6]`
- **Corners:** Avoid `rounded-*` classes. Preserve standard 90-degree sharp corners to maintain the blocky architectural feel.

## 5. Interactivity & Motion
Tactile feedback is critical. Elements that can be interacted with (buttons, project cards, navigation links) must mimic physical buttons:
- **Hover:** Add translational offset using `hover:-translate-y-1 hover:translate-x-1` alongside an increased shadow distance (e.g., `hover:shadow-[10px_10px_0_0_#18181b]`).
- **Active (Click):** The element must visually "depress" into the page. Apply `active:translate-y-1 active:translate-x-1 active:shadow-none`.
- **Transitions:** Use fast, mechanical timing: `transition-all duration-200` to `duration-300` for crisp feedback.

## 6. Iconography
- **No Inline Emojis:** Do not use raw OS-level text emojis (e.g., 🚀, 💡) within the UI.
- **Library:** Utilize SVG components exclusively from the `lucide-react` package.
- **Styling:** Whenever viable, house icons within small contrasting geometric blocks when used as header anchors (e.g., a `w-10 h-10` container with `border-2`, a vibrant background, and a raw `2px` solid drop-shadow).

---

## Technical Component Examples

### The "Block" Button
```tsx
<button className="px-8 py-4 bg-blue-600 text-white font-black text-xl uppercase tracking-wider
  border-4 border-zinc-900 dark:border-zinc-100 
  shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] 
  hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#18181b] dark:hover:shadow-[10px_10px_0_0_#fafafa] 
  active:translate-y-1 active:translate-x-1 active:shadow-none 
  transition-all duration-200 flex items-center justify-center gap-3">
  <RocketIcon className="w-6 h-6 stroke-[3]" />
  Deploy Project
</button>
```

### The "Container" Card
```tsx
<div className="p-8 bg-white dark:bg-zinc-900 
  border-4 border-zinc-900 dark:border-zinc-100 
  shadow-[8px_8px_0_0_#10B981] 
  flex flex-col gap-4">
  <h2 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-50">
    Card Header
  </h2>
  <p className="font-bold text-zinc-600 dark:text-zinc-400">
    This outlines the contents of the structural module block.
  </p>
</div>
```
