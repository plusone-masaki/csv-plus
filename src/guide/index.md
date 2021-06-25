# インストール方法

OSによってインストール方法が変わりますが、
ほとんどの場合、ダウンロードしたインストーラを起動するだけです。

インストール後はCSVファイルへの関連付けを行うことをおすすめします。

## Windows

### .exe 形式

インストーラ形式のファイルで、インストールを行うことでスタートメニューなどに登録することができ、
ファイルの関連付けが容易になったり、将来的には自動更新にも対応します。

1. [ダウンロードページ](/csv-plus/download) で「Windows」のダウンロードボタンをクリックします。
2. ダウンロードしてきた `csv-plus-setup-[x.x.x].exe` をダブルクリックして起動します。
3. **Microsoft Defender SmartScreen** というダイアログが出て **「実行しない」しか押せない**
   というパターンがありますが、 **「詳細情報」をクリックしてから「実行」を押すことでインストールができます。**
4. ダイアログの案内に従って進んでいけばインストールが完了します。


::: tip Microsoft Defender SmartScreenがインストールをブロックする理由
公開して間もない、証明書を取得していないソフトウェアは信頼されてないので警告を出すようにしているらしいです。
証明書を取ろうかと思いましたが、年間2〜3万の会費がかかるらしく、フリーソフトの公開のためにそこまで費用は出せませんでした...

インストールされた回数が増えると信頼度が上がってダイアログも出なくなるらしいので、みなさまにご協力いただけると大変ありがたく思いますm(_ _)m
:::


### .zip 形式

インストール不要の実行ファイルが入っています。
学校や職場の規則などでソフトのインストールができない場合に便利です。

1. [ダウンロードページ](/csv-plus/download) で「その他のリリース」から `csv-plus-setup-[x.x.x].zip`
   をクリックしてファイルをダウンロードします。
2. [Lhaplus](https://forest.watch.impress.co.jp/library/software/lhaplus/) などを利用してファイルを解凍します。
3. 解凍したフォルダの中にある `CSV+.exe` をダブルクリックすると起動します。

::: danger 注意！
`CSV+.exe` ファイルはフォルダから移動させないでください。起動できなくなります。
CSV+のフォルダごと移動させるか、ショートカットをご利用ください。
:::

## MacOS

1. [ダウンロードページ](/csv-plus/download) で「MacOS」のダウンロードボタンをクリックします。
2. ダウンロードしてきた `csv-plus-setup-[x.x.x].dmg` をダブルクリックして起動します。
3. `CSV+.app` ファイルをアプリケーションに追加します。


## Debian/Ubuntu(.deb)

1. [ダウンロードページ](/csv-plus/download) で「Ubuntu(.deb)」のダウンロードボタンをクリックします。
2. ダウンロードしてきた `csv-plus-setup-[x.x.x].deb` をダブルクリックして起動します。
3. ダイアログの案内に従ってインストールを行ってください。


## Linux(.AppImage)

1. [ダウンロードページ](/csv-plus/download) で「Linux(.AppImage)」のダウンロードボタンをクリックします。
2. ダウンロードしてきた `csv-plus-setup-[x.x.x].AppImage` に実行権限(x)を追加します。
3. AppImage ファイルをダブルクリックすると起動します。

<br>
<br>
<br>

<!-- CSV+使い方 -->
<ins class="adsbygoogle"
style="display:block"
data-ad-client="ca-pub-9835503912749997"
data-ad-slot="2237157972"
data-ad-format="auto"
data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
