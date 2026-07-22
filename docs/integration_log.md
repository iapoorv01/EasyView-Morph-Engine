<div align="center">
  <img src="https://raw.githubusercontent.com/iapoorv01/EasyView/main/icons/icon128.png" alt="EasyView Logo" width="128" />
  <h1>🚀 Engineering & Integration Log</h1>
  <p><em>The transparent record of private platform commits, architectural decisions, and integrations driving the EasyView ecosystem.</em></p>
</div>

<br/>

> **🎯 Purpose:** This document acts as a transparent engineering record of parallel development throughout the internship. EasyView Morph Engine is being built as a standalone public project for evaluation, while simultaneously being integrated into the broader EasyView startup product (which remains under active private development due to IP considerations).

> [!NOTE]
> **No proprietary source code from the private EasyView project is included here.** This document serves as a transparent engineering record of parallel development throughout the internship.

<details>
<summary><b>Click to see what this log covers</b></summary>

- 🚀 **Production integration & Compatibility testing**
- 🐛 **Bug fixes & Internal validation**
- 🏗️ **Infrastructure and environment setup**
- ⚡ **Performance improvements**
- 🧪 **Research and experimentation**
- 🔒 **Private repository commits** (where code cannot be shared)
- 📸 **Screenshots demonstrating progress**
</details>

---

<details open>
<summary><h2>🗓️ July 22, 2026: Premium Marketing UI & Live Database Integration</h2></summary>

> **Objective**: Elevate the EasyView brand aesthetics by implementing 11 new dark-themed premium marketing and support pages, backed by a highly reusable Next.js layout system and a live Supabase database connection for real-time community reviews.

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Premium Page Architecture
*Delivering a high-end, immersive web experience.*

- **Skeuomorphic & Glassmorphic Layout**: Developed `PremiumPageLayout.tsx` utilizing deep black backgrounds (`#050505`), ambient glowing borders, and responsive grid overlays without polluting global CSS.
- **11 New Routes**: Fully designed and deployed highly immersive routes including About, Founder Portfolio, Blog, Research, Labs, Case Studies, Manifesto, Release Notes, FAQ, News, and Reviews.
- **Micro-Interactions**: Integrated global `framer-motion` enter animations and interactive hover states to create a seamless, cinematic user experience.

</td>
<td width="50%" valign="top">

### 🛠️ Live Database & UI Resilience
*Connecting the frontend directly to verified user testimony.*

- **Live Store Reviews API**: Engineered the `/api/reviews` backend route to securely fetch public testimony directly from the Supabase `store_reviews` table.
- **Instagram-Style Grid**: Replaced outdated layout logic with a precisely clamped, 3-column fixed-height architectural grid that perfectly houses variable-length text via custom internal scrollbars.
- **Portal & AnimatePresence**: Implemented robust React Portals coupled with Framer Motion to decouple modals from nested CSS `<main>` transforms, ensuring that expanded review popups perfectly lock to the viewport over heavy backdrop blurs.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository:

```text
commit f2611af
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Wed Jul 22 13:37:00 2026 +0530

    feat(ui): implement premium dark-mode content pages and live reviews feed
    
 13 files changed, 1277 insertions(+)
```
<img width="1919" height="634" alt="image" src="https://github.com/user-attachments/assets/30599d4d-444c-4a04-808d-f337c6e3d313" />


### 📸 Visual Verification

<p align="center">
  <img width="48%" alt="Reviews Grid Layout" src="https://github.com/user-attachments/assets/8c9f41a1-02a9-4486-9ae4-ad2447b907b6" />
  <img width="48%" alt="Premium Modal" src="https://github.com/user-attachments/assets/21ecce61-5c20-42fc-8e79-0b632492429a" />
</p>

</details>

<details>
<summary><h2>🗓️ July 18, 2026: Maintenance UX & Superadmin Audit Hardening</h2></summary>

