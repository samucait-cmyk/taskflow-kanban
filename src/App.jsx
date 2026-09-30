import { useState } from 'react'
import Header from './components/Header'
import KanbanColumn from './components/KanbanColumn'
import TaskModal from './components/TaskModal'

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Implementar filtros de busca',
    description: 'Adicionar barra de pesquisa em tempo real.',
    status: 'todo',
    priority: 'Baixa',
    tag: 'Backend',
    dueDate: '2026-10-20',
    checklist: [
      { id: 'c1', text: 'Filtrar por texto', completed: false },
      { id: 'c2', text: 'Filtrar por prioridade e tag', completed: false },
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
    checklist: [
      { id: 'c3', text: 'Desenhar esquema de cores', completed: true },
      { id: 'c4', text: 'Criar componente de Cartão', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Configurar ambiente React',
    description: 'Instalar dependências e organizar componentes.',
    status: 'done',
    priority: 'Alta',
    tag: 'Frontend',
    dueDate: '2026-10-10',
    checklist: [
      { id: 'c5', text: 'Instalar Node.js e Vite', completed: true },
      { id: 'c6', text: 'Configurar Tailwind CSS', completed: true },
    ],
  },
]

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
    } else {
      const newTask = {
        ...taskData,
        id: Date.now().toString(),
        checklist: taskData.checklist || [],
      }
      setTasks([...tasks, newTask])
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleMoveTask = (id, newStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  const handleToggleChecklist = (taskId, itemIndex) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        const updatedChecklist = [...task.checklist]
        updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed
        return { ...task, checklist: updatedChecklist }
      })
    )
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter ? t.priority === priorityFilter : true
    const matchesTag = tagFilter ? t.tag === tagFilter : true
    return matchesSearch && matchesPriority && matchesTag
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header onOpenNewTask={() => { setEditingTask(null); setIsModalOpen(true); }} />

        {/* Barra de Pesquisa e Filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas Prioridades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas Tags</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        {/* Colunas do Kanban - Empilhadas no telemóvel, Lado a lado no Computador */}
        <main className="flex flex-col md:flex-row gap-6 items-start">
          <KanbanColumn
            title="A Fazer"
            status="todo"
            color="border-amber-500"
            dotColor="bg-amber-500"
            tasks={filteredTasks.filter((t) => t.status === 'todo')}
            onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
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
            onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
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
            onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onToggleChecklist={handleToggleChecklist}
          />
        </main>
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  )
}