import PomodoroTimer from './PomodoroTimer'

export default function Header({ onNewTask }) {
  return (
    <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Marca */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl font-extrabold text-lg shadow-lg shadow-indigo-500/30">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-100 text-base tracking-tight">
                TaskFlow Pro
              </h1>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Enterprise Agile
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Gestão de Quadros Kanban de Alta Performance
            </p>
          </div>
        </div>

        {/* Único Temporizador Pomodoro + Botão Criar Tarefa */}
        <div className="flex items-center gap-3">
          <PomodoroTimer />

          <button
            onClick={onNewTask}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer shrink-0"
          >
            <span>+</span> Nova Tarefa
          </button>
        </div>
      </div>
    </header>
  )
}