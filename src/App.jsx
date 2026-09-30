import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import PomodoroTimer from './components/PomodoroTimer'
import KanbanColumn from './components/KanbanColumn'
import TableView from './components/TableView'
import TaskModal from './components/TaskModal'
import Dashboard from './components/Dashboard'

const COLUMNS = [
  { id: 'todo', title: 'A Fazer', color: 'border-amber-500/30 bg-amber-500/5' },
  { id: 'blocked', title: 'Bloqueado', color: 'border-rose-500/30 bg-rose-500/5' },
  { id: 'in_progress', title: 'Em Andamento', color: 'border-indigo-500/30 bg-indigo-500/5' },
  { id: 'ready_to_test', title: 'Pronto p/ Teste', color: 'border-blue-500/30 bg-blue-500/5' },
  { id: 'testing', title: 'Em Teste', color: 'border-purple-500/30 bg-purple-500/5' },
  { id: 'done', title: 'Concluído', color: 'border-emerald-500/30 bg-emerald-500/5' },
]

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      {
        id: '1',
        title: 'Criar wireframe da interface',
        description: 'Desenhar rascunhos iniciais do painel principal.',
        status: 'todo',
        priority: 'Alta',
        tag: 'Design',
        dueDate: '2026-10-10',
      },
      {
        id: '2',
        title: 'Configurar rotas do React',
        description: 'Implementar navegação entre páginas.',
        status: 'in_progress',
        priority: 'Média',
        tag: 'Desenvolvimento',
        dueDate: '2026-10-12',
      },
    ]
  })

  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'table'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleCreateOrUpdateTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t))
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
      }
      setTasks([newTask, ...tasks])
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  // Filtragem de tarefas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = selectedTag === 'All' || task.tag === selectedTag
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority
    return matchesSearch && matchesTag && matchesPriority
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header 
        onNewTask={() => { setEditingTask(null); setIsModalOpen(true); }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        {/* Barra superior com Pomodoro e Estatísticas */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>🚀</span> Taskflow Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Gerencie suas tarefas com eficiência, foco e produtividade máxima.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <PomodoroTimer />
          </div>
        </div>

        {/* Dashboard de Estatísticas */}
        <Dashboard tasks={tasks} />

        {/* Seletor de visualização (Kanban vs Tabela) e contagem */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs text-slate-400 font-medium">
            Mostrando <span className="text-slate-200 font-bold">{filteredTasks.length}</span> de {tasks.length} tarefas
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabela (List)
            </button>
          </div>
        </div>

        {/* Área Principal: Kanban ou Tabela */}
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-start pb-6"
            >
              {COLUMNS.map((col) => {
                const columnTasks = filteredTasks.filter(t => t.status === col.id)
                return (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    tasks={columnTasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                )
              })}
            </motion.div>
          ) : (
            <TableView
              key="table"
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modal de Criação / Edição de Tarefas */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={editingTask}
      />
    </div>
  )
}