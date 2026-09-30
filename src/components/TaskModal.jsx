import React, { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');
  const [tag, setTag] = useState('Frontend');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setTag(taskToEdit.tag || 'Frontend');
      setDueDate(taskToEdit.dueDate || '');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Média');
      setTag('Frontend');
      setDueDate('');
      setSubtasks([]);
    }
    setNewSubtaskText('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { id: Date.now(), text: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((sub) => sub.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit ? taskToEdit.id : Date.now(),
      title,
      description,
      priority,
      tag,
      dueDate,
      subtasks,
      status: taskToEdit ? taskToEdit.status : 'todo',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <h3 className="text-base font-bold text-slate-100">
            {taskToEdit ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Título da Tarefa</label>
            <input
              type="text"
              required
              placeholder="Ex: Desenhar wireframes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Descrição</label>
            <textarea
              rows="2"
              placeholder="Detalhes ou passos da tarefa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Etiqueta (Tag)</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Bug">Bug</option>
                <option value="Design">Design</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Data de Vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Secção de Subtarefas */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Checklist / Subtarefas</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Adicionar subtarefa..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Adicionar
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs">
                    <span className={`text-slate-300 truncate ${sub.completed ? 'line-through text-slate-500' : ''}`}>
                      {sub.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-400 text-xs ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}