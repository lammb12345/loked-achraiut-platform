# Plan 4: Deploy & Go Live

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the platform live — commit all pending work, fix the auth↔student link, run Schooler sync, deploy to Netlify.

**Architecture:** Supabase DB trigger auto-links `students.auth_user_id` whenever a user logs in (email match). Schooler sync populates all tables. Netlify serves the Vite build with SPA redirects.

**Tech Stack:** React 19 + Vite + Tailwind v3 + Shadcn v4 (base-ui) + Supabase JS v2 + react-router-dom v7 + Netlify

---

## Context (read before starting)

**Repo:** `C:\Users\saarj\Downloads\loked-achraiut-platform` → GitHub `lammb12345/loked-achraiut-platform`

**Git push command (always use this):**
```bash
TOKEN=$(gh auth token)
git push "https://lammb12345:${TOKEN}@github.com/lammb12345/loked-achraiut-platform.git" master:main
```

**Supabase project ID:** `cnauteihwxwqmpwraxpv`

**Critical RLS dependency:** `students` table has column `auth_user_id uuid FK → auth.users.id`.  
RLS policy `student_reads_own`: `auth_user_id = auth.uid()`.  
Enrollments policy joins through students: `s.auth_user_id = auth.uid()`.  
Without `auth_user_id` set, members see zero courses even after sync.

**Schooler credentials (already in `.env.local`):**
```
VITE_SCHOOLER_CLIENT_ID=-22zSjJdNpbMvte6AKADrACPhxFx7lDA1mlZ3YWdQnQ
VITE_SCHOOLER_CLIENT_SECRET=HWfkxWiLR9Bh6Tid9Xh-IrHgqDyhpcZyHIZjeUNuSf4
VITE_SCHOOLER_USER_ID=achrayut@outlook.co.il
VITE_SCHOOLER_USER_SECRET=c1eca983f4e669d0a5ed5eeee709f1b4
```

**Key existing files:**
- `src/lib/schooler.ts` — Schooler API client (token cache, fetchCourses, fetchCourseStudents, etc.)
- `src/lib/syncSchooler.ts` — syncs Schooler → Supabase (courses, lessons, students, enrollments)
- `src/pages/admin/AdminSync.tsx` — UI for running sync
- `src/pages/admin/AdminDashboard.tsx` — full admin panel (courses/students/search/news/sync views)
- `src/pages/member/MemberCourses.tsx` — member course page (reads from Supabase by email)
- `src/pages/member/MemberClub.tsx` — club member page (static content)
- `netlify.toml` — Netlify build + SPA redirect config (already correct)

**Shadcn v4 quirks:**
- No `asChild` on Button → use `buttonVariants()` + `<Link className={cn(buttonVariants())}>`
- No built-in Form → use `src/components/ui/form.tsx` (manually created)
- Accordion from base-ui: no `type="single"` prop — omit it

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| (Supabase SQL) | Create migration | Trigger: set `students.auth_user_id` on login |
| `src/App.tsx` | Already correct | Routes wired |
| `netlify.toml` | Already correct | Build + redirects |

---

### Task 1: Commit all uncommitted work

**Files to commit:**
- Modified: `src/App.tsx`, `src/pages/admin/AdminDashboard.tsx`
- New: `netlify.toml`, `src/lib/syncSchooler.ts`, `src/pages/admin/AdminSync.tsx`, `src/pages/member/MemberClub.tsx`, `src/pages/member/MemberCourses.tsx`

- [ ] **Step 1: Verify build passes**

```bash
cd /c/Users/saarj/Downloads/loked-achraiut-platform
npm run build 2>&1 | tail -5
```
Expected: `✓ built in Xs`

- [ ] **Step 2: Stage and commit**

