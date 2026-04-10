---
description: "Full code review of all changed files — checking for Altheia-specific patterns, security, performance, and best practices."
mode: "pr-review-agent"
---

# Code Review Request

Please review the recent changes in this project:

## Review Scope
{{ files_or_description }}

---

Perform a thorough review checking:

### Critical (Blocking)
- [ ] `useCallback` defined BEFORE `useEffect` that references it
- [ ] `user?.id` used instead of `user` in dependency arrays
- [ ] `.maybeSingle()` used for existence checks (not `.single()`)
- [ ] RLS enabled on any new tables
- [ ] New routes wrapped in `ProtectedRoute`
- [ ] Input sanitized via `security.ts`

### High Priority
- [ ] TypeScript: No `any`, proper null checks, error handling
- [ ] React: No state mutation, stable keys, cleanup in effects
- [ ] Supabase: Errors checked, proper table/column names

### Medium
- [ ] UI: Loading states, error states, Spanish text, responsive
- [ ] Performance: Proper memoization, no N+1 queries

### Low
- [ ] Documentation updated (AGENTS.md, comments)

Output format: Blocking issues first, then warnings, then suggestions.
