import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionsData from '../data/questions.json';
import type { Question } from '../types';

interface QuestionScreenProps {
  onComplete: (answers: Record<string, number>) => void;
}

// リッカート尺度（6段階）
const scaleConfig = [
  { value: 6, size: 'w-14 h-14 md:w-20 md:h-20', color: 'bg-brand-500 hover:bg-brand-600', label: '強く同意', text: '😍' },
  { value: 5, size: 'w-12 h-12 md:w-16 md:h-16', color: 'bg-brand-400 hover:bg-brand-500', label: '同意', text: '😊' },
  { value: 4, size: 'w-10 h-10 md:w-14 md:h-14', color: 'bg-brand-300 hover:bg-brand-400', label: 'やや同意', text: '🙂' },
  { value: 3, size: 'w-10 h-10 md:w-14 md:h-14', color: 'bg-slate-300 hover:bg-slate-400', label: 'やや反対', text: '🤔' },
  { value: 2, size: 'w-12 h-12 md:w-16 md:h-16', color: 'bg-slate-400 hover:bg-slate-500', label: '反対', text: '😓' },
  { value: 1, size: 'w-14 h-14 md:w-20 md:h-20', color: 'bg-slate-500 hover:bg-slate-600', label: '強く反対', text: '😱' },
];

function QuestionScreen({ onComplete }: QuestionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(1);

  const questions = questionsData.questions as Question[];
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    if (isTransitioning) return;

    // スコア反転処理（必要なら）: ここではそのまま
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    setIsTransitioning(true);
    setDirection(1);

    setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        onComplete(newAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setDirection(-1);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col">
      {/* 進捗バー */}
      <div className="w-full bg-white/50 backdrop-blur-sm fixed top-0 left-0 z-50 border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>QUESTION {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-brand-400 to-accent-400 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* メイン */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-300 to-accent-300 opactiy-50" />

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold border border-brand-100 uppercase tracking-wider">
                  {currentQuestion.wall}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                  {currentQuestion.category_name}
                </span>
              </div>

              {/* 質問文 */}
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-12 text-center leading-relaxed">
                {currentQuestion.text}
              </h2>

              {/* 回答ボタン */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-4 px-4 hidden md:flex">
                  <span className="text-brand-600">同意する</span>
                  <span className="text-slate-500">同意しない</span>
                </div>

                <div className="flex justify-center items-end gap-1 md:gap-4">
                  {scaleConfig.map((config) => (
                    <motion.button
                      key={config.value}
                      onClick={() => handleAnswer(config.value)}
                      className={`
                        ${config.size} ${config.color}
                        rounded-2xl shadow-lg border-2 border-white/50
                        flex flex-col items-center justify-center
                        text-white font-bold
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isTransitioning}
                      title={config.label}
                    >
                      <span className="text-xl md:text-2xl drop-shadow-sm">{config.text}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-4 px-2 md:hidden">
                  <span>同意</span>
                  <span>反対</span>
                </div>
              </div>

              {/* 戻る */}
              {currentIndex > 0 && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleBack}
                    disabled={isTransitioning}
                    className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors py-2 px-4 rounded-full hover:bg-gray-50"
                  >
                    ← 前の質問に戻る
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
