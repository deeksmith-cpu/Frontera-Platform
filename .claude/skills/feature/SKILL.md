---
name: feature
description: Scaffold new features following Frontera development standards. Use when user says "add feature", "new feature", "create feature", or asks to build a new capability.
---

# Feature Scaffold Skill

Scaffolds new features for the Frontera Platform following DEVELOPMENT_STANDARDS.md.

## When to Use

Activate when user requests:
- "add feature"
- "new feature"
- "create feature"
- "implement feature"
- Building a new capability

## Process

1. **Gather Requirements**
   - Feature name (kebab-case)
   - Feature type: Standard or AI/LLM
   - Brief description

2. **Create Structure**
   ```
   src/app/api/{feature}/route.ts
   src/app/dashboard/{feature}/page.tsx
   src/components/{feature}/index.tsx
   src/lib/{feature}/index.ts
   src/lib/analytics/{feature}.ts
   src/types/{feature}.ts
   ```

3. **Analytics File** - Create with:
   - Journey events: `{feature}_started`, `{feature}_completed`
   - Engagement events: `{feature}_interaction`
   - Error events: `{feature}_error`
   - Base properties: user_id, org_id, client_tier

4. **API Route** - Use patterns from CLAUDE.md:
   - Clerk auth check
   - Supabase admin client
   - Error response format: `{ error: string }`

5. **Output Checklist** from DEVELOPMENT_STANDARDS.md

## Naming Conventions

- Events: snake_case (`feature_action`)
- Components: PascalCase
- Functions: camelCase
- Types: PascalCase
