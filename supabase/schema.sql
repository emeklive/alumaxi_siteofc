-- Tabela genérica usada pelo site (orçamentos, contatos, candidaturas, produtos, artigos)
create table if not exists public.records (
  collection text not null,
  id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  primary key (collection, id)
);
create index if not exists records_collection_created_idx on public.records (collection, created_at desc);

-- Acesso apenas pelo servidor (service role). Nenhum acesso público.
alter table public.records enable row level security;

-- Bucket PRIVADO para anexos e currículos
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false)
on conflict (id) do nothing;