> **Objective**: Transition the EasyView platform from a restrictive maintenance gate to an "Informative over Blocking" UX pattern, while deeply hardening Superadmin audit logs to decode low-level raw database queries into human-readable activity feeds.

<table>
<tr>
<td width="50%" valign="top">

### 🛠️ Informative Maintenance & Global Controls
*Ensuring maximum local utility even during cloud downtime while providing dynamic global management.*

- **System-Wide Configuration Controls**: Successfully implemented the new Settings panel allowing Super Admins to instantly toggle **Maintenance Mode**, temporarily **Stop New Signups**, and globally configure AI limits with zero deployments required.
- **Graceful Degradation UX**: Engineered a transparent maintenance architecture (`/api/platform-status`) that allows users to seamlessly use local offline features (like the Markdown Notebook) while explicitly preventing server-reliant AI decodes.
- **Dynamic Badge Engine**: Implemented an animated, GPU-accelerated wrench icon inside the extension popup and a dismissable "Status Acknowledgement" glassmorphic modal, providing users full transparency without hard-blocking access.
- **Unsaved Changes Tracking**: Built a dynamic state diffing tracker in the Admin Settings panel that actively monitors `originalSettings` vs `settings`, rendering a pulsing amber warning on the "Save Configuration" button to prevent configuration loss.

</td>
<td width="50%" valign="top">

### 🕵️‍♂️ Advanced Audit Log Parsing & Support
*Translating raw SQL updates into high-fidelity intelligence and improving user support.*

- **Individual Decode Resets**: Added the capability to directly reset a specific user's free decodes count from their User 360 profile, allowing granular support rather than just global resets.
- **Support Request Integration**: Deployed a direct Support Ticket / Feedback system accessible immediately when users run out of quotas or face issues, bridging the gap between end-users and the administrative triage inbox.
- **JSON Payload Decoding**: Completely overhauled the `formatAdminLog` parsers across the Admin Dashboard, Settings Feed, and Staff Management views.
- **Granular Action Mapping**: The system now dynamically intercepts generic `UPDATE on profiles` database commands and translates the inner JSON payload into explicit English sentences (e.g., "reset free decodes to 0 for user example@email.com", "granted custom premium access", or "banned user").
- **Precision Tracking**: Global and individual decode resets are now distinctly logged and isolated, securing a perfect paper trail of administrative actions mapped directly to the originating staff member.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository:

```text
commit 995c09c
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Sat Jul 18 12:27:46 2026 +0530

    feat(admin): enhance maintenance UX and superadmin audit logs
    
 13 files changed, 456 insertions(+), 292 deletions(-)
```
<img width="1918" height="583" alt="image" src="https://github.com/user-attachments/assets/e53441e5-3428-4df5-a305-36e567771872" />


### 📸 Visual Verification

<p align="center">
  <img width="1912" alt="Unsaved Changes Indicator" src="https://github.com/user-attachments/assets/001116a7-a46b-4ff8-833c-9770fbd83825" />
  <img width="48%" alt="Maintenance Mode" src="https://github.com/user-attachments/assets/61ce54c4-b259-4faa-8f32-cbd4e9667380" />
  <img width="48%" alt="Stop Signup" src="https://github.com/user-attachments/assets/45ebe229-13ea-4cde-bcde-94f5b8d1dfd0" />
  <img width="22%" alt="Maintenance Warning" src="https://github.com/user-attachments/assets/06cfb952-84c7-4c5b-9276-da5d8d13ffb6" />
  <img width="22%" alt="Under Maintenance" src="https://github.com/user-attachments/assets/f7905678-af56-452d-9949-2394b06a1382" />
</p>

</details>

<details>
<summary><h2>🗓️ July 17, 2026: Premium Mobile Architecture & Advanced Analytics Forecasting</h2></summary>

> **Objective**: Re-architect the EasyView Admin ecosystem for premium mobile responsiveness using a zero-impact CSS strategy, deploy a robust Web Store Review Scraper for multi-platform intelligence, and launch an AI-driven OLS forecasting engine for the Analytics Dashboard.

