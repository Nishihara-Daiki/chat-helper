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
|4|左上の「パッケージ化されていない拡張機能を読み込む」から、<br>先ほど解凍（展開）したフォルダ `chat-helper-master/` の中の [`src/`](./src) を選択します。<br>|![パッケージ化されていない拡張機能を読み込む](./docs/images/install-load.png)|


## 使い方
1. ブラウザ右上のアイコン <img src="./docs/images/extension_icon.png" width="16"> をクリックします。
2. chat helper を選択します。ピン止めしておくと便利です。
3. 設定画面を開き、必要な設定をオンにします。
4. 設定を反映するために、chat画面を更新します。


## 機能
実装済みの機能については、[機能紹介のページ](./docs/functions.md)を参照してください。
また、オプションページでも確認できます。オプションページでは、未実装の機能も掲載されています。


## 免責事項
この拡張機能は開発途中にあります。制作者は不具合が無いよう注意を払って制作しておりますが、この拡張機能の利用に関して、利用者に何らかの不都合や損害が生じたとしても、制作者は何ら責任を負いません。
なお、動作不具合等があれば、issue等でお知らせください。


## 更新履歴
[更新履歴のページ](./docs/history.md)を参照してください。


## 使用ライブラリ
開発にあたり、以下のライブラリを使用しています。

+ [Highlight.js](https://highlightjs.org/) (v11.1.0)
+ [insertion-query](https://github.com/naugtur/insertionQuery) (v1.0.5)
+ [marked](https://github.com/markedjs/marked) (v2.1.3)
+ [MathJax](https://github.com/mathjax/MathJax) (v3.2.0)
