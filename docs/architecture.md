# EasyView Morph Engine - Architecture Overview

## Core Vision
Morph Engine is a prompt-driven website personalization engine. It shifts the paradigm from users adapting to websites, to websites adapting to users based on natural language instructions.

## V1 Architecture Components

### 1. Popup Interface (`popup/`)
The entry point for the user. Provides a clean, accessibility-focused UI for entering prompts.
- **`popup.html/css/js`**: Captures user intent and sends it to the active tab's content script for execution.

### 2. Intent Processing Layer (`content/engine/intent-processor.js`)
Responsible for translating raw user prompts (natural language) into structured, executable intents.
- **Current State (V1)**: Uses a placeholder keyword/regex matching system to identify predefined intents.
- **Future State (V2+)**: Will integrate a local or API-based Large Language Model (LLM) to perform zero-shot classification, parameter extraction (e.g., identifying target colors, font sizes), and handling ambiguous prompts.

### 3. Transformation Engine (`content/engine/morph-engine.js`)
The core orchestrator that maintains state and applies modifications.
- **Morph Registration**: Individual morphs register themselves with the engine.
- **State Management**: Keeps track of which morphs are active and handles conflict resolution or layering.
- **Execution & Reversal**: Calls `apply()` and `revert()` on instantiated morph objects.

### 4. Morph Modules (`content/morphs/`)
Discrete, self-contained scripts that handle specific types of DOM modifications.
- **`base-morph.js`**: An abstract base class providing common utilities like safe CSS injection and cleanup.
- **Implementation**: E.g., `youtube-shorts.js` specifically targets YouTube's DOM to hide shorts components. `study-mode.js` applies global CSS overrides to improve readability.

## Future AI Integration Roadmap

1. **LLM Intent Extraction**: Replace the keyword matcher in `intent-processor.js` with an AI model that maps open-ended prompts to standard Morph IDs + parameters.
2. **Generative Morphs**: Instead of relying solely on pre-written CSS/JS morph modules, the system will use an LLM with DOM-awareness to generate layout modifications on the fly.
3. **Morph Profile System**: Persist user preferences (e.g., "always load study mode on Wikipedia") using Chrome Storage API.
4. **Context-Aware Engine**: The engine will analyze the page DOM first, summarize it, and feed it into the AI to determine the best CSS selectors to target dynamically.
