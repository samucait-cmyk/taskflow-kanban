import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import KanbanColumn from './components/KanbanColumn'
import TaskModal from './components/TaskModal'
import Dashboard from './components/Dashboard'

const initialTasks = [
  {
    id: '1',
    title: 'Implementar filtros de busca',
    description: 'Adicionar barra de pesquisa em tempo real.',
    status: 'todo',
    priority: 'Baixa',
    tag: 'Backend',
    dueDate: '2026-10-20',
    linkedTaskId: '',
    checklist: [
      { id: 'c1', text: 'Filtrar por texto', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Desenvolver layout do Kanban',
    description: 'Criar colunas estilizadas com Tailwind CSS.',
    status: 'in_progress',
    priority: 'Média',
    tag: 'Design',
    dueDate: '2026-10-15',
    linkedTaskId: '',
    checklist: [
      { id: 'c3', text: 'Desenhar esquema de cores', completed: true },
    ],
  },
]

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [fontSize, setFontSize] = useState('16px')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Aplica o tamanho de fonte globalmente no documento (raiz html)
  useEffect(() => {
    document.documentElement.style.fontSize = fontSize
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesTag = tagFilter ? task.tag === tagFilter : true

    return matchesSearch && matchesPriority && matchesTag
  })

  const handleOpenModal = (task = null) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      )
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
      }
      setTasks([...tasks, newTask])
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleMoveTask = (id, newStatus) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
  }

  const handleToggleChecklist = (taskId, itemIndex) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        const updatedChecklist = [...task.checklist]
        updatedChecklist[itemIndex] = {
          ...updatedChecklist[itemIndex],
          completed: !updatedChecklist[itemIndex].completed,
        }
        return { ...task, checklist: updatedChecklist }
      })
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Header
        onNewTask={() => handleOpenModal()}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Dashboard de Indicadores */}
        <Dashboard tasks={tasks} />

        {/* Barra de Filtros */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full md:w-auto">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Prioridades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Tags</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        {/* Quadro Kanban (6 Colunas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 items-start">
          <KanbanColumn
            title="A Fazer"
            status="todo"
            color="border-amber-500"
            dotColor="bg-amber-500"
            tasks={filteredTasks.filter((t) => t.status === 'todo')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />

          <KanbanColumn
            title="Bloqueado"
            status="blocked"
            color="border-rose-500"
            dotColor="bg-rose-500"
            tasks={filteredTasks.filter((t) => t.status === 'blocked')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />

          <KanbanColumn
            title="Em Andamento"
            status="in_progress"
            color="border-indigo-500"
            dotColor="bg-indigo-500"
            tasks={filteredTasks.filter((t) => t.status === 'in_progress')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />

          <KanbanColumn
            title="Pronto p/ Teste"
            status="ready_to_test"
            color="border-blue-500"
            dotColor="bg-blue-500"
            tasks={filteredTasks.filter((t) => t.status === 'ready_to_test')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />

          <KanbanColumn
            title="Em Teste"
            status="testing"
            color="border-purple-500"
            dotColor="bg-purple-500"
            tasks={filteredTasks.filter((t) => t.status === 'testing')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />

          <KanbanColumn
            title="Concluído"
            status="done"
            color="border-emerald-500"
            dotColor="bg-emerald-500"
            tasks={filteredTasks.filter((t) => t.status === 'done')}
            allTasks={tasks}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />
        </div>
      </main>

      {/* Modal Animado com AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            task={editingTask}
            allTasks={tasks}
            onClose={() => {
              setIsModalOpen(false)
              setEditingTask(null)
            }}
            onSave={handleSaveTask}
          />
        )}
      </AnimatePresence>
    </div>
  )
}