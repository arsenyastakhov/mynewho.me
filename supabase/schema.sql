create table if not exists public.properties (
  id text primary key,
  data jsonb not null
);

alter table public.properties enable row level security;
