# Vercel デプロイ手順

このプロジェクトを自身の Vercel 環境にデプロイする際の手順です。

## 📦 1. GitHubにプッシュ

自身のリポジトリを作成してプッシュします：

```bash
# Gitリポジトリ初期化
git init

# 全ファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# メインブランチ作成
git branch -M main

# 自身のリポジトリと連携
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# プッシュ
git push -u origin main
```

## 🚀 2. Vercelにデプロイ

### 2-1. プロジェクトインポート
1. [Vercel](https://vercel.com) ダッシュボードで「Add New...」→「Project」を選択
2. GitHubから対象のリポジトリをインポート
3. Framework Preset: **Vite** を選択

### 2-2. 環境変数設定
デプロイ前に以下の Environment Variables を追加してください：

| Name | Value | Description |
|------|-------|-------------|
| `DIFY_API_KEY` | `app-xxxxxxxxxx` | DifyのApi Key |
| `DIFY_API_URL` | `https://api.dify.ai/v1/workflows/run` | Dify APIのベースURL |

### 2-3. 本番APIの有効化
開発用のモックデータを無効化し、本番APIを使用するように設定します。
`src/constants/index.ts` の `USE_MOCK_DATA` を `false` に変更してください。

```typescript
// src/constants/index.ts
export const API_CONFIG = {
  ENDPOINT: '/api/analyze',
  USE_MOCK_DATA: false, // ここを false に設定
} as const;
```

変更をコミットしてプッシュすると、Vercelが自動でビルド・デプロイを開始します。

## ✅ 3. 動作確認

1. デプロイ完了後に発行されたURLを開きます。
2. 診断を実行し、最後にAIによる分析レポートが生成されれば成功です。

---

> [!IMPORTANT]
> Dify側のワークフローが正常に動作していないと、AI分析レポートが表示されません。
> DSLファイルのインポートとプロンプトの設定が完了しているか、[README.md](./README.md) を再度ご確認ください。
