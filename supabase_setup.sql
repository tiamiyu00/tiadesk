-- ============================================================
-- TiaDesk — Supabase Setup SQL
-- Paste this entire script into the Supabase SQL Editor and run it.
-- ============================================================

-- ── 1. Drop tables if re-running ────────────────────────────
drop table if exists alerts cascade;
drop table if exists handover_notes cascade;
drop table if exists tasks cascade;
drop table if exists team_members cascade;

-- ── 2. team_members ─────────────────────────────────────────
create table team_members (
  id          text primary key,
  name        text not null,
  initials    text not null,
  status      text not null check (status in ('Active','Focus','Blocked','Meeting','Offline')),
  task        text not null default '',
  color       text not null,
  department  text not null,
  role        text not null,
  email       text not null
);

insert into team_members values
  ('am', 'Amara D.',  'AD', 'Active',  'Finalising API integration spec',       '#6366f1', 'Engineering',      'Lead Engineer',      'amara.d@workspace.io'),
  ('km', 'Kofi M.',   'KM', 'Focus',   'Deep work — dashboard UI',              '#0ea5e9', 'Design',           'Senior Designer',    'kofi.m@workspace.io'),
  ('fs', 'Fatima S.', 'FS', 'Blocked', 'Waiting on design approval',            '#f43f5e', 'Product',          'Product Manager',    'fatima.s@workspace.io'),
  ('jo', 'James O.',  'JO', 'Meeting', 'Sprint planning sync',                  '#eab308', 'Engineering',      'Backend Engineer',   'james.o@workspace.io'),
  ('nl', 'Nadia L.',  'NL', 'Active',  'Writing handover notes for v1.2',       '#22c55e', 'Operations',       'Ops Lead',           'nadia.l@workspace.io'),
  ('rb', 'Remi B.',   'RB', 'Offline', 'Performance audit (paused)',             '#a855f7', 'Engineering',      'DevOps Engineer',    'remi.b@workspace.io'),
  ('cc', 'Clara C.',  'CC', 'Active',  'Client onboarding documentation',       '#f97316', 'Customer Success',  'CS Manager',        'clara.c@workspace.io'),
  ('dm', 'Daniel M.', 'DM', 'Meeting', 'Stakeholder review — Q2 roadmap',       '#14b8a6', 'Product',          'Product Director',   'daniel.m@workspace.io');

-- ── 3. tasks ────────────────────────────────────────────────
create table tasks (
  id                text primary key,
  title             text not null,
  description       text not null default '',
  assignee          text not null,
  assignee_initials text not null,
  assignee_color    text not null,
  progress          integer not null default 0,
  deadline          date not null,
  priority          text not null check (priority in ('High','Medium','Low')),
  status            text not null check (status in ('In Progress','Blocked','Complete','Pending Review')),
  dependencies      text[] not null default '{}',
  owner             text not null,
  reviewer          text not null
);

insert into tasks values
  ('t1','API Integration Specification',       'Define and document the full API integration spec for v1.2 release.',              'Amara D.', 'AD','#6366f1', 78,'2026-05-12','High',  'In Progress',    '{t3}',  'Amara D.', 'Daniel M.'),
  ('t2','Dashboard UI Redesign',               'Full redesign of the ops dashboard with new component library.',                   'Kofi M.',  'KM','#0ea5e9', 55,'2026-05-14','High',  'In Progress',    '{}',    'Kofi M.',  'Fatima S.'),
  ('t3','Design System Approval',              'Pending sign-off from design leadership on the new component system.',             'Fatima S.','FS','#f43f5e', 40,'2026-05-10','High',  'Blocked',        '{}',    'Fatima S.','Daniel M.'),
  ('t4','Sprint Planning Documentation',       'Document sprint goals, capacity, and story point allocations.',                   'James O.', 'JO','#eab308', 90,'2026-05-09','Medium','Pending Review',  '{}',    'James O.', 'Amara D.'),
  ('t5','Handover Notes — v1.2',               'Structured handover notes covering all active tasks and context.',                 'Nadia L.', 'NL','#22c55e', 65,'2026-05-11','Medium','In Progress',    '{t1}',  'Nadia L.', 'Amara D.'),
  ('t6','Performance Audit',                   'Audit current system performance and identify bottlenecks.',                      'Remi B.',  'RB','#a855f7', 20,'2026-05-20','Low',   'Pending Review',  '{t1}',  'Remi B.',  'Amara D.'),
  ('t7','Client Onboarding Docs',              'Comprehensive onboarding documentation for enterprise clients.',                   'Clara C.', 'CC','#f97316', 82,'2026-05-13','High',  'In Progress',    '{}',    'Clara C.', 'Nadia L.'),
  ('t8','Q2 Roadmap Presentation',             'Stakeholder presentation covering Q2 roadmap and milestones.',                    'Daniel M.','DM','#14b8a6',100,'2026-05-09','High',  'Complete',        '{}',    'Daniel M.','Fatima S.');

