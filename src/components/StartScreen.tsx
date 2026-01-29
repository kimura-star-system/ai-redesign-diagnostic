import { useState } from 'react';
import { motion } from 'framer-motion';
import VideoModal from './VideoModal';
import { AXIS_DESCRIPTIONS } from '../constants';

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-5xl w-full">
        {/* ヘッダーエリア */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-sm font-bold tracking-wide mb-4 border border-brand-100">
            AI TRANSFORMATION HUB
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-2 tracking-tight">
            AI活用・業務リデザイン
          </h1>
          <h2 className="text-xl md:text-3xl font-bold text-gradient">
            変革支援ツール
          </h2>
        </motion.div>

        {/* メインダッシュボード */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

          {/* メインアクション：診断（左 7/12） */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 flex flex-col"
          >
            <div className="glass-card p-10 flex-1 flex flex-col justify-between relative overflow-hidden group border-2 border-brand-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10">
                <div className="text-4xl mb-6">📊</div>
                <h3 className="text-xl md:text-3xl font-black text-gray-800 mb-4">
                  現状を可視化する
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 max-w-md">
                  20の質問に答えることで、あなたの組織が直面している「4つの壁」を特定。AIとの共生に向けた具体的なロードマップを提示します。
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={onStart}
                  className="w-full py-5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 
                             text-white font-bold rounded-2xl text-2xl shadow-xl shadow-brand-200/50
                             transition duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  診断を開始する <span className="text-3xl">→</span>
                </button>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400 font-medium">
                  <span>所要時間: 約3分 / 全20問</span>
                  <span className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded italic">Recommended</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 学習コンテンツ（右 5/12） */}
          <div className="md:col-span-5 flex flex-col gap-6">

            {/* 解説動画：モチベーションアップ */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowVideoModal(true)}
              className="glass-card p-8 text-left group hover:border-pink-300 transition-colors relative overflow-hidden flex-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform" />
              <div className="relative z-10">
                <div className="text-3xl mb-4">🎥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  変革の意義を知る
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  なぜ今、リデザインが必要なのか？<br />
                  あなたの意識をアップデートする動画。
                </p>
                <div className="mt-4 text-pink-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  動画を視聴する <span>▶</span>
                </div>
              </div>
            </motion.button>

            {/* AI活用のヒント */}
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              href="/AI活用のヒント30選.html"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 text-left group hover:border-amber-300 transition-colors relative overflow-hidden flex-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform" />
              <div className="relative z-10">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  活用のヒントを見る
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  実務で今すぐ使えるAI活用術30選。<br />
                  診断前のイメージ作りに。
                </p>
                <div className="mt-4 text-amber-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  ヒントを閲覧する <span>◹</span>
                </div>
              </div>
            </motion.a>

          </div>
        </div>

        {/* 診断の目的説明：4つの壁 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50"
        >
          <h4 className="text-center font-bold text-gray-600 mb-8 tracking-widest text-sm uppercase">MEASUREMENT AXES : 4つの壁</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AXIS_DESCRIPTIONS.map((item, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${item.color} backdrop-blur-sm bg-opacity-60 text-center`}>
                <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                <p className="text-[10px] opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />
    </div>
  );
}

export default StartScreen;
