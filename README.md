# YouTubeDownloader

シンプルな静的YouTubeDownloaderフロントエンドです。

## 重要

HTML/CSS/JavaScriptだけの静的サイトでは、YouTubeの動画をサーバー側で取得してMP4/MP3へ変換する処理を安全・確実に実行することはできません。

このプロジェクトは以下を実装済みです。

- YouTube URL入力
- URL形式チェック
- 貼り付けボタン
- MP4 / MP3切り替え
- MP4品質選択
- レスポンシブUI
- エラー・処理状態表示
- API接続部分を差し替えやすい構成

## デプロイ

`index.html`, `style.css`, `app.js` を静的ホスティングへアップロードできます。

### Vercel
1. GitHubへこのフォルダをpush
2. VercelでリポジトリをImport
3. Framework PresetはOther
4. Build Commandは空欄
5. Output Directoryは `.`

### Cloudflare Pages
1. GitHubリポジトリを接続
2. Framework preset: None
3. Build command: 空欄
4. Build output directory: `/`

### GitHub Pages
リポジトリの Settings → Pages から `main` ブランチのルートを公開してください。

## バックエンド接続

`app.js` の form submit 部分を、自分が権利を持つ動画・音声、または利用規約上ダウンロードが許可されているコンテンツを処理するバックエンド/APIへ接続します。

例:

```js
const response = await fetch("/api/download", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    url,
    format: state.format,
    quality: state.format === "mp4" ? quality.value : null
  })
});

const data = await response.json();
```

バックエンド側では、入力URLの検証、レート制限、サイズ制限、ジョブ管理、ファイル削除、エラー処理などを実装してください。

## ライセンス

このテンプレートは自由に改変できます。
