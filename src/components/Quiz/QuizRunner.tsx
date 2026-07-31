import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { Pattern, Problem, QuizAttempt } from '../../types';

interface QuizRunnerProps {
  problems: Problem[];
  patterns: Pattern[];
  onQuizCompleted: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  problems,
  patterns,
  onQuizCompleted,
}) => {
  const [quizQuestions, setQuizQuestions] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timeTakenPerQuestion, setTimeTakenPerQuestion] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizAttempt['answers']>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize quiz with 5 random problems
  const startNewQuiz = () => {
    const shuffled = [...problems].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedPatternId(null);
    setIsAnswered(false);
    setTimerSeconds(30);
    setTimeTakenPerQuestion([]);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  useEffect(() => {
    startNewQuiz();
  }, [problems]);

  // Countdown timer per question
  useEffect(() => {
    if (isFinished || isAnswered || quizQuestions.length === 0) return;

    if (timerSeconds <= 0) {
      // Time expired -> register timeout as wrong
      handleAnswerSubmit('');
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds, isAnswered, isFinished, quizQuestions]);

  const currentProblem = quizQuestions[currentIndex];

  const handleAnswerSubmit = (chosenPatternId: string) => {
    if (isAnswered || !currentProblem) return;

    const timeTaken = 30 - timerSeconds;
    setSelectedPatternId(chosenPatternId);
    setIsAnswered(true);

    const isCorrect = chosenPatternId === currentProblem.patternId;
    if (isCorrect) setScore((prev) => prev + 1);

    setUserAnswers((prev) => [
      ...prev,
      {
        problemId: currentProblem.id,
        selectedPatternId: chosenPatternId,
        correctPatternId: currentProblem.patternId,
        isCorrect,
        timeSeconds: timeTaken,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedPatternId(null);
      setIsAnswered(false);
      setTimerSeconds(30);
    } else {
      // Finish Quiz
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const totalTime = userAnswers.reduce((acc, a) => acc + a.timeSeconds, 0);
      onQuizCompleted({
        userId: 'usr-1',
        score,
        totalQuestions: quizQuestions.length,
        timeTakenSeconds: totalTime,
        answers: userAnswers,
      });
    }
  };

  // Generate 4 pattern choices (1 correct + 3 random distractors)
  const choices = React.useMemo(() => {
    if (!currentProblem) return [];
    const correct = patterns.find((p) => p.id === currentProblem.patternId);
    const distractors = patterns
      .filter((p) => p.id !== currentProblem.patternId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const list = correct ? [correct, ...distractors] : distractors;
    return list.sort(() => 0.5 - Math.random());
  }, [currentProblem, patterns]);

  if (quizQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-slate-300">Loading pattern recognition quiz questions...</p>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
          <p className="text-sm text-slate-400">
            Great job training your pattern recognition speed.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <div>
            <span className="text-slate-400 text-xs block font-semibold">Score</span>
            <span className="text-xl font-bold text-white">
              {score} / {quizQuestions.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block font-semibold">Accuracy</span>
            <span className="text-xl font-bold text-emerald-400">{accuracy}%</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block font-semibold">XP Earned</span>
            <span className="text-xl font-bold text-indigo-400">+{score * 15} XP</span>
          </div>
        </div>

        <button
          onClick={startNewQuiz}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Recognition Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl mx-auto space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Quick Pattern Quiz
          </span>
          <h3 className="text-sm text-slate-300 font-semibold">
            Question {currentIndex + 1} of {quizQuestions.length}
          </h3>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-mono text-xs font-bold ${
            timerSeconds <= 10
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
              : 'bg-slate-800 text-amber-400 border-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{timerSeconds}s</span>
        </div>
      </div>

      {/* Problem Challenge Card */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {currentProblem.difficulty}
          </span>
          <h4 className="text-base font-bold text-white">{currentProblem.title}</h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          {currentProblem.statement}
        </p>

        {/* Problem Pattern Triggers */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400">Clues in this question:</p>
          <div className="flex flex-wrap gap-1.5">
            {currentProblem.patternTriggers.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                ✦ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Choices */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-200">
          Which pattern is the best fit for this problem?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((pat) => {
            const isSelected = selectedPatternId === pat.id;
            const isCorrectPattern = pat.id === currentProblem.patternId;

            let buttonStyles =
              'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200';
            if (isAnswered) {
              if (isCorrectPattern) {
                buttonStyles =
                  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
              } else if (isSelected) {
                buttonStyles =
                  'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold';
              } else {
                buttonStyles = 'bg-slate-950/40 opacity-50 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={pat.id}
                disabled={isAnswered}
                onClick={() => handleAnswerSubmit(pat.id)}
                className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${buttonStyles}`}
              >
                <div>
                  <p className="font-bold text-sm">{pat.name}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{pat.category}</p>
                </div>
                {isAnswered && isCorrectPattern && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectPattern && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Explanation Banner & Next Button */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            {selectedPatternId === currentProblem.patternId ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Spot on! That's correct!
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Not quite! Check the explanation below.
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentProblem.solutionExplanation}
          </p>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              {currentIndex < quizQuestions.length - 1 ? 'Next Question →' : 'View Results →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
