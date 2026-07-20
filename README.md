<div align="center">
  <img src="https://raw.githubusercontent.com/iapoorv01/EasyView/main/icons/icon128.png" alt="EasyView Logo" width="120" style="border-radius: 20px; box-shadow: 0 0 40px rgba(0, 120, 255, 0.4);" />

  <br />
  <br />

  # ✦ **EasyView Morph Engine** ✦
  **The first zero-shot, LLM-powered UI mutation engine for the modern web.**

  [![Version: 2.0.0-beta](https://img.shields.io/badge/Version-2.0.0--beta-000000?style=for-the-badge&logo=vercel)](#)
  [![State: Active Mutation](https://img.shields.io/badge/State-Active_Mutation-0055FF?style=for-the-badge)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge)](#)

  <br />

  > *"Why browse a website built for millions, when it can mutate into a website built just for you?"*

</div>

<br />

<div align="center">

https://github.com/user-attachments/assets/e94d997a-b39e-4eda-aa79-ab20754a572f

<br/>

<img width="1917" height="985" alt="Image" src="https://github.com/user-attachments/assets/9d52d8b8-086f-45c9-aa4c-1c1e016f4ddb" />

</div>

## ⚡ The Paradigm Shift

For thirty years, the web has been **static**. We built websites, and humans were forced to adapt to them. 
**EasyView Morph Engine** reverses this relationship. We use advanced prompt-driven AI to dynamically reshape the DOM in real-time, tailoring any website's layout, styling, and content density to match *your exact cognitive needs*.

```bash
> easyview morph --target "youtube.com" --intent "remove distractions, focus on code"
[✓] Initializing Context Scanner...
[✓] Mapping DOM topology...
[✓] Executing Shadow Morph: Injecting focus-mode.css
[✓] Success: 4 elements hidden, typography scaled to 110%
```

---

## 🔮 Unprecedented Capabilities

We've evolved from hard-coded CSS injections to a fully stateful, context-aware architectural marvel.

<div align="center">
  
| 🧬 Capability | 🔍 How it Works | 🚀 Status |
| :--- | :--- | :--- |
| **Shadow Morphing** | Injects isolated shadow DOMs to ensure zero style leakage and perfect encapsulation. | `v2 Active` |
| **Dynamic State Orchestration** | Resolves UI state desync and handles complex race conditions during style restoration. | `v2 Active` |
| **Fluid AI Feedback** | Real-time visual feedback states, dynamic character counters, and semantic chips. | `v2 Active` |
| **Admin & Telemetry** | Complete Superadmin control, graceful degradation UX, and deep audit logging. | `v2 Active` |
| **Zero-Shot LLM Intent** | Captures natural language, infers exact visual intent, and translates to CSS/JS mutations. | `Beta` |

</div>

---

## 🧬 Anatomy of a Mutation

The Morph Engine is powered by a modular, self-healing pipeline.

<details>
<summary><b>1. Intent Processor (The Brain)</b></summary>
<br/>
Reads the user's natural language prompt (e.g., "Make this site senior-friendly"). Evaluates history, parses context, and dispatches the exact required parameters without relying on fragile server-side computations.
</details>

<details>
<summary><b>2. DOM Scanner (The Eyes)</b></summary>
<br/>
Maps the page structure. (Recently updated: Removed character limits on text nodes to preserve full UI context for precise targeting).
</details>

<details>
<summary><b>3. Transformation Engine (The Muscle)</b></summary>
<br/>
Executes modular morphs (`dynamic-morph.js`, `shadow-morph.js`, `senior-mode.js`). Seamlessly handles overlapping morphs and exact state reversions when disabled.
</details>

---

## 🛠️ The Tech Stack

Built for speed, safety, and scale.

- **Core Engine:** Chrome Extension APIs (Manifest V3), Service Workers, Isolated Content Scripts
- **Mutations:** Vanilla JavaScript (ES6+), Advanced CSS (Shadow DOM, CSS Variables)
- **UI & Experience:** Custom fluid transitions, AI-driven feedback loops, gracefully degrading architecture (ADR-003)

---

## 🚀 Experience the Future (Local Installation)

This project is an active R&D initiative. To witness the mutation engine locally:

1. **Clone the matrix:**
   ```bash
   git clone https://github.com/iapoorv01/EasyView-Morph-Engine.git
   ```
2. **Access the manifest:** Open Chrome and navigate to `chrome://extensions/`.
3. **Engage Developer Mode:** Toggle on in the top right.
4. **Inject:** Click **Load unpacked** and select the cloned directory.
5. **Mutate:** Pin the extension, open your favorite chaotic website, and type a prompt.

---

## 🌌 Project Evolution (What's Next?)

> We are currently finalizing **Phase 3** of our technical roadmap.

- [x] **Phase 1:** Core Extension Architecture & Hardcoded Morphs (Study Mode, Shorts Removal)
- [x] **Phase 2:** Advanced UI States, Shadow DOM encapsulation, Desync Resolution
- [x] **Phase 3:** Superadmin Telemetry, ADR Implementations, Graceful Degradation
- [ ] **Phase 4:** Morph Profiles (Persistent user-specific mutation rules saved globally)
- [ ] **Phase 5:** Autonomous LLM DOM generation (On-the-fly generation of `style-morph.js` for any arbitrary site structure)

---

<div align="center">
  <br/>
  <i>Crafted with precision for the future of web accessibility.</i><br/>
  <b>© EasyView Engine Architecture</b>
</div>
