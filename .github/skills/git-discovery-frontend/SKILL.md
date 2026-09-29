---
name: git-discovery-frontend
description: "Use when adding, changing, reviewing, or debugging this Git Discovery frontend, including React components, TypeScript, Vite configuration, Supabase authentication, API requests, or frontend UI."
---

# Git Discovery Frontend

Apply this skill to changes in this repository. Keep solutions consistent with the existing React, TypeScript, Vite, Supabase, and ESLint setup; do not introduce new frameworks or dependencies without a concrete need.

## Before Changing Code

1. Read the target file and the closest related component, utility, or configuration. Follow the current ownership boundary and keep the change scoped.
2. Check `package.json`, `tsconfig.app.json`, and `eslint.config.js` before relying on a package, script, compiler option, or lint rule.
3. Identify the expected behavior and relevant states, including loading, errors, empty data, and unauthenticated use where applicable.

## Implementation Practices

- Use TypeScript types for component props, state, API payloads, and errors. Avoid `any`; model unknown data as `unknown` and narrow it before use.
- Prefer small, focused React components and ordinary functions. Add abstractions only when they remove real duplication or match an established pattern.
- Follow React Hooks rules. Keep effects focused, include their reactive dependencies, and clean up subscriptions or listeners they create.
- Server state stays in the cache layer; domain logic stays in custom hooks; transient state stays in local components.
- Handle asynchronous work explicitly: represent loading and error states, check `response.ok` before consuming API responses, and avoid updating state after a component has unmounted when an operation can outlive it.
- Treat Supabase browser credentials and all `VITE_*` values as public. Never place service-role keys, private API secrets, or other server-only credentials in frontend code or Vite environment variables.
- Send the Supabase access token only to the configured backend when required. Do not log tokens or expose them in rendered UI, URLs, or error messages.
- Keep authentication state and subscriptions consistent with the existing Supabase client. Unsubscribe from auth listeners during cleanup and surface sign-in or sign-out failures when they affect the user flow.
- Keep UI accessible and responsive: use semantic elements, label interactive controls, support keyboard use, and provide clear feedback for loading and failure states.
- Preserve the repository's formatting and import conventions. Avoid unrelated cleanup or speculative dependencies.

## Validation

After changes, run the narrowest relevant check. For application code, use:

```sh
npm run lint
npm run build
```

For documentation-only changes, verify command names and configuration details against `package.json` and the relevant config or environment template. Report checks that could not be run and distinguish them from checks that passed.
