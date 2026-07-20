/*
# Create comments and chat_messages tables for Global Cinema Hub

## Purpose
Stores user-generated content for the movie/TV streaming app: per-media comments
and a global community chat. Both tables are owner-scoped to the authenticated
Google user so only the author can modify or delete their own posts.

## New Tables

### comments
- `id` uuid, primary key (default gen_random_uuid)
- `media_id` bigint, not null — TMDB id of the movie/TV series being commented on
- `user_id` uuid, not null, defaults to auth.uid() — author reference to auth.users
- `user_name` text, not null — denormalized display name from Google profile
- `user_avatar` text — denormalized avatar URL from Google profile
- `text` text, not null — the comment body
- `created_at` timestamptz, default now()

### chat_messages
- `id` uuid, primary key (default gen_random_uuid)
- `user_id` uuid, not null, defaults to auth.uid() — author reference to auth.users
- `user_name` text, not null — denormalized display name from Google profile
- `user_avatar` text — denormalized avatar URL from Google profile
- `text` text, not null — the message body
- `created_at` timestamptz, default now()

## Security
- RLS enabled on both tables.
- SELECT is public (TO anon, authenticated) so guests can read comments and chat.
- INSERT/UPDATE/DELETE scoped TO authenticated with ownership check (auth.uid() = user_id).
- user_id columns default to auth.uid() so inserts that omit user_id still satisfy WITH CHECK.

## Notes
1. Comments and chat are readable by everyone (guests included) but only the
   authenticated author can create, edit, or delete their own rows.
2. Denormalized user_name/user_avatar are copied from the Google OAuth profile at
   insert time so the UI can render authors without an extra join.
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id bigint NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_avatar text,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_comments" ON comments;
CREATE POLICY "read_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_comment" ON comments;
CREATE POLICY "insert_own_comment" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_comment" ON comments;
CREATE POLICY "update_own_comment" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_comment" ON comments;
CREATE POLICY "delete_own_comment" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comments_media_id ON comments(media_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_avatar text,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_chat" ON chat_messages;
CREATE POLICY "read_chat" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_chat" ON chat_messages;
CREATE POLICY "insert_own_chat" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chat" ON chat_messages;
CREATE POLICY "delete_own_chat" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_messages(created_at DESC);
