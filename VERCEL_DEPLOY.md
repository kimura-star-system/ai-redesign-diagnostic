# Vercel デプロイ手順

このドキュメントは `kimura-star-system` アカウント向けの具体的な手順です。

## 📦 1. GitHubにプッシュ

リポジトリを作成してプッシュします：

```powershell
cd "c:\Users\SS1449\Documents\実務\ソ研\自己診断ツールG\ai-redesign-diagnostic"

# Gitリポジトリ初期化（まだの場合）
git init

# 全ファイルをステージング
git add .

# コミット
git commit -m "Initial commit: AI診断ツール完成版"

# メインブランチ作成
git branch -M main

# GitHubリポジトリと連携（リポジトリ名は自由に変更可能）
git remote add origin https://github.com/kimura-star-system/ai-redesign-diagnostic.git

# プッシュ
git push -u origin main
```

⚠️ **注意**: 事前にGitHub上で `ai-redesign-diagnostic` リポジトリを作成してください
（または別の名前を使用する場合は上記URLを変更）

## 🚀 2. Vercelにデプロイ

### 2-1. Vercelアカウント作成
1. [vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」→「Continue with GitHub」でログイン
3. `kimura-star-system` アカウントを選択

### 2-2. プロジェクトインポート
1. Vercelダッシュボードで「Add New...」→「Project」
2. 「Import Git Repository」から `ai-redesign-diagnostic` を選択
3. Framework Preset: **Vite** を選択（自動検出されるはず）
4. **「Deploy」ボタンはまだ押さない**

### 2-3. 環境変数設定
デプロイ前に Environment Variables を追加：

| Name | Value |
|------|-------|
| `DIFY_API_KEY` | `app-YOUR_API_KEY_HERE` |
| `DIFY_API_URL` | `https://api.dify.ai/v1/workflows/run` |

### 2-4. 本番APIを有効化
`src/services/difyApi.ts` の11行目を変更：

```typescript
const USE_MOCK_DATA = false;  // ダミーから本番APIに切り替え
```

コミット＆プッシュ：
```powershell
git add src/services/difyApi.ts
git commit -m "本番API有効化"
git push
```

### 2-5. デプロイ実行
1. Vercelダッシュボードで「Deploy」をクリック
2. 約1〜2分でデプロイ完了
3. `https://ai-redesign-diagnostic.vercel.app` などのURLが発行される

## ✅ 3. 動作確認

1. デプロイされたURLにアクセス
2. 診断を最後まで実行
3. AI分析が正しく表示されることを確認

## 🔄 4. 今後の更新方法

コードを変更したら：
```powershell
git add .
git commit -m "変更内容の説明"
git push
```

Vercelが自動で再デプロイします（約1分）。

## 🎯 完成！

これで CORS問題なく、セキュアに動作する本番環境が完成しました。
