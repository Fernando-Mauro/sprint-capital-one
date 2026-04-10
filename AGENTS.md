# AGENTS.md - AI Agent Knowledge Base for Altheia

This document contains critical knowledge about the Altheia codebase to help AI agents work effectively on this project.

## Project Overview

**Altheia** is an educational platform for students and teachers, built with:
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Routing**: React Router with HashRouter

## Project Structure

```
src/
├── components/
│   ├── student/          # Student-facing components (Dashboard, Profile, Leaderboard)
│   ├── teacher/          # Teacher-facing components (Dashboard, Groups, Stats)
│   ├── subject/          # Subject-related (Problems, Flashcards, Practice Tests)
│   ├── group/            # Group management (GroupViewPage, JoinGroupPage)
│   ├── settings/         # User settings tabs
│   ├── pages/            # Standalone pages (ErroresPage)
│   └── ui/               # shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx   # User authentication state
│   └── SubjectColorsContext.tsx
├── services/
│   ├── database.ts       # Supabase queries (problems, errors, subjects)
│   └── activity.ts       # User activity tracking, stats, streaks
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   └── security.ts       # Input sanitization utilities
└── hooks/                # Custom React hooks
```

## Critical React Patterns

### ⚠️ MUST: Define useCallback BEFORE useEffect

JavaScript temporal dead zone causes `ReferenceError` if useCallback is defined after useEffect that references it.

```tsx
// ❌ WRONG - Will crash with "can't access lexical declaration before initialization"
useEffect(() => {
  loadData();
}, [loadData]);

const loadData = useCallback(async () => { ... }, []);

// ✅ CORRECT - Define useCallback first
const loadData = useCallback(async () => { ... }, []);

useEffect(() => {
  loadData();
}, [loadData]);
```

### ⚠️ Avoid Infinite Loops with User Dependency

Using `user` object as dependency causes infinite re-renders because the object reference changes. Use `user?.id` instead.

```tsx
// ❌ WRONG - Causes infinite loop
const loadData = useCallback(async () => {
  if (!user) return;
  // ...
}, [user]);  // user object reference changes every render

// ✅ CORRECT - Use primitive value
const loadData = useCallback(async () => {
  if (!user) return;
  // ...
}, [user?.id]);  // string is stable
```

### ⚠️ Topic Filter Re-render Issue

The TopicFilter component uses `useRef` to prevent re-loading when user clicks options:
- `hasAutoSelected` ref prevents multiple auto-selections
- `onSelectionChangeRef` ref avoids callback dependency issues

### ⚠️ Authentication & Back Button Protection

**CRITICAL**: Prevent users from seeing protected content after logout via back button spam.

**Multi-layered defense:**
1. **GlobalAuthBlocker** (App.tsx wrapper) - Synchronously checks localStorage for auth token before rendering anything. Returns `null` if no valid token (prevents ANY flash of content).
2. **ProtectedRoute** - Second layer that validates session via Supabase API.
3. **Logout force reload** - Uses `window.location.href = '/#/'` to completely clear React state and browser history.

Key files:
- [GlobalAuthBlocker.tsx](src/components/GlobalAuthBlocker.tsx) - Outer defense layer
- [ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) - Inner auth validation with 500ms interval checks
- [AuthContext.tsx](src/contexts/AuthContext.tsx) - Clears localStorage token before signOut

**Implementation pattern:**
```tsx
// In App.tsx
<AuthProvider>
  <GlobalAuthBlocker>
    {/* All routes */}
  </GlobalAuthBlocker>
</AuthProvider>

// In logout function
const logout = async () => {
  // 1. Clear localStorage token FIRST
  const storageKey = Object.keys(localStorage).find(key => 
    key.startsWith('sb-') && key.endsWith('-auth-token')
  );
  if (storageKey) localStorage.removeItem(storageKey);
  
  // 2. Sign out from Supabase
  await supabase.auth.signOut();
  
  // 3. Force full page reload
  window.location.href = '/#/';
};
```

## Database Patterns

### Supabase Environments

- **DEV**: `jkbuowdbmvhrqmynturh.supabase.co`
- **PROD**: `htikohojkylebqwtvxhx.supabase.co`

