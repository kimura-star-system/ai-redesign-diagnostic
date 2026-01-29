/**
 * スコア計算ユーティリティ
 * 20問の回答から4つの軸のスコアを計算
 */

import type { ChartData } from 'chart.js';

export interface Scores {
  human_internal: string;
  resource_internal: string;
  human_external: string;
  environment_external: string;
}

/**
 * 軸ごとに質問をグループ化し、平均スコアを計算
 * @param answers - { Q1: 6, Q2: 4, ... } 形式の回答（1-6の値）
 * @returns 4軸のスコア（1-6の平均）
 */
export function calculateScores(answers: Record<string, number>): Scores {
  const axisGroups = {
    human_internal: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    resource_internal: ['Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    human_external: ['Q11', 'Q12', 'Q13', 'Q14', 'Q15'],
    environment_external: ['Q16', 'Q17', 'Q18', 'Q19', 'Q20']
  };

  const scores: Scores = {
    human_internal: '0',
    resource_internal: '0',
    human_external: '0',
    environment_external: '0'
  };

  for (const [axis, questionIds] of Object.entries(axisGroups)) {
    // 6段階評価（1-6）のまま平均を計算
    const values = questionIds.map(qId => answers[qId] || 1);
    const sum = values.reduce((acc, val) => acc + val, 0);
    scores[axis as keyof Scores] = (sum / values.length).toFixed(2);
  }

  return scores;
}

/**
 * スコアから日本語の軸名を取得
 * @returns 軸名のマッピング
 */
export function getAxisLabels(): Record<keyof Scores | 'none', string> {
  return {
    human_internal: '自分の壁',
    resource_internal: '資源の壁',
    human_external: '他者の壁',
    environment_external: '環境の壁',
    none: '全ての壁を突破'
  };
}

/**
 * スコアをレーダーチャート用のデータに変換
 * @param scores - calculateScores() の結果
 * @returns Chart.js用のデータ形式
 */
export function convertToChartData(scores: Scores): ChartData<'radar'> {
  const labels = getAxisLabels();
  return {
    labels: Object.keys(scores).map(key => labels[key as keyof Scores]),
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
export function getBottleneckAxis(scores: Scores): keyof Scores | 'none' {
  const entries = Object.entries(scores) as [keyof Scores, string][];
  const numericScores = entries.map(e => ({ key: e[0], val: parseFloat(e[1]) }));

  // 最小スコアを特定
  const minScore = Math.min(...numericScores.map(s => s.val));

  // もし最小スコアが 6.0 以上（満点）なら「ボトルネックなし」
  if (minScore >= 6.0) {
    return 'none';
  }

  // 最小スコアが複数ある場合（タイ）の処理：
  // 「自分の壁」ばかりにならないよう、外部要因（環境 -> 他者 -> 資源 -> 自分）を優先する
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
  const axisGroups = {
    human_internal: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    resource_internal: ['Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    human_external: ['Q11', 'Q12', 'Q13', 'Q14', 'Q15'],
    environment_external: ['Q16', 'Q17', 'Q18', 'Q19', 'Q20']
  };

  const result: string[] = [];

  for (const [, questionIds] of Object.entries(axisGroups)) {
    // スコアをそのまま抽出
    const questionScores = questionIds.map(qId => {
      const rawValue = answers[qId] || 1;
      return {
        id: qId,
        score: rawValue
      };
    });

    // 最低スコアの質問を抽出
    const lowestQ = questionScores.sort((a, b) => a.score - b.score)[0];
    result.push(`${lowestQ.id}(${lowestQ.score.toFixed(1)})`);
  }

  return result.join(', ');
}

/**
 * 各軸の標準偏差を計算
 * @param answers - { Q1: 6, Q2: 4, ... } 形式の回答（1-6の値）
 * @returns 各軸の標準偏差を含むオブジェクト
 */
export function calculateStandardDeviation(answers: Record<string, number>): Record<string, number> {
  const axisGroups = {
    human_internal: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
    resource_internal: ['Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    human_external: ['Q11', 'Q12', 'Q13', 'Q14', 'Q15'],
    environment_external: ['Q16', 'Q17', 'Q18', 'Q19', 'Q20']
  };

  const stdDevs: Record<string, number> = {};

  for (const [axis, questionIds] of Object.entries(axisGroups)) {
    const values = questionIds.map(qId => answers[qId] || 1);

    // 平均を計算
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;

    // 分散を計算
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;

    // 標準偏差
    stdDevs[axis] = Math.sqrt(variance);
  }

  return stdDevs;
}
