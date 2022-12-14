---
theme: gaia
---

# これは何？

Markdownでスライドを作り、それを自分の代わりにVOICEVOXに発表してもらおうというツールです。

<!--
まずは、これは一体なんなのかという話ですが、
マークダウンからスライドを作って、その発表者メモをVOICEVOXに読み上げてもらうためのコマンドラインツールです。
-->

--- 

# モチベーション

- 自分の声を聞きたくない
- 「撮り直し」という非人道的な作業から人類を解放する（？）

<!--
次に、なんのためにこんなものを作ったのか。
一番の理由は、おっさんである自分の声をあまり聞きたくないというものです。
あと、撮り直しという作業がとても嫌いなので、人間がそれをやらずに音声付きのスライドが作れればいいな、というのもありました。
-->

---

# どんなスライドが作れる？

今見ているこのスライドがサンプルです。

<!--
どんなものが作れるのか。
今見ているこれがまさにボイドを使って作ったものです。
コマンド一発、加工なしです。
-->

---

# 使い方

1. Markdownを準備する
2. 話す内容を書く
3. Voideで処理する

<!--
さて、使い方です。
このような3つの手順で使います。
-->

---

# 使い方1: Markdownを準備する

スライドの元となるMarkdownを準備します。
内部でMarpを使っているので、Marpの記法に従います。

VS Codeの拡張やコマンドラインツールがあるので、好きな方法で作成します。

<a href="https://marp.app/#get-started" target="_blank" rel="noopener">https://marp.app/#get-started</a>

<!--
まずは一番大事なスライドの中身ですが、これはマープというツールに任せているので、これに従ってマークダウンを書けばOKです。
ブイエスコードの拡張やシーエルアイツールがあるので、好きな方法でどうぞ。
-->

---

# 使い方2: 話す内容を書く

各スライドにHTMLコメントで書きます。

```
---

# タイトル

本文

<!--
ここに書きます
-->

---
```

<!--
次におそらく一番面倒な手順です。
各スライドにHTMLコメントとして、VOICEVOXに読み上げてもらう原稿を書いていきます。
めんどいとは言え、実際にしゃべるよりはだいぶマシなのではないかと思います。
-->

---

# 使い方3: Voideで処理する

markdownファイルをVoideに渡します。
Node(npm)が必要です。また、**事前にVOICEVOXを起動しておく必要があります。**

```
$ npx voide \
  -i Markdownファイルのパス \
  -o 出力ディレクトリのパス \
  -s 音声ライブラリのID \
  -t タイトル \
  -d 概要 \
  -w ページ:待ち時間
```

<!--
最後に作成したマークダウンをボイドに渡します。
-->

---

# 使い方3: Voideで処理する

- `-o`に指定したディレクトリにファイルが生成されます。
- `-s`に使用するIDは`voide -h`で確認できます。（0〜35）
- `-w`は読み上げが終わった後に待ちたい場合に使います。複数指定できます。「ページ:秒」の形式で指定します。

<!--
主なオプションはこちらです。
wがわかりづらいですが、読み上げた後、スライドがすぐ切り替わってしまうのを防ぐためのものです。
-->

---

# 使い方3: Voideで処理する

このスライドは以下のようなコマンドで生成しています。

```
$ npx voide \
  -i examples/docs.md \
  -o docs \
  -s 0 \
  -t Voide \
  -d '"Kawaii" Slide Generator' \
  -w 1:1 2:1 3:1 4:2 5:2 6:2 7:2 8:2 9:2 10:1 11:1
```

<!--
実際にこのスライドを生成したコマンドを載せておきます。
-->

---


# 完成・公開

これで完成です。

公開したい場合は`-o`に指定したディレクトリの中身をそのままGitHub PagesなどでホスティングすればOKです。

<!--
完成したスライドはアウトプットディレクトリをまるごと公開すればOKです。
-->

---

# ライセンスに注意

VOICEVOXはとても緩いライセンスでありがたいのですが、
一部注意が必要な音声ライブラリもあります。

スライドを公開する前に必ず確認しましょう。

<a href="https://voicevox.hiroshiba.jp/" target="_blank" rel="noopener">https://voicevox.hiroshiba.jp/</a>

<!--
VOICEVOXのライセンスは音声ライブラリごとに異なるので、各自確認してください。
音声作品への使用が禁止されているものなどがあるので要注意です。
-->

---

# よいスライドライフを

Kawaiiスライドは作れる :muscle:

<!--
それでは、もし興味が湧きましたらスライドを作ってみてください。
かわいい、スライドは、作れる！です。
ありがとうございました。
-->
