/**
 * CONTENT ARCHITECTURE
 * ----------------------------------------------------
 * セクション追加は GUIDE_DATA.volumes[0].sections に section オブジェクトを足すだけ。
 * 読者UIには研究名・論文名を出さない。sources は制作用メタデータで、描画されない。
 *
 * page.type:
 * question | explain | contrast | history | failure | chorus | modern | wisdom
 */
window.GUIDE_DATA = {
  version: 1,
  volumes: [
    {
      id: "vol-01",
      title: "大人のリアル攻略本",
      subtitle: "当たり前を疑うと、人類の失敗と知恵が見えてくる。",
      targetSections: 100,
      sections: [
        {
          id: "sec-001",
          number: 1,
          title: "なんで子どもの頃の1年って、あんなに長かったんだろう？",
          startPrompt: "時計は同じなのに、何が変わった？",
          finalWisdom: "時間を守りなさい。",
          sources: [
            "https://link.springer.com/article/10.3758/s13423-025-02833-z",
            "https://americanhistory.si.edu/ontime/mechanizing/reliable.html",
            "https://americanhistory.si.edu/ontime/synchronizing/zones.html",
            "https://timeandnavigation.si.edu/timeline2"
          ],
          pages: [
            {
              type: "question",
              eyebrow: "SECTION 01",
              title: "なんで子どもの頃の1年って、\nあんなに長かったんだろう？",
              body: [
                "夏休みからクリスマスまで、めちゃくちゃ遠かった気がする。",
                "今は気づいたら、もう一年終わってる。"
              ],
              visual: { kind: "timeline", left: "🎒 夏休み ───── 🎄 クリスマス", right: "📅 1月  2月  3月  …  12月", dayPose: "school" },
              trigger: "時計は同じなのに、何が変わった？"
            },
            {
              type: "contrast",
              title: "時間って、意外と適当。",
              visual: { kind: "split", left: "😑 退屈な10分", right: "🎮 楽しい10分", badge: "どっちも 10分", dayPose: "watch" },
              body: [
                "同じ10分でも、\n『長っ……』ってなる時と、\n『もう終わり？』ってなる時がある。",
                "つまり俺たちが感じてる時間って、時計ほど正確じゃない。"
              ],
              trigger: "じゃあ、過ぎた一年の長さって何で決めてる？"
            },
            {
              type: "explain",
              title: "一年は、365日分の動画じゃない。",
              visual: { kind: "islands", items: ["初めて行った場所", "新しい友達", "大失敗", "旅行", "喧嘩"], dayPose: "memory" },
              body: [
                "去年の365日を全部思い出せる人なんて、たぶんいない。",
                "でも、『あの日』は残ってたりする。",
                "人間は過ぎた時間を秒単位で保存してるわけじゃない。出来事の区切りを手がかりに、あとから組み直してる。"
              ],
              note: "年齢で時間が速くなる理由は、これ一個だけじゃない。",
              trigger: "じゃあ、毎日ほぼ同じだったら？"
            },
            {
              type: "explain",
              title: "『いつもの日』は、まとめられていく。",
              visual: { kind: "routine", items: ["起きる", "移動", "学校・仕事", "帰る", "寝る"], dayPose: "routine" },
              body: [
                "似た日が続くと、一日一日を全部別々に持っておく必要がなくなる。",
                "頭の中では、\n『まあ、いつものやつ』\nになっていく。"
              ],
              dayLine: "俺これ、昨日と今日の区別つかなくなるな。",
              trigger: "でも、こんなに人によって伸び縮みする『時間』を、どうやって社会全体で合わせてる？"
            },
            {
              type: "history",
              title: "昔は、そもそも合わせてなかった。",
              visual: { kind: "clocks", items: ["町A  ☀️ 12:00", "町B  ☀️ 11:52"], dayPose: "traveler" },
              body: [
                "昔は町ごとに太陽を見て、『今が昼だな』って時計を合わせてた。",
                "だから隣町に行けば、時計が数分ズレてる。",
                "歩くか馬で移動してるうちは、数分くらいズレても大して困らない。"
              ],
              trigger: "ところが、人間が急に速くなる。"
            },
            {
              type: "history",
              title: "鉄道が、数分のズレを巨大な問題にした。",
              visual: { kind: "rail", items: ["A町 11:52", "B町 11:58", "C町 12:06", "D町 12:11"], dayPose: "conductor" },
              body: [
                "鉄道が広がると、昨日まで小さかった『数分のズレ』が一気にデカい問題になる。",
                "乗り換え。時刻表。単線でのすれ違い。貨物の接続。",
                "全部『同じ時間を使ってる』が前提だから。"
              ],
              trigger: "当然、人類はここでやらかす。"
            },
            {
              type: "failure",
              stamp: "FAILURE 01",
              title: "何時なんだよ。",
              visual: { kind: "station", label: "違う時刻表・違う時計・違う鉄道会社", dayPose: "confused" },
              body: [
                "まず普通に、分かりにくい。",
                "鉄道会社が違えば、『12時』の意味まで違う。",
                "乗客は乗り換えるたびに、どの時計を見るのか確認しないといけない。"
              ],
              trigger: "でも、列車を逃すだけならまだ笑える。"
            },
            {
              type: "failure",
              stamp: "FAILURE 02",
              title: "時計が少し遅かった。",
              visual: { kind: "collision", label: "1853 / アメリカ / 単線", dayPose: "silent" },
              body: [
                "ある車掌は、『まだ向こうの列車が来るまで時間がある』と判断した。",
                "でも、その時計は遅れていた。",
                "2本の列車は正面衝突。14人が亡くなった。",
                "数分のズレが、ただの不便じゃなくなった。"
              ],
              trigger: "しかも、問題は一回で終わらなかった。"
            },
            {
              type: "failure",
              stamp: "FAILURE 03",
              title: "また、同じところでコケる。",
              visual: { kind: "manyClocks", label: "北米の鉄道：数十種類の時刻", dayPose: "observe" },
              body: [
                "鉄道が巨大になるほど、バラバラの時間を抱えたまま動かすのがキツくなる。",
                "違う時刻、違う時計、複雑になる乗り換え。",
                "一回なら事故。でも何度も同じ構造で失敗すると、話が変わる。"
              ],
              reveal: "ここで人類側も気づく。",
              trigger: "これ、『もっと気をつけろ』で直る問題じゃない。"
            },
            {
              type: "chorus",
              eyebrow: "THE TURNING POINT",
              title: "人間じゃなく、仕組みを直す。",
              chorusLeft: ["時刻表の混乱", "乗り遅れ", "遅れた時計", "事故", "バラバラの地域時刻"],
              chorusRight: ["時計を検査する", "基準時刻を送る", "運行ルールを揃える", "地域の時刻そのものを揃える"],
              body: [
                "『全員が絶対に間違えないようにする』じゃない。",
                "『間違いにくい世界を作る』に変えた。",
                "鉄道会社や技術者たちが、バラバラだった時間を社会のインフラとしてガチガチに組み直していった。"
              ],
              trigger: "で、その巨大な仕組みは今どこにある？"
            },
            {
              type: "modern",
              title: "今では、見えないくらい当たり前になった。",
              visual: { kind: "network", items: ["✈️ 飛行機", "🏫 学校", "🏢 会社", "📦 配送", "🏥 病院", "📱 スマホ", "🖥️ サーバー"], dayPose: "modern" },
              body: [
                "9時の会議。12時の飛行機。15時の配送。17時の予約。",
                "人がつながるほど、自分の5分が他人の5分にもなる。",
                "時間を合わせることは、礼儀より先に、システムを動かす条件になる。"
              ],
              trigger: "そんな巨大な仕組みを、毎回ぜんぶ説明するわけにはいかない。"
            },
            {
              type: "wisdom",
              title: "人類は、長い説明を一言に圧縮する。",
              body: [
                "人間が感じる時間は、意外なくらい伸びたり縮んだりする。",
                "だから人類は、自分の感覚とは別に『みんなで共有する時間』を作った。",
                "その時間がズレて何度も困ったから、時計もルールも通信も標準時も本気で揃えていった。",
                "でも、その巨大な仕組みを子どもに毎回説明するわけにはいかない。"
              ],
              wisdom: "時間を守りなさい。",
              dayLine: "……思ってたより重い言葉だな。",
              endSection: true
            }
          ]
        }
      ]
    }
  ]
};

// 新規セクション用の雛形。コピーして sections 配列へ追加する。
window.SECTION_TEMPLATE = {
  id: "sec-002",
  number: 2,
  title: "ここに潜在的な謎",
  finalWisdom: "最後に着地する一言",
  sources: [],
  pages: [
    { type: "question", title: "最初の問い", body: ["本文"], trigger: "次の問い" },
    { type: "failure", stamp: "FAILURE 01", title: "歴史上の失敗", body: ["本文"], trigger: "次の問い" },
    { type: "failure", stamp: "FAILURE 02", title: "同じ構造の失敗", body: ["本文"], trigger: "読者がパターンに気づく問い" },
    { type: "chorus", title: "人類が気づく", chorusLeft: ["失敗"], chorusRight: ["修正"], body: ["人ではなく仕組みを直す。"], trigger: "現代へ" },
    { type: "modern", title: "今では当たり前", body: ["現代への転移"], trigger: "着地へ" },
    { type: "wisdom", title: "一言に圧縮される", body: ["本文"], wisdom: "人類の知恵", endSection: true }
  ]
};
