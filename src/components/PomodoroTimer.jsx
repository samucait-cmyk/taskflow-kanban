import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  
  // Estados para o Tempo Excedido (Overtime)
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
              // Atingiu o limite exato
              setIsOvertime(true)
              setShowPopup(true)
            }
            return prev - 1
          })
        } else {
          // Já está em 0, contabilizar tempo excedido (overtime)
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
    setIsRunning(true) // Continua a correr automaticamente no novo modo
  }

  // Formatar tempo regular
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Formatar tempo excedido
  const otMinutes = Math.floor(overtimeSeconds / 60)
  const otSeconds = overtimeSeconds % 60
  const formattedOvertime = `+${String(otMinutes).padStart(2, '0')}:${String(otSeconds).padStart(2, '0')}`

  return (
    <div className="relative flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-inner">
      <div className="flex items-center gap-2">
        <span className="text-base">
          {mode === 'focus' ? '🎯' : '☕'}
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            {mode === 'focus' ? 'Foco' : 'Pausa'}
            {isOvertime && (
              <span className="text-rose-400 animate-pulse font-bold">• Limite Excedido</span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-sm sm:text-base font-bold tracking-tight ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {isOvertime ? formattedOvertime : formattedTime}
            </span>
          </div>
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

      {/* Popup Profissional de Limite Excedido */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 z-50 w-80 bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl p-4 backdrop-blur-xl flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                    {mode === 'focus' ? 'Tempo de Foco Esgotado!' : 'Pausa Terminada!'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {mode === 'focus'
                      ? 'Você ultrapassou os 25 minutos programados.'
                      : 'O tempo de descanso chegou ao fim.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Tempo excedido atual:</span>
              <span className="font-mono font-bold text-rose-400">{formattedOvertime}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {mode === 'focus' ? (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('break')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    ☕ Iniciar Pausa (5m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all cursor-pointer"
                  >
                    Continuar Foco
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSwitchModeAfterLimit('focus')}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    🎯 Voltar ao Foco (25m)
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-all cursor-pointer"
                  >
                    Estender Pausa
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