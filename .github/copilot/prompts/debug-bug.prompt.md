---
description: 'Debug and fix a bug by tracing through frontend, backend, and database layers.'
mode: 'master-orchestrator'
---

# Bug Investigation

## Symptom

{{ bug_description }}

## Steps to Reproduce

{{ steps }}

---

Please investigate this bug:

1. **Identify the layer** — Is this a frontend (React), backend (Supabase service), database (RLS/schema), or cross-layer issue?
2. **Trace the data flow** — Follow the data from UI → service → database and back
3. **Check known patterns** — Review AGENTS.md "Common Bugs & Fixes" for similar issues
4. **Propose fix** — Identify which agent should implement the fix
5. **Verify fix** — What tests or checks confirm the fix works?

Common Altheia-specific bugs to check first:

- `user` object in dependency array (causes infinite loops)
- `useEffect` before `useCallback` (causes ReferenceError)
- `.single()` instead of `.maybeSingle()` (causes PGRST116)
- Missing RLS policy (causes empty results or permission errors)
- Missing `teachers` table entry (causes teacher redirect bug)
