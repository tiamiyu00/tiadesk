import { useState } from 'react'
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
  tasks as initialTasks,
  handovers as initialHandovers,
  alerts as initialAlerts,
  type Task,
  type HandoverNote,
  type Alert,
} from './data/mockData'

export type PageType =
  | 'dashboard' | 'team-status' | 'tasks' | 'workflow'
  | 'handovers' | 'ai-summaries' | 'reports'
  | 'hierarchy' | 'alerts' | 'settings'

function App() {
  const [isDark, setIsDark] = useState(true)
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

  const [taskList, setTaskList] = useState<Task[]>(initialTasks)
  const [handoverList, setHandoverList] = useState<HandoverNote[]>(initialHandovers)
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts)

  const addTask = (t: Task) => setTaskList(prev => [t, ...prev])
  const updateTask = (t: Task) => setTaskList(prev => prev.map(x => x.id === t.id ? t : x))

  const addHandover = (h: HandoverNote) => setHandoverList(prev => [h, ...prev])
  const updateHandover = (h: HandoverNote) => setHandoverList(prev => prev.map(x => x.id === h.id ? h : x))

  const markAlertRead = (id: string) => setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const markAllAlertsRead = () => setAlertList(prev => prev.map(a => ({ ...a, read: true })))

  const alertCount = alertList.filter(a => !a.read).length
  const border = isDark ? '#1a1a1a' : '#e5e7eb'
  const statusBarBg = isDark ? '#0d0d0d' : '#ffffff'

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard isDark={isDark} onNavigate={setCurrentPage} />
      case 'tasks':
        return <Tasks isDark={isDark} taskList={taskList} onAddTask={addTask} onUpdateTask={updateTask} />
      case 'team-status':
        return <TeamStatus isDark={isDark} />
      case 'handovers':
        return <Handovers isDark={isDark} handoverList={handoverList} onAddHandover={addHandover} onUpdateHandover={updateHandover} />
      case 'ai-summaries':
        return <AISummaries isDark={isDark} />
      case 'reports':
        return <Reports isDark={isDark} />
      case 'workflow':
        return <Workflow isDark={isDark} taskList={taskList} />
      case 'hierarchy':
        return <Hierarchy isDark={isDark} />
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
      color: isDark ? '#fafafa' : '#111827',
      overflow: 'hidden',
    }}>
      <Sidebar
        isDark={isDark}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        alertCount={alertCount}
        taskCount={taskList.length}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopNav
          isDark={isDark}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onToggleTheme={() => setIsDark(!isDark)}
          alertCount={alertCount}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {renderPage()}
        </div>

        <div style={{
          height: '32px', padding: '0 24px',
          borderTop: `1px solid ${border}`,
          backgroundColor: statusBarBg,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '11.5px', color: isDark ? '#404040' : '#9ca3af', flexShrink: 0,
        }}>
          <span>
            <span style={{ color: '#22c55e', marginRight: '5px' }}>●</span>
            All systems live · Last sync 8 seconds ago
          </span>
          <span>Workspace v1.0 · Confidential</span>
        </div>
      </div>
    </div>
  )
}

export default App
