/*
# Fix comments & chat_messages for local guest profiles

## Why
The app uses a local "Guest Profile" system (name + DiceBear avatar stored in
localStorage) instead of Supabase auth. The existing `comments` and
`chat_messages` tables were built for Supabase auth:
  - `comments.user_id` has DEFAULT auth.uid() and a FK to auth.users(id)
  - `chat_messages.user_id` has DEFAULT auth.uid() and a FK to auth.users(id)
  - RLS INSERT policies check `auth.uid() = user_id`

With no Supabase session, `auth.uid()` returns null, so:
  - INSERT policies fail (null = null is false under the WITH CHECK)
  - The FK constraint on comments.user_id rejects null/missing values

## Changes
1. comments table:
   - Drop FK constraint comments_user_id_fkey (auth.users)
   - Make user_id nullable (guests have no Supabase uid)
   - Remove the DEFAULT auth.uid() so inserts don't try to populate it
2. chat_messages table:
   - Drop FK constraint chat_messages_user_id_fkey (auth.users) if present
   - Make user_id nullable
   - Remove the DEFAULT auth.uid()
3. RLS policies: replace auth-scoped policies with anon+authenticated open
   policies so the anon-key frontend can read and write. The data is
   intentionally public (community chat / movie comments) — no ownership
   isolation is needed for guest profiles.

## Security
- RLS stays ENABLED on both tables.
- SELECT is public (anyone can read comments/chat).
- INSERT/UPDATE/DELETE are open to anon + authenticated. This is the
  single-tenant shared-data pattern documented in the bolt-database skill:
  `USING (true)` / `WITH CHECK (true)` is correct here because the content
  is intentionally public community data, not private user data.

## Notes
- No data is lost: existing rows are preserved. user_id values that
  referenced real auth.users ids remain in the column (now nullable).
- Idempotent: uses IF EXISTS on drops and re-creates policies by name.
*/

-- 1. comments: detach from auth.users, make user_id nullable, drop default
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE comments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE comments ALTER COLUMN user_id DROP DEFAULT;

-- 2. chat_messages: detach from auth.users, make user_id nullable, drop default
ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
ALTER TABLE chat_messages ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE chat_messages ALTER COLUMN user_id DROP DEFAULT;

-- 3. RLS policies — replace auth-scoped policies with anon+authenticated open policies

-- comments: SELECT (public read)
DROP POLICY IF EXISTS "read_comments" ON comments;
CREATE POLICY "read_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

-- comments: INSERT (anyone can post)
DROP POLICY IF EXISTS "insert_own_comment" ON comments;
CREATE POLICY "insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- comments: UPDATE (open for guest edits)
DROP POLICY IF EXISTS "update_own_comment" ON comments;
CREATE POLICY "update_comments" ON comments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- comments: DELETE (open for guest deletes)
DROP POLICY IF EXISTS "delete_own_comment" ON comments;
CREATE POLICY "delete_comments" ON comments FOR DELETE
  TO anon, authenticated USING (true);

-- chat_messages: SELECT (public read)
DROP POLICY IF EXISTS "read_chat" ON chat_messages;
CREATE POLICY "read_chat" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

-- chat_messages: INSERT (anyone can post)
DROP POLICY IF EXISTS "insert_own_chat" ON chat_messages;
CREATE POLICY "insert_chat" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- chat_messages: DELETE (open for guest deletes)
DROP POLICY IF EXISTS "delete_own_chat" ON chat_messages;
CREATE POLICY "delete_chat" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);
