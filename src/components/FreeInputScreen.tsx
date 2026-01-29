import { useState } from 'react';
import { motion } from 'framer-motion';

interface FreeInputScreenProps {
    onComplete: (text: string) => void;
    onBack: () => void;
}

function FreeInputScreen({ onComplete, onBack }: FreeInputScreenProps) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        onComplete(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full glass-card p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-accent-400" />

                <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                    最後に、一言だけ教えてください
                </h2>

                <p className="text-gray-600 mb-8 text-center">
                    組織の現状や、診断を通じて感じたこと、具体的な課題感などがあれば自由にご記入ください。<br />
                    <span className="text-sm text-gray-400">※ 入力は任意です。そのまま結果に進むこともできます。</span>
                </p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="例：上層部の理解が得られない、現場のリソースが足りない..."
                    className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all resize-none mb-8 bg-white/50 backdrop-blur-sm text-lg"
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        ← 戻る
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-10 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700
                       text-white font-bold rounded-xl text-lg shadow-lg shadow-brand-200/50
                       transition duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {text.trim() ? '入力して結果を見る' : 'スキップして結果を見る'}
                        <span className="text-xl">→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default FreeInputScreen;