-- ── 4. handover_notes ───────────────────────────────────────
create table handover_notes (
  id             text primary key,
  from_name      text not null,
  from_initials  text not null,
  from_color     text not null,
  to_name        text not null,
  to_initials    text not null,
  to_color       text not null,
  task           text not null,
  notes          text not null,
  timestamp      timestamptz not null,
  status         text not null check (status in ('Pending','Acknowledged','Complete')),
  priority       text not null check (priority in ('High','Medium','Low'))
);

insert into handover_notes values
  ('h1','Amara D.','AD','#6366f1','James O.', 'JO','#eab308','API Integration Spec — Section 3',
   'Section 3 is 80% complete. Auth endpoints are done; payment gateway endpoints still need schema definition. Reference the Notion doc linked in #api-spec Slack channel.',
   '2026-05-09T17:30:00+00','Acknowledged','High'),

  ('h2','Kofi M.', 'KM','#0ea5e9','Fatima S.','FS','#f43f5e','Dashboard UI — Component Review',
   'All components are in Figma under "v2 Dashboard". The stat cards need approval before dev handoff. Focus on mobile responsiveness for the team status table.',
   '2026-05-09T16:45:00+00','Pending','High'),

  ('h3','Nadia L.','NL','#22c55e','Clara C.', 'CC','#f97316','Client Onboarding — Module 4',
   'Module 4 covers the integrations section. Draft is in Google Docs. Clara to review the Zapier and Slack integration steps — they need screenshots updated.',
   '2026-05-09T14:00:00+00','Acknowledged','Medium'),

  ('h4','James O.','JO','#eab308','Remi B.',  'RB','#a855f7','Infrastructure Scale — Backend',
   'The DB indexing changes are deployed to staging. Remi to monitor query performance over the next 48h and flag if p99 latency exceeds 200ms.',
   '2026-05-08T18:00:00+00','Complete','Medium'),

  ('h5','Fatima S.','FS','#f43f5e','Daniel M.','DM','#14b8a6','Design System — Leadership Approval',
   'The design system v2 deck is ready. Waiting on Daniel to schedule the review meeting with leadership. All components are documented and Storybook is live.',
   '2026-05-08T15:30:00+00','Pending','High');

-- ── 5. alerts ───────────────────────────────────────────────
create table alerts (
  id         text primary key,
  type       text not null check (type in ('warning','error','info','success')),
  title      text not null,
  message    text not null,
  timestamp  timestamptz not null,
  read       boolean not null default false,
  department text not null
);

insert into alerts values
  ('a1','error',  'Task Blocked',          'Design System Approval has been blocked for 2 days. Fatima S. is waiting on design leadership sign-off.',       '2026-05-09T09:15:00+00', false, 'Product'),
  ('a2','warning','Deadline Risk',          'Sprint Planning Documentation is due today and pending review from Amara D.',                                     '2026-05-09T08:30:00+00', false, 'Engineering'),
  ('a3','warning','Team Member Offline',    'Remi B. has been offline for 3 hours during working hours. Performance Audit task is paused.',                   '2026-05-09T11:00:00+00', false, 'Engineering'),
  ('a4','info',   'Handover Pending',       'Kofi M. submitted a handover to Fatima S. that has not been acknowledged after 4 hours.',                        '2026-05-09T16:45:00+00', true,  'Design'),
  ('a5','success','Task Completed',         'Daniel M. completed the Q2 Roadmap Presentation. All stakeholder review items are documented.',                  '2026-05-09T14:20:00+00', true,  'Product'),
  ('a6','info',   'Sprint Ends in 3 Days',  'Current sprint ends on 12 May. 3 tasks are still in progress and 1 is blocked.',                                 '2026-05-09T07:00:00+00', true,  'All');

-- ── 6. Row-Level Security (enable but allow all for anon) ───
alter table team_members  enable row level security;
alter table tasks          enable row level security;
alter table handover_notes enable row level security;
alter table alerts         enable row level security;

create policy "allow all" on team_members  for all using (true) with check (true);
create policy "allow all" on tasks          for all using (true) with check (true);
create policy "allow all" on handover_notes for all using (true) with check (true);
create policy "allow all" on alerts         for all using (true) with check (true);
