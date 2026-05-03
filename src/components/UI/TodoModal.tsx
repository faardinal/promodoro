import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { X, Plus, Trash2, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import { TodoTask } from '../../types';
import { audioService } from '../../services/audioService';

interface TodoModalProps {
  tasks: TodoTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (from: number, to: number) => void;
  onReorder: (newTasks: TodoTask[]) => void;
  onClose: () => void;
}

export default function TodoModal({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onReorder,
  onClose 
}: TodoModalProps) {
  const [newText, setNewText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newText.trim()) {
      audioService.playSFX('click');
      onAddTask(newText.trim());
      setNewText('');
    }
  };

  const handleToggle = (id: string) => {
    audioService.playSFX('click');
    onToggleTask(id);
  };

  const handleDelete = (id: string) => {
    audioService.playSFX('click');
    onDeleteTask(id);
  };

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90svh] md:max-h-[80vh]"
      >
        {/* Header */}
        <div className="p-5 md:p-6 pb-2 md:pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tasks</h2>
            <p className="text-stone-500 text-xs md:text-sm mt-0.5 font-medium italic">Clear mind, clear work.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add Area */}
        <div className="px-5 md:px-6 mb-4 md:mb-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add a task..."
              className="flex-1 bg-stone-800/50 border border-stone-800 text-white px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl focus:outline-none focus:border-stone-700 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              className="bg-stone-100 text-stone-900 p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-white disabled:opacity-30 disabled:hover:bg-stone-100 transition-all active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 pb-6 custom-scrollbar">
          <Reorder.Group axis="y" values={tasks} onReorder={onReorder} className="space-y-2">
            <AnimatePresence initial={false}>
              {tasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center opacity-30"
                >
                  <p className="text-base md:text-lg italic font-medium">Nothing here. A peaceful start.</p>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <Reorder.Item
                    key={task.id}
                    value={task}
                    initial={{ opacity: 0, scale: 0.98, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                    className="group flex items-center gap-2 md:gap-3 bg-stone-800/20 hover:bg-stone-800/40 border border-stone-800/50 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all cursor-default"
                  >
                    <div className="p-1 cursor-grab active:cursor-grabbing text-stone-700 group-hover:text-stone-500 transition-colors">
                      <GripVertical size={14} className="md:w-4 md:h-4" />
                    </div>
                    
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-stone-700 hover:text-stone-500'}`}
                    >
                      {task.completed ? <CheckCircle2 size={20} className="md:w-6 md:h-6" /> : <Circle size={20} className="md:w-6 md:h-6" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium block truncate transition-all duration-300 ${task.completed ? 'text-stone-600 line-through' : 'text-stone-200'}`}>
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 md:p-2 md:hidden group-hover:block rounded-lg md:rounded-xl hover:bg-red-500/10 text-stone-700 hover:text-red-400 transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </Reorder.Item>
                ))
              )}
            </AnimatePresence>
          </Reorder.Group>

          {tasks.length > 0 && completedCount === tasks.length && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center opacity-40 italic text-[11px] md:text-sm py-4 border-t border-stone-800/50"
            >
              Everything done. Impressive.
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 md:p-6 bg-stone-900 border-t border-stone-800 flex-shrink-0">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
            <span className="text-stone-500">{tasks.length - completedCount} REMAINING</span>
            <span className="text-stone-300">{completedCount} COMPLETED TODAY</span>
          </div>
          <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-stone-100"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
