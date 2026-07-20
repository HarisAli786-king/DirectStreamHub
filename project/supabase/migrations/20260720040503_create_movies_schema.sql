-- Global Cinema Hub: movies + genres + watch options
create extension if not exists "pgcrypto";

create table if not exists genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text,
  overview text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  year int,
  runtime_minutes int,
  rating numeric(3,1) default 0,
  country text,
  language text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists movie_genres (
  movie_id uuid references movies(id) on delete cascade,
  genre_id uuid references genres(id) on delete cascade,
  primary key (movie_id, genre_id)
);

create table if not exists watch_options (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references movies(id) on delete cascade,
  provider text not null,
  search_url text not null,
  created_at timestamptz default now()
);

-- No-auth public hub: anon + authenticated may read everything; writes are admin-only (blocked for anon by default).
alter table genres enable row level security;
alter table movies enable row level security;
alter table movie_genres enable row level security;
alter table watch_options enable row level security;

create policy "read_genres" on genres for select to anon, authenticated using (true);
create policy "read_movies" on movies for select to anon, authenticated using (true);
create policy "read_movie_genres" on movie_genres for select to anon, authenticated using (true);
create policy "read_watch_options" on watch_options for select to anon, authenticated using (true);

create index if not exists movies_featured_idx on movies(is_featured);
create index if not exists movies_rating_idx on movies(rating desc);