Environment is controlled via `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Checking for Existing Records

Use `.maybeSingle()` instead of `.single()` when checking if a record exists:

```tsx
// ❌ WRONG - Throws error when no row found
const { data: existing } = await supabase
  .from('errors')
  .select('id')
  .eq('user_id', userId)
  .single();  // Throws PGRST116 error if not found

// ✅ CORRECT - Returns null when no row found
const { data: existing } = await supabase
  .from('errors')
  .select('id')
  .eq('user_id', userId)
  .maybeSingle();  // Returns null gracefully
```

### Key Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | User profiles (students/teachers) | `id`, `email`, `role`, `points`, `avatar_url`, `institution_id` |
| `groups` | Teacher-created study groups | `id`, `name`, `teacher_id`, `subject_id`, `institution_id` |
| `group_members` | Student-group associations | `id`, `group_id`, `student_id` |
| `group_teachers` | Teacher-group associations | `id`, `group_id`, `teacher_id` |
| `group_invitations` | Group invite tokens | `id`, `group_id`, `token`, `invited_email`, `expires_at` |
| `teachers` | Teacher-subject assignments | `id`, `user_id`, `subject_id` |
| `subjects` | Available subjects | `id`, `name`, `code`, `level`, `color` |
| `topics` | Subject topic organization | `id`, `subject_id`, `order_id`, `name` |
| `assessments` | Practice test definitions | `id`, `name`, `subject_id`, `duration`, `total_marks` |
| `problems` | Practice problems | `id`, `question`, `options`, `correct_answer`, `marks`, `topic_id`, `is_multipart`, `image_url` |
| `problem_subparts` | Multi-part problem components | `id`, `problem_id`, `part_label`, `question_text`, `marks` |
| `flashcards` | Study flashcards | `id`, `subject_id`, `topic_id`, `question`, `answer`, `order_id` |
| `errors` | Wrong answers tracked per user | `id`, `user_id`, `problem_id`, `user_answer` |
| `bookmarks` | User bookmarks | `id`, `user_id`, `content_type`, `content_id`, `subject_id` |
| `practice_test_sessions` | Completed test records | `id`, `user_id`, `subject_id`, `group_id`, `correct_answers`, `score`, `total_time_seconds` |
| `user_activity` | Daily activity tracking | `id`, `user_id`, `date`, `points_earned`, `practice_tests_completed`, `total_time_seconds` |
| `user_streaks` | Streak tracking | `user_id`, `current_streak`, `max_streak`, `last_activity_date` |
| `user_preferences` | User UI settings (theme, colors) | `user_id`, `theme`, `accent_color` |
| `activities` | Teacher-assigned activities | `id`, `title`, `type`, `subject_id`, `group_id`, `teacher_id`, `due_date` |
| `student_progress` | Student activity completion | `id`, `student_id`, `activity_id`, `score`, `completed` |
| `institutions` | Institution accounts | `id`, `name`, `license_type`, `max_teachers`, `max_students` |
| `suggestions` | User feedback/bug reports | `id`, `user_id`, `type`, `title`, `description`, `status` |

### RLS Policies

All tables use Row-Level Security. Users can only access their own data or data from groups they belong to.

## Key Services

### `services/database.ts`

- `getProblemById(id)` - Fetch problem with subparts
- `addError(userId, problemId, answer)` - Track wrong answer (checks for duplicates)
- `removeError(userId, problemId)` - Remove from error tracking
- `getErrorsByUser(userId)` - Get all user's wrong answers
- `isOpenEnded(problem)` - Check if problem has no options (open-ended)

### `services/activity.ts`

- `getUserStats(userId)` - Returns `UserStats` with time, accuracy, streaks
- `getUserActivity(userId, days)` - Daily activity points
- `getPracticeTestSessions(userId, days)` - Test history
- `recordPracticeTestSession(...)` - Save completed test
- `incrementDailyActivity(userId, addTime, addPoints, ...)` - Add to daily totals (called by `recordPracticeTestSession`)

**⚠️ Streak Calculation**: Uses integer date subtraction (`p_activity_date - last_activity`) for accurate day counting.
- `days_diff = 0` → Same day (no change)
- `days_diff = 1` → Consecutive day (increment streak)
- `days_diff > 1` → Streak broken (reset to 1)

### `services/userPreferences.ts`

- `getUserPreferences(userId)` - Fetch user UI preferences from database
- `updateUserPreferences(userId, preferences)` - Upsert theme/colors
- `updateThemePreference(userId, theme)` - Update only theme
- `updateSubjectColors(userId, colors)` - Update only subject colors

**Cross-device sync**: Preferences are synced via `PreferencesSync` component that loads on login and saves on change.

## Open-Ended Questions

Problems without `options` are considered open-ended and use self-grading:

1. User submits answer
2. System shows explanation (not correct answer)
3. User self-grades (0 to max marks)
4. Score is recorded

Check for open-ended: `problem.options === null`

## Common TypeScript Interfaces

```typescript
interface UserStats {
  total_time_seconds: number;
  total_correct_answers: number;
  total_problems_attempted: number;
  max_streak: number;
  current_streak: number;
  accuracy_percentage: number;
}

