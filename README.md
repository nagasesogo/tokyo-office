# 東京支所 LP サイト

添付デザインをもとに構築した、弁護士法人長瀬総合法律事務所 東京支所の静的ランディングページです。

## ファイル構成

- `index.html`：LP本体
- `styles.css`：デザイン・レスポンシブ対応
- `script.js`：スマートフォン用メニュー、ナビゲーションの現在地表示
- `assets/`：画像・favicon・デザイン確認用画像
- `.nojekyll`：GitHub Pagesでそのまま公開するための空ファイル

## 公開方法

GitHub Pagesで公開する場合は、このフォルダ内のファイルをリポジトリ直下に配置してください。

1. GitHubで新規リポジトリを作成
2. `index.html`, `styles.css`, `script.js`, `assets/`, `.nojekyll` をアップロード
3. Settings > Pages で `Deploy from a branch` を選択
4. `main` ブランチ / root を指定して公開

## 差し替え推奨箇所

- 新着情報の各リンク先
- 取扱分野カード画像を正式素材に差し替える場合は `assets/practice-*.jpg`
- ヒーロー写真を正式素材に差し替える場合は `assets/hero-right.jpg`
- 地図画像を正式素材に差し替える場合は `assets/office-map.jpg`

## 注意

本データは静的HTMLです。フォーム送信機能、WordPress連携、CMS連携は含めていません。お問い合わせボタンは既存の予約ページにリンクしています。


## 新着情報の自動取得

`script.js` により、総合サイト `https://nagasesogo.com/wp-json/wp/v2/posts?per_page=4&_embed=1` から最新投稿をクライアント側で取得し、LPの「新着情報」に反映します。GitHub Pages上でもブラウザから直接取得します。取得できない場合は、予備の新着情報を表示します。

## 茨城県内4拠点

東京支所案内の下に、牛久本部・日立支所・水戸支所・守谷支所の所在地と電話番号を掲載しています。
