import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import KanbanColumn from './components/KanbanColumn'
import TableView from './components/TableView'
import TaskModal from './components/TaskModal'

const COLUMNS = [
  { id: 'todo', title: 'A Fazer' },
  { id: 'blocked', title: 'Bloqueado' },
  { id: 'in_progress', title: 'Em Andamento' },
  { id: 'ready_to_test', title: 'Pronto p/ Teste' },
  { id: 'testing', title: 'Em Teste' },
  { id: 'done', title: 'Concluído' },
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
        title: 'Criar tela de carregamento',
        description: 'Carregamento de informações',
        status: 'todo',
        priority: 'Alta',
        tag: 'Design',
        dueDate: '2026-10-15',
        checklist: [],
      },
      {
        id: '2',
        title: 'Criar login',
        description: 'Criar acesso de login',
        status: 'todo',
        priority: 'Média',
        tag: 'Frontend',
        dueDate: '2026-10-15',
        checklist: [
          { text: 'Criar login_fase 1', completed: true },
          { text: 'Criar a senha', completed: false },
        ],
      },
      {
        id: '3',
        title: 'Criação de animação',
        description: 'Animação de função.',
        status: 'ready_to_test',
        priority: 'Alta',
        tag: 'Frontend',
        dueDate: '2026-11-15',
        checklist: [],
      },
    ]
  })

  // Estados de Filtro, Tamanho de Texto Numérico (Píxeis), Ordenação e Vista
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('kanban')
  
  // Base do tamanho da fonte em px (padrão: 16px, min: 12px, max: 22px)
  const [fontSize, setFontSize] = useState(16)

  // Modais e Toasts
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [toast, setToast] = useState(null)

  const fileInputRef = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  // Funções de Aumento e Diminuição de Fonte
  const handleIncreaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, 22))
  }

  const handleDecreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  // Efeito responsável por alterar dinamicamente a raiz do documento (funciona em mobile)
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    document.body.style.fontSize = `${fontSize}px`
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])

  // Lógica de Filtragem
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesTag = tagFilter ? task.tag === tagFilter : true

    return matchesSearch && matchesPriority && matchesTag
  })

  // Lógica de Ordenação
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const weights = { Urgente: 4, Alta: 3, Média: 2, Baixa: 1 }
      return (weights[b.priority] || 0) - (weights[a.priority] || 0)
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  const handleCreateOrUpdateTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t)))
      showToast('Tarefa atualizada com sucesso!')
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
      }
      setTasks([newTask, ...tasks])
      showToast('Nova tarefa criada com sucesso!')
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
    showToast('Tarefa eliminada!', 'info')
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    showToast('Estado da tarefa atualizado!')
  }

  const handleToggleChecklist = (taskId, subtaskIdx) => {
    setTasks(
      tasks.map((task) => {
        if (task.id !== taskId) return task
        const updatedChecklist = [...(task.checklist || [])]
        updatedChecklist[subtaskIdx].completed = !updatedChecklist[subtaskIdx].completed
        return { ...task, checklist: updatedChecklist }
      })
    )
  }

  // Backup: Exportar JSON
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('Backup exportado com sucesso!')
  }

  // Backup: Importar JSON
  const handleImportBackup = (e) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8')
      fileReader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target.result)
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks)
            showToast('Backup importado com sucesso!')
          } else {
            showToast('Formato de ficheiro inválido.', 'error')
          }
        } catch (error) {
          showToast('Erro ao ler o ficheiro JSON.', 'error')
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-all">
      {/* Cabeçalho com Temporizador Centralizado e Controlo de Fonte A- / A+ */}
      <Header
        onIncreaseFont={handleIncreaseFont}
        onDecreaseFont={handleDecreaseFont}
        currentFontSize={fontSize}
        onNewTask={() => {
          setEditingTask(null)
          setIsModalOpen(true)
        }}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        {/* Título do Painel */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            🚀 Taskflow Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gerencie suas tarefas com eficiência, foco e produtividade máxima.
          </p>
        </div>

        {/* Dashboard de Indicadores */}
        <Dashboard tasks={tasks} />

        {/* Barra de Filtros, Ordenação, Backups e Alternador de Vista */}
        <div className="flex flex-col lg:flex-row items-center gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-lg">
          {/* Campo de Pesquisa */}
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
            {/* Filtro por Prioridade */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Prioridades</option>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>

            {/* Filtro por Tag */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Todas Tags</option>
              <option value="Design">Design</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Bug">Bug</option>
              <option value="DevOps">DevOps</option>
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="col-span-2 sm:col-span-1 w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="default">↕️ Ordenar: Padrão</option>
              <option value="priority">⚡ Prioridade (Alta → Baixa)</option>
              <option value="dueDate">📅 Data Limite (Mais Urgente)</option>
            </select>

            {/* Botões de Backup */}
            <div className="col-span-2 sm:col-span-auto flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={handleExportBackup}
                title="Descarregar backup em JSON"
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                💾 Exportar
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportBackup}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                title="Carregar backup de ficheiro JSON"
                className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                📂 Importar
              </button>
            </div>

            {/* Alternador Kanban / Tabela */}
            <div className="col-span-2 sm:col-span-auto flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabela (List)
              </button>
            </div>
          </div>
        </div>

        {/* Contador de tarefas filtradas */}
        <div className="text-xs text-slate-400 font-medium px-1">
          Mostrando <span className="text-slate-200 font-bold">{sortedTasks.length}</span> de {tasks.length} tarefas
        </div>

        {/* Visualização de Quadros Kanban ou Tabela */}
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
                const columnTasks = sortedTasks.filter((t) => t.status === col.id)
                return (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    tasks={columnTasks}
                    allTasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onMove={handleStatusChange}
                    onStatusChange={handleStatusChange}
                    onToggleChecklist={handleToggleChecklist}
                  />
                )
              })}
            </motion.div>
          ) : (
            <TableView
              key="table"
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modal de Tarefas */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={editingTask}
        allTasks={tasks}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-slate-200 border-slate-700/60'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
            }`}
          >
            <span>{toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}</span>
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}