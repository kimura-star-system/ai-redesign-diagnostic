# 環境変数設定ガイド

## Vercelデプロイ時の設定

Vercelにデプロイする際は、以下の環境変数を設定してください。

### 設定手順

1. Vercelダッシュボードでプロジェクトを選択
2. `Settings` → `Environment Variables` に移動
3. 以下の変数を追加：

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DIFY_API_KEY` | `app-xxxxxxxxxx` | Dify APIキー |
| `DIFY_API_URL` | `https://api.dify.ai/v1/workflows/run` | Dify API URL |

### .env.local（ローカル開発用・オプション）

ローカル環境でAPIをテストする場合は、プロジェクトルートに `.env.local` を作成してください：

```env
DIFY_API_KEY=app-xxxxxxxxxx
DIFY_API_URL=https://api.dify.ai/v1/workflows/run
```

> [!WARNING]
> `.env.local` は機密情報を含むため、Gitには絶対にコミットしないでください（`.gitignore` で除外されています）。

## モード切り替え

開発中はAPI消費を抑えるためにモックデータを使用し、本番公開時に本番APIへと切り替えることができます。
設定は `src/constants/index.ts` で行います。

```typescript
// src/constants/index.ts
export const API_CONFIG = {
  ENDPOINT: '/api/analyze',
  USE_MOCK_DATA: true, // true: モックデータ / false: 本番API
} as const;
```

- **開発時**: `true` (定義済みのダミー回答を使用)
- **公開時**: `false` (Vercel Serverless Function経由でDifyを呼び出し)
