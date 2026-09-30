import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KanbanColumn from './components/KanbanColumn';
import TaskModal from './components/TaskModal';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { 
        id: 1, 
        title: 'Configurar ambiente React', 
        description: 'Instalar dependências e organizar componentes.', 
        priority: 'Alta', 
        tag: 'Frontend', 
        dueDate: '2026-10-10', 
        subtasks: [
          { id: 101, text: 'Instalar Node.js e Vite', completed: true },
          { id: 102, text: 'Configurar Tailwind CSS', completed: true }
        ],
        status: 'done' 
      },
      { 
        id: 2, 
        title: 'Desenvolver layout do Kanban', 
        description: 'Criar colunas estilizadas com Tailwind CSS.', 
        priority: 'Média', 
        tag: 'Design', 
        dueDate: '2026-10-15', 
        subtasks: [
          { id: 201, text: 'Desenhar esquema de cores', completed: true },
          { id: 202, text: 'Criar componente de Cartão', completed: false }
        ],
        status: 'doing' 
      },
      { 
        id: 3, 
        title: 'Implementar filtros de busca', 
        description: 'Adicionar barra de pesquisa em tempo real.', 
        priority: 'Baixa', 
        tag: 'Backend', 
        dueDate: '2026-10-20', 
        subtasks: [
          { id: 301, text: 'Filtrar por texto', completed: false },
          { id: 302, text: 'Filtrar por prioridade e tag', completed: false }
        ],
        status: 'todo' 
      },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [tagFilter, setTagFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSaveTask = (newTask) => {
    if (taskToEdit) {
      setTasks(tasks.map((t) => (t.id === newTask.id ? newTask : t)));
    } else {
      setTasks([newTask, ...tasks]);
    }
    setTaskToEdit(null);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleMoveTask = (id, direction) => {
    const statusOrder = ['todo', 'doing', 'done'];
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const currentIndex = statusOrder.indexOf(task.status);
          const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
          if (newIndex >= 0 && newIndex < statusOrder.length) {
            return { ...task, status: statusOrder[newIndex] };
          }
        }
        return task;
      })
    );
  };

  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const processedTasks = tasks
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'Todas' || t.priority === priorityFilter;
      const matchesTag = tagFilter === 'Todas' || t.tag === tagFilter;
      return matchesSearch && matchesPriority && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        onOpenNewTask={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-x-auto">
        <div className="flex gap-6 min-w-[960px] pb-6">
          <KanbanColumn
            title="A Fazer"
            status="todo"
            tasks={processedTasks}
            onMove={handleMoveTask}
            onDelete={handleDeleteTask}
            onEdit={handleOpenEdit}
            colorClass="bg-amber-500"
          />
          <KanbanColumn
            title="Em Andamento"
            status="doing"
            tasks={processedTasks}
            onMove={handleMoveTask}
            onDelete={handleDeleteTask}
            onEdit={handleOpenEdit}
            colorClass="bg-indigo-500"
          />
          <KanbanColumn
            title="Concluído"
            status="done"
            tasks={processedTasks}
            onMove={handleMoveTask}
            onDelete={handleDeleteTask}
            onEdit={handleOpenEdit}
            colorClass="bg-emerald-500"
          />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}