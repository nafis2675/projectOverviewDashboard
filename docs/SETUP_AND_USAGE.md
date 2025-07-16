# Setup and Usage Guide / セットアップと使用方法

## English Version

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**
   ```bash
   cd project-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the mock API server (optional)**
   ```bash
   npx json-server --watch db.json --port 4000
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Features Overview

#### Role-Based Access Control
The application supports three user roles:

- **Manager**: Full access to all features
  - Create, edit, delete projects
  - Manage teams and members
  - View all data and statistics

- **Team Lead**: Limited management access
  - View and edit own team
  - Access to team-specific projects
  - Member management within team

- **Member**: View-only access
  - View assigned tasks
  - Personal to-do management
  - Limited project visibility

#### How to Change Roles
1. Click on the role selector in the header (top-right)
2. Choose from Manager, Team Lead, or Member
3. The interface will update automatically based on your role

#### Language Switching
1. Click the globe icon (🌐) in the header
2. Select English (🇺🇸) or Japanese (🇯🇵)
3. The entire interface will switch languages instantly

#### Dark Mode Toggle
1. Click the sun/moon icon in the header
2. Toggle between light and dark themes
3. Your preference is saved automatically

### Navigation

#### Dashboard
- Overview of all projects and teams
- Progress charts and statistics
- Quick access to recent activities

#### Projects
- List of all projects with search and filtering
- Project cards showing progress and status
- Role-based actions (view, edit, delete)

#### Project Detail
- Detailed project information
- Timeline visualization
- Project parts with to-do lists
- Team assignments

#### Teams
- Team management interface
- Member visualization
- Progress tracking

#### Members
- Member directory with role filtering
- Individual member profiles
- Task assignments and progress

### Data Management

#### Mock Data
The application includes realistic mock data:
- 2 sample projects (E-commerce Platform, CRM System)
- 3 teams (Frontend, Backend, CRM)
- 8 team members with various roles

#### Local Storage
User preferences are automatically saved:
- Theme preference (light/dark)
- Language selection (English/Japanese)
- Role selection (Manager/Team Lead/Member)

### Troubleshooting

#### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Dependencies not installed**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build errors**
   ```bash
   npm run lint
   # Fix any linting issues
   ```

#### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 日本語版

### 前提条件
- Node.js（バージョン16以上）
- npmまたはyarnパッケージマネージャー
- モダンなウェブブラウザ（Chrome、Firefox、Safari、Edge）

### インストール

1. **プロジェクトをクローンまたはダウンロード**
   ```bash
   cd project-dashboard
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

4. **モックAPIサーバーを起動（オプション）**
   ```bash
   npx json-server --watch db.json --port 4000
   ```

5. **ブラウザを開く**
   `http://localhost:3000`にアクセス

### 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルド
- `npm run preview` - 本番ビルドのプレビュー
- `npm run lint` - ESLintを実行

### 機能概要

#### 役割ベースアクセス制御
アプリケーションは3つのユーザー役割をサポートします：

- **マネージャー**: すべての機能への完全アクセス
  - プロジェクトの作成、編集、削除
  - チームとメンバーの管理
  - すべてのデータと統計の表示

- **チームリーダー**: 限定された管理アクセス
  - 自分のチームの表示と編集
  - チーム固有のプロジェクトへのアクセス
  - チーム内のメンバー管理

- **メンバー**: 読み取り専用アクセス
  - 割り当てられたタスクの表示
  - 個人のTo-Do管理
  - 限定されたプロジェクト可視性

#### 役割の変更方法
1. ヘッダーの役割セレクター（右上）をクリック
2. マネージャー、チームリーダー、メンバーから選択
3. インターフェースが役割に基づいて自動的に更新されます

#### 言語切り替え
1. ヘッダーの地球アイコン（🌐）をクリック
2. 英語（🇺🇸）または日本語（🇯🇵）を選択
3. インターフェース全体が即座に言語を切り替えます

#### ダークモード切り替え
1. ヘッダーの太陽/月アイコンをクリック
2. ライトテーマとダークテーマを切り替え
3. 設定が自動的に保存されます

### ナビゲーション

#### ダッシュボード
- すべてのプロジェクトとチームの概要
- 進捗チャートと統計
- 最近の活動へのクイックアクセス

#### プロジェクト
- 検索とフィルタリング付きのすべてのプロジェクトのリスト
- 進捗とステータスを表示するプロジェクトカード
- 役割ベースのアクション（表示、編集、削除）

#### プロジェクト詳細
- 詳細なプロジェクト情報
- タイムライン可視化
- To-Doリスト付きプロジェクトパーツ
- チーム割り当て

#### チーム
- チーム管理インターフェース
- メンバー可視化
- 進捗追跡

#### メンバー
- 役割フィルタリング付きメンバーディレクトリ
- 個別メンバープロファイル
- タスク割り当てと進捗

### データ管理

#### モックデータ
アプリケーションには現実的なモックデータが含まれています：
- 2つのサンプルプロジェクト（Eコマースプラットフォーム、CRMシステム）
- 3つのチーム（フロントエンド、バックエンド、CRM）
- 様々な役割を持つ8人のチームメンバー

#### ローカルストレージ
ユーザー設定が自動的に保存されます：
- テーマ設定（ライト/ダーク）
- 言語選択（英語/日本語）
- 役割選択（マネージャー/チームリーダー/メンバー）

### トラブルシューティング

#### 一般的な問題

1. **ポートが既に使用中**
   ```bash
   # ポート3000のプロセスを終了
   npx kill-port 3000
   ```

2. **依存関係がインストールされていない**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **ビルドエラー**
   ```bash
   npm run lint
   # リンティングの問題を修正
   ```

#### ブラウザ互換性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Quick Start / クイックスタート

### English
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:3000

# 4. Try different roles and languages!
```

### 日本語
```bash
# 1. 依存関係をインストール
npm install

# 2. 開発サーバーを起動
npm run dev

# 3. ブラウザで http://localhost:3000 を開く

# 4. 異なる役割と言語を試してみてください！
``` 