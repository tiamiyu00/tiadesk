export type StatusType = 'Active' | 'Focus' | 'Blocked' | 'Meeting' | 'Offline'
export type Priority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'In Progress' | 'Blocked' | 'Complete' | 'Pending Review'

export interface TeamMember {
  id: string
  name: string
  initials: string
  status: StatusType
  task: string
  color: string
  department: string
  role: string
  email: string
}

export interface Task {
  id: string
  title: string
  assignee: string
  assigneeInitials: string
  assigneeColor: string
  progress: number
  deadline: string
  priority: Priority
  status: TaskStatus
  dependencies: string[]
  owner: string
  reviewer: string
  description: string
}

export interface HandoverNote {
  id: string
  from: string
  fromInitials: string
  fromColor: string
  to: string
  toInitials: string
  toColor: string
  task: string
  notes: string
  timestamp: string
  status: 'Pending' | 'Acknowledged' | 'Complete'
  priority: Priority
}

export interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  department: string
}

export interface DailySummary {
  id: string
  date: string
  completedTasks: number
  blockedTasks: number
  pendingTasks: number
  highlights: string[]
  blockers: string[]
  nextDayPriorities: string[]
  generatedAt: string
}

export const teamMembers: TeamMember[] = [
  {
    id: 'am',
    name: 'Amara D.',
    initials: 'AD',
    status: 'Active',
    task: 'Finalising API integration spec',
    color: '#6366f1',
    department: 'Engineering',
    role: 'Lead Engineer',
    email: 'amara.d@workspace.io',
  },
  {
    id: 'km',
    name: 'Kofi M.',
    initials: 'KM',
    status: 'Focus',
    task: 'Deep work — dashboard UI',
    color: '#0ea5e9',
    department: 'Design',
    role: 'Senior Designer',
    email: 'kofi.m@workspace.io',
  },
  {
    id: 'fs',
    name: 'Fatima S.',
    initials: 'FS',
    status: 'Blocked',
    task: 'Waiting on design approval',
    color: '#f43f5e',
    department: 'Product',
    role: 'Product Manager',
    email: 'fatima.s@workspace.io',
  },
  {
    id: 'jo',
    name: 'James O.',
    initials: 'JO',
    status: 'Meeting',
    task: 'Sprint planning sync',
    color: '#eab308',
    department: 'Engineering',
    role: 'Backend Engineer',
    email: 'james.o@workspace.io',
  },
  {
    id: 'nl',
    name: 'Nadia L.',
    initials: 'NL',
    status: 'Active',
    task: 'Writing handover notes for v1.2',
    color: '#22c55e',
    department: 'Operations',
    role: 'Ops Lead',
    email: 'nadia.l@workspace.io',
  },
  {
    id: 'rb',
    name: 'Remi B.',
    initials: 'RB',
    status: 'Offline',
    task: 'Performance audit (paused)',
    color: '#a855f7',
    department: 'Engineering',
    role: 'DevOps Engineer',
    email: 'remi.b@workspace.io',
  },
  {
    id: 'cc',
    name: 'Clara C.',
    initials: 'CC',
    status: 'Active',
    task: 'Client onboarding documentation',
    color: '#f97316',
    department: 'Customer Success',
    role: 'CS Manager',
    email: 'clara.c@workspace.io',
  },
  {
    id: 'dm',
    name: 'Daniel M.',
    initials: 'DM',
    status: 'Meeting',
    task: 'Stakeholder review — Q2 roadmap',
    color: '#14b8a6',
    department: 'Product',
    role: 'Product Director',
    email: 'daniel.m@workspace.io',
  },
]

