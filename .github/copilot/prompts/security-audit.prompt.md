---
description: 'Audit security across auth flows, RLS policies, and input handling.'
mode: 'security-rls-agent'
---

# Security Audit

## Scope

{{ scope_description }}

---

Please perform a security audit:

### 1. Authentication

- [ ] `GlobalAuthBlocker` properly wraps all routes
- [ ] `ProtectedRoute` validates sessions server-side
- [ ] Logout clears localStorage BEFORE signOut
- [ ] No cached content visible after logout (back button attack)

### 2. Row-Level Security

- [ ] Every table has `ENABLE ROW LEVEL SECURITY`
- [ ] Policies correctly restrict data to authorized users
- [ ] No recursive policies (especially on `group_members`)
- [ ] No overly permissive policies
- [ ] `auth.uid()` null case handled

### 3. Input Handling

- [ ] User text inputs sanitized before storage
- [ ] No raw HTML rendering (XSS prevention)
- [ ] File uploads validated (type, size)

### 4. Environment

- [ ] No secrets in code or version control
- [ ] Environment variables used for sensitive config
- [ ] Supabase anon key only (no service role key in client)

Report any vulnerabilities found with severity (Critical/High/Medium/Low) and remediation steps.
