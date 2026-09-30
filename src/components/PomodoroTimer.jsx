import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'

  useEffect(() => {
    let timer = null
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      if (mode === 'focus') {
        alert('Pomodoro concluído! Hora de fazer uma pausa de 5 minutos.')
        setTimeLeft(5 * 60)
        setMode('break')
      } else {
        alert('Pausa terminada! De volta ao foco total.')
        setTimeLeft(25 * 60)
        setMode('focus')
      }
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, mode])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = (newMode = mode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-inner">
      <div className="flex items-center gap-2">
        <span className="text-base">
          {mode === 'focus' ? '🎯' : '☕'}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {mode === 'focus' ? 'Foco' : 'Pausa'}
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-slate-100 tracking-tight">
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            isRunning
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
          }`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => resetTimer(mode)}
          title="Reiniciar temporizador"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors cursor-pointer"
        >
          🔄
        </motion.button>
      </div>

      {/* Alternar modo rápido */}
      <div className="hidden xl:flex items-center gap-1 border-l border-slate-800 pl-2.5">
        <button
          onClick={() => resetTimer('focus')}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
            mode === 'focus' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          25m
        </button>
        <button
          onClick={() => resetTimer('break')}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
            mode === 'break' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          5m
        </button>
      </div>
    </div>
  )
}