import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import TeamStatus from './pages/TeamStatus'
import Handovers from './pages/Handovers'
import AISummaries from './pages/AISummaries'
import Reports from './pages/Reports'
import Workflow from './pages/Workflow'
import Hierarchy from './pages/Hierarchy'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import {
  fetchTasks, createTask, updateTask,
  fetchHandovers, createHandover, updateHandover,
  fetchAlerts, markAlertReadDB, markAllAlertsReadDB,
  fetchTeamMembers,
} from './lib/db'
import { teamMembers as fallbackMembers } from './data/mockData'
import type { Task, HandoverNote, Alert, TeamMember } from './data/mockData'

export type PageType =
  | 'dashboard' | 'team-status' | 'tasks' | 'workflow'
  | 'handovers' | 'ai-summaries' | 'reports'
  | 'hierarchy' | 'alerts' | 'settings'

function Spinner({ isDark }: { isDark: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5', gap: '16px',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#3b82f6',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '13.5px', color: isDark ? '#525252' : '#9ca3af' }}>
        Connecting to database…
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ErrorScreen({ message, isDark, onRetry }: { message: string; isDark: boolean; onRetry: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5', gap: '12px',
    }}>
      <div style={{ fontSize: '32px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#fafafa' : '#111827' }}>
        Database connection failed
      </div>
      <div style={{ fontSize: '13px', color: isDark ? '#737373' : '#6b7280', maxWidth: '320px', textAlign: 'center' }}>
        {message}
      </div>
      <button
        onClick={onRetry}
        style={{
          marginTop: '8px', padding: '8px 20px', borderRadius: '8px',
          border: 'none', backgroundColor: '#3b82f6', color: '#fff',
          fontSize: '13.5px', fontWeight: 500, cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(true)
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  const [taskList, setTaskList] = useState<Task[]>([])
  const [handoverList, setHandoverList] = useState<HandoverNote[]>([])
  const [alertList, setAlertList] = useState<Alert[]>([])
  const [memberList, setMemberList] = useState<TeamMember[]>(fallbackMembers)

  const loadAll = async () => {
    setLoading(true)
    setDbError(null)
    try {
      const [tasks, handovers, alerts, members] = await Promise.all([
        fetchTasks(),
        fetchHandovers(),
        fetchAlerts(),
        fetchTeamMembers(),
      ])
      setTaskList(tasks)
      setHandoverList(handovers)
      setAlertList(alerts)
      if (members.length > 0) setMemberList(members)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setDbError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  // ── Optimistic + DB sync handlers ───────────────────────────────────────

  const addTask = (t: Task) => {
    setTaskList(prev => [t, ...prev])
    createTask(t).catch(console.error)
  }
  const updateTaskHandler = (t: Task) => {
    setTaskList(prev => prev.map(x => x.id === t.id ? t : x))
    updateTask(t).catch(console.error)
  }

  const addHandover = (h: HandoverNote) => {
    setHandoverList(prev => [h, ...prev])
    createHandover(h).catch(console.error)
  }
  const updateHandoverHandler = (h: HandoverNote) => {
    setHandoverList(prev => prev.map(x => x.id === h.id ? h : x))
    updateHandover(h).catch(console.error)
  }

  const markAlertRead = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
    markAlertReadDB(id).catch(console.error)
  }
  const markAllAlertsRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })))
    markAllAlertsReadDB().catch(console.error)
  }

  const alertCount = alertList.filter(a => !a.read).length
  const border = isDark ? '#1a1a1a' : '#e5e7eb'
  const statusBarBg = isDark ? '#0d0d0d' : '#ffffff'

  if (loading) return <Spinner isDark={isDark} />
  if (dbError) return <ErrorScreen message={dbError} isDark={isDark} onRetry={loadAll} />

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard isDark={isDark} onNavigate={setCurrentPage} />
      case 'tasks':
        return <Tasks isDark={isDark} taskList={taskList} members={memberList} onAddTask={addTask} onUpdateTask={updateTaskHandler} />
      case 'team-status':
        return <TeamStatus isDark={isDark} members={memberList} />
      case 'handovers':
        return <Handovers isDark={isDark} handoverList={handoverList} members={memberList} onAddHandover={addHandover} onUpdateHandover={updateHandoverHandler} />
      case 'ai-summaries':
        return <AISummaries isDark={isDark} />
      case 'reports':
        return <Reports isDark={isDark} />
      case 'workflow':
        return <Workflow isDark={isDark} taskList={taskList} members={memberList} />
      case 'hierarchy':
        return <Hierarchy isDark={isDark} members={memberList} />
      case 'alerts':
        return <Alerts isDark={isDark} alertList={alertList} onMarkRead={markAlertRead} onMarkAllRead={markAllAlertsRead} />
      case 'settings':
        return <Settings isDark={isDark} />
      default:
        return <Dashboard isDark={isDark} onNavigate={setCurrentPage} />
    }
  }

  return (
    <div style={{
      display: 'flex', height: '100vh',
      backgroundColor: isDark ? '#0a0a0a' : '#f5f5f5',
      color: isDark ? '#fafafa' : '#111827', overflow: 'hidden',
    }}>
      <Sidebar
        isDark={isDark} currentPage={currentPage}
        onNavigate={setCurrentPage} alertCount={alertCount}
        taskCount={taskList.length}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopNav
          isDark={isDark} currentPage={currentPage}
          onNavigate={setCurrentPage} onToggleTheme={() => setIsDark(!isDark)}
          alertCount={alertCount}
        />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {renderPage()}
        </div>
        <div style={{
          height: '32px', padding: '0 24px',
          borderTop: `1px solid ${border}`, backgroundColor: statusBarBg,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '11.5px', color: isDark ? '#404040' : '#9ca3af', flexShrink: 0,
        }}>
          <span>
            <span style={{ color: '#22c55e', marginRight: '5px' }}>●</span>
            Connected to Supabase · Live
          </span>
          <span>Workspace v1.0 · Confidential</span>
        </div>
      </div>
    </div>
  )
}

export default App
