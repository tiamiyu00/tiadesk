import Anthropic from '@anthropic-ai/sdk'
import type { Task, TeamMember, HandoverNote, Alert } from '../data/mockData'

const client = new Anthropic({
  apiKey: (import.meta.env.VITE_ANTHROPIC_API_KEY as string) || 'missing',
  dangerouslyAllowBrowser: true,
})

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export function buildWorkspaceContext(
  tasks: Task[],
  members: TeamMember[],
  handovers: HandoverNote[],
  alerts: Alert[]
): string {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const blocked = tasks.filter(t => t.status === 'Blocked')
  const inProgress = tasks.filter(t => t.status === 'In Progress')
  const complete = tasks.filter(t => t.status === 'Complete')
  const overdue = tasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Complete')
  const pending = handovers.filter(h => h.status === 'Pending')
  const unread = alerts.filter(a => !a.read)

  return `Today: ${today}

TEAM (${members.length} members):
${members.map(m => `• ${m.name} | ${m.role} | ${m.department} | ${m.status} | "${m.task}"`).join('\n')}

TASKS — ${tasks.length} total | In Progress: ${inProgress.length} | Blocked: ${blocked.length} | Complete: ${complete.length} | Overdue: ${overdue.length}

IN PROGRESS:
${inProgress.map(t => `• "${t.title}" — ${t.assignee} (${t.progress}%, due ${t.deadline}, ${t.priority})`).join('\n') || 'None'}

BLOCKED:
${blocked.map(t => `• "${t.title}" — ${t.assignee} (due ${t.deadline}, ${t.priority})`).join('\n') || 'None'}

${overdue.length > 0 ? `OVERDUE:\n${overdue.map(t => `• "${t.title}" — ${t.assignee} (was due ${t.deadline})`).join('\n')}\n` : ''}
PENDING HANDOVERS (${pending.length}):
${pending.map(h => `• ${h.from} → ${h.to}: "${h.task}" [${h.priority}]`).join('\n') || 'None'}

UNREAD ALERTS (${unread.length}):
${unread.map(a => `• [${a.type.toUpperCase()}] ${a.title}: ${a.message}`).join('\n') || 'None'}`
}

export async function streamChat(
  messages: ChatMessage[],
  workspaceContext: string,
  onToken: (token: string) => void
): Promise<void> {
  const stream = client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: `You are Workspace AI — an intelligent operations assistant embedded in a team dashboard. You have live access to team status, tasks, handovers, and alerts.

Be concise and direct. Use bullet points for lists. Reference specific names, tasks, and numbers from the data. Suggest concrete next actions. Keep responses under 200 words unless asked for a full summary.

CURRENT WORKSPACE DATA:
${workspaceContext}`,
    messages,
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onToken(chunk.delta.text)
    }
  }
}

export async function streamSummary(
  workspaceContext: string,
  onToken: (token: string) => void
): Promise<void> {
  const stream = client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 2000,
    system: 'You are Workspace AI. Generate sharp, data-driven operational summaries. Be specific — use names, numbers, and dates from the data.',
    messages: [{
      role: 'user',
      content: `Generate today's end-of-day operational summary using this exact structure:

## Executive Summary
(2-3 sentences on overall status and health)

## Key Achievements
(bullet list of what got done today)

## Blockers & Risks
(what's stuck, who's affected, urgency)

## Team Highlights
(individual callouts worth noting)

## Tomorrow's Top 3 Priorities
(numbered, specific, actionable)

WORKSPACE DATA:
${workspaceContext}`,
    }],
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onToken(chunk.delta.text)
    }
  }
}
