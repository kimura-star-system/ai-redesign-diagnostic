/**
 * 共通型定義
 */

/**
 * 画面遷移の識別子
 */
export type Screen = 'start' | 'questions' | 'free-input' | 'result';

/**
 * 4つの軸のスコア
 */
export interface Scores {
    human_internal: string;
    resource_internal: string;
    human_external: string;
    environment_external: string;
}

/**
 * スコアのキー型
 */
export type ScoreKey = keyof Scores;

/**
 * ボトルネック軸の型（スコアキーまたは'none'）
 */
export type BottleneckAxis = ScoreKey | 'none';

/**
 * Dify API分析結果
 */
export interface AnalysisResult {
    success: boolean;
    analysis?: string;
    error?: string;
    fallback?: string;
    raw?: unknown;
}

/**
 * 質問データの型
 */
export interface Question {
    id: string;
    axis: string;
    wall: string;
    category: string;
    category_name: string;
    text: string;
}

/**
 * 動画データの型
 */
export interface VideoItem {
    title: string;
    subtitle: string;
    label: string;
    color: string;
}
