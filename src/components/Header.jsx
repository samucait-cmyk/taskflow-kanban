import PomodoroTimer from './PomodoroTimer'

export default function Header({ onNewTask, fontSize, setFontSize }) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Esquerda: Logo & Marca + Ajuste de Texto (Apenas Mobile/Tablet) */}
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

          {/* Ajuste de Texto: Oculto em Desktops/Laptops (lg:hidden) e Visível apenas em Smartphones e Tablets */}
          <div className="flex lg:hidden items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-medium hidden xs:inline">
              Texto:
            </span>
            <button
              onClick={() => setFontSize('small')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                fontSize === 'small'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pequena
            </button>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                fontSize === 'normal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                fontSize === 'large'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grande
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