export const tasks: Task[] = [
  {
    id: 't1',
    title: 'API Integration Specification',
    assignee: 'Amara D.',
    assigneeInitials: 'AD',
    assigneeColor: '#6366f1',
    progress: 78,
    deadline: '2026-05-12',
    priority: 'High',
    status: 'In Progress',
    dependencies: ['t3'],
    owner: 'Amara D.',
    reviewer: 'Daniel M.',
    description: 'Define and document the full API integration spec for v1.2 release.',
  },
  {
    id: 't2',
    title: 'Dashboard UI Redesign',
    assignee: 'Kofi M.',
    assigneeInitials: 'KM',
    assigneeColor: '#0ea5e9',
    progress: 55,
    deadline: '2026-05-14',
    priority: 'High',
    status: 'In Progress',
    dependencies: [],
    owner: 'Kofi M.',
    reviewer: 'Fatima S.',
    description: 'Full redesign of the ops dashboard with new component library.',
  },
  {
    id: 't3',
    title: 'Design System Approval',
    assignee: 'Fatima S.',
    assigneeInitials: 'FS',
    assigneeColor: '#f43f5e',
    progress: 40,
    deadline: '2026-05-10',
    priority: 'High',
    status: 'Blocked',
    dependencies: [],
    owner: 'Fatima S.',
    reviewer: 'Daniel M.',
    description: 'Pending sign-off from design leadership on the new component system.',
  },
  {
    id: 't4',
    title: 'Sprint Planning Documentation',
    assignee: 'James O.',
    assigneeInitials: 'JO',
    assigneeColor: '#eab308',
    progress: 90,
    deadline: '2026-05-09',
    priority: 'Medium',
    status: 'Pending Review',
    dependencies: [],
    owner: 'James O.',
    reviewer: 'Amara D.',
    description: 'Document sprint goals, capacity, and story point allocations.',
  },
  {
    id: 't5',
    title: 'Handover Notes — v1.2',
    assignee: 'Nadia L.',
    assigneeInitials: 'NL',
    assigneeColor: '#22c55e',
    progress: 65,
    deadline: '2026-05-11',
    priority: 'Medium',
    status: 'In Progress',
    dependencies: ['t1'],
    owner: 'Nadia L.',
    reviewer: 'Amara D.',
    description: 'Structured handover notes covering all active tasks and context.',
  },
  {
    id: 't6',
    title: 'Performance Audit',
    assignee: 'Remi B.',
    assigneeInitials: 'RB',
    assigneeColor: '#a855f7',
    progress: 20,
    deadline: '2026-05-20',
    priority: 'Low',
    status: 'Pending Review',
    dependencies: ['t1'],
    owner: 'Remi B.',
    reviewer: 'Amara D.',
    description: 'Audit current system performance and identify bottlenecks.',
  },
  {
    id: 't7',
    title: 'Client Onboarding Docs',
    assignee: 'Clara C.',
    assigneeInitials: 'CC',
    assigneeColor: '#f97316',
    progress: 82,
    deadline: '2026-05-13',
    priority: 'High',
    status: 'In Progress',
    dependencies: [],
    owner: 'Clara C.',
    reviewer: 'Nadia L.',
    description: 'Comprehensive onboarding documentation for enterprise clients.',
  },
  {
    id: 't8',
    title: 'Q2 Roadmap Presentation',
    assignee: 'Daniel M.',
    assigneeInitials: 'DM',
    assigneeColor: '#14b8a6',
    progress: 100,
    deadline: '2026-05-09',
    priority: 'High',
    status: 'Complete',
    dependencies: [],
    owner: 'Daniel M.',
    reviewer: 'Fatima S.',
    description: 'Stakeholder presentation covering Q2 roadmap and milestones.',
  },
]

export const handovers: HandoverNote[] = [
  {
    id: 'h1',
    from: 'Amara D.',
    fromInitials: 'AD',
    fromColor: '#6366f1',
    to: 'James O.',
    toInitials: 'JO',
    toColor: '#eab308',
    task: 'API Integration Spec — Section 3',
    notes: 'Section 3 is 80% complete. Auth endpoints are done; payment gateway endpoints still need schema definition. Reference the Notion doc linked in #api-spec Slack channel.',
    timestamp: '2026-05-09T17:30:00',
    status: 'Acknowledged',
    priority: 'High',
  },
  {
    id: 'h2',
    from: 'Kofi M.',
    fromInitials: 'KM',
    fromColor: '#0ea5e9',
    to: 'Fatima S.',
    toInitials: 'FS',
    toColor: '#f43f5e',
    task: 'Dashboard UI — Component Review',
    notes: 'All components are in Figma under "v2 Dashboard". The stat cards need approval before dev handoff. Focus on mobile responsiveness for the team status table.',
    timestamp: '2026-05-09T16:45:00',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'h3',
    from: 'Nadia L.',
    fromInitials: 'NL',
    fromColor: '#22c55e',
    to: 'Clara C.',
    toInitials: 'CC',
    toColor: '#f97316',
    task: 'Client Onboarding — Module 4',
    notes: 'Module 4 covers the integrations section. Draft is in Google Docs. Clara to review the Zapier and Slack integration steps — they need screenshots updated.',
    timestamp: '2026-05-09T14:00:00',
    status: 'Acknowledged',
    priority: 'Medium',
  },
  {
    id: 'h4',
    from: 'James O.',
    fromInitials: 'JO',
    fromColor: '#eab308',
    to: 'Remi B.',
    toInitials: 'RB',
    toColor: '#a855f7',
    task: 'Infrastructure Scale — Backend',
    notes: 'The DB indexing changes are deployed to staging. Remi to monitor query performance over the next 48h and flag if p99 latency exceeds 200ms.',
    timestamp: '2026-05-08T18:00:00',
    status: 'Complete',
    priority: 'Medium',
  },
  {
    id: 'h5',
    from: 'Fatima S.',
    fromInitials: 'FS',
    fromColor: '#f43f5e',
    to: 'Daniel M.',
    toInitials: 'DM',
    toColor: '#14b8a6',
    task: 'Design System — Leadership Approval',
    notes: 'The design system v2 deck is ready. Waiting on Daniel to schedule the review meeting with leadership. All components are documented and Storybook is live.',
    timestamp: '2026-05-08T15:30:00',
    status: 'Pending',
    priority: 'High',
  },
]

