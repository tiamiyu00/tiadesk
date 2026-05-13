import { supabase } from './supabase'
import type { Task, HandoverNote, Alert, TeamMember } from '../data/mockData'

// ── Row mappers (snake_case DB → camelCase TS) ──────────────────────────────

const toTask = (r: Record<string, unknown>): Task => ({
  id: r.id as string,
  title: r.title as string,
  description: (r.description as string) ?? '',
  assignee: r.assignee as string,
  assigneeInitials: r.assignee_initials as string,
  assigneeColor: r.assignee_color as string,
  progress: r.progress as number,
  deadline: r.deadline as string,
  priority: r.priority as Task['priority'],
  status: r.status as Task['status'],
  dependencies: (r.dependencies as string[]) ?? [],
  owner: r.owner as string,
  reviewer: r.reviewer as string,
})

const toHandover = (r: Record<string, unknown>): HandoverNote => ({
  id: r.id as string,
  from: r.from_name as string,
  fromInitials: r.from_initials as string,
  fromColor: r.from_color as string,
  to: r.to_name as string,
  toInitials: r.to_initials as string,
  toColor: r.to_color as string,
  task: r.task as string,
  notes: r.notes as string,
  timestamp: r.timestamp as string,
  status: r.status as HandoverNote['status'],
  priority: r.priority as HandoverNote['priority'],
})

const toAlert = (r: Record<string, unknown>): Alert => ({
  id: r.id as string,
  type: r.type as Alert['type'],
  title: r.title as string,
  message: r.message as string,
  timestamp: r.timestamp as string,
  read: r.read as boolean,
  department: r.department as string,
})

const toMember = (r: Record<string, unknown>): TeamMember => ({
  id: r.id as string,
  name: r.name as string,
  initials: r.initials as string,
  status: r.status as TeamMember['status'],
  task: r.task as string,
  color: r.color as string,
  department: r.department as string,
  role: r.role as string,
  email: r.email as string,
})

// ── Tasks ───────────────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks').select('*').order('deadline', { ascending: true })
  if (error) throw error
  return (data ?? []).map(toTask)
}

export async function createTask(t: Task): Promise<void> {
  const { error } = await supabase.from('tasks').insert({
    id: t.id, title: t.title, description: t.description,
    assignee: t.assignee, assignee_initials: t.assigneeInitials,
    assignee_color: t.assigneeColor, progress: t.progress,
    deadline: t.deadline, priority: t.priority, status: t.status,
    dependencies: t.dependencies, owner: t.owner, reviewer: t.reviewer,
  })
  if (error) throw error
}

export async function updateTask(t: Task): Promise<void> {
  const { error } = await supabase.from('tasks').update({
    title: t.title, description: t.description,
    assignee: t.assignee, assignee_initials: t.assigneeInitials,
    assignee_color: t.assigneeColor, progress: t.progress,
    deadline: t.deadline, priority: t.priority, status: t.status,
    dependencies: t.dependencies, owner: t.owner, reviewer: t.reviewer,
  }).eq('id', t.id)
  if (error) throw error
}

// ── Handover Notes ──────────────────────────────────────────────────────────

export async function fetchHandovers(): Promise<HandoverNote[]> {
  const { data, error } = await supabase
    .from('handover_notes').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toHandover)
}

export async function createHandover(h: HandoverNote): Promise<void> {
  const { error } = await supabase.from('handover_notes').insert({
    id: h.id, from_name: h.from, from_initials: h.fromInitials,
    from_color: h.fromColor, to_name: h.to, to_initials: h.toInitials,
    to_color: h.toColor, task: h.task, notes: h.notes,
    timestamp: h.timestamp, status: h.status, priority: h.priority,
  })
  if (error) throw error
}

export async function updateHandover(h: HandoverNote): Promise<void> {
  const { error } = await supabase.from('handover_notes')
    .update({ status: h.status }).eq('id', h.id)
  if (error) throw error
}

// ── Alerts ──────────────────────────────────────────────────────────────────

export async function fetchAlerts(): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toAlert)
}

export async function markAlertReadDB(id: string): Promise<void> {
  const { error } = await supabase.from('alerts')
    .update({ read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllAlertsReadDB(): Promise<void> {
  const { error } = await supabase.from('alerts')
    .update({ read: true }).eq('read', false)
  if (error) throw error
}

// ── Team Members ────────────────────────────────────────────────────────────

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members').select('*').order('name')
  if (error) throw error
  return (data ?? []).map(toMember)
}