```bash
cd /c/Users/saarj/Downloads/loked-achraiut-platform
git add netlify.toml \
  src/App.tsx \
  src/lib/syncSchooler.ts \
  src/pages/admin/AdminDashboard.tsx \
  src/pages/admin/AdminSync.tsx \
  src/pages/member/MemberClub.tsx \
  src/pages/member/MemberCourses.tsx
git commit -m "$(cat <<'EOF'
Plan 4: member area, admin sync, deploy config

- MemberCourses: תצוגת קורסים לחבר לפי email
- MemberClub: דף מועדון הורים
- AdminSync: UI לסנכרון Schooler → Supabase
- syncSchooler.ts: לוגיקת סנכרון מלאה
- AdminDashboard: views חדשות + sync
- netlify.toml: build config + SPA redirects

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push**

```bash
cd /c/Users/saarj/Downloads/loked-achraiut-platform
TOKEN=$(gh auth token)
git push "https://lammb12345:${TOKEN}@github.com/lammb12345/loked-achraiut-platform.git" master:main
```
Expected: `master -> main`

---

### Task 2: Supabase trigger — auto-link auth_user_id

**Problem:** `students.auth_user_id` is NULL after sync. RLS blocks members from reading enrollments.  
**Solution:** Supabase trigger on `auth.users` that sets `auth_user_id` on matching student row (by email) whenever a user logs in or signs up.

- [ ] **Step 1: Apply migration via Supabase MCP**

Run this SQL on project `cnauteihwxwqmpwraxpv`:

```sql
-- Function: link auth user to student record by email
CREATE OR REPLACE FUNCTION public.link_student_to_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.students
  SET auth_user_id = NEW.id
  WHERE email = LOWER(NEW.email)
    AND auth_user_id IS NULL;
  RETURN NEW;
END;
$$;

