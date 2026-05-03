# AGENTS.md

## Tech Stack
Vue 3 (Composition API + `<script setup>`) + TypeScript + Pinia + Vue Router + Vite + PWA + Tailwind CSS.

## Project Structure

```
src/
├── main.js              # App entry
├── App.vue              # Root layout
├── index.css            # Global styles
├── util.ts              # Utility functions (localStorage, type aliases)
├── router/index.ts      # Routes: /welcome → /exercise/:cat/:params/:n → /report → /report-share
├── store/
│   ├── setting.ts       # Persisted settings (category, quantity, params, avoidRepeat)
│   ├── question.ts      # Question session state (questions, progress, timing, answer logic)
│   └── mistakes.ts      # Mistake collection (persisted)
├── question/
│   ├── index.ts         # Core types: Question, QuestionModule, QuestionProvider, AnswerResult, helpers
│   ├── loading.ts       # Default loading module placeholder
│   ├── add-sub.ts       # Category implementations (add, sub, mul, div, pow, pff, disc-2, sqrt...)
│   └── ...
├── components/
│   ├── Welcome.vue      # Category/params form
│   ├── Exercise.vue     # Main exercise UI (question display, answer input, progress)
│   ├── Report.vue       # Score report / results
│   ├── ReportShare.vue  # Shareable report card
│   ├── QuestionsPrint.vue    # Printable question sheet
│   ├── MistakesCollection.vue  # Mistake review page
│   └── report/
│       ├── QuestionDisplay.vue
│       └── QuestionShareDisplay.vue
└── assets/
    └── components/
        ├── Duration.vue          # Time display component
        └── CustomizedFooter.vue  # App footer
```

## Data Flow

1. **Welcome** → User selects category/params/quantity → URL navigation to `/exercise/:category/:params/:quantity`
2. **Exercise** → `useSettingStore` reads URL params → `categoryId` change triggers `questionStore` to dynamically `import()` the question module → `reset_questions()` pre-generates all questions → user answers → `answer_current_question()` updates progress/duration/mistakes → all done → navigate to `/report`
3. **Report** → Reads completed `questions` from store → displays stats + each Q&A → can navigate to share or main page
4. **Persistence** → `setting` store syncs to localStorage; `mistakes` store persists wrong answers for review

## Key Conventions
- Pinia stores use Composition API (`defineStore` with setup function)
- Question modules export `QuestionModule` interface with `get_provider()`, `paramsConfig`, and optional `validate()`
- `QUESTION_CONTEXT` singleton contains all question helper dependencies (reduces bundle via code splitting)
- Dynamic imports for question categories (lazy loading)
- PWA via `vite-plugin-pwa` with Workbox `NetworkOnly` for umami analytics

## Version Bump

1. Read current version from `package.json` (match `"version": "..."`)
2. `grep -r <current_version> --include="*.{json,ts,vue,md,mjs}"` to find all occurrences
3. Update version in: `package.json`, `src/App.vue`, `CHANGELOG.md`
4. In `CHANGELOG.md`: write new version entry under `[[Unreleased]]`, move link from `vX.Y.Z..HEAD` to `vX.Y.Z+1..HEAD`, add old version link
5. `git add -A && git commit -m "Release: v<new.version>"`
6. `git tag v<new.version>`
7. `git push && git push --tags` (if user requests)
