# Chat Helper
GChat向けに、充実したChrome拡張機能を提供します。

## サポート対象
- Chromeブラウザ
- 日本語設定

## インストール方法

Chromeウェブストア未公開のため、ソースコードをダウンロードして追加する必要があります。
||手順|スクリーンショット|
|--|--|--|
|1|リポジトリをクローンまたはダウンロードします。<br>右上の Code ボタンから、Download ZIPをクリックし、<br>ダウンロードされたファイルを解凍（展開）します。|![ダウンロード手順](./docs/images/install-download.png)|
|2|Chromeの拡張機能ページ [`chrome://extensions/`](chrome://extensions/) <br>を開きます。||
|3|右上のデベロッパーモードをオンにします。|![デベロッパーモード](./docs/images/install-developer-mode.png)|
|4|左上の「パッケージ化されていない拡張機能を読み込む」から、<br>先ほど解凍（展開）したフォルダ [`chat-helper-master/src/`](./src) を選択します。<br>|![パッケージ化されていない拡張機能を読み込む](./docs/images/install-load.png)|


## 使い方
1. 拡張機能のオプションページを開きます。
	オプションページの開き方は2種類あります。
	- [`chrome://extensions/`](chrome://extensions/)の拡張機能の「詳細」ボタン→画面スクロールして「拡張機能のオプション」をクリックします。
	- 拡張機能アイコンをクリック
1. オプションページで、使用したい機能をオンにします。（デフォルトはすべてオフ）


## 機能
実装済みの機能を紹介します。
オプションページでも確認できます。オプションページでは、未実装の機能も掲載されています。
画像付きの詳細説明は[機能紹介のページ](./docs/functions.md)を参照してください。

### スタイルの変更
- **行間を狭く**<br>チャット画面の行間や余白を調整し、多くのメッセージが表示できるようにします。狭さの強さを3段階で選択できます。
- **ユーザ名太字**<br>チャット画面のユーザ名を太字にします。初期設定の太さでは、アルファベットは太字になりますが、日本語は太字にならないため、太さを上げます。
- **OGP非表示**<br>URL投稿時のサムネイルを隠し、会話が縦に伸びないようにします。
- **添付ファイルのサムネイル非表示**<br>添付ファイルのサムネイル画像を隠し、会話が縦に伸びないようにします。
- **画像折り畳みの有効化**<br>各画像を小さく折りたたむボタンを表示します。

### 追加情報の表示
- **Markdown**<br>各メッセージをMarkdown形式として認識します。設定により、シンタックスハイライト（ソースコードの色付け）をつけることもできます。
- **数式**<br>TeX形式で書かれた数式をレンダリングします。`$`で囲まれた部分はインライン数式、`$$`で囲まれた部分はブロック数式と解釈します。

### メッセージアクション
- **URL取得**<br>各メッセージのURLをクリップボードにコピーするボタンを追加します。
- **メッセージのピン止め**<br>指定したメッセージの情報を上部に表示します。クリックするとメッセージに飛びます。
- **メッセージのコピー**<br>指定したメッセージのテキストをクリップボードにコピーするボタンを追加します。特に、Markdown、リッチテキスト、数式をコピーしたい場合に役立ちます。

### リアクション
- **よく使うリアクションのサジェスト**<br>ユーザのリアクション使用履歴に基づき、よく使われるリアクションの欄を、ユーザが実際によく使うリアクションに変更します。


## 更新履歴
### 2021/08/03
- よく使うリアクションのサジェストの機能を追加
- 数式レンダリングのバグを修正

### 2021/08/02
- 数式レンダリングの機能を追加
- メッセージコピー機能を追加
- 機能説明ドキュメントの追加

### 2021/08/01
- Markdownの機能を追加

### 2021/07/30
- 画像折りたたみ機能を追加

### 2021/07/29
- 6機能公開

