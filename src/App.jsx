import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import KanbanColumn from './components/KanbanColumn'
import TaskModal from './components/TaskModal'
import Dashboard from './components/Dashboard'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [fontSize, setFontSize] = useState('16px')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fileInputRef = useRef(null)

  // Aplica o tamanho de fonte globalmente no documento (raiz html)
  useEffect(() => {
    document.documentElement.style.fontSize = fontSize
  }, [fontSize])

  // Guarda sempre as alterações no localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])

  // Filtragem
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true
    const matchesTag = tagFilter ? task.tag === tagFilter : true

    return matchesSearch && matchesPriority && matchesTag
  })

  // Ordenação Inteligente
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const weights = { 'Alta': 3, 'Média': 2, 'Baixa': 1 }
      return (weights[b.priority] || 0) - (weights[a.priority] || 0)
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
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

  // Funcionalidade de Exportar Backup (JSON)
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Funcionalidade de Importar Backup (JSON)
  const handleImportBackup = (e) => {
    const fileReader = new FileReader()
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8")
      fileReader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target.result)
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks)
            alert("Backup importado com sucesso!")
          } else {
            alert("Formato de ficheiro inválido.")
          }
        } catch (error) {
          alert("Erro ao ler o ficheiro JSON.")
        }
      }
    }
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

        {/* Barra de Filtros, Ordenação e Gestão de Backups */}
        <div className="flex flex-col lg:flex-row items-center gap-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-lg">
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

          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full lg:w-auto flex-wrap">
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="col-span-2 sm:col-span-1 w-full sm:w-auto px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="default">↕️ Ordenar: Padrão</option>
              <option value="priority">⚡ Prioridade (Alta → Baixa)</option>
              <option value="dueDate">📅 Data Limite (Mais Urgente)</option>
            </select>

            {/* Botões de Backup corporativo */}
            <div className="col-span-2 sm:col-span-auto flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportBackup}
                title="Descarregar backup em JSON"
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                📂 Importar
              </button>
            </div>
          </div>
        </div>

        {/* Quadro Kanban (6 Colunas com Limites WIP corporativos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 items-start">
          <KanbanColumn
            title="A Fazer"
            status="todo"
            color="border-amber-500"
            dotColor="bg-amber-500"
            maxLimit={5}
            tasks={sortedTasks.filter((t) => t.status === 'todo')}
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
            maxLimit={3}
            tasks={sortedTasks.filter((t) => t.status === 'blocked')}
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
            maxLimit={4}
            tasks={sortedTasks.filter((t) => t.status === 'in_progress')}
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
            maxLimit={4}
            tasks={sortedTasks.filter((t) => t.status === 'ready_to_test')}
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
            maxLimit={3}
            tasks={sortedTasks.filter((t) => t.status === 'testing')}
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
            maxLimit={10}
            tasks={sortedTasks.filter((t) => t.status === 'done')}
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