-- Trigger: fires after INSERT on auth.users (new signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_student_to_auth_user();
```

Use the Supabase MCP tool `apply_migration` with project_id `cnauteihwxwqmpwraxpv`.

- [ ] **Step 2: Backfill existing auth users**

After trigger is in place, run this to link any users who already signed up:

```sql
UPDATE public.students s
SET auth_user_id = u.id
FROM auth.users u
WHERE LOWER(u.email) = LOWER(s.email)
  AND s.auth_user_id IS NULL;
```

Use `execute_sql` MCP tool for this.

- [ ] **Step 3: Also add RLS policy to allow student SELECT by email (fallback)**

MemberCourses.tsx first queries students by email. Add a permissive SELECT policy:

```sql
-- Allow authenticated users to read student row matching their auth email
CREATE POLICY "student_reads_own_by_email"
ON public.students
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

Use `apply_migration` MCP tool.

---

### Task 3: Create admin user in Supabase

Need a real admin account to log in and run the Schooler sync.

- [ ] **Step 1: Create user in Supabase Auth**

In Supabase dashboard → Authentication → Users → "Invite user":
- Email: use your own (the one you'll log in with)
- OR use Supabase MCP `execute_sql` to insert via auth functions

- [ ] **Step 2: Assign admin role**

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT DO NOTHING;
```

Replace `YOUR_EMAIL_HERE` with the admin email. Use `execute_sql` MCP.

---

### Task 4: Run Schooler sync

- [ ] **Step 1: Login to the dev server**

```bash
cd /c/Users/saarj/Downloads/loked-achraiut-platform
npm run dev
```

Open `http://localhost:5173/auth` → log in with the admin account from Task 3.

- [ ] **Step 2: Navigate to sync**

Go to `/admin` → sidebar "סנכרון" → click "הרץ סנכרון".

Wait for completion. Should sync ~42 courses, lessons, and all students.

- [ ] **Step 3: Verify data in Supabase**

```sql
SELECT
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM lessons) as lessons,
  (SELECT COUNT(*) FROM students) as students,
  (SELECT COUNT(*) FROM enrollments) as enrollments;
```

Use `execute_sql` MCP. Expected: courses ~42, lessons hundreds, students thousands.

- [ ] **Step 4: Verify trigger linked existing auth users**

```sql
SELECT COUNT(*) FROM students WHERE auth_user_id IS NOT NULL;
```

Should be > 0 if any auth users have matching emails in students.

---

### Task 5: Deploy to Netlify

- [ ] **Step 1: Install Netlify CLI (if needed)**

```bash
npm install -g netlify-cli
```

- [ ] **Step 2: Login to Netlify**

```bash
netlify login
```

Browser will open for OAuth. Log in with the Netlify account.

- [ ] **Step 3: Initialize site and deploy**

```bash
cd /c/Users/saarj/Downloads/loked-achraiut-platform
netlify init
```

Select: "Create & configure a new site" → team → site name `lokchim-achrayut` (or leave default).

- [ ] **Step 4: Set environment variables**

```bash
netlify env:set VITE_SUPABASE_URL "https://cnauteihwxwqmpwraxpv.supabase.co"
netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYXV0ZWlod3h3cW1wd3JheHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDAzMTIsImV4cCI6MjA5MjUxNjMxMn0.GJiD608kTVrw_4orGn8dQq-pEmJ6g8nyudY4g2Q58Uc"
netlify env:set VITE_SCHOOLER_CLIENT_ID "-22zSjJdNpbMvte6AKADrACPhxFx7lDA1mlZ3YWdQnQ"
netlify env:set VITE_SCHOOLER_CLIENT_SECRET "HWfkxWiLR9Bh6Tid9Xh-IrHgqDyhpcZyHIZjeUNuSf4"
netlify env:set VITE_SCHOOLER_USER_ID "achrayut@outlook.co.il"
netlify env:set VITE_SCHOOLER_USER_SECRET "c1eca983f4e669d0a5ed5eeee709f1b4"
```

- [ ] **Step 5: Deploy**

```bash
netlify deploy --build --prod
```

Expected: `Website is live` with a URL like `https://lokchim-achrayut.netlify.app`

- [ ] **Step 6: Update Supabase allowed URLs**

In Supabase dashboard → Authentication → URL Configuration:
- **Site URL:** `https://lokchim-achrayut.netlify.app` (or custom domain)
- **Redirect URLs:** add `https://lokchim-achrayut.netlify.app/**`

---

### Task 6: End-to-end smoke test

- [ ] **Step 1: Test public pages**

Visit the Netlify URL. Verify:
- `/` loads (Home page with logo, hero, sections)
- `/about` loads
- `/news` loads (empty is OK — no articles yet)
- `/meamnim` loads (MediaCoaches page)

- [ ] **Step 2: Test auth**

Go to `/auth` → sign up with a new email.
Expected: redirect to `/member`.

- [ ] **Step 3: Test member courses (with Schooler email)**

If the test email is enrolled in a Schooler course, go to `/member/courses`.
Expected: courses appear with progress bars and "כניסה לקורס" button.

If email not in Schooler: courses page shows "לא נמצאו קורסים רשומים" — correct behavior.

- [ ] **Step 4: Test admin**

Log in with admin email → `/admin`.
Expected: 42 courses in grid, sync tab shows stats.

- [ ] **Step 5: Test news creation**

Admin → news tab → create article → toggle published → go to `/news` on public site.
Expected: article appears.

---

### Task 7: Add custom domain (optional)

If there's a custom domain (e.g., `lokchimachrayut.co.il`):

- [ ] **Step 1: Add domain in Netlify**

```bash
netlify domains:add lokchimachrayut.co.il
```

Or via Netlify dashboard → Domain management.

- [ ] **Step 2: Update DNS**

At domain registrar: add CNAME `lokchimachrayut.co.il → lokchim-achrayut.netlify.app`  
Or use Netlify's nameservers for full DNS management.

- [ ] **Step 3: Update Supabase URLs**

Add `https://lokchimachrayut.co.il/**` to Supabase → Auth → Redirect URLs.

---

## Known Limitations & Next Steps

- **Lesson progress** (`lesson_progress` table) not populated by sync — Schooler API doesn't expose per-lesson completion per student. Progress shown in admin comes from Schooler directly; progress in member area currently shows 0/N unless manually marked.
- **Club content** (`/member/club`) is static — future: connect to Supabase for dynamic resources.
- **Schooler credentials in browser bundle** — acceptable for internal admin tool. Future: move to Supabase Edge Function for full security.
- **Sync is manual** — future: cron job or webhook to auto-sync nightly.