export const alerts: Alert[] = [
  {
    id: 'a1',
    type: 'error',
    title: 'Task Blocked',
    message: 'Design System Approval has been blocked for 2 days. Fatima S. is waiting on design leadership sign-off.',
    timestamp: '2026-05-09T09:15:00',
    read: false,
    department: 'Product',
  },
  {
    id: 'a2',
    type: 'warning',
    title: 'Deadline Risk',
    message: 'Sprint Planning Documentation is due today and pending review from Amara D.',
    timestamp: '2026-05-09T08:30:00',
    read: false,
    department: 'Engineering',
  },
  {
    id: 'a3',
    type: 'warning',
    title: 'Team Member Offline',
    message: 'Remi B. has been offline for 3 hours during working hours. Performance Audit task is paused.',
    timestamp: '2026-05-09T11:00:00',
    read: false,
    department: 'Engineering',
  },
  {
    id: 'a4',
    type: 'info',
    title: 'Handover Pending',
    message: 'Kofi M. submitted a handover to Fatima S. that has not been acknowledged after 4 hours.',
    timestamp: '2026-05-09T16:45:00',
    read: true,
    department: 'Design',
  },
  {
    id: 'a5',
    type: 'success',
    title: 'Task Completed',
    message: 'Daniel M. completed the Q2 Roadmap Presentation. All stakeholder review items are documented.',
    timestamp: '2026-05-09T14:20:00',
    read: true,
    department: 'Product',
  },
  {
    id: 'a6',
    type: 'info',
    title: 'Sprint Ends in 3 Days',
    message: 'Current sprint ends on 12 May. 3 tasks are still in progress and 1 is blocked.',
    timestamp: '2026-05-09T07:00:00',
    read: true,
    department: 'All',
  },
]

export const dailySummaries: DailySummary[] = [
  {
    id: 's1',
    date: '2026-05-09',
    completedTasks: 4,
    blockedTasks: 3,
    pendingTasks: 8,
    highlights: [
      'Daniel M. completed the Q2 Roadmap Presentation ahead of schedule.',
      'Amara D. reached 78% completion on the API Integration Spec.',
      'Clara C. completed Module 4 of client onboarding documentation.',
      'Sprint velocity is on track — 91% productivity score.',
    ],
    blockers: [
      'Fatima S. is blocked on design system approval — requires leadership sign-off.',
      'Remi B. was offline for part of the afternoon, delaying the performance audit.',
      'API spec section 3 dependent on design approval before dev handoff.',
    ],
    nextDayPriorities: [
      'Resolve design system approval blocker — Daniel M. to schedule leadership review.',
      'Complete API spec section 3 — James O. to pick up from Amara D. handover.',
      'Dashboard UI component review — Fatima S. to review Kofi M. handover.',
      'Monitor DB indexing performance on staging — Remi B.',
    ],
    generatedAt: '2026-05-09T18:00:00',
  },
  {
    id: 's2',
    date: '2026-05-08',
    completedTasks: 6,
    blockedTasks: 1,
    pendingTasks: 9,
    highlights: [
      'Infrastructure DB indexing changes successfully deployed to staging.',
      'Client onboarding Module 3 completed by Clara C.',
      'Sprint planning session completed — all stories estimated.',
      'Team capacity at 100% — all 18 members active.',
    ],
    blockers: [
      'Design system approval still pending from previous day — escalated to Daniel M.',
    ],
    nextDayPriorities: [
      'API spec completion — Amara D. to finalise sections 2 and 3.',
      'Dashboard UI deep work session — Kofi M.',
      'Design system leadership review — Fatima S. to follow up with Daniel M.',
    ],
    generatedAt: '2026-05-08T18:00:00',
  },
  {
    id: 's3',
    date: '2026-05-07',
    completedTasks: 5,
    blockedTasks: 0,
    pendingTasks: 11,
    highlights: [
      'Q2 roadmap deck first draft completed by Daniel M.',
      'New team member onboarding completed for two engineers.',
      'Performance benchmark baseline established by Remi B.',
      'Zero blockers — best ops health score this week at 92.',
    ],
    blockers: [],
    nextDayPriorities: [
      'Begin design system review process.',
      'API spec work to resume after sprint planning.',
      'Client onboarding Module 3 — Clara C.',
    ],
    generatedAt: '2026-05-07T18:00:00',
  },
]
