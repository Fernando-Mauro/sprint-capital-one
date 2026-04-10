---
description: 'Create a new Supabase migration with table, RLS policies, indexes, and the corresponding service layer code.'
mode: 'db-migrations-manager'
---

# New Database Migration

## Table: {{ table_name }}

### Columns

{{ columns }}

### Relationships

{{ foreign_keys }}

### Access Rules

{{ who_can_read_write }}

---

Please create:

1. **Migration file** in `supabase/migrations/` with:
   - Table creation with proper types and defaults
   - UUID primary key with `gen_random_uuid()`
   - `created_at` timestamptz with `now()` default
   - Foreign keys with appropriate ON DELETE behavior
   - `ENABLE ROW LEVEL SECURITY`
   - RLS policies for SELECT, INSERT, UPDATE, DELETE
   - Indexes on foreign keys and RLS-referenced columns

2. **Verify** the migration follows conventions in AGENTS.md

After migration is ready, hand off to **Backend Specialist** to create the service functions.
