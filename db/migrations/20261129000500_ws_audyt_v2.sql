-- Audyt IG v2 (27.11.2026): nowe źródło danych „scrape” (ScrapeCreators + Gemini). Tylko rozszerzenie warunku, bez zmian w danych.
alter table public.ws_audit_requests drop constraint if exists ws_audit_requests_source_check;
alter table public.ws_audit_requests add constraint ws_audit_requests_source_check check (source in ('meta', 'reczne', 'test', 'scrape'));