interface Problem {
  id: string;
  question: string;
  options: Record<string, string> | null;  // null = open-ended
  correct_answer: string;
  explanation?: string;
  marks: number;
  is_multipart: boolean;
  subparts?: ProblemSubpart[];
}
```

## Commands

```bash
# Development
npm run dev              # Start dev server

# Linting & Type Checking
npm run lint             # ESLint check
npx tsc --noEmit --project tsconfig.app.json  # TypeScript check

# Combined check (add to package.json)
npm run check            # "eslint . && tsc --noEmit --project tsconfig.app.json"

# Build
npm run build            # Production build
```

## Routes (HashRouter)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | LoginForm/RegisterForm | Auth pages |
| `/student/dashboard` | StudentDashboard | Student home |
| `/teacher/dashboard` | TeacherDashboard | Teacher home |
| `/materias` | SubjectsPage | Subject selection |
| `/subject/:subjectId` | SubjectDashboard | Subject home |
| `/subject/:subjectId/problems/:assessmentId` | AssessmentProblemsView | Test setup |
| `/subject/:subjectId/problems/:assessmentId/test` | PracticeTestPage | Active test |
| `/subject/:subjectId/problems/:assessmentId/results` | PracticeTestResultsPage | Test results |
| `/subject/:subjectId/material` | MaterialPage | Study materials |
| `/errores` | ErroresPage | Wrong answer review |
| `/settings` | SettingsPage | User settings |
| `/teacher/group/:groupId` | GroupViewPage | Group management |
| `/join/:token` | JoinGroupPage | Group invitation |

## Known ESLint Warnings (Safe to Ignore)

These warnings are harmless:
- `react-refresh/only-export-components` - Only affects HMR
- `user` dependency warnings - We intentionally use `user?.id` instead

## Deployment Notes

1. Ensure `.env` points to correct Supabase instance
2. Run `npm run build` to create production build
3. Build output is in `dist/` folder
4. Uses HashRouter so works with static hosting (GitHub Pages, etc.)

## Database Content Workflow (DEV → PROD)

When adding new content (problems, flashcards, subjects, etc.) to test in DEV then push to PROD:

### 1. Add Content in DEV
- Add your content via the app UI or SQL Editor in DEV Supabase dashboard
- Test thoroughly to ensure everything works

### 2. Export Content from DEV
```bash
# Export specific content tables (exclude user data)
# IMPORTANT: Use UTF-8 encoding to preserve special characters (ñ, ó, equations, etc.)
npx supabase db dump --data-only --schema public \
  --exclude auth.users,public.users,public.groups,public.group_members,\
public.errors,public.practice_test_sessions,public.user_activity,public.user_streaks,\
public.bookmarks,public.teachers \
  --project-ref jkbuowdbmvhrqmynturh | Out-File -Encoding UTF8 content_export.sql
```

**For Windows PowerShell, use:** `| Out-File -Encoding UTF8 content_export.sql`  
**For Unix/Mac/WSL, use:** `> content_export.sql` (UTF-8 by default)

### 3. Review Export
- Open `content_export.sql` and verify:
  - Only content tables are included (subjects, topics, assessments, problems, flashcards)
  - No user-specific data
  - No test/development records you don't want in production
  - **Special characters display correctly** (ñ, á, é, í, ó, ú, ¿, ¡, etc.)
  - **Mathematical equations/LaTeX render properly** (check KaTeX syntax)

### 4. Import to PROD
```bash
# Apply to PROD database
npx supabase db push --db-url "postgresql://postgres:[PASSWORD]@[PROD_HOST]:5432/postgres" \
  --file content_export.sql
