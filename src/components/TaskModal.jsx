import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TaskModal({ isOpen = false, onClose, onSave, taskToEdit }) {
  if (!isOpen) return null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('Média')
  const [tag, setTag] = useState('Desenvolvimento')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '')
      setDescription(taskToEdit.description || '')
      setStatus(taskToEdit.status || 'todo')
      setPriority(taskToEdit.priority || 'Média')
      setTag(taskToEdit.tag || 'Desenvolvimento')
      setDueDate(taskToEdit.dueDate || '')
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('Média')
      setTag('Desenvolvimento')
      setDueDate(new Date().toISOString().split('T')[0])
    }
  }, [taskToEdit, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title,
      description,
      status,
      priority,
      tag,
      dueDate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold">
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Título *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criar tela de carregamento"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre a tarefa..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Status / Coluna</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="todo">A Fazer</option>
                <option value="blocked">Bloqueado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="ready_to_test">Pronto p/ Teste</option>
                <option value="testing">Em Teste</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="Design">Design</option>
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Bug">Bug</option>
                <option value="Marketing">Marketing</option>
                <option value="Pesquisa">Pesquisa</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Data Limite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}