<table>
<tr>
<td width="50%" valign="top">

### 📱 Zero-Impact Mobile Architecture
*Delivering a native-app feel on mobile without altering desktop components.*

- **Scoped Overrides**: Engineered a highly robust `admin-mobile.css` payload mapped precisely to `@media (max-width: 767px)`, ensuring standard viewport sizes remain mathematically identical to the original design.
- **Data-to-Card UI**: Refactored rigid `<table/>` row mapping into beautiful, stacked, flex-based mobile cards (Users, Staff, Hall of Fame, Payments) to completely eliminate horizontal scrolling on phones.
- **Adaptive Boundaries**: Implemented strict `min-w-0` and `shrink-0` flexbox constraints across dynamic elements (like Staff emails) to guarantee safe truncation and prevent UI breaking.
- **Premium Interactivity**: Standardized touch targets (minimum 38-44px) on action pills and replaced un-usable hover effects with satisfying `:active` press-feedback.

</td>
<td width="50%" valign="top">

### 🧠 Analytics & Intelligence Expansion
*Building sophisticated tools to monitor growth and user satisfaction.*

- **AI-Driven Forecasting**: Integrated an advanced Ordinary Least Squares (OLS) regression algorithm into the Analytics dashboard to mathematically forecast user acquisition and revenue trajectories.
- **Multi-Store Aggregator**: Built custom, highly-resilient HTML regex scrapers directly analyzing the Chrome Web Store, Firefox Add-ons, and Edge Add-ons pages.
- **Data Hardening**: Eliminated race conditions with a new synchronous `useAsyncAction` locking hook and transitioned modal layers into React Portals to solve stacking context limitations.
- **Spider Background Element**: Integrated a beautiful, non-obtrusive `SpiderBackground.tsx` to elevate the Admin panel's visual fidelity while strictly maintaining `pointer-events-none`.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository:

```text
commit 93eccf7
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Fri Jul 17 11:12:46 2026 +0530

    feat(admin): implement premium mobile-first responsive architecture for dashboard
 
 14 files changed, 895 insertions(+), 84 deletions(-)

commit 0261e12
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Fri Jul 17 10:43:00 2026 +0530

    feat: implement premium analytics dashboard, AI-driven OLS forecasting, and system configuration enhancements

 11 files changed, 1438 insertions(+), 128 deletions(-)

commit 4b8ca50
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Fri Jul 17 10:41:30 2026 +0530

    feat(admin): harden infrastructure, resolve UI interaction bugs, and enhance data durability
 
 25 files changed, 1775 insertions(+), 469 deletions(-)

commit 56c5e38
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Fri Jul 17 05:38:18 2026 +0530

    feat(admin): implement comprehensive admin dashboard and multi-store review scraper
 
 27 files changed, 3042 insertions(+), 134 deletions(-)
```
<p align="center">
 <img width="1905" height="564" alt="image" src="https://github.com/user-attachments/assets/1306a154-0875-48c2-b094-2dd79bc861ca" />
</p>

### 📸 Visual Verification

<p align="center">
  <img width="48%" alt="Admin Overview" src="https://github.com/user-attachments/assets/f443942f-6041-4eb8-a224-24905b6654dc" />
  <img width="48%" alt="Reviews" src="https://github.com/user-attachments/assets/40f671d7-30e9-46d2-870a-7c862eb0ca6e" />
  <img width="48%" alt="AI Predictive Forecasting Engine" src="https://github.com/user-attachments/assets/f764d38d-0126-4460-aa3b-18df3b2a37ed" />
  <img width="48%" alt="Settings" src="https://github.com/user-attachments/assets/3e7f26d1-e4cf-407b-a5ce-7c902190e7f2" />
</p>

</details>

<details>
<summary><h2>🗓️ July 16, 2026: Secure Super Admin Dashboard & User 360 Architecture</h2></summary>

