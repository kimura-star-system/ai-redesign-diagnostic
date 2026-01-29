/**
 * Dify API連携サービス
 * 診断結果をDifyに送信してAI分析を取得
 * Vercel API Route経由で通信（CORS回避 + セキュリティ向上）
 */

import axios from 'axios';
import type { Scores, BottleneckAxis, AnalysisResult } from '../types';
import { getBottleneckAxis, getLowestQuestions, getAxisLabels } from '../utils/scoreCalculator';
import { API_CONFIG } from '../constants';

/**
 * 診断結果をDifyに送信してAI分析を取得
 * @param scores - 4軸のスコア
 * @param answers - 全20問の回答
 * @param freeText - ユーザーからのフリーテキスト入力（任意）
 * @returns Difyからの分析結果
 */
export async function analyzeDiagnostic(
  scores: Scores,
  answers: Record<string, number>,
  freeText: string = ''
): Promise<AnalysisResult> {

  const bottleneckAxis = getBottleneckAxis(scores);
  const lowestQuestions = getLowestQuestions(answers);

  // モックデータモード
  if (API_CONFIG.USE_MOCK_DATA) {
    return getMockAnalysis(bottleneckAxis, lowestQuestions);
  }

  // 本番APIモード
  try {
    const payload = {
      scores: {
        human_internal: scores.human_internal,
        resource_internal: scores.resource_internal,
        human_external: scores.human_external,
        environment_external: scores.environment_external
      },
      bottleneckAxis,
      lowestQuestions,
      free_text: freeText
    };

    const response = await axios.post(API_CONFIG.ENDPOINT, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.data.success) {
      const errorMsg = response.data.error || response.data.message || 'API request failed';
      return {
        success: false,
        error: errorMsg,
        fallback: `⚠️ **APIエラー**\n\n${errorMsg}\n\n一時的にAI分析を利用できません。しばらく待ってから再度お試しください。`
      };
    }

    const cleanAnalysis = cleanDifyResponse(response.data.analysis);

    return {
      success: true,
      analysis: cleanAnalysis,
      raw: response.data.raw
    };

  } catch (error: unknown) {
    console.error('API Error:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: getDummyAnalysis(scores)
    };
  }
}

/**
 * モックデータ生成（開発用）
 */
function getMockAnalysis(
  bottleneckAxis: BottleneckAxis,
  lowestQuestions: string
): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const axisLabels = getAxisLabels();
      let analysisText = '';

      if (bottleneckAxis === 'none') {
        analysisText = `# 🎯 診断結果レポート

---

## 🚩 最大のボトルネック
### **【全ての壁を突破！】**
> おめでとうございます！あなたは全ての「壁」を乗り越え、AIと高度に協働できる準備が整っています。

---

## 💡 専門家からのアドバイス
全ての項目で高いスコアを達成されたことは驚くべき成果です。あなたは組織内での「AI変革リーダー」として、自身の成功体験をナレッジ化し、周囲を導いていくフェーズにあります。`;
      } else {
        analysisText = `# 🎯 診断結果レポート

---

## 🚩 最大のボトルネック
### **【${axisLabels[bottleneckAxis]}】**
> ここが、あなたの組織が「AI共働型」へ進化するのを妨げている最大の壁です。

---

## 🔎 現状の分析：リデザインレベル
| 現在の推定レベル | 目指すべき姿 |
| :--- | :--- |
| **レベル 2（一部自動化）** | **レベル 3（業務全体の再設計）** |

### ⚡ 解決すべき課題
${lowestQuestions.split(',').map(q => `* **課題：** ${q.trim()} のスコアが低く、ボトルネックになっています。`).join('\n')}

---

## 🛠️ 改善ロードマップ

### 🐾 Step 1：短期アクション
* 低スコア設問に対する局所的な改善施策の実行

### 🚀 Step 2：中長期アクション
* 組織全体での学習プロセスの確立

---

## 💡 専門家からのアドバイス
**${axisLabels[bottleneckAxis]}** の課題は、裏を返せば最大の伸びしろです。`;
      }

      resolve({ success: true, analysis: analysisText });
    }, 1500);
  });
}

/**
 * API障害時のダミー分析（フォールバック用）
 */
function getDummyAnalysis(scores: Scores): string {
  return `
【診断結果サマリー】
各軸のスコアは以下の通りです：
- 自分（内側）: ${scores.human_internal}
- 資源（内側）: ${scores.resource_internal}
- 他者（外側）: ${scores.human_external}
- 環境（外側）: ${scores.environment_external}

※現在、AI分析機能は一時的に利用できません。後ほどお試しください。
  `.trim();
}

/**
 * Difyからのレスポンスをクリーニングする
 */
function cleanDifyResponse(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 先頭の不純物を除去
  const firstHeaderIndex = cleaned.search(/^#+\s/m);
  if (firstHeaderIndex !== -1) {
    cleaned = cleaned.substring(firstHeaderIndex);
  }

  // 末尾の不純物を除去
  cleaned = cleaned.replace(/```\s*$/g, '');

  return cleaned.trim();
}
