import PomodoroTimer from './PomodoroTimer'

export default function Header({ onNewTask, onIncreaseFont, onDecreaseFont, currentFontSize }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Esquerda: Logo & Marca + Botões A- / A+ (Apenas Mobile/Tablet) */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-2xl font-extrabold text-lg shadow-lg shadow-indigo-500/25">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-100 text-sm sm:text-base tracking-tight">
                  TaskFlow Pro
                </h1>
                <span className="text-[9px] sm:text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Enterprise Agile
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
                Gestão de Quadros Kanban de Alta Performance
              </p>
            </div>
          </div>

          {/* Botões Aumentar (A+) e Diminuir (A-) Texto: Oculto no Desktop (lg:hidden) */}
          <div className="flex lg:hidden items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-semibold hidden xs:inline">
              Texto:
            </span>
            <button
              onClick={onDecreaseFont}
              title="Diminuir tamanho do texto"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer active:scale-95 border border-slate-700/50"
            >
              A-
            </button>
            <button
              onClick={onIncreaseFont}
              title="Aumentar tamanho do texto"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm shadow-indigo-500/30"
            >
              A+
            </button>
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
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>
    </header>
  )
}