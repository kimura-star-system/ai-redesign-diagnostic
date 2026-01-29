import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const videos = [
    {
        title: '動画①：基礎編',
        subtitle: '4つの壁の全体像と乗り越え方',
        label: 'Coming Soon',
        color: 'from-pink-500 to-rose-500'
    },
    {
        title: '動画②：実践編',
        subtitle: '業務リデザインを始める5ステップ',
        label: 'Coming Soon',
        color: 'from-blue-500 to-indigo-500'
    },
];

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="text-2xl text-pink-500">🎥</span> 動画を選択
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {videos.map((video, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="aspect-video rounded-xl bg-gray-100 mb-4 overflow-hidden relative border border-gray-200">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-5`} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                                <span className="text-2xl ml-1">▶</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 text-white text-[10px] font-bold rounded">
                                            {video.label}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">{video.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">{video.subtitle}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 text-center">
                            <p className="text-sm text-gray-500">
                                動画コンテンツは現在制作中です。近日中に公開予定です。
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
