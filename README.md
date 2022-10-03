# Voide

Generate HTML presentations from markdown with [Marp](https://marp.app/) and [VOICEVOX](https://voicevox.hiroshiba.jp/)

日本語: <https://tnantoka.github.io/voide>

## Requirements

- Node
- VOICEVOX

## Usage

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

## Development

```
# Run VOICEVOX
$ ~/path/to/VOICEVOX.app/Contents/MacOS/run
# or open VOICEVOX.app
# or docker compose up

$ npm i
$ npm run hello
```

## License

MIT

## Author

[@tnantoka](https://twitter.com/tnantoka)
