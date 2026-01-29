/**
 * Vercel サーバーレス関数
 * Dify API へのプロキシとして機能し、CORS問題を回避
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scores, bottleneckAxis, lowestQuestions, free_text } = req.body;

    // 環境変数からDify設定を取得
    const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1/workflows/run';
    const DIFY_API_KEY = process.env.DIFY_API_KEY;

    if (!DIFY_API_KEY) {
      return res.status(500).json({
        error: 'DIFY_API_KEY is not configured',
        message: 'サーバー設定エラー：Dify APIキーが設定されていません'
      });
    }

    console.log('--- Dify API Request ---');
    console.log('URL:', DIFY_API_URL);
    console.log('Key (masked):', DIFY_API_KEY ? `${DIFY_API_KEY.slice(0, 8)}...${DIFY_API_KEY.slice(-4)}` : 'MISSING');
    console.log('Payload:', JSON.stringify({
      inputs: {
        human_internal: String(scores.human_internal),
        resource_internal: String(scores.resource_internal),
        human_external: String(scores.human_external),
        environment_external: String(scores.environment_external),
        bottleneck_axis: bottleneckAxis,
        lowest_questions: lowestQuestions,
        free_text: free_text || ''
      },
      response_mode: 'blocking',
      user: 'user-' + Date.now()
    }, null, 2));

    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          human_internal: String(scores.human_internal),
          resource_internal: String(scores.resource_internal),
          human_external: String(scores.human_external),
          environment_external: String(scores.environment_external),
          bottleneck_axis: bottleneckAxis,
          lowest_questions: lowestQuestions,
          free_text: free_text || ''
        },
        response_mode: 'blocking',
        user: 'user-' + Date.now()
      })
    });

    const data = await response.json();
    console.log('--- Dify API Response ---');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));

    // Difyのエラーハンドリング
    if (data.data?.status === 'failed') {
      return res.status(400).json({
        success: false,
        error: data.data?.error || 'Dify workflow failed'
      });
    }

    // レスポンスから分析テキストを抽出
    let analysisText = '';
    if (data.data?.outputs?.text) {
      analysisText = data.data.outputs.text;
    } else if (data.data?.outputs?.result) {
      analysisText = data.data.outputs.result;
    } else if (typeof data.data?.outputs === 'string') {
      analysisText = data.data.outputs;
    } else if (data.outputs?.text) {
      analysisText = data.outputs.text;
    } else {
      analysisText = JSON.stringify(data.data?.outputs || data, null, 2);
    }

    return res.status(200).json({
      success: true,
      analysis: analysisText,
      raw: data
    });

  } catch (error: unknown) {
    console.error('Dify API Error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Dify APIへの接続に失敗しました'
    });
  }
}
