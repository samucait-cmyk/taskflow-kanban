import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [isOvertime, setIsOvertime] = useState(false)
  const [overtimeSeconds, setOvertimeSeconds] = useState(0)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    let timer = null
    if (isRunning) {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft((prev) => {
            if (prev === 1) {
              setIsOvertime(true)
              setShowPopup(true)
            }
            return prev - 1
          })
        } else {
          setOvertimeSeconds((prev) => prev + 1)
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = (newMode = mode) => {
    setIsRunning(false)
    setIsOvertime(false)
    setOvertimeSeconds(0)
    setShowPopup(false)
    setMode(newMode)
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60)
  }

  const handleSwitchModeAfterLimit = (targetMode) => {
    resetTimer(targetMode)
    setIsRunning(true)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const otMinutes = Math.floor(overtimeSeconds / 60)
  const otSeconds = overtimeSeconds % 60
  const formattedOvertime = `+${String(otMinutes).padStart(2, '0')}:${String(otSeconds).padStart(2, '0')}`

  return (
    <div className="relative flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner text-xs">
      <div className="flex items-center gap-2">
        <span>{mode === 'focus' ? '🎯' : '☕'}</span>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
            {mode === 'focus' ? 'FOCO' : 'PAUSA'}
            {isOvertime && <span className="text-rose-400 animate-pulse ml-1">• Excedido</span>}
          </span>
          <span className={`font-mono font-bold tracking-tight ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
            {isOvertime ? formattedOvertime : formattedTime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
        <button
          onClick={toggleTimer}
          className={`px-2.5 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
            isRunning
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>

        <button
          onClick={() => resetTimer(mode)}
          title="Reiniciar"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
        >
          🔄
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
        <button
          onClick={() => resetTimer('focus')}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            mode === 'focus' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400'
          }`}
        >
          25m
        </button>
        <button
          onClick={() => resetTimer('break')}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            mode === 'break' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400'
          }`}
        >
          5m
        </button>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-12 right-0 z-50 w-72 bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl p-3.5 flex flex-col gap-2.5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-rose-300">
                    {mode === 'focus' ? 'Tempo de Foco Esgotado!' : 'Pausa Terminada!'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Você passou do limite estipulado.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-slate-500 hover:text-slate-300 text-xs font-bold">✕</button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Tempo excedido:</span>
              <span className="font-mono font-bold text-rose-400">{formattedOvertime}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {mode === 'focus' ? (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('break')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                  >
                    ☕ Iniciar Pausa (5m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-2.5 py-1.5 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('focus')}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer"
                  >
                    🎯 Voltar ao Foco (25m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-2.5 py-1.5 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    Estender
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}