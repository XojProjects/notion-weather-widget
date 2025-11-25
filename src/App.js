import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('stopwatch');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      const startTime = parseInt(localStorage.getItem('startTime')) || Date.now();

      if (!localStorage.getItem('startTime')) {
        localStorage.setItem('startTime', startTime.toString());
      }

      intervalId = setInterval(() => {
        if (mode === 'stopwatch') {
          const elapsedTime = Date.now() - startTime;
          const newSeconds = Math.floor(elapsedTime / 1000);
          setTime(newSeconds);
        } else {
          setTime(prevTime => {
            if (prevTime <= 0) {
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, mode]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);

  const handlePause = () => {
    setIsRunning(false);
    localStorage.removeItem('startTime');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(mode === 'timer' && inputMinutes ? parseInt(inputMinutes) * 60 : 0);
    localStorage.removeItem('startTime');
  };

  const handleModeToggle = () => {
    setIsRunning(false);
    setTime(0);
    setMode(prev => (prev === 'stopwatch' ? 'timer' : 'stopwatch'));
  };

  const handleTimerInput = e => {
    const value = e.target.value;
    setInputMinutes(value);
    if (value && !isRunning) {
      setTime(parseInt(value) * 60);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-start bg-transparent font-mono text-[#c084fc] px-2">
      <div className="w-full max-w-[700px] p-2">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl tracking-widest text-purple-400">
            {mode === 'stopwatch' ? 'FLOW STATE' : 'TIME MODULE'}
          </h2>

          <button
            onClick={handleModeToggle}
            className="px-3 py-1 rounded-full text-xs tracking-wider bg-purple-600/20 border border-purple-500 text-purple-300 hover:bg-purple-600/40"
          >
            {mode === 'stopwatch' ? 'TIMER MODE' : 'FLOW MODE'}
          </button>
        </div>

        {mode === 'timer' && !isRunning && (
          <input
            type="number"
            value={inputMinutes}
            onChange={handleTimerInput}
            placeholder="Minutes"
            className="w-full mb-4 bg-black/60 border border-purple-500 text-cyan-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        <div className="text-[3.1rem] text-center my-6 tracking-[0.25em] text-[#9b7df5] drop-shadow-[0_0_4px_rgba(155,125,245,0.35)]">
          {formatTime(time)}
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 border border-[#8b5cf6]/40 text-[#e9d5ff] py-2 rounded-lg hover:bg-[#8b5cf6]/15 shadow-[0_0_10px_rgba(139,92,246,0.45)]"
            >
              START
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 border border-[#a855f7]/40 text-[#f5d0fe] py-2 rounded-lg hover:bg-[#a855f7]/15 shadow-[0_0_10px_rgba(168,85,247,0.45)]"
            >
              PAUSE
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex-1 border border-[#9333ea]/40 text-[#d8b4fe] py-2 rounded-lg hover:bg-[#9333ea]/15 shadow-[0_0_10px_rgba(147,51,234,0.4)]"
          >
            RESET
          </button>
        </div>

      </div>
    </div>
  );
}
