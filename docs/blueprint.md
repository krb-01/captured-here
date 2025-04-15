# **App Name**: GeoBook Explorer

## Core Features:

- Location Based Search: Implement a cascading pulldown UI to allow users to select a continent, country and region. Use english as the UI language.
- Book Listing: Display a list of books matching the selected location, showing each book's thumbnail, title, author and publication year.
- Dynamic Description Generation: When a user views a book details page, and the book description does not exist, use a tool to generate one.
- Book Details Display: Display key details about a book: thumbnail, title, author, publication year, country, region and description.
- Related Books: Display books that are related to the current book being viewed.  Try to find books by the same author or books from the same region.

## Style Guidelines:

- Primary color: Use a neutral background, such as light gray (#f0f0f0), to provide a clean and unobtrusive backdrop for the content.
- Secondary color: Use a soft blue (#e0f7fa) for secondary elements such as headers, borders or accents.
- Accent: A vibrant teal (#26a69a) should be used to highlight interactive elements, calls to action and important information.
- Ensure a clean and intuitive layout, prioritizing easy navigation and readability.
- Employ a consistent style of simple, modern icons for wayfinding and to represent different categories of books or locations.

## Original User Request:
アプリ概要
* 世界中の写真集やアートブックを「撮影地（地域・国）」で検索できるWebアプリ
* 書籍紹介には Amazon アソシエイトリンクを使用（収益化を想定）

技術スタックと開発体制
* 開発者：個人開発（日本語でのやりとり希望）
* 使用技術：
    * フロントエンド：Next.js（静的サイト生成・一部再生成対応予定）
    * スタイリング：Tailwind CSS
    * データベース：Firestore
    * バックエンドAPI：Cloud Functions（LLM連携処理など）
    * CI/CD：GitHub Actions（Firebase CLIを用いた自動デプロイ）

基本方針
* アプリUIの使用言語は英語（多国籍ユーザーを想定）
* コストを最小限に抑えた設計を希望（Firebaseの無料枠を活用）
* 最小機能から開発し、必要に応じてスケールアップ予定

ページ構成
* TOPページ（検索・書籍一覧）
* 書籍詳細ページ
* このアプリについて（About）
* プライバシーポリシー

TOPページの機能
* 検索UI：
    * 大陸（7大州＋北極） → 国 → 地域のプルダウン選択
    * GeoJSON地図イメージもクリック可能で、検索UIと双方向連動
* 地図アニメーション：
    * 選択エリアにフォーカス・ズームイン（選択に応じた動き）
* 書籍リストの表示：
    * 条件に合致した書籍一覧を表示（サムネイル／タイトル／著者／発行年）
* 新着書籍の表示：
    * 直近で追加された本をリスト表示（国も含む）

書籍詳細ページの機能
* TOPページと同様の検索UIを再表示
* 書籍の詳細情報を表示：
    * サムネイル／タイトル／著者／発行年／国／行政区分／説明文
* 関連書籍の表示：
    * 同地域の別年代の本
    * 同作者の別地域の本
* 説明文がない場合：
    * ユーザーが詳細ページを開いた際に LLM で説明文を生成
    * Firestore に保存し、そのページのみ静的再生成（ISRまたは再ビルド）

書籍データ
* 開発初期は事前に用意した静的データ（JSONやTypeScriptファイル）を使用
* 各国10冊以上の網羅を目標
* Firestoreの構成例：
    * コレクション：books
        * isbn / title / author / published_on / item_url / image_url / region / country / division_name / description / created_at / updated_at / url01, url02 …
    * コレクション：country_divisions
        * country名 → division_name のマッピングデータ

Amazonアソシエイト連携
* 書籍ページへのリンクは Amazon アソシエイトのURLを使用
* 現在はアカウント未取得のため、開発中はパラメータ部分を定数で管理

バックエンド処理（Cloud Functions）
＜定期実行（スケジュール）＞
* A. 新作取得（Weekly） 　Amazon APIで新作や人気書籍を books コレクションに追加
* B. 撮影地補完（Weekly） 　撮影地が未設定の書籍に対して、LLMで予測・補完して更新
* C. コレクション拡充（Monthly） 　撮影地ごとの新作書籍を追加
＜ユーザー操作に応じて＞
* D. 説明文生成 　詳細ページ表示時に説明文がなければ、LLMで生成→保存→対象ページのみ再生成

CI/CDの運用
* GitHubの main/master ブランチにマージ → 全ページ再ビルド＋デプロイ
* B/C アクション終了時 → TOPページ＋追加された詳細ページを再ビルド＋デプロイ
* D アクション終了時 → 対象詳細ページのみ再ビルド＋デプロイ
  