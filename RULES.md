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

With the "One Page Every Day" workflow, you **MUST** use the centralized component library to avoid copying raw Tailwind strings.

### The `<PageHeader>` Component
Always use this at the top of every new page to provide a consistent back button, icon container, and title.
```tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { BoxSelect } from "lucide-react";

<PageHeader 
  title="Page Title" 
  subtitle="OPTIONAL SUBTITLE" 
  icon={<BoxSelect className="w-5 h-5" />} 
  iconClass="bg-rose-600 text-white" 
  shadowClass="shadow-[0_4px_0_0_#E11D48]" 
/>
```

### The `<NeoBlock>` Component
The primary wrapper for all structured content. It enforces sharp 90-degree corners, standardized borders, and solid shadow offsets.
```tsx
import { NeoBlock } from "@/components/ui/NeoBlock";

<NeoBlock shadowClass="shadow-[8px_8px_0_0_#10B981]" className="p-8">
  <h2 className="text-2xl font-black uppercase">Card Header</h2>
  <p className="font-bold text-zinc-600 dark:text-zinc-400 mt-4">
    Content goes here.
  </p>
</NeoBlock>
```
*Note: Pass `noPadding` to remove default padding.*

### The `<NeoButton>` Component
A tactile button element that automatically handles physics-based click state translation (`hover:-translate-y-1` and `active:translate-y-1`).
```tsx
import { NeoButton } from "@/components/ui/NeoButton";
import { RocketIcon } from "lucide-react";

<NeoButton onClick={handleClick} variant="primary" className="py-4 text-xl flex items-center gap-3">
  <RocketIcon className="w-6 h-6 stroke-[3]" />
  Deploy Project
</NeoButton>
```
*Variants available: `primary`, `danger`, `success`, `outline`.*

---

## 7. Development & Deployment Workflow

When developing new features or adding your "One Page Every Day", follow this standard workflow to ensure stability:

1. **Develop Locally**
   Run the development server to test your changes in real-time.
   ```bash
   npm run dev
   ```

2. **Verify Types & Build**
   Before committing your code, **ALWAYS** run the production build process. This guarantees that there are no hidden TypeScript or Next.js compilation errors. If the build fails, do not push!
   ```bash
   npm run build
   ```

3. **Commit & Push**
   Once the build succeeds locally, you can safely commit and push your changes.
   ```bash
   git add .
   git commit -m "feat: added new page and updated components"
   git push origin main
   ```
   *Note: Pushing to the `main` branch will automatically trigger a Vercel deployment.*

---

## 8. Navigation & Menu System

When you add a new page (e.g., a new game or tool), you need to make it accessible from the Home Page.

The entire navigation and featured sections are centrally located in:
**`src/app/page.tsx`**

To add your new page to the menu, open `src/app/page.tsx` and find the relevant data arrays near the top of the `Home` component. Add a new object to the array:

- **For a new Tool:**
  Add to the `tools` array:
  ```typescript
  { name: "New Tool", href: "/tools/new-tool", icon: <Wrench className="w-5 h-5" /> }
  ```
- **For a new Game:**
  Add to the `games` array:
  ```typescript
  { name: "New Game", href: "/games/new-game", icon: <Gamepad2 className="w-5 h-5" /> }
  ```
- **To feature it in the large cards at the bottom:**
  Add to the `projects` array:
  ```typescript
  {
    name: "New Page",
    description: "What this page does",
    tags: ["React", "New"],
    color: "bg-teal-500", // Pick a vibrant color
    href: "/path/to/page",
  }
  ```

Adding the object to these arrays will automatically render it in both the Top Navbar Checkdowns, the Mobile Menu, and the Featured Cards!
