# Project Learning Summary

Zap Chat is a full-stack, neobrutalist cartoon-style chat application. This document summarizes the core architectural, design, and programming achievements realized during the development of this project, spanning both the client frontend and the microservices backend.

---

## 1. Frontend Client Architecture
- **Next.js App Router**: Mastered client-side routing structures with dedicated subroutes for `/login` and `/chats`, using root level `/` middleware redirect rules.
- **Unidirectional Data Flow**: Modeled the state tree inside the main `/chats` page, propagating data down through `AppShell` to sibling components (`ChatList`, `ChatArea`, `ProfileView`), and lifting events (block triggers, chat creation, message routing) back up to the parent page.
- **Conditional Layout Management**: Structured a dynamic viewport manager (`AppShell.tsx`) that controls views across mobile drawer sliders, active side rails, and conversation detail panes.

---

## 2. Backend Microservices Architecture
- **Node.js & TypeScript Stack**: Developed modular backends using Node.js and TypeScript, enforcing strict typing across server routes, controllers, and models.
- **Decoupled Service Model**: Constructed three independent microservices running on dedicated port boundaries:
  - **`user` service**: Manages authorization, credential validation, profiles, and state storage.
  - **`chat` service**: Powers channels, messages lists, user blocks, and thread states.
  - **`mail` service**: Deploys email alerts and OTP tokens asynchronously.
- **RabbitMQ Event Broker**: Decoupled user registration flows by publishing OTP events from the `user` service to a RabbitMQ message queue, which the `mail` service consumes (`sendOtpToConsumer`) to dispatch emails asynchronously.
- **Redis Caching Layer**: Configured a Redis integration inside the `user` service to speed up token validation, manage user sessions, and reduce MongoDB database read latency.
- **MongoDB/Mongoose Integration**: Designed flexible schemas for messages, active sessions, and blocked profiles, connecting database pools cleanly.

---

## 3. Neo-Brutalist Design & Cartoon Aesthetics
- **Double-Border Comic Framing**: Implemented the distinct neomorphic/cartoon look using thick black borders (`border-[3px] border-black`), solid offset black shadows (`shadow-[4px_4px_0px_#000]`), and high-contrast color palettes (Zap Yellow, Zap Pink, Zap Cyan).
- **Skewed Comic Headers**: Created floating slanted title capsules using CSS transforms (`transform -skew-x-12`) and customized text stroke properties.
- **Physics-Based Button Offsets**: Styled interactive buttons to mimic physics-based clicks by offsetting translate states and shadow widths (`hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`).
- **Alternating Rotational Slants**: Applied slight alternating rotations to chat bubbles (`rotate-[-0.6deg]` vs `rotate-[0.8deg]`) and polaroid photo slots (`rotate-[-2.2deg]` vs `rotate-[2.5deg]`) to produce an authentic hand-drawn scrapbook grid.

---

## 4. Interactive UI Component Library
- **SideRail Sidebar Drawer**: Constructed a structural vertical navigation bar that adapts from desktop sidebar slots into a mobile hamburger slide-out drawer.
- **ProfileView Dashboard**: Designed a comprehensive widget deck showcasing sticker count capsules, online tags, invite rows, and image galleries.
- **Message List & Polaroid Renders**: Engineered a customized message renderer capable of transforming inline text identifiers (e.g. `IMAGE:<url>`) into tilted polaroid photo frames complete with bold uppercase captions.
- **Reaction Badge Rows**: Positioned quick reaction rows above the text inputs, enabling users to click badge phrases (e.g. `🔥 FIRE!`, `LOL FR`) to instantly append them to the conversation stream.

---

## 5. Client State & Utility Additions
- **Floating Heart Click Spawner**: Developed a global screen interaction listener that spawns floating, scaling, and fading wobbly heart SVGs wherever the user clicks.
- **Click-Outside Overlay Backdrops**: Implemented transparent fullscreen backdrop blockers to capture click-outside events for select dropdowns, emoji menus, and attachment pickers cleanly.
- **Grayscaling Block Filters**: Managed user status overlays that apply a greyscale contrast filter (`grayscale contrast-75 bg-[#F3F3ED] opacity-60`) to blocked conversation cards.
