# Voide

[Marp](https://marp.app/)と[VOICEVOX](https://voicevox.hiroshiba.jp/)を使って音声付きスライドを作るツール

デモ: <https://tnantoka.github.io/voide>

## 必要なもの

- Node
- VOICEVOX

## 使い方

事前にVOICEVOXを起動する必要があります。

```
$ npx voide -h
Usage: voide [options]

Options:
  -i, --input <path>               path/to/source.md
  -o, --output <path>              path/to/output.d/
  -s, --speaker <id>               0: 四国めたん (あまあま)
                                   1: ずんだもん (あまあま)
                                   2: 四国めたん (ノーマル)
                                   3: ずんだもん (ノーマル)
                                   4: 四国めたん (セクシー)
                                   5: ずんだもん (セクシー)
                                   6: 四国めたん (ツンツン)
                                   7: ずんだもん (ツンツン)
                                   8: 春日部つむぎ (ノーマル)
                                   9: 波音リツ (ノーマル)
                                   10: 雨晴はう (ノーマル)
                                   11: 玄野武宏 (ノーマル)
                                   12: 白上虎太郎 (ふつう)
                                   13: 青山龍星 (ノーマル)
                                   14: 冥鳴ひまり (ノーマル)
                                   15: 九州そら (あまあま)
                                   16: 九州そら (ノーマル)
                                   17: 九州そら (セクシー)
                                   18: 九州そら (ツンツン)
                                   19: 九州そら (ささやき)
                                   20: もち子さん (ノーマル)
                                   21: 剣崎雌雄 (ノーマル)
                                   22: ずんだもん (ささやき)
                                   23: WhiteCUL (ノーマル)
                                   24: WhiteCUL (たのしい)
                                   25: WhiteCUL (かなしい)
                                   26: WhiteCUL (びえーん)
                                   27: 後鬼 (人間ver.)
                                   28: 後鬼 (ぬいぐるみver.)
                                   29: No.7 (ノーマル)
                                   30: No.7 (アナウンス)
                                   31: No.7 (読み聞かせ)
                                   32: 白上虎太郎 (わーい)
                                   33: 白上虎太郎 (びくびく)
                                   34: 白上虎太郎 (おこ)
                                   35: 白上虎太郎 (びえーん)
  -t, --title <title>
  -d, --description <description>
  -w, --wait <page:seconds...>
  -h, --help                       display help for command
```

## 開発

### 方針

MarkdownファイルはそのままMarpで処理できるようにしたいので、カスタマイズしない。コマンドラインオプションで何とかする。

### 手順

```
# VOICEVOXの起動
$ ~/path/to/VOICEVOX.app/Contents/MacOS/run
# または open VOICEVOX.app
# または docker compose up # Dockerにかなりのリソースを割り当てないと遅いと思います

$ npm i
$ npm run hello
```

## ライセンス

MIT

## 作者

[@tnantoka](https://twitter.com/tnantoka)
