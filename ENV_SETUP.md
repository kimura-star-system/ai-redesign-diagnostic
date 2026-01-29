# 環境変数設定ガイド

## Vercelデプロイ時の設定

Vercelにデプロイする際は、以下の環境変数を設定してください。

### 設定手順

1. Vercelダッシュボードでプロジェクトを選択
2. `Settings` → `Environment Variables` に移動
3. 以下の変数を追加：

| Variable Name | Value |
|--------------|-------|
| `DIFY_API_KEY` | `app-YOUR_API_KEY_HERE` |
| `DIFY_API_URL` | `https://api.dify.ai/v1/workflows/run` |

### .env.local（ローカル開発用・オプション）

ローカルで本番APIをテストする場合は、プロジェクトルートに `.env.local` を作成：

```env
DIFY_API_KEY=app-YOUR_API_KEY_HERE
DIFY_API_URL=https://api.dify.ai/v1/workflows/run
```

⚠️ **注意**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

## モード切り替え

`src/services/difyApi.ts` の先頭：

```typescript
// 🔄 モード切り替え：true=ダミーデータ / false=本番API (Vercel経由)
const USE_MOCK_DATA = true;  // 開発中はtrue
```

- **開発中**: `true` (ダミーデータで動作確認)
- **デプロイ時**: `false` (Vercel API Route経由でDify APIを呼び出し)

## デプロイ手順

1. GitHubにプッシュ
2. Vercelと連携
3. 環境変数を設定（上記参照）
4. `USE_MOCK_DATA = false` に変更してデプロイ

これで、CORS問題なく本番環境でDify APIが動作します！
