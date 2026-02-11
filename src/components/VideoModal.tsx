import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIDEOS } from '../constants';
import type { VideoItem } from '../types';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const handleClose = () => {
        setSelectedVideo(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {selectedVideo ? (
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="hover:text-pink-500 flex items-center gap-1 transition-colors"
                                    >
                                        <span className="text-lg">←</span> {selectedVideo.title}
                                    </button>
                                ) : (
                                    <>
                                        <span className="text-2xl text-pink-500">🎥</span> 動画を選択
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 md:p-8">
                            {selectedVideo ? (
                                <div className="space-y-4">
                                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                                        <video
                                            src={selectedVideo.url}
                                            controls
                                            autoPlay
                                            className="w-full h-full"
                                        >
                                            お使いのブラウザは動画の再生に対応していません。
                                        </video>
                                    </div>
                                    <div className="px-2">
                                        <p className="text-gray-600 italic">{selectedVideo.subtitle}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {VIDEOS.map((video, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVideo(video)}
                                            className="group text-left"
                                        >
                                            <div className="aspect-video rounded-xl bg-gray-100 mb-4 overflow-hidden relative border border-gray-200">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${video.color} opacity-5`} />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                                                        <span className="text-2xl ml-1 text-pink-500">▶</span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 text-white text-[10px] font-bold rounded">
                                                    {video.label}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">{video.title}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">{video.subtitle}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!selectedVideo && (
                            <div className="p-6 bg-gray-50 text-center">
                                <p className="text-sm text-gray-500">
                                    動画を選択して再生を開始してください。
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
