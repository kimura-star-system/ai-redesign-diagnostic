import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import RadarChart from './RadarChart';
import VideoModal from './VideoModal';
import { calculateScores, convertToChartData, getBottleneckAxis } from '../utils/scoreCalculator';
import { analyzeDiagnostic } from '../services/difyApi';
import { AXIS_LABELS } from '../constants';

interface ResultScreenProps {
  answers: Record<string, number>;
  freeText?: string;
  onRestart: () => void;
}

function ResultScreen({ answers, freeText = '', onRestart }: ResultScreenProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const hasFetched = useRef(false);

  const scores = calculateScores(answers);
  const chartData = convertToChartData(scores);
  const bottleneckAxis = getBottleneckAxis(scores);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAnalysis() {
      setLoading(true);
      // freeTextを渡す
      const result = await analyzeDiagnostic(scores, answers, freeText);

      if (result.success) {
        setAnalysis(result.analysis || null);
      } else {
        setAnalysis(result.fallback || null);
      }

      setLoading(false);
    }

    fetchAnalysis();
  }, [scores, answers, freeText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 p-4 py-12 text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* ヒーローセクション */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-brand-600 to-accent-600 rounded-3xl shadow-2xl p-8 mb-12 text-white overflow-hidden"
        >
          {/* 背景装飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 text-center">
            <p className="text-lg font-medium mb-3 opacity-90 tracking-wider">DIAGNOSTIC RESULT</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-sm">
              {bottleneckAxis === 'none' ? 'おめでとうございます！' : 'あなたの最大のボトルネックは'}
            </h1>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl py-8 px-10 inline-block shadow-lg">
              <p className="text-4xl md:text-6xl font-black tracking-tight">
                {AXIS_LABELS[bottleneckAxis]}
              </p>
            </div>
          </div>
        </motion.div>

        {/* メイングリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

          {/* 左カラム：チャート & 基本スコア (5/12) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* チャートカード */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span> 現状バランス
              </h2>
              <div className="aspect-square relative">
                <RadarChart data={chartData} />
              </div>
            </div>

            {/* スコアカード */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'human_internal', label: '自分', color: 'bg-green-50 text-green-700', border: 'border-green-200' },
                { key: 'resource_internal', label: '資源', color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200' },
                { key: 'human_external', label: '他者', color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
                { key: 'environment_external', label: '環境', color: 'bg-red-50 text-red-700', border: 'border-red-200' },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`
                    p-4 rounded-xl border ${bottleneckAxis === item.key ? 'ring-2 ring-red-400 ring-offset-2' : ''}
                    ${item.color} ${item.border}
                  `}
                >
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold opacity-80">{item.label}</span>
                    <span className="text-2xl font-black">{scores[item.key as keyof typeof scores]}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 右カラム：AI分析レポート (7/12) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-8 h-full min-h-[600px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="bg-gradient-to-br from-brand-500 to-accent-500 w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  🤖
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">AI Analysis</h2>
                  <p className="text-sm text-gray-500">Dify Selected AIによる詳細分析</p>
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                      ✨
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium text-lg animate-pulse">分析レポートを作成中...</p>
                  <p className="text-gray-400 text-sm mt-2">約10〜15秒ほどお待ちください</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-lg prose-blue max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-800 
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-gray-600 prose-li:my-2
                    prose-strong:text-brand-700 prose-strong:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-brand-600
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis || ''}</ReactMarkdown>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 拡張リンク (フッター) */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-brand-600">🎓</span> さらに詳しく学ぶ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <button
              onClick={() => setShowVideoModal(true)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 text-left"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
              <div className="relative z-10">
                <div className="text-3xl mb-4">🎥</div>
                <h4 className="text-lg font-bold mb-2 group-hover:text-brand-600 transition-colors">動画</h4>
                <p className="text-sm text-gray-500">4つの壁を突破するための動画</p>
              </div>
            </button>

            <a
              href="/AI活用のヒント30選.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
              <div className="relative z-10">
                <div className="text-3xl mb-4">💡</div>
                <h4 className="text-lg font-bold mb-2 group-hover:text-brand-600 transition-colors">AI活用のヒント</h4>
                <p className="text-sm text-gray-500">具体的な実務での活用案30選</p>
              </div>
            </a>
          </div>
        </section>

        {/* 動画選択モーダル（共通コンポーネント） */}
        <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-20">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 flex items-center justify-center gap-2"
          >
            <span>↺</span> もう一度診断する
          </button>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-10 py-4 bg-gray-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>🖨️</span> 結果をプリントする / PDF保存
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResultScreen;
