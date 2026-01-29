/**
 * スコア計算ユーティリティ
 * 20問の回答から4つの軸のスコアを計算
 */

import type { ChartData } from 'chart.js';
import type { Scores, ScoreKey, BottleneckAxis } from '../types';
import { AXIS_GROUPS, AXIS_LABELS } from '../constants';

// 型を再エクスポート
export type { Scores, ScoreKey, BottleneckAxis };

/**
 * 軸ごとに質問をグループ化し、平均スコアを計算
 * @param answers - { Q1: 6, Q2: 4, ... } 形式の回答（1-6の値）
 * @returns 4軸のスコア（1-6の平均）
 */
export function calculateScores(answers: Record<string, number>): Scores {
  const scores: Scores = {
    human_internal: '0',
    human_external: '0',
    resource_internal: '0',
    environment_external: '0'
  };

  for (const [axis, questionIds] of Object.entries(AXIS_GROUPS)) {
    const values = questionIds.map(qId => answers[qId] || 1);
    const sum = values.reduce((acc, val) => acc + val, 0);
    scores[axis as ScoreKey] = (sum / values.length).toFixed(2);
  }

  return scores;
}

/**
 * スコアから日本語の軸名を取得
 * @returns 軸名のマッピング
 */
export function getAxisLabels(): Record<ScoreKey | 'none', string> {
  return AXIS_LABELS;
}

/**
 * スコアをレーダーチャート用のデータに変換
 * @param scores - calculateScores() の結果
 * @returns Chart.js用のデータ形式
 */
export function convertToChartData(scores: Scores): ChartData<'radar'> {
  return {
    labels: Object.keys(scores).map(key => AXIS_LABELS[key as ScoreKey]),
    datasets: [{
      label: '診断結果',
      data: Object.values(scores).map(v => parseFloat(v)),
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
  };
}

/**
 * ボトルネック軸（最もスコアが低い軸）を特定
 * @param scores - calculateScores() の結果
 * @returns ボトルネック軸のキー（満点の場合は 'none'）
 */
export function getBottleneckAxis(scores: Scores): BottleneckAxis {
  const entries = Object.entries(scores) as [ScoreKey, string][];
  const numericScores = entries.map(e => ({ key: e[0], val: parseFloat(e[1]) }));

  const minScore = Math.min(...numericScores.map(s => s.val));

  // 満点なら「ボトルネックなし」
  if (minScore >= 6.0) {
    return 'none';
  }

  // 最小スコアが複数ある場合：外部要因を優先
  const bottlenecks = numericScores.filter(s => s.val === minScore).map(s => s.key);

  if (bottlenecks.includes('environment_external')) return 'environment_external';
  if (bottlenecks.includes('human_external')) return 'human_external';
  if (bottlenecks.includes('resource_internal')) return 'resource_internal';

  return 'human_internal';
}

/**
 * 各軸で最もスコアが低い質問を特定（Dify用簡潔フォーマット）
 * @param answers - { Q1: 6, Q2: 4, ... } 形式の回答（1-6の値）
 * @returns 各軸の最低質問（例：Q2(1.0), Q10(1.8), Q11(2.2), Q17(1.0)）
 */
export function getLowestQuestions(answers: Record<string, number>): string {
  const result: string[] = [];

  for (const [, questionIds] of Object.entries(AXIS_GROUPS)) {
    const questionScores = questionIds.map(qId => ({
      id: qId,
      score: answers[qId] || 1
    }));

    const lowestQ = questionScores.sort((a, b) => a.score - b.score)[0];
    result.push(`${lowestQ.id}(${lowestQ.score.toFixed(1)})`);
  }

  return result.join(', ');
}