```

OR use SQL Editor on PROD dashboard:
1. Open the SQL file in a UTF-8 compatible editor (VS Code, not Notepad)
2. Copy and paste the content
3. Verify special characters display correctly in the editor before running

### 5. Verify
- Check PROD database that content appeared correctly
- **Specifically verify special characters:** ñ, á, é, í, ó, ú, mathematical symbols
- **Test equations render properly** in the app (KaTeX)
- Test the new content in PROD app

**Important Notes:**
- Always exclude user tables when exporting content
- **Use UTF-8 encoding at every step** to preserve special characters and equations
- If using Supabase Dashboard SQL Editor, it handles UTF-8 automatically
- If characters appear corrupted (� or ????), re-export with proper UTF-8 encoding
- Spanish content requires UTF-8: letters like ñ, á, é, í, ó, ú must survive the export/import
- Use `--exclude` flag to prevent copying user data
- Review the dump file before importing to PROD
- Make database schema changes (migrations) separately from content

## Common Bugs & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Page loads then unloads repeatedly | `user` object in dependencies | Use `user?.id` instead |
| "can't access lexical declaration" | useEffect before useCallback | Reorder: useCallback first |
| Duplicate errors in database | Using `.single()` for existence check | Use `.maybeSingle()` |
| TopicFilter flashes on click | Dependencies causing reload | Use refs for callbacks |
| 404 on test results | Wrong route path in navigate | Match route definition |
| Teacher Material tab redirects to dashboard | Missing record in `teachers` table | Ensure teacher has entry in `teachers` table with `subject_id` |
| Back button shows content after logout | React state persists in browser | GlobalAuthBlocker + localStorage check + force reload |
| Streak counter shows 1 but calendar shows multiple days | Date comparison using INTERVAL | Use integer date subtraction (`date1 - date2`) |

## Style System

Uses CSS custom properties defined in `index.css`:
- `--color-teal`: Primary accent
- `--color-gold`: Secondary accent
- `--color-red`: Error/destructive
- `--bg-primary`, `--bg-secondary`: Backgrounds
- `--text-primary`, `--text-secondary`: Text colors

Theme switching handled by `ThemeProvider` with dark/light modes.
## LaTeX Rendering

### LatexText Component
Located at `src/components/ui/LatexText.tsx`. This shared component handles:
- `$...$` inline math and `$$...$$` display math
- Converts `\(...\)` to `$...$` and `\[...\]` to `$$...$$`
- Converts `**text**` markdown to `<strong>text</strong>`
- Uses react-katex with KaTeX CSS for rendering

### Problem Options with Images
Problems can have image-based options instead of text. The options field structure:
```typescript
// Text option
options: { "a": "Answer text", "b": "Another answer" }

// Image option
options: { 
  "a": { "type": "image", "url": "https://...supabase.co/storage/.../image.png" },
  "b": { "type": "image", "url": "..." }
}
```

Check for image options: `typeof value === 'object' && value?.type === 'image'`

### Problem Images (question images)
Problems can have an `image_url` field for images that appear in the question itself.
Images are stored in Supabase Storage bucket `problem-images`.

## Content Migration Scripts

### `scripts/parse_problems.py`
Parses Markdown files (e.g., `Problemas P1-A.md`) and generates SQL insert statements.

**Key features:**
- Converts `\_X` subscripts to `$X_{subscript}$`
- Converts Unicode superscripts `²³⁴` to `^{2}^{3}^{4}`
- Handles accented subscripts with `\text{}`
- Generates full Supabase Storage URLs for images
- Uses `$json$...$json$::jsonb` dollar-quoting for safe JSON insertion

**Usage:**
```bash
python scripts/parse_problems.py
# Outputs to: sql/insert_paper1a_problems.sql
```

**Topic Mapping:** The parser uses a hardcoded `TOPIC_MAP` dictionary mapping topic order_id (0-25) to UUIDs.

### Supabase Storage for Images
- **Bucket**: `problem-images` (public)
- **URL format**: `https://{project}.supabase.co/storage/v1/object/public/problem-images/{filename}.png`
- Images are named by problem ID (e.g., `01-05-03-01.png`)