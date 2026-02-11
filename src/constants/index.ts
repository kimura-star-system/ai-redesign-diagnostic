/**
 * 共通定数
 */

import type { ScoreKey, VideoItem } from '../types';

/**
 * 軸ごとの質問IDグループ
 */
export const AXIS_GROUPS: Record<ScoreKey, readonly string[]> = {
    human_internal: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    human_external: ['Q11', 'Q12', 'Q13', 'Q14', 'Q15'],
    resource_internal: ['Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    environment_external: ['Q16', 'Q17', 'Q18', 'Q19', 'Q20']
} as const;

/**
 * 軸の日本語ラベル
 */
export const AXIS_LABELS: Record<ScoreKey | 'none', string> = {
    human_internal: '自分の壁',
    human_external: '他者の壁',
    resource_internal: '資源の壁',
    environment_external: '環境の壁',
    none: '全ての壁を突破'
} as const;

/**
 * 軸の詳細説明（StartScreen用）
 */
export const AXIS_DESCRIPTIONS = [
    { key: 'human_internal', title: '自分 (Internal)', desc: '心理的抵抗・当事者意識', color: 'bg-green-50 text-green-700 border-green-200' },
    { key: 'human_external', title: '他者 (Social)', desc: '関係者・顧客の理解', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'resource_internal', title: '資源 (Resource)', desc: '時間・予算・スキル', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { key: 'environment_external', title: '環境 (External)', desc: '制度・文化・市場変化', color: 'bg-red-50 text-red-700 border-red-200' },
] as const;

/**
 * スコアの範囲
 */
export const SCORE_SCALE = {
    MIN: 1,
    MAX: 6
} as const;

/**
 * 動画コンテンツ
 */
export const VIDEOS: readonly VideoItem[] = [
    {
        title: 'リデザイン劇場パート１：究極の謝罪プロンプト VS 業務リデザイン',
        subtitle: 'リデザインレベル2とレベル3で何が違うの？',
        label: 'Video 1',
        color: 'from-pink-500 to-rose-500',
        url: '/videos/video1.mp4'
    },
    {
        title: 'リデザイン劇場パート２：ひろし覚醒！AIと共に歩む業務リデザインの記録',
        subtitle: 'リデザインレベル3への壁を突破せよ！',
        label: 'Video 2',
        color: 'from-blue-500 to-indigo-500',
        url: '/videos/video2.mp4'
    }
] as const;

/**
 * API設定
 */
export const API_CONFIG = {
    ENDPOINT: '/api/analyze',
    USE_MOCK_DATA: false
} as const;
