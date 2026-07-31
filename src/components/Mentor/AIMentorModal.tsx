import React, { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { MentorMessage, Problem } from '../../types';

interface AIMentorModalProps {
  problem: Problem | null;
  onClose: () => void;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({
  problem,
  onClose,
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'm-1',
      sender: 'mentor',
      text: `Observation\n\n• Look closely at the problem statement to identify key constraints.\n• Check if the question asks for contiguous elements or a window.\n• Notice what target value or length needs to be calculated.\n\nThink about this:\n\nWhat key pattern trigger stands out to you first?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hintLevel: 1,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState(1);

  if (!problem) return null;

  const handleSendMessage = async (userText?: string, hintLevelOverride?: number) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const newLevel = hintLevelOverride || currentHintLevel;

    const userMsg: MentorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemStatement: problem.statement,
          patternName: problem.patternName,
          history: updatedHistory.map((m) => ({ sender: m.sender, text: m.text })),
          hintLevel: newLevel,
        }),
      });

      const data = await res.json();
      if (data.mentorAdvice) {
        setMessages((prev) => [
          ...prev,
          {
            id: `men-${Date.now()}`,
            sender: 'mentor',
            text: data.mentorAdvice,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hintLevel: newLevel,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'mentor',
          text: `Observation\n\n• Scan through the input elements sequentially.\n• Maintain an active window state between two boundaries.\n• Adjust boundaries whenever the target condition changes.\n\nThink about this:\n\nWhat variable will track your window boundaries?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNextHintLevel = () => {
    const nextLevel = Math.min(4, currentHintLevel + 1);
    setCurrentHintLevel(nextLevel);

    const hintPrompts = {
      2: 'Can you point out the key trigger words in the problem text?',
      3: 'Why do those trigger words suggest this pattern family?',
      4: 'What is the high-level conceptual approach without writing code?',
    }[nextLevel as 2 | 3 | 4];

    handleSendMessage(hintPrompts, nextLevel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full flex flex-col h-[640px] shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Friendly AI Teacher</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  No Spoilers
                </span>
              </div>
              <p className="text-xs text-slate-400">Question: {problem.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hint Level Indicator Bar */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint Level {currentHintLevel} of 4</span>
          </div>

          <button
            onClick={handleRequestNextHintLevel}
            disabled={currentHintLevel >= 4 || isLoading}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 text-xs font-semibold rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentHintLevel >= 4 ? 'Max Hint Reached' : 'Get Next Hint →'}</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'mentor' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className="text-[10px] opacity-60 block text-right">{m.timestamp}</span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Socratic Mentor is formulating guiding questions...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question or share your thought process..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
