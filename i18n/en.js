/* 英語の訳。
   左が日本語のもとの文、右がその訳です。もとの文は content.js と assets の中に書いてあります。
   ・左側は、もとの文と一字でもちがうと使われません。日本語を書きかえたら、ここの左側も同じに書きかえてください。
   ・訳がない文は、日本語のまま出ます。ページのアドレスのうしろに ?lang=en&check をつけて開くと、訳がまだない文がわかります。
   ・{n} や {x} は、数字や名前が入る場所です。訳の中にも同じものを書きます。<br> や <wbr> などのタグも、同じように残します。
   ・OpenAIの公式ページにある文は、公式の英語のページの言い回しに合わせてあります。
   ・左側に <br> <wbr> <em> &nbsp; が入っている文は、訳がそのままHTMLとして出ます。訳の中に < や & を書かないでください（「Q&A」のような書き方も）。
   ・「東京大学での活動は、{n}人の…」の訳のおわりにある空白は、次の文とのあいだをあけるためのものです。消さないでください。 */
window.SITE_I18N = window.SITE_I18N || {};
window.SITE_I18N.en = {

  // ── メニュー・サイト名・共通の言葉 ──
  '次回':
    'Next',
  '作品':
    'Projects',
  '活動記録':
    'Recaps',
  '運営メンバー':
    'Team',
  'はじめての方へ':
    'New here?',
  'メニュー':
    'Menu',
  '東京大学 学生運営':
    'Student-run',
  'OpenAI Student Collective at UTokyo｜東京大学 学生運営':
    'OpenAI Student Collective at UTokyo | Student-run',
  '次回のイベント':
    'Next event',
  'OpenAI Student Collectiveは、OpenAIの公式プログラムです。東京大学での活動は、Campus Lead（学生）が運営しています。':
    'The OpenAI Student Collective is an official OpenAI program. At UTokyo, it’s run by student Campus Leads.',
  'OpenAI Student Collective Campus Lead 2026のバッジ':
    'OpenAI Student Collective Campus Lead 2026 badge',
  '@イベントで使うことば':
    'Events are held in Japanese.',
  '閉じる':
    'Close',
  'くわしい表示':
    'Details',
  'くわしく見る':
    'See details',
  'すべて見る':
    'See all',
  '準備中':
    'In the works',
  '調整中':
    'TBA',
  '日程調整中':
    'Date TBA',
  '日程調整中です':
    'Dates to be announced',
  '今学期の予定':
    'This term',
  'ワークショップ':
    'Workshop',
  'ショーケース':
    'Showcase',
  'イベント':
    'Event',
  '毎週':
    'Weekly',
  'よくある質問':
    'FAQ',
  '次回のイベントを見る':
    'See the next event',
  '次回のイベントをくわしく見る':
    'See details of the next event',
  '作品を見る':
    'See projects',
  '活動記録を見る':
    'See recaps',
  '{n}件':
    '{n}',
  '{n}人':
    '{n} joined',
  '{t}から':
    'from {t}',
  '{a}（{b}）':
    '{a} ({b})',
  '。':
    '.',
  '第{n}回':
    'No.{n}',
  '全{n}回':
    '{n} this term',
  '{n}回終了':
    '{n} done',
  '次回は{d}です':
    'Next: {d}',
  '次回は{d}です。':
    'The next one is on {d}.',
  '{x}は日程調整中です':
    '{x}: date TBA',
  '今学期の回は終了しました':
    'All sessions this term are over',
  '月火水木金':
    'MTWTF',
  '「{x}」のページは準備中です。':
    'The “{x}” page isn’t ready yet.',

  // ── イベント（content.js の 2〜4） ──
  '2026年10月〜12月':
    'Oct–Dec 2026',
  '日程は、教室が決まり次第このページに載せます。':
    'Dates will be posted here once rooms are confirmed.',
  '第1回ワークショップ':
    'Workshop 1',
  '第1回':
    'Workshop 1',
  'はじめてのCodex：ほしいものを、その場でつくろう':
    'First steps with Codex: build what you want, on the spot',
  'はじめてのCodex。':
    'First steps with Codex.',
  'ほしいものを、その場でつくろう。':
    'Build what you want, on the spot.',
  'はじめてのCodex':
    'First steps with Codex',
  '駒場キャンパス':
    'Komaba Campus',
  '教室は調整中です':
    'Room TBA',
  'はじめての人も歓迎です':
    'First-timers welcome',
  'ノートPC':
    'Laptop',
  '充電器もあると安心です':
    'A charger is handy too',
  '充電器もあると安心です。':
    'A charger is handy too.',
  '無料':
    'Free',
  '学部・学年は問いません':
    'Any major, any year',
  '第2回〜第4回ワークショップ':
    'Workshops 2–4',
  '12月まで':
    'By Dec',
  '内容は決まり次第お知らせします':
    'Details to be announced',
  '12月':
    'Dec',
  '今学期の作品発表':
    'Presenting this term’s projects',
  '曜日と時間は決まり次第お知らせします':
    'Day and time to be announced',

  // ── 「次回」のページ ──
  '場所':
    'Where',
  '使うもの':
    'Tool',
  '持ち物':
    'Bring',
  '参加費':
    'Fee',
  'Lumaで申し込む':
    'Sign up on Luma',
  '申し込む':
    'Sign up',
  'カレンダーに追加':
    'Add to calendar',
  '申し込みは準備中です。日程が決まり次第、このページから申し込めるようになります。':
    'Sign-up isn’t open yet. Once the date is set, you can sign up from this page.',
  '申し込みは準備中です。準備ができ次第、このページから申し込めるようになります。':
    'Sign-up isn’t open yet. You’ll be able to sign up from this page once it’s ready.',
  '申し込みは準備中です。日程が決まり次第、ここから申し込めます。':
    'Sign-up isn’t open yet. Once the date is set, you can sign up here.',
  '申し込みは準備中です。準備ができ次第、ここから申し込めます。':
    'Sign-up isn’t open yet. You’ll be able to sign up here once it’s ready.',
  '次回のイベントは、<br>決まり次第お知らせします。':
    'We’ll announce the next event once it’s set.',
  '次回のイベントは、決まり次第お知らせします。':
    'We’ll announce the next event once it’s set.',
  '運営メンバーの作品から':
    'From the team',
  'これまでにできた作品':
    'Projects so far',
  '{x}の作品':
    'From {x}',
  '{x}の作品はここに並びます。':
    '{x} projects will appear here.',
  'ワークショップでできた作品を、ここに載せていきます。':
    'Projects built at the workshops will be posted here.',
  '{x}の記録はここに載ります。':
    'The {x} recap will appear here.',
  '当日の様子と、できた作品をまとめます。':
    'A recap of the day and what was built.',

  // ── 「作品」のページ ──
  '東大生がAIでつくる作品を、':
    'What UTokyo students are building with AI,',
  'ここに。':
    'all in one place.',
  'ワークショップとStudio Hoursで、その場で生まれた作品を載せていきます。まずは運営メンバーの作品から。':
    'We’ll post what gets built on the spot at our workshops and Studio Hours. For now, here’s what the team has made.',
  '東大生がAIでつくった、':
    'Projects UTokyo students have built with AI:',
  '{n}の作品。':
    '{n} so far.',
  '2026年10月からのワークショップとStudio Hoursで、その場で生まれた作品を並べています。':
    'Projects built on the spot at our workshops and Studio Hours since October 2026.',
  '運営メンバーの作品':
    'Projects by the team',
  'Campus Leadが自分でつくって、使っているもの':
    'Things the Campus Leads built and actually use',
  'こんなものがつくれます':
    'Things you could build',
  '作品の例です。{x}の作品ができたら、ここに並べます。':
    'These are examples. {x} projects will go here once they’re built.',
  '例':
    'Example',
  '{x}（例）':
    '{x} (example)',
  '{x}でつくる例':
    'Try building it with {x}',
  'これは例です。':
    'This is an example.',
  '実際の作品ではありません。ワークショップでは、こういうものをつくれます。':
    'It’s not a real project. It’s the kind of thing you can build at a workshop.',
  '種類':
    'Type',
  'つくった人':
    'Made by',
  'つくった回':
    'Made at',
  '使ったもの':
    'Built with',
  '作品を開く':
    'Open',
  'ピックアップ':
    'Featured',
  'つくった回で絞り込む':
    'Filter by session',
  'すべての回':
    'All sessions',
  '分類で絞り込む':
    'Filter by type',
  'すべて':
    'All',
  'もっと見る（残り{n}件）':
    'Show more ({n} left)',
  'ウェブサイト':
    'Website',
  'ダッシュボード':
    'Dashboard',
  'リサーチ':
    'Research',
  'アシスタント':
    'Assistant',
  'ゲーム':
    'Game',
  'カレンダー':
    'Calendar',
  '地図':
    'Map',

  // ── 作品と、作品の例（content.js の 5 と 5-2） ──
  '単語帳アプリ':
    'Flashcard app',
  '覚え具合に合わせて出題する単語帳。自分と友達が使っています。':
    'A flashcard app that quizzes you based on how well you remember each word. Used by me and my friends.',
  '献立アプリ':
    'Meal-planning app',
  '食べたいものを選んで、その日の献立を決めるアプリ。自分と友達が使っています。':
    'An app for picking what you feel like eating and deciding the day’s menu. Used by me and my friends.',
  '駒場ランチ混雑マップ':
    'Komaba lunch crowd map',
  '食堂と周辺の店の混み具合を、時間帯ごとに色で見られるマップ':
    'A color-coded map of how crowded the cafeterias and nearby places to eat are at each time of day',
  'あきコマ':
    'Free Periods',
  '友達と時間割を重ねて、共通の空きコマを見つけるカレンダー':
    'A calendar that overlays your class schedule with your friends’ to find the free periods you share',
  '進学選択シミュレーター':
    'Major selection simulator',
  '成績を入れると、基本平均点と志望先の目安が出る計算ツール':
    'Enter your grades to see your average and where you stand for the majors you want',
  'みんなで世界史クイズ':
    'World history quiz battle',
  'クラスのみんなで同時に遊べる、年号当ての対戦クイズ':
    'A head-to-head quiz on historical dates that a whole class can play at once',
  '先行研究3行まとめ':
    'Prior research in three lines',
  'テーマを入れると、関連する論文を表にして3行ずつ要約':
    'Enter a topic to get related papers in a table, each summarized in three lines',
  'レポート締切ボード':
    'Assignment deadline board',
  '授業ごとの締切を、残り日数の少ない順に並べるボード':
    'A board listing deadlines for each class, soonest first',
  '寮の当番ルーレット':
    'Dorm chore roulette',
  '掃除とゴミ出しの当番を公平に回して、前日に知らせる係':
    'Rotates cleaning and trash duty fairly and reminds people the day before',
  '一人暮らし家計メモ':
    'Solo living budget log',
  'レシートの金額を入れるだけで、月の食費がグラフになるメモ':
    'Just enter receipt totals and see your monthly food spending as a chart',

  // ── 「活動記録」のページ ──
  'これまでの記録':
    'Earlier recaps',
  'ワークショップ <em>{n}回</em>':
    'Workshops held: <em>{n}</em>',
  '記録 <em>{n}件</em>':
    'Recaps: <em>{n}</em>',
  '作品 <em>{n}件</em>':
    'Projects: <em>{n}</em>',

  // ── 「Studio Hours」のページ（content.js の 10） ──
  'つくりかけを持って、':
    'Bring your half-finished project,',
  '集まろう。':
    'and come join us.',
  'どんな時間？':
    'What’s it like?',
  'いつ・どこで':
    'When & where',
  '1回の流れ':
    'How a session goes',
  '持ってくるもの':
    'What to bring',
  'Studio&nbsp;Hoursで<wbr>できた作品':
    'Built at Studio&nbsp;Hours',
  'Studio Hoursでできた作品は、ここに並びます。':
    'Projects built at Studio Hours will appear here.',
  'いま取り組んでいることを話す':
    'Share what you’re working on',
  'はじめに、それぞれが取り組んでいることをひとことずつ共有します。':
    'We start by going around: everyone says in a sentence what they’re working on.',
  'それぞれ作業する':
    'Work on your own thing',
  'ほとんどの時間は、自分の作業にあてます。行き詰まったら、まわりの人やCampus Leadに聞けます。':
    'Most of the time is for your own work. If you get stuck, ask the people around you or a Campus Lead.',
  '進んだところを見せ合う':
    'Show each other your progress',
  'さいごに、進んだところや、うまくいったやり方を共有します。':
    'We wrap up by sharing progress and what worked.',
  '取り組みたいもの':
    'Something to work on',
  '授業の課題、自分のプロジェクト、ワークショップでつくったものの続きなど。プログラミングでなくても大丈夫です。':
    'A class assignment, your own project, something you started at a workshop. It doesn’t have to be coding.',
  '聞きたいこと':
    'Questions',
  'アイデアや質問だけでも大丈夫です。':
    'Coming with just an idea or a question is fine.',
  '何をつくるか決まっていなくても大丈夫ですか。':
    'Is it OK if I haven’t decided what to build?',
  'はい。まわりの人がつくっているものを見ながら、考えるところから始められます。':
    'Yes. You can start by looking at what others are building and thinking it over.',
  'どんなツールを使いますか。':
    'What tools do you use?',
  'CodexやChatGPT Workを使います。使い方がわからないときは、その場で聞いてください。':
    'Codex and ChatGPT Work. If you’re not sure how to use them, just ask.',

  // ── 「運営メンバー」のページ（content.js の 7 と 11） ──
  '東京大学の<br>Campus Lead':
    'Campus Leads at UTokyo',
  '東京大学での活動は、{n}人のCampus Leadが企画・運営しています。':
    'Everything here at UTokyo is planned and run by {n} Campus Leads. ',
  'Campus Leadは、OpenAI Student Collectiveに選ばれた学生です。OpenAIの社員や代弁者ではありません。':
    'Campus Leads are students selected for the OpenAI Student Collective. They are not OpenAI employees or spokespeople.',
  'お気に入りの使い方':
    'Favorite way to use AI',
  'つくったもの':
    'Projects',
  'Campus Leadとは':
    'About Campus Leads',
  'Campus Leadは2人1組で活動し、学生が最新のAIツールを学び、新しいプロジェクトを始め、つくったものを共有できる場をつくります。':
    'Campus Leads work in pairs to create a place where students learn the latest AI tools, start projects, and share what they create along the way.',
  'OpenAIは、Campus Leadにツールやトレーニング、資金を提供しています。':
    'OpenAI gives Campus Leads tools, training, and funding.',
  'OpenAI Student Collectiveについて':
    'About the OpenAI Student Collective',
  'OpenAIの公式ページ':
    'Official OpenAI page',
  '質問・相談':
    'Questions',
  '質問や相談は、上のメールアドレスへどうぞ。イベントの会場で、直接声をかけてもらっても大丈夫です。':
    'For questions, email us at the address above. You’re also welcome to come talk to us at an event.',
  '工学部・2年':
    'Faculty of Engineering, 2nd year',
  '筋トレと料理が好きです。駒場の近くに住んでいるので、筋トレが好きな人は、ぜひ一緒にトレーニングしましょう。':
    'I like working out and cooking. I live near Komaba, so if you’re into the gym, let’s train together.',
  'まえたけにし ときはる':
    'Maetakenishi Tokiharu',
  '理科一類・1年':
    'Natural Sciences I, 1st year',
  'ピアノと運動が好きです。下北沢に住んでいます。':
    'I like piano and sports. I live in Shimokitazawa.',
  'ほしいと思ったプロダクトをすぐにつくらせて、そのつど改良していくこと。英会話の先生になってもらうこと。':
    'Having it build a product I want right away, then improving it as I go. And having it be my English conversation teacher.',
  'ほしいものを言葉で伝えて、その場で動くものにすること。':
    'Saying what I want in plain words and turning it into something that works, right then and there.',

  // ── 「はじめての方へ」のページ（content.js の 8） ──
  'ほしいものは、':
    'If you want it,',
  '自分でつくれる。':
    'you can build it.',
  'OpenAI Student Collective at UTokyoは、AIを使って「自分がほしいもの」をつくってみる、東大生のコミュニティです。プログラミングは、できなくても大丈夫です。':
    'OpenAI Student Collective at UTokyo is a community of UTokyo students who use AI to try building the things they want. You don’t need to know how to code.',
  'どんなことをするの？':
    'What do we do?',
  'OpenAI Student Collectiveとは':
    'What is the OpenAI Student Collective?',
  'OpenAI Student Collectiveは、OpenAIの公式プログラムです。学生がAIの恩恵を受けられるように、大学ごとに選ばれた学生（Campus Lead）が、キャンパスで活動しています。':
    'The OpenAI Student Collective is an official OpenAI program. Students selected at each university (Campus Leads) run activities on campus so that students can benefit from AI.',
  '学生はこれまで、AIが学びや創造性、問題解決を助ける新しい使い方を、いち早く見つけてきました。その熱意をキャンパスでさらに広げていくために、OpenAIがCampus Leadにツールやトレーニング、資金を提供しています。':
    'Students have been among the first to find new ways AI can support learning, creativity, and problem-solving. To help that energy grow on campus, OpenAI gives Campus Leads tools, training, and funding.',
  '世界各地':
    'Global',
  'の大学で展開するプログラム':
    'program at universities around the world',
  '2人1組':
    'Pairs',
  'のCampus Leadが運営':
    'of Campus Leads run the program',
  '2027年6月':
    'June 2027',
  'まで続くプログラム':
    'is when the program wraps up',
  '目標は、AIに関心を持つ誰もが、仲間とともに学び、試し、ものづくりに取り組める場をつくることです。':
    'The goal is to create a space where anyone curious about AI can learn, experiment, and build alongside their peers.',
  'OpenAIの公式ページより':
    'From the official OpenAI page',
  '公式ページを見る':
    'See the official page',
  'なぜ「つくる」のか':
    'Why build?',
  'アプリやサービスはたくさんあるのに、「自分にぴったり」のものは、なかなか見つかりません。':
    'There are countless apps and services out there, yet it’s hard to find one that’s just right for you.',
  'いまは、ほしいものを言葉で伝えれば、その場で形にできます。自分のために。友達のために。このコミュニティは、それを実際にやってみる場所です。':
    'These days, if you can put what you want into words, you can make it real on the spot. For yourself. For your friends. This community is where you actually give it a try.',
  'これまでにできた作品から':
    'From the projects so far',
  '運営メンバーが自分でつくって、使っているもの':
    'Things the team built and actually use',
  '今学期に<wbr>やること':
    'This term',
  '新しいAIスキルを学び、何をつくれるかを探る、誰でも参加しやすいイベントです。はじめての人は、まずここから。':
    'Welcoming events where students learn new AI skills and explore what they can make. If you’re new, start here.',
  '自分のプロジェクトに集中して取り組み、仲間と話し、必要なときに手伝ってもらえる、毎週の共同作業の時間です。':
    'Weekly coworking sessions where students spend focused time on their projects, connect with peers, and get help when they need it.',
  '学生がAIを使ってつくったものを、キャンパス全体で称える日です。':
    'A campus-wide celebration of what students are creating with AI.',
  '運営メンバーのページへ':
    'Meet the team',
  '参加するには':
    'How to join',
  '次回の日程をチェックする':
    'Check the next date',
  '日程は、決まり次第このサイトに載せます。':
    'Dates will be posted on this site once they’re set.',
  '申し込みは準備中です。日程が決まり次第、申し込めるようになります。':
    'Sign-up isn’t open yet. It will open once the date is set.',
  '次回のページから申し込めます。':
    'You can sign up on the “Next” page.',
  '{x}を持って、会場へ':
    'Come along. Bring: {x}',
  'プログラミングができなくても大丈夫ですか。':
    'Is it OK if I can’t code?',
  'はい、大丈夫です。つくりたいものを言葉で伝えるところから始めます。技術系の学生や、すでにAIを使いこなしている人だけの場ではありません。':
    'Yes, that’s fine. You start by describing what you want to build in plain words. Events aren’t only for technical students or those already experimenting with AI.',
  'AIをほとんど使ったことがなくても参加できますか。':
    'Can I join if I’ve barely used AI?',
  'はい。これから始める人も、気軽に参加できる場にしています。':
    'Yes. We keep it welcoming for people who are just getting started.',
  'どの学部・学年でも参加できますか。':
    'Is it open to all majors and years?',
  'はい。専攻や学年、経験は問いません。':
    'Yes. Any major, any year, any level of experience.',
  '大学院生も参加できますか。':
    'Can graduate students join?',
  'はい、参加できます。':
    'Yes, grad students are welcome.',
  '参加費はかかりますか。':
    'Is there a fee?',
  '無料です。':
    'No, it’s free.',
  'ChatGPTの有料プランに入っていなくても参加できますか。':
    'Can I join without a paid ChatGPT plan?',
  'はい、入っていなくても大丈夫です。':
    'Yes, you don’t need one.',
  '何を持っていけばいいですか。':
    'What should I bring?',
  'ノートPCを持ってきてください。充電器もあると安心です。':
    'Please bring a laptop. A charger is handy too.',
  '時間はどのくらいですか。':
    'How long does it last?',
  'ワークショップは、1〜2時間ほどです。':
    'Workshops last about one to two hours.',
  '1回だけの参加でも大丈夫ですか。':
    'Is it OK to come just once?',
  'はい。どの回もその回だけで完結するので、1回だけでも大丈夫です。続きをつくりたくなったら、Studio Hoursへどうぞ。':
    'Yes. Each session stands on its own, so coming once is fine. If you want to keep building, come to Studio Hours.',
  'どんなものがつくれますか。':
    'What kind of things can I build?',
  'ウェブサイトやちょっとしたツール、ゲームなど、自分がほしいものをつくります。作品のページで、運営メンバーの作品と、つくれるものの例を見られます。':
    'Websites, small tools, games—whatever you want for yourself. On the Projects page you can see projects by the team and examples of what you could build.',
  '写真や、できた作品は公開されますか。':
    'Will photos and finished projects be made public?',
  'イベントの写真や、できた作品は、このサイトなどで公開することがあります。':
    'Photos from events and finished projects may be published on this site and elsewhere.',
  '次回のお知らせはどこで見られますか。':
    'Where can I find news about the next event?',
  '次回の日程やお知らせは、このサイトに載せます。':
    'Dates and news for the next event are posted on this site.',
  'OpenAIとはどんな関係ですか。':
    'How is this related to OpenAI?',
  'まずは、ひとつ作って帰ろう。':
    'Come build one thing and take it home.',

  // ── サンプル表示（?demo）のときだけ出る言葉 ──
  'サンプル表示中':
    'Showing sample data',
  '作品名・参加者名・日付は架空のものです（運営メンバーは実名です）。':
    'Project titles, participant names, and dates are fictional (team members are real).',
  '架空のデータです':
    'Fictional data',
  '実際のページを見る':
    'See the real page',
  'サンプル表示中です。作品名と参加者名は架空のもので（運営メンバーは実名です）、写真のかわりに絵を置いています。':
    'Showing sample data. Project titles and participant names are fictional (team members are real), and illustrations stand in for photos.',
  'サンプルのため、Lumaのページには移動しません。':
    'This is a sample, so it doesn’t go to Luma.',
  'サンプルのため、カレンダーには追加されません。':
    'This is a sample, so nothing is added to your calendar.',
  'サンプルのため、作品のリンクはありません。':
    'This is a sample, so there’s no link to the project.',

  // ── 作品の絵の中に出る単位 ──
  '点':
    'pts',
  '円':
    'yen',

  // ── 名前の読みと、公式ページのアドレス ──
  'ディ ジュンボ':
    'Di Junbo',
  'https://openai.com/ja-JP/student-collective/':
    'https://openai.com/student-collective/',

  // ── 言葉と言葉のあいだの区切り ──
  ' ・ ':
    ' · ',
  ' ／ ':
    ' / ',
  '｜':
    ' | ',
  '　':
    ' '
};
