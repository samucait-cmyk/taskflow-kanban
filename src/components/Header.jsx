import PomodoroTimer from './PomodoroTimer'

export default function Header({ onNewTask }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Esquerda: Logo & Marca */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2.5 rounded-2xl font-extrabold text-xl shadow-lg shadow-indigo-500/25">
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

        {/* Centro: Temporizador Pomodoro Centralizado */}
        <div className="flex-1 flex justify-center w-full md:w-auto">
          <PomodoroTimer />
        </div>

        {/* Direita: Botão Nova Tarefa */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewTask}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>
    </header>
  )
}