> **Objective**: Engineer a secure, high-performance operational dashboard for monitoring the EasyView ecosystem, managing user feedback, and analyzing telemetry, with zero exposure of sensitive data to the public client.

<table>
<tr>
<td width="50%" valign="top">

### 🛡️ Zero-Trust Security Architecture
*Ensuring maximum security for sensitive operational data.*

- **Service Role Data Bypassing**: Engineered protected Next.js API routes (`/api/admin/*`) utilizing the Supabase Service Role Key to securely bypass RLS for aggregate system queries.
- **Client-Side Admin Guard**: Implemented a robust `AdminGuard` React component acting as an edge bouncer, instantly redirecting non-admin users via RLS validation.
- **Token Verification**: Integrated strict Bearer Token verification on all administrative API endpoints to prevent unauthorized access.
- **Isolated Routing**: Segregated all admin interfaces under a protected `/admin` route group, dynamically hiding public components like `FloatingNav`.

</td>
<td width="50%" valign="top">

### 📊 Ecosystem Intelligence & UI
*Building a startup-grade, metallic-dark operational interface.*

- **The 'Pulse' Overview Dashboard**: Live aggregation of total users, active subscriptions, revenue metrics, and AI decode consumption.
- **User 360° Management**: Built a comprehensive data grid (`/admin/users`) with advanced filtering, status indicators, and usage tracking.
- **Feedback Inbox System**: Developed a triage dashboard for bug reports and feature requests, utilizing dynamic color-coding and quick-action resolution tools.
- **Premium Metallic Aesthetics**: Crafted a sophisticated UI utilizing radial CSS gradients, glassmorphism, and Lucide iconography to deliver a 'Super Admin' experience.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository:

```text
commit aa08aed
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Thu Jul 16 10:52:00 2026 +0530

    feat: secure admin dashboard architecture and UI

 9 files changed, 727 insertions(+), 14 deletions(-)
```

<p align="center">
  <img width="1919" height="495" alt="image" src="https://github.com/user-attachments/assets/bde2a4ba-bb90-408e-ad7d-ebbd199f0e69" />
</p>

### 📸 Visual Verification

<p align="center">
  <img width="48%" alt="User 360 View" src="https://github.com/user-attachments/assets/8d3c98a1-e861-4357-9ae8-601f20fb7ce1" />
  <img width="48%" alt="Feedback Inbox" src="https://github.com/user-attachments/assets/e64a48c1-94ab-45db-a1db-9d55908de501" />
</p>

</details>

<details>
<summary><h2>🗓️ July 09, 2026: Premium UX Overhaul & Extension Architecture Hardening</h2></summary>

<table>
<tr>
<td width="50%" valign="top">

### 🎨 Web Platform Overhaul
*Elevating the portal to a startup-grade experience.*

- **Dynamic Floating Navigation**: Global `FloatingNav.tsx` system that transforms dynamically on scroll.
- **Cinematic Theme Transitions**: Experimental View Transitions API for radial-clip dark mode toggling.
- **Route Level Animations**: Standardized page routing using Framer Motion via `template.tsx`.
- **Responsive Global Layouts**: Injected robust responsive padding accommodating detached UI layers.
- **Interactive Primitive Refactoring**: Patched restrictive `overflow-hidden` constraints across `SpotlightCard`.
- **Checkout Precision Mitigation**: Server-side `Math.round()` patch to prevent USD floating-point transaction rejections.

</td>
<td width="50%" valign="top">

### 🛡️ Extension Security Hardening
*Preparing the pipeline for robust AI code execution.*

