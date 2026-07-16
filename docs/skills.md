# Skills Acquired

This document lists the design methodologies, backend systems, database schemas, and frontend engineering skills mastered during the development of the full-stack Zap Chat application.

---

## 1. Backend Microservices Engineering
- **TypeScript on Node.js**: Setting up compile-safe backend servers with dedicated `tsconfig.json` mappings, routing structures, and strictly-typed controllers.
- **RESTful API Development**: Designing standardized REST endpoints with versioned routing prefixes (`/api/v1`) using Express.
- **Event-Driven Messaging (RabbitMQ)**: Implementing publisher-subscriber patterns using RabbitMQ to decouple time-consuming tasks (like OTP verification mailing) from core web transactions.
- **Cache Management (Redis)**: Integrating Redis in memory key-value stores for user session management and validation pipelines.
- **MongoDB Schema Modeling (Mongoose)**: Designing Mongoose model schemas for chat records, message lists, blocked users, and user auth entities.

---

## 2. Neobrutalist UI & Graphic Design
- **High-Contrast Cartoony Styling**: Mastering cartoon aesthetics using flat, bright colors combined with thick black boundaries and flat black drop shadows instead of soft blurs.
- **Transform & Rotation Mathematics**: Applying CSS 2D transforms (`rotate`, `skew`, `translate`) in alternating sequences to create "crooked" layouts that look hand-drawn and scrapbooked.
- **Custom Vector (SVG) Art Creation**: Drafting complex inline vector illustrations (e.g. beanie hats, avatar characters, quick-reaction buttons, wobbly emoji icons) directly inside code blocks.

---

## 3. Next.js & React Architecture
- **Responsive Layout Orchestration**: Constructing multi-pane shells that transition between sidebar lists on desktop and single-pane detail layouts on mobile screens.
- **Ref State & Event Management**: Designing transparent, full-screen overlay components (`fixed inset-0`) that handle click-outside close handlers without creating global event listeners.
- **Modular Prop Delegation**: Structuring props and interfaces to propagate callback chains up to page containers while keeping UI components reusable and isolated.

---

## 4. Advanced Tailwind CSS Styling
- **Utility Composition**: Constructing complex custom shadow wrappers (`shadow-[4px_4px_0px_#000]`) and using custom arbitrary utility values in Tailwind classes.
- **Dynamic Class Merging**: Working with `clsx` and `tailwind-merge` (`cn` helper) to conditionally apply animations, layout orders, and state-specific colors.
- **Interactive Animations**: Implementing transition timings and translate offsets that trigger when users press or hover over elements, creating a tactile, physical UI.

---

## 5. Frontend UX/UI Patterns
- **Floating Heart Animation Systems**: Designing requestAnimationFrame physics animations that spawn, float, wobble, and fade out SVG nodes based on screen coordinates.
- **Emoji Picker Grid Popovers**: Building compact emoji keyboards that directly feed character selections into text input states.
- **Block Overlay Masking**: Applying CSS filters (`grayscale`, `contrast`, `opacity`) to block and disable channel states dynamically.
