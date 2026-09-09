# Project Rules & Guidelines

These are the strict rules the AI and all contributors must follow during development. 
**CRITICAL RULE:** Never break existing functionality unless explicitly requested by the user.

## 1. Coding Standards
- Use **TypeScript** for all new files (`.ts` or `.tsx`). Enforce strong typing; avoid `any`.
- Prefer functional components and hooks in React.
- Keep components small and focused on a single responsibility.
- Document complex logic, especially anything related to healthcare compliance or medicine comparison.

## 2. Folder Structure Rules
- `/src/components`: UI components. Group by domain if the list grows large.
- `/src/data`: Static data, mock data, or types related to data models.
- `/public`: Static assets.
- Keep configuration files at the root directory.

## 3. Naming Conventions
- **Components/Files**: Use `PascalCase` for React components (e.g., `AdminPortalView.tsx`).
- **Functions/Variables**: Use `camelCase` (e.g., `fetchMedicineData`).
- **Constants**: Use `UPPER_SNAKE_CASE` (e.g., `MAX_RETRY_ATTEMPTS`).
- **Interfaces/Types**: Use `PascalCase` and prefix with `I` only if necessary, or just descriptive names (e.g., `MedicineDetail`).

## 4. UI/UX Consistency Rules
- Use **Tailwind CSS** for all styling.
- Maintain consistent spacing, typography, and color schemes using Tailwind utility classes.
- Ensure all healthcare-related data (prices, compositions) is displayed clearly and prominently.
- Ensure responsiveness across mobile, tablet, and desktop views.

## 5. Git Commit Rules
- Use semantic commit messages (e.g., `feat: add comparison view`, `fix: correct price calculation`, `docs: update readme`).
- Keep commits focused on a single logical change.

## 6. Security and Environment Variables
- **NEVER** commit `.env` files or hardcode API keys (like `GEMINI_API_KEY`) in the source code.
- Always use `import.meta.env.VITE_*` to access environment variables in the Vite application.
- Validate all user inputs, especially when querying medicine data or interacting with AI models.

## 7. AI Assistant Instructions
- Read `memory.md`, `decisions.md`, and this file before proposing architectural changes.
- Ensure any added features align with the roadmap in `memory.md`.
