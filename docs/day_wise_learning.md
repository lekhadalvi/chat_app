# Day-Wise Learning Log

This document details the step-by-step progress, key milestones, and iterative lessons learned throughout each phase of the project.

---

## 📅 Phase 1: Setup, Brand Identity & Auth Views
### Milestones
- Initialized the Next.js TypeScript project.
- Configured theme values, custom fonts (`Lilita One`), and core colors (Zap Yellow, Zap Pink, Zap Cyan) in `tailwind.config.ts`.
- Built the Neo-Brutalist login card with paper-stack shadows, input fields, and social authentication buttons.
- Developed the wobbly, floating heart spawn effect triggered by clicking outside the login forms.

### Learnings
- **Root Font Configuration**: Standardized font families across the Next.js `layout.tsx` using Google Font loaders.
- **Physics Press Effects**: Discovered that shifting buttons by `translate-x-[2px]` and reducing shadow sizes when active creates a premium click response.
- **Heart Spawning Coordinate Math**: Used absolute cursor coordinates (`clientX`, `clientY`) to dynamically position SVG nodes inside fixed portals.

---

## 📅 Phase 2: Core Chat Interfaces & Responsive Shells
### Milestones
- Structured the dual-pane dashboard layout (`AppShell.tsx`) with SideRail, conversation selectors, and active chat window panels.
- Designed horizontal story avatar slots and floating action buttons (FABs) for mobile lists.
- Fixed the transparent background settings of the page containers to bring the background grid dot canvas forward.

### Learnings
- **CSS Stacking Hierarchies**: Discovered that setting root divs to transparent allowed the underlying grid dot background of the body container to show through correctly.
- **Mobile Side Drawer Animation**: Configured smooth transition slide-ins (`animate-in slide-in-from-left`) to slide the navigation drawer from the side.

---

## 📅 Phase 3: Block States, Profile Dashboards & Alignments
### Milestones
- Created `ProfileView.tsx` with user badges, sticker stats counters, and alternating polaroid photo grids.
- Implemented crooked tilts on chat bubbles, white incoming cards (black shadows), and yellow outgoing cards (cyan shadows).
- Constructed options dropdowns with block toggles, and styled blocked users as greyscale cards.

### Learnings
- **Greyscale Masking**: Using a combination of `grayscale contrast-75 bg-[#F3F3ED] text-black/45` to grey out blocked chats.
- **Visual Asymmetry**: Discovered that small alternating rotations (such as `-0.6deg` and `0.8deg`) create a cartoony, comic-strip feel.

---

## 📅 Phase 4: Overlays, Invite Portals & Desktop Widescreen Optimization
### Milestones
- Integrated the grid emoji pop-up keyboard and polaroid image attachment menus inside the input bar.
- Restructured `ProfileView.tsx` into a responsive 2-column widescreen view (Gallery left, Bio right) on desktop, while retaining the vertical stack on mobile.
- Added desktop-only back buttons, header layouts, and search header chat triggers.

### Learnings
- **Widescreen Flex-Row Columns**: Leveraged Tailwind's responsive orders (`order-2 md:order-1` for gallery and `order-1 md:order-2` for bio) to reorganise layout columns on desktop screens while keeping mobile views untouched.
- **Outside Click Dismissal**: Integrated transparent overlay backdrops to capture outside clicks and close open dropdowns without having to clean up window listeners.
