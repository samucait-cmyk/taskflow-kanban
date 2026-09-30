import { motion } from 'framer-motion'
import PomodoroTimer from './PomodoroTimer'

export default function Header({ onNewTask, fontSize, setFontSize }) {
  const fontSizes = [
    { label: 'Pequena', value: '14px' },
    { label: 'Normal', value: '16px' },
    { label: 'Grande', value: '18px' },
  ]

  return (
    <header className="bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logótipo e Título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base sm:text-lg tracking-tight flex items-center gap-2">
              TaskFlow Pro
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30 hidden sm:inline-block">
                Enterprise Agile
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Gestão de Quadros Kanban de Alta Performance
            </p>
          </div>
        </div>

        {/* Zona Central: Temporizador Pomodoro */}
        <div className="hidden md:flex items-center">
          <PomodoroTimer />
        </div>

        {/* Controlo de Acessibilidade (Tamanho de Letra) e Nova Tarefa */}
        <div className="flex items-center gap-3">
          {/* Seletor de Tamanho de Fonte */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
            <span className="text-xs text-slate-400 font-medium mr-1">Texto:</span>
            {fontSizes.map((item) => (
              <button
                key={item.value}
                onClick={() => setFontSize(item.value)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  fontSize === item.value
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Botão Nova Tarefa */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNewTask}
            className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            <span>Nova Tarefa</span>
          </motion.button>
        </div>

      </div>
    </header>
  )
}