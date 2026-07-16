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