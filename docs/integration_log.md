# Engineering & Integration Log

## Purpose

This document records engineering activities performed during the internship that are **not directly reflected in this public repository**.

EasyView Morph Engine is being developed as a standalone public project for internship evaluation while simultaneously being integrated into the broader EasyView product, which remains under active private development due to ongoing startup and IP considerations.

Accordingly, this log documents work completed outside this repository, including but not limited to:

- Production integration
- Compatibility testing
- Bug fixes
- Infrastructure and environment setup
- Internal validation
- Performance improvements
- Research and experimentation
- Private repository commits (where code cannot be shared)
- Screenshots demonstrating progress
- Commit messages and development milestones
- Any engineering work that contributes to Morph Engine but is not published in this repository

No proprietary source code from the private EasyView project is included here. This document serves as a transparent engineering record of parallel development throughout the internship.

---

## 🗓️ June 25, 2026: Multi-Currency Localization & International Gateway Setup

### 📌 Feature Spotlight: Dynamic Multi-Currency Pricing
**Objective**: Implement dynamic, location-based multi-currency support (INR & USD) on the EasyView landing page and pricing dashboard to optimize global conversion rates.

**High-Level Architecture & Implementation**:
- **Timezone Auto-Detection**: Integrated browser-native timezone detection to dynamically default the UI to USD for users outside of specific Asian regions.
- **Dynamic Pricing State**: Refactored the static pricing data into a dynamic state architecture that seamlessly swaps between predefined currency tiers.
- **Manual Override Controls**: Built a custom UI toggle allowing users to override the auto-detected currency if they are using a VPN or traveling.
- **Payment Gateway Synchronization**: Configured the backend Razorpay API payloads to dynamically inherit the active client-side currency state during checkout initialization.

### 💳 International Payment Infrastructure & KYC
As part of making the platform globally ready, I spearheaded the setup and integration of international payment rails:
- **Gateway Configuration**: Integrated PayPal via Razorpay to serve as the international card processing bridge.
- **KYC & Compliance**: Successfully completed the initial KYC setup, registering the business entity type (Individual) and mapping the correct RBI Purpose Code (`P0802 - Software consultancy/implementation`) for SaaS subscription compliance.
- **Current Status**: The frontend and backend API code is 100% complete and tested. The live international gateway processing is currently in the final banking verification stage (awaiting penny drop micro-deposits, expected completion in 2-3 business days), after which USD test and live payments will automatically unblock.

### 📜 Verifiable Git Commit Log
The following is an export of the commit log from the private platform repository, demonstrating the scale of the contribution:

```text
commit fecdd9422fb5f4d86230d069d3a5cb52d2a0b7a1
Author: Abhi <171412961+iapoorv01@users.noreply.github.com>
Date:   Thu Jun 25 13:47:15 2026 +0530

    feat: add multi-currency USD support to pricing based on user location

 src/app/pricing/page.tsx          |  64 ++++++++++++++++----
 src/components/PremiumSection.tsx | 122 +++++++++++++++++++++++++++-----------
 2 files changed, 137 insertions(+), 49 deletions(-)
```

<img width="1920" height="437" alt="image" src="https://github.com/user-attachments/assets/8d859560-3751-4d9d-9a0e-32438391bd0d" />

### 📸 Visual Verification

<img width="1912" height="1055" alt="image" src="https://github.com/user-attachments/assets/a59ca273-aaab-464d-a34f-be3f0e28181c" />
<img width="1179" height="640" alt="image" src="https://github.com/user-attachments/assets/3e2e078c-57e7-449c-a99f-3165a468452a" />
<img width="956" height="532" alt="image" src="https://github.com/user-attachments/assets/3c8a6a6f-27fe-4dbe-bbb0-d93b86377bc2" />