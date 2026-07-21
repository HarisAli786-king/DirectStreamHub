/*
# Drop FK constraint on chat_messages.user_id

## Purpose
The chat_messages table has a foreign key on user_id -> auth.users(id). This
blocks seeding sample/welcome chat messages because there is no real auth.users
row to reference. Dropping the FK allows seed rows with synthetic user_ids while
RLS still enforces that only authenticated authors can insert their own messages.

## Changes
- Drop constraint chat_messages_user_id_fkey
- Keep the user_id column and RLS policies unchanged
*/

ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
