# EasyView Morph Engine

**Extended from EasyView**

EasyView Morph Engine is a prompt-driven website personalization engine that allows users to modify and transform any website through natural language instructions.

## Project Structure

```text
easyview-morph-engine/
├── manifest.json              # Extension manifest (V3)
├── background/
│   └── service_worker.js      # Background script for global state and APIs
├── content/
│   ├── content.js             # Main entry point for content script injection
│   ├── engine/
│   │   ├── morph-engine.js    # Transformation state and orchestration
│   │   └── intent-processor.js# Natural language to intent mapping
│   └── morphs/
│       ├── base-morph.js      # Base class for morph implementations
│       ├── youtube-shorts.js  # Implementation: Hide YouTube Shorts
│       └── study-mode.js      # Implementation: Study Mode
├── docs/
│   ├── architecture.md        # Technical architecture details
│   └── README.md              # This file
└── popup/
    ├── popup.html             # User interface structure
    ├── popup.css              # Styling (EasyView branding)
    └── popup.js               # UI logic and messaging to content script
```

## How to Install (Developer Mode)

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the `easyview-morph-engine` folder.

## Core Vision

For years, developers and platforms controlled how users experienced the web. Morph Engine gives that control back to users.

Instead of: **Website → User adapts**  
Morph Engine enables: **User → Website adapts**

© EasyView. All Rights Reserved.
