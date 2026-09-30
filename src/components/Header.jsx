import React from 'react';

export default function Header({
  onOpenNewTask,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  tagFilter,
  setTagFilter,
  sortBy,
  setSortBy,
}) {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo / Título */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold text-lg">
              📋
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 tracking-tight">TaskFlow Kanban</h1>
              <p className="text-xs text-slate-400">Gerencie seus projetos com agilidade</p>
            </div>
          </div>

          {/* Botão de Nova Tarefa visível em mobile */}
          <button
            onClick={onOpenNewTask}
            className="md:hidden flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
          >
            + Nova Tarefa
          </button>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Barra de Pesquisa */}
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-3.5 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por Prioridade */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="Todas">Todas Prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>

          {/* Filtro por Etiqueta (Tag) */}
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="Todas">Todas Tags</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Bug">Bug</option>
            <option value="Design">Design</option>
            <option value="Geral">Geral</option>
          </select>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
            <option value="az">Alfabética (A-Z)</option>
          </select>

          {/* Botão de Nova Tarefa (Desktop) */}
          <button
            onClick={onOpenNewTask}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
          >
            + Nova Tarefa
          </button>
        </div>

      </div>
    </header>
  );
}