# Implementation Plan: Reverse Engineer Strapi Page Builder React

This plan outlines the steps to reconstruct the source code of `@wecre8websites/strapi-page-builder-react` from its compiled `dist` files.

## Goal
Convert minified/compiled JavaScript files in `dist/` back into clean, maintainable TypeScript React components in `src/`.

## Status
- [x] `src/index.tsx` (Reconstructed from `index.mjs`)
- [x] `src/utils.tsx` (Reconstructed from `chunk-HHGIPONM.mjs`)
- [ ] `src/rsc.tsx` (Server Component entry point)
- [ ] `src/components/ColorInput.tsx`
- [ ] `src/components/SliderInput.tsx`
- [ ] `src/components/RichTextInput.tsx`
- [ ] `src/components/MediaInput.tsx`
- [ ] `src/components/StrapiComponent.tsx`

## Step-by-Step Plan

### Phase 1: Core Components (Simple)
These components appear to be smaller and easier to reconstruct.

1.  **ColorInput**
    -   **Source:** `dist/ColorInput-L7226P4U.mjs`
    -   **Target:** `src/components/ColorInput.tsx`
    -   **Action:** Read file, format, identify dependencies (likely `react-colorful`, `popover`), rewrite in TSX.

2.  **SliderInput**
    -   **Source:** `dist/SliderInput-KG6TAP35.mjs`
    -   **Target:** `src/components/SliderInput.tsx`
    -   **Action:** Read file, format, identify dependencies (likely `@radix-ui/react-slider`), rewrite in TSX.

3.  **RichTextInput**
    -   **Source:** `dist/RichTextInput-YAAQX2TG.mjs`
    -   **Target:** `src/components/RichTextInput.tsx`
    -   **Action:** Read file, format, identify dependencies (likely `slate`, `slate-react`), rewrite in TSX.

### Phase 2: Complex Components
These components likely have more logic and dependencies.

4.  **MediaInput**
    -   **Source:** `dist/MediaInput-LR7OAKZX.mjs` (and others, need to identify the main entry).
    -   **Target:** `src/components/MediaInput.tsx`
    -   **Action:** This seems to have many chunks. Need to analyze if they are separate components or just split chunks. Will start by reading the main one referenced in `utils.tsx`.

5.  **StrapiComponent**
    -   **Source:** `dist/StrapiComponent.client-W5B33GMH.mjs`
    -   **Target:** `src/components/StrapiComponent.tsx`
    -   **Action:** This is the core component for rendering Strapi blocks. It likely handles recursion and dynamic importing.

### Phase 3: Server Components & Exports

6.  **RSC Entry**
    -   **Source:** `dist/rsc.mjs`
    -   **Target:** `src/rsc.tsx`
    -   **Action:** Reconstruct the server-side component exports.

### Phase 4: Cleanup & Verification

7.  **Update Utils**
    -   **Action:** Update `src/utils.tsx` to import the newly created components from `src/components/` instead of lazy loading from `dist/`.

8.  **Build & Test**
    -   **Action:** Run `npm run build` to verify that the reconstructed source code compiles correctly.

## Execution Instructions
For each step:
1.  Use `view_file` to read the `dist` file.
2.  Use `write_to_file` to create the `src` file with the reconstructed code.
3.  (Optional) Use `run_command` to format or lint the file.