- **Isolated Main-World Execution**: Overhauled `MorphEngine` to securely dispatch to `MAIN` world context via `chrome.scripting.executeScript`, bypassing Manifest V3 CSP.
- **Dynamic Media Support**: Expanded `sandbox.html` with explicit `allow="autoplay"` attributes.
- **Global GC Lifecycle Management**: Engineered `EV_CLEAR_MORPH` listeners to clean orphaned `setInterval`/`AudioContext` nodes.
- **Defensive API Gateways**: Regex Markdown stripping to prevent JSON parsing crashes.
- **Graceful API Degradation**: 'High demand' modal flows for LLM quota exhaustion.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repositories:

```text
commit 321edeb
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Thu Jul 09 15:45:00 2026 +0530

    feat(ui): premium ux overhaul with view transitions and dynamic navigation

 17 files changed, 355 insertions(+), 196 deletions(-)

commit 230da6f
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Thu Jul 09 15:55:00 2026 +0530

    feat(morph-engine): introduce ai morph engine and enhance stability

 8 files changed, 147 insertions(+), 263 deletions(-)
```

<p align="center">
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/ea2d2e9b-1e48-41ab-917e-bbb64033d9dc" />
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/f00df787-4c15-4096-b7a6-bbf9f14724e0" />
</p>

### 📸 Visual Verification

<p align="center">
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/79f30240-ccd0-46ee-86ae-8e2815693c2a" />
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/9973fc47-b9a3-4a70-94fa-4e4ca149dfb6" />
</p>
<p align="center">
  <img width="22%" alt="image" src="https://github.com/user-attachments/assets/2369afe8-d3e1-406e-b470-3d04a52b43ea" />
  <img width="22%" alt="image" src="https://github.com/user-attachments/assets/1c3c9af8-df4c-40c6-bf3b-62152a39e77e" />
</p>
</details>

<details>
<summary><h2>🗓️ June 25, 2026: Multi-Currency Localization & International Gateway Setup</h2></summary>

> **Objective**: Implement dynamic, location-based multi-currency support (INR & USD) on the EasyView landing page and pricing dashboard to optimize global conversion rates.

<table>
<tr>
<td width="50%" valign="top">

### 🌍 Dynamic Multi-Currency Pricing
- **Timezone Auto-Detection**: Dynamically defaults UI to USD for users outside specific Asian regions based on browser native timezone APIs.
- **Dynamic Pricing State**: Refactored static pricing into a dynamic state architecture swapping between predefined currency tiers.
- **Manual Override**: Custom UI toggle for users on VPNs or traveling.
- **Gateway Sync**: Razorpay API payloads dynamically inherit active client-side currency state during checkout.

</td>
<td width="50%" valign="top">

### 💳 International Payment Infrastructure
- **Gateway Configuration**: Integrated PayPal via Razorpay as the international card processing bridge.
- **KYC & Compliance**: Registered Individual business entity type and mapped RBI Purpose Code `P0802` for SaaS subscription compliance.
- **Status**: Live gateway processing in final banking verification (penny drop). USD test & live payments unblocked soon.

</td>
</tr>
</table>

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository:

```text
commit fecdd9422fb5f4d86230d069d3a5cb52d2a0b7a1
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Thu Jun 25 13:47:15 2026 +0530

    feat: add multi-currency USD support to pricing based on user location

 src/app/pricing/page.tsx          |  64 ++++++++++++++++----
 src/components/PremiumSection.tsx | 122 +++++++++++++++++++++++++++-----------
 2 files changed, 137 insertions(+), 49 deletions(-)
```

<p align="center">
  <img width="90%" alt="image" src="https://github.com/user-attachments/assets/8d859560-3751-4d9d-9a0e-32438391bd0d" />
</p>

### 📸 Visual Verification

<p align="center">
  <img width="90%" alt="image" src="https://github.com/user-attachments/assets/a59ca273-aaab-464d-a34f-be3f0e28181c" />
</p>
<p align="center">
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/3e2e078c-57e7-449c-a99f-3165a468452a" />
  <img width="48%" alt="image" src="https://github.com/user-attachments/assets/3c8a6a6f-27fe-4dbe-bbb0-d93b86377bc2" />
</p>

</details>