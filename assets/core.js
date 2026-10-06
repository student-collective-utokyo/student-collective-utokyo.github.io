/* サイトの土台。content.js を読んで、各ページが使いやすい形に整えます。
   ここは内容を書く場所ではありません。内容は content.js に書きます。 */
(function () {
  'use strict';

  var demo = /[?&]demo(=|&|$)/.test(location.search);    // ?demo ＝ サンプルデータで表示
  var check = /[?&]check(=|&|$)/.test(location.search);  // ?check ＝ 書き方のチェックを表示
  /* ── ことば（日本語・中国語・英語） ──
     もとの文は日本語です。中国語と英語は、i18n/zh.js と i18n/en.js に「日本語の文 → 訳した文」の形で書いてあります。
     訳がまだない文は、日本語のまま出ます。
     どのことばで出すかは、アドレスの ?lang=zh / ?lang=en / ?lang=ja で決まります。一度選ぶと、そのブラウザでは次からも同じことばで出ます。 */
  var LANGS = ['ja', 'zh', 'en'];
  var lang = (function () {
    var m = /[?&]lang=([a-z]+)/i.exec(location.search), v = m ? m[1].toLowerCase() : '', saved = '';
    try { saved = localStorage.getItem('osc-lang') || ''; } catch (e) {}
    if (LANGS.indexOf(v) < 0) v = LANGS.indexOf(saved) >= 0 ? saved : 'ja';
    try { if (m) localStorage.setItem('osc-lang', v); } catch (e) {}
    return v;
  })();
  var dict = {}, missing = [];
  // 文を、いまのことばに直す。{n} のような場所には、vars の値を入れる
  function t(s, vars) {
    var out = s;
    if (lang !== 'ja' && s) {
      if (Object.prototype.hasOwnProperty.call(dict, s)) out = dict[s];
      else if (/[ぁ-んァ-ヶ一-龠]/.test(s) && missing.indexOf(s) < 0) missing.push(s);
    }
    if (vars) out = out.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return out;
  }
  // 曜日。訳のファイルを読めなかったときは途中で日本語に戻すので、使うたびにいまのことばで選ぶ
  var DOWS = { ja: ['日', '月', '火', '水', '木', '金', '土'], zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  function dowOf(i) { return DOWS[lang][i]; }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // 日付の長い書き方。日本語：10月22日(木)　中国語：10月22日（周四）　英語：Thu, Oct 22
  function longDate(mo, d, dow) {
    return lang === 'en' ? dow + ', ' + MONTHS[mo - 1] + ' ' + d : lang === 'zh' ? mo + '月' + d + '日（' + dow + '）' : mo + '月' + d + '日(' + dow + ')';
  }
  var KIND = { workshop: 'ワークショップ', showcase: 'ショーケース' };   // 画面に出すときに t() を通す
  var LOOKS = ['site', 'map', 'dash', 'game', 'cal', 'asst', 'res'];
  var LOOK_BY_CATEGORY = { 'ウェブサイト': 'site', 'ダッシュボード': 'dash', 'リサーチ': 'res', 'アシスタント': 'asst', 'ゲーム': 'game', 'カレンダー': 'cal', '地図': 'map' };
  var issues = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function str(v) { return v == null ? '' : String(v).trim(); }
  // 画面に出す文章の項目は、これで読む（いまのことばに直す）。名前・日付・アドレスなどは str のまま読む
  function tx(v) { return t(str(v)); }
  function list(v) { return Array.isArray(v) ? v.filter(function (x) { return x != null; }) : []; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }

  // '2026-10-22' を日付の部品に分ける。空なら null。書き方がちがうときも null にして、チェックに出す
  function parseDate(v, where) {
    var s = str(v);
    if (!s) return null;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
    var day = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
    if (!day || day.getUTCMonth() !== +m[2] - 1 || day.getUTCDate() !== +m[3]) {
      issues.push(where + '：日付「' + s + '」を読めませんでした。\'2026-10-22\' の形で書いてください。いまは「日程調整中」として表示しています。');
      return null;
    }
    return {
      y: +m[1], m: +m[2], d: +m[3], dow: dowOf(day.getUTCDay()),
      key: m[1] + pad(+m[2]) + pad(+m[3]),
      md: +m[2] + '.' + pad(+m[3]),
      long: longDate(+m[2], +m[3], dowOf(day.getUTCDay()))
    };
  }
  // '18:45' を時刻の部品に分ける
  function parseTime(v, where) {
    var s = str(v);
    if (!s) return null;
    var m = /^(\d{1,2})[:：](\d{2})$/.exec(s);
    if (!m || +m[1] > 23 || +m[2] > 59) {
      issues.push(where + '：時刻「' + s + '」を読めませんでした。\'18:45\' の形で書いてください。いまは時刻なしで表示しています。');
      return null;
    }
    return { h: +m[1], min: +m[2], text: +m[1] + ':' + m[2] };
  }
  // 外へのリンクは http か https ではじまるものだけを通す
  function link(v, where) {
    var s = str(v);
    if (!s) return '';
    if (/^https?:\/\//i.test(s)) return s;
    issues.push(where + '：アドレス「' + s + '」は https:// ではじまる形で書いてください。いまはリンクなしで表示しています。');
    return '';
  }
  // 仮の絵の色。0以上の整数だけを通す。それ以外はチェックに出して、名前から自動で選ぶ
  function colorOf(v, title, where) {
    if (v == null) return hash(title);
    if (typeof v === 'number' && v >= 0 && v % 1 === 0) return v;
    issues.push(where + '：color「' + v + '」は使えません。\' をつけずに、0〜7の数字だけを書いてください。いまは自動で選んだ色で表示しています。');
    return hash(title);
  }
  // 項目の名前の書きまちがいを見つけて、チェックに出す
  function known(o, names, where) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return;
    Object.keys(o).forEach(function (k) {
      if (names.indexOf(k) < 0) issues.push(where + '：「' + k + '」という項目はありません。つづりを確かめてください。この項目は表示に使われていません。');
    });
  }
  // [ ] で囲んで並べる項目が、ほかの形で書かれていたらチェックに出す
  function listed(v, where) {
    if (v != null && !Array.isArray(v)) issues.push(where + '：[ ] で囲んで書いてください。いまは表示されていません。');
  }
  // 書かないと表示が欠ける項目が、空のままになっていたらチェックに出す
  function need(v, where, key) {
    if (!str(v)) issues.push(where + '：' + key + ' が空です。');
  }
  var KEYS = {
    top: ['home', 'term', 'events', 'studio', 'works', 'examples', 'records', 'members', 'about', 'worksPage', 'studioPage', 'membersPage', 'today'],
    term: ['label', 'workshops', 'note'],
    event: ['id', 'kind', 'name', 'short', 'date', 'when', 'start', 'end', 'title', 'bigTitle', 'sub', 'place', 'placeNote', 'tool', 'toolNote', 'bring', 'bringNote', 'fee', 'feeNote', 'applyUrl', 'people'],
    studio: ['when', 'time', 'place', 'note'],
    work: ['id', 'title', 'about', 'maker', 'makerNote', 'from', 'date', 'tool', 'category', 'image', 'url', 'look', 'color', 'num', 'pick', 'comingSoon'],
    example: ['title', 'about', 'tool', 'category', 'image', 'look', 'color', 'num'],
    record: ['date', 'label', 'title', 'image', 'focus'],
    member: ['name', 'kana', 'role', 'note', 'intro', 'like', 'image', 'email'],
    about: ['catch', 'lead', 'what', 'stats', 'quote', 'quoteFrom', 'officialUrl', 'why', 'workshop', 'studio', 'showcase', 'faq', 'closing'],
    worksPage: ['openTitle', 'openLead', 'title', 'lead'],
    studioPage: ['catch', 'steps', 'bring', 'faq'],
    membersPage: ['lead', 'about', 'contact']
  };

  // 今日の日付（日本時間）
  function todayKey() {
    var t = new Date(Date.now() + 9 * 3600000);
    return t.getUTCFullYear() + pad(t.getUTCMonth() + 1) + pad(t.getUTCDate());
  }

  /* content.js の内容を、ページが使う形に整える。
     sample があるとき（?demo）は、イベント・作品・活動記録などをサンプルに差しかえる。
     ホームの設定、運営メンバー、各ページの文章（about など）は、いつも本物を使う。作品の例は本物から読み、サンプル表示のときは出さない。 */
  function build(real, sample) {
    var src = sample || real;
    var sampleToday = sample ? parseDate(sample.today, 'today') : null;
    var today = sampleToday ? sampleToday.key : todayKey();
    var term = src.term || {};
    var st = src.studio || {};
    known(src, KEYS.top, sample ? 'sample-content.js' : 'content.js');
    known(term, KEYS.term, 'term'); known(st, KEYS.studio, 'studio');
    ['events', 'works', 'records'].forEach(function (k) { listed(src[k], k); });
    ['examples', 'members'].forEach(function (k) { listed(real[k], k); });

    var ids = {};
    var events = list(src.events).map(function (e, i) {
      var where = 'events の' + (i + 1) + '番目（' + (str(e.name) || '名前なし') + '）';
      known(e, KEYS.event, where); need(e.name, where, 'name'); listed(e.bigTitle, where + ' の bigTitle');
      var date = parseDate(e.date, where);
      var start = parseTime(e.start, where), end = parseTime(e.end, where);
      if (end && !start) { issues.push(where + '：終わる時刻（end）だけが書いてあります。始まる時刻（start）も書いてください。いまは時刻なしで表示しています。'); end = null; }
      if (start && end && end.h * 60 + end.min <= start.h * 60 + start.min) { issues.push(where + '：終わる時刻（' + end.text + '）が、始まる時刻（' + start.text + '）と同じか、それより前になっています。いまは「' + start.text + 'から」と表示しています。'); end = null; }
      var id = str(e.id);
      if (id) { if (ids[id]) issues.push(where + '：id「' + id + '」がほかの回と重なっています。'); ids[id] = true; }
      if (e.kind && !KIND[e.kind]) issues.push(where + '：kind「' + str(e.kind) + '」は使えません。\'workshop\' か \'showcase\' を書いてください。');
      var kind = KIND[e.kind] ? e.kind : 'workshop';
      return {
        id: id, kind: kind, kindLabel: t(KIND[kind]), name: tx(e.name), short: tx(e.short),
        no: (/^第(\d+)回$/.exec(str(e.short)) || [])[1] || '',   // 「第1回」の 1。大きく出すときに使う
        date: date, when: tx(e.when), start: start, end: end,
        timeText: start ? (end ? start.text + '–' + end.text : t('{t}から', { t: start.text })) : '',
        title: tx(e.title), bigTitle: list(e.bigTitle).map(tx).filter(Boolean), sub: tx(e.sub),
        place: tx(e.place), placeNote: tx(e.placeNote), tool: str(e.tool), toolNote: tx(e.toolNote),
        bring: tx(e.bring), bringNote: tx(e.bringNote), fee: tx(e.fee), feeNote: tx(e.feeNote),
        applyUrl: sample ? '' : link(e.applyUrl, where), people: str(e.people).replace(/[人名]$/, ''),   // うしろに「人」をつけて出すので、'34人' と書いてあっても「34人人」にならないようにする
        done: !!date && date.key < today
      };
    });
    // 日付の順に書いてあるか（「次回」は、まだ終わっていない回のうち、いちばん上のものになるため）
    events.reduce(function (prev, e) {
      if (prev && e.date && e.date.key < prev.date.key) issues.push('events：「' + e.name + '」（' + e.date.long + '）が、それより後の「' + prev.name + '」（' + prev.date.long + '）の下に書いてあります。開催する順に、上から書いてください。');
      return e.date ? e : prev;
    }, null);
    var next = events.filter(function (e) { return !e.done; })[0] || null;
    events.forEach(function (e) { e.state = e.done ? 'done' : e === next ? 'next' : 'plan'; });
    var byId = {};
    events.forEach(function (e) { if (e.id) byId[e.id] = e; });

    var works = [], pending = [], workIds = {};
    var memberNames = list(real.members).map(function (m) { return str(m.name); });
    list(src.works).forEach(function (w, i) {
      var where = 'works の' + (i + 1) + '番目（' + (str(w.title) || str(w.maker)) + '）';
      known(w, KEYS.work, where); need(w.maker, where, 'maker');
      if (w.comingSoon) { pending.push({ maker: str(w.maker), makerNote: tx(w.makerNote) }); return; }
      need(w.title, where, 'title');
      if (w.id != null) { if (workIds[w.id]) issues.push(where + '：id「' + w.id + '」がほかの作品と重なっています。'); workIds[w.id] = true; }
      var from = str(w.from) || 'lead', ev = byId[from], date = parseDate(w.date, where);
      var fromLabel = '', fromShort = '';
      if (from === 'lead') { /* 下でまとめて決める */ }
      else if (from === 'studio') { fromLabel = 'Studio Hours' + (date ? t(' ・ ') + date.long : ''); fromShort = 'Studio Hours'; }
      else if (ev) { fromLabel = ev.name + (ev.date ? t(' ・ ') + ev.date.long : ''); fromShort = ev.short || ev.name; }
      else {
        // from の書きまちがい。イベントの作品として数えると、ページ全体が「作品がある」表示に変わってしまうので、運営メンバーの作品として扱う
        issues.push(where + '：from「' + from + '」と同じ id の回が events にありません。いまは運営メンバーの作品として表示しています。');
        from = 'lead';
      }
      if (from === 'lead') {
        fromLabel = t('運営メンバーの作品'); fromShort = t('運営メンバー');
        if (!sample && str(w.maker) && memberNames.indexOf(str(w.maker)) < 0) issues.push(where + '：maker「' + str(w.maker) + '」と同じ名前の人が members にいません（空白のちがいにも注意してください）。「運営メンバー」のページの「つくったもの」に出ません。');
      }
      var title = str(w.title), category = str(w.category);
      works.push({
        id: String(w.id != null ? w.id : 'n' + (i + 1)), seed: typeof w.id === 'number' ? w.id : i + 1,
        title: t(title), about: tx(w.about), maker: str(w.maker), makerNote: tx(w.makerNote),
        from: from, fromLabel: fromLabel, fromShort: fromShort, tool: str(w.tool), category: category,   // category は絞り込みの目印なので日本語のまま持つ。画面に出すときに t() を通す
        image: str(w.image), url: sample ? '' : link(w.url, where), pick: !!w.pick,
        look: LOOKS.indexOf(w.look) >= 0 ? w.look : LOOK_BY_CATEGORY[category] || 'site',
        color: colorOf(w.color, title, where),
        num: Array.isArray(w.num) ? w.num.map(str) : null,
        byEvent: from !== 'lead'
      });
    });
    // 作品の例（本物の内容から読む。サンプル表示のときは出さない）
    var examples = sample ? [] : list(real.examples).map(function (w, i) {
      var title = str(w.title), category = str(w.category), where = 'examples の' + (i + 1) + '番目（' + title + '）';
      known(w, KEYS.example, where); need(title, where, 'title');
      return {
        id: 'ex' + (i + 1), seed: i + 1, title: t(title), about: tx(w.about), tool: str(w.tool), category: category, image: str(w.image),
        look: LOOKS.indexOf(w.look) >= 0 ? w.look : LOOK_BY_CATEGORY[category] || 'site',
        color: colorOf(w.color, title, where), num: Array.isArray(w.num) ? w.num.map(str) : null
      };
    }).filter(function (w) { return w.title; });
    // ピックアップを先に。それ以外は書いた順のまま
    works = works.filter(function (w) { return w.pick; }).concat(works.filter(function (w) { return !w.pick; }));

    var records = list(src.records).map(function (r, i) {
      var where = 'records の' + (i + 1) + '番目（' + str(r.title) + '）', focus = str(r.focus);
      known(r, KEYS.record, where); need(r.title, where, 'title');
      // focus（写真のどこを中心に見せるか）は '50% 30%' の形だけを通す
      if (focus && !/^\d{1,3}% \d{1,3}%$/.test(focus)) { issues.push(where + '：focus「' + focus + '」は \'50% 30%\' の形で書いてください。いまは写真のまんなかを表示しています。'); focus = ''; }
      return { date: parseDate(r.date, where), label: tx(r.label), title: tx(r.title), image: str(r.image), focus: focus || '50% 50%', n: i };
    });
    // 新しい記録を先に
    records.sort(function (a, b) { return (b.date ? b.date.key : '0').localeCompare(a.date ? a.date.key : '0') || a.n - b.n; });

    // 「はじめての方へ」の文章。サンプル表示のときも、文章は本物を使う
    var ab = real.about || {};
    known(ab, KEYS.about, 'about'); known(real.worksPage, KEYS.worksPage, 'worksPage'); known(real.studioPage, KEYS.studioPage, 'studioPage'); known(real.membersPage, KEYS.membersPage, 'membersPage');
    ['catch', 'what', 'stats', 'why', 'faq'].forEach(function (k) { listed(ab[k], 'about の ' + k); });
    ['openTitle', 'title'].forEach(function (k) { listed((real.worksPage || {})[k], 'worksPage の ' + k); });
    ['catch', 'steps', 'bring', 'faq'].forEach(function (k) { listed((real.studioPage || {})[k], 'studioPage の ' + k); });
    listed((real.membersPage || {}).about, 'membersPage の about');
    var about = {
      catchLines: list(ab.catch).map(tx).filter(Boolean), lead: tx(ab.lead),
      what: list(ab.what).map(tx).filter(Boolean), why: list(ab.why).map(tx).filter(Boolean),
      stats: list(ab.stats).map(function (x) { return [tx(list(x)[0]), tx(list(x)[1])]; }).filter(function (x) { return x[0]; }),
      quote: tx(ab.quote), quoteFrom: tx(ab.quoteFrom), officialUrl: link(tx(ab.officialUrl), 'about の officialUrl'),   // 英語のページでは、訳のファイルに書いた英語の公式ページのアドレスに差しかえる
      workshop: tx(ab.workshop), studio: tx(ab.studio), showcase: tx(ab.showcase),
      faq: list(ab.faq).map(function (x) { return { q: tx(x.q), a: tx(x.a) }; }).filter(function (x) { return x.q && x.a; }),
      closing: tx(ab.closing)
    };

    // 「作品」のページのいちばん上の文章。サンプル表示のときも、文章は本物を使う
    var wp = real.worksPage || {};
    var worksPage = {
      openTitle: list(wp.openTitle).map(tx).filter(Boolean), openLead: tx(wp.openLead),
      title: list(wp.title).map(tx).filter(Boolean), lead: tx(wp.lead)
    };

    // 「Studio Hours」と「運営メンバー」のページの文章。サンプル表示のときも、文章は本物を使う
    var sp = real.studioPage || {}, mp = real.membersPage || {};
    function pairs(v) { return list(v).map(function (x) { return [tx(list(x)[0]), tx(list(x)[1])]; }).filter(function (x) { return x[0]; }); }
    var studioPage = {
      catchLines: list(sp.catch).map(tx).filter(Boolean), steps: pairs(sp.steps), bring: pairs(sp.bring),
      faq: list(sp.faq).map(function (x) { return { q: tx(x.q), a: tx(x.a) }; }).filter(function (x) { return x.q && x.a; })
    };
    var membersPage = { lead: tx(mp.lead), about: list(mp.about).map(tx).filter(Boolean), contact: tx(mp.contact) };

    var home = str(real.home) || 'next';
    // 今学期のワークショップの回数。数字で書いていないときは、チェックに出して events から数える
    var wsCount = term.workshops == null || term.workshops === '' ? 0 : +term.workshops;
    if (!(wsCount >= 0 && wsCount % 1 === 0)) { issues.push('term の workshops「' + term.workshops + '」は、数字だけで書いてください（例：4）。いまは events に書いてある回を数えて表示しています。'); wsCount = 0; }
    if (home !== 'next' && home !== 'works') { issues.push('home「' + home + '」は使えません。\'next\' か \'works\' を書いてください。'); home = 'next'; }

    return {
      demo: !!sample, home: home, lang: lang,
      term: { label: tx(term.label), workshops: wsCount, note: tx(term.note) },
      events: events, next: next,
      studio: { when: tx(st.when), time: tx(st.time), place: tx(st.place), note: tx(st.note) },
      works: works, pending: pending, examples: examples,
      eventWorks: works.filter(function (w) { return w.byEvent; }),
      records: records,
      // 運営メンバーは、サンプル表示のときも本物を使う
      members: list(real.members).map(function (m, i) {
        var email = str(m.email), where = 'members の' + (i + 1) + '番目（' + str(m.name) + '）';
        known(m, KEYS.member, where); need(m.name, where, 'name');
        if (email && !/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)) {
          issues.push('members の' + (i + 1) + '番目（' + str(m.name) + '）：メールアドレス「' + email + '」を読めませんでした。いまはメールなしで表示しています。');
          email = '';
        }
        return { name: str(m.name), kana: tx(m.kana), role: str(m.role), note: tx(m.note), intro: tx(m.intro), like: tx(m.like), image: str(m.image), email: email };
      }),
      about: about, worksPage: worksPage, studioPage: studioPage, membersPage: membersPage
    };
  }

  // 表示できないとき、白い画面のままにしないで理由を出す
  function fail(what, err) {
    var errs = (window.__siteErrors || []).map(function (e) { return (e.file ? e.file.split('/').pop() + 'の' + e.line + '行目あたり：' : '') + e.msg; });
    if (err) errs.push(String(err && err.message || err));
    var file = what === 'sample' ? 'sample/sample-content.js' : 'content.js';
    document.body.removeAttribute('data-view');
    document.getElementById('app').innerHTML =
      '<div class="osc-err"><h1>ページを表示できません</h1>' +
      '<p>' + esc(file) + 'の書き方に、まちがいがあるかもしれません。</p>' +
      (errs.length ? '<pre>' + esc(errs.join('\n')) + '</pre>' : '') +
      '<ul><li>項目のおわりの , が抜けていませんか。</li><li>文字をはさむ \' が、片方だけになっていませんか。</li><li>{ } や [ ] の数は合っていますか。</li></ul></div>';
  }

  // ?check のとき、書き方で気になった点をページの上に出す
  function showCheck() {
    var box = document.createElement('div');
    box.className = 'osc-check';
    var file = Site.M && Site.M.demo ? 'サンプル表示（sample/sample-content.js と content.js）' : 'content.js';
    var main = document.createElement('div');
    box.appendChild(main);
    function draw() {
      main.innerHTML = issues.length
        ? '<b>' + file + 'のチェック：気になる点が' + issues.length + '件あります。</b><ul>' + issues.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
        : '<b>' + file + 'のチェック：気になる点は見つかりませんでした。</b>';
    }
    draw();
    // 日本語以外のときは、訳がまだない文も並べる（その文は日本語のまま出ている）
    var errs = (window.__siteErrors || []).map(function (e) { return (e.file ? e.file.split('/').pop() + 'の' + e.line + '行目あたり：' : '') + e.msg; });
    if (errs.length) { var er = document.createElement('div'); er.innerHTML = '<b style="display:block;margin-top:8px">読みこみのときのエラー</b><ul>' + errs.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>'; box.appendChild(er); }
    if (lang !== 'ja' && Site.M && !Site.M.demo) {
      var note = document.createElement('div');
      note.innerHTML = '<b style="display:block;margin-top:8px">i18n/' + lang + '.js：訳がまだない文が' + missing.length + '件あります。</b>' +
        (missing.length ? '<ul>' + missing.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' : '');
      box.appendChild(note);
    }
    document.body.insertBefore(box, document.body.firstChild);
    // 画像のファイルが実際にあるかを確かめる（ファイル名の書きまちがいを見つけるため）
    var M = Site.M, imgs = [];
    if (M) [['works', M.works], ['examples', M.examples], ['records', M.records], ['members', M.members]].forEach(function (g) {
      g[1].forEach(function (x) { if (x.image) imgs.push([g[0] + '（' + (x.title || x.name || '') + '）', x.image]); });
    });
    imgs.forEach(function (x) {
      var im = new Image();
      im.onerror = function () { issues.push(x[0] + '：画像「' + x[1] + '」を読みこめません。ファイルの名前と置き場所を確かめてください。'); draw(); };
      im.src = x[1];
    });
  }

  // スクリプトのファイルを読みこむ
  function script(src, ok, ng) {
    var s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = ng;
    document.head.appendChild(s);
  }

  function load(render) {
    var real = window.SITE_CONTENT;
    if (!real || typeof real !== 'object') return fail('content');
    function go(sample) {
      var M;
      try { M = build(real, sample); } catch (e) { return fail(sample ? 'sample' : 'content', e); }
      Site.M = M;
      try { render(M); } catch (e) { return fail(sample ? 'sample' : 'content', e); }
      if (check) showCheck();
    }
    function start() {
      if (!demo) return go(null);
      // サンプル表示は、検索に出ないようにする
      var robots = document.createElement('meta');
      robots.name = 'robots'; robots.content = 'noindex';
      document.head.appendChild(robots);
      // サンプルデータは ?demo のときだけ読みこむ
      script('sample/sample-content.js', function () { if (window.SITE_SAMPLE) go(window.SITE_SAMPLE); else fail('sample'); }, function () { fail('sample'); });
    }
    if (lang === 'ja') { document.body.setAttribute('data-lang', 'ja'); return start(); }
    /* 日本語以外のときは、訳のファイルを読みこんでから組み立てる。
       読みこめなかったとき、書き方のまちがいで中身が空のときは、ページ全体を日本語に戻して出す（選んだことばの記憶はそのまま）。 */
    function ready() {
      var d = (window.SITE_I18N || {})[lang];
      if (d && Object.keys(d).length) { dict = d; document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang; }
      else { issues.push('i18n/' + lang + '.js を読みこめませんでした（ファイルがないか、書き方にまちがいがあります）。日本語で表示しています。'); lang = Site.lang = 'ja'; }
      document.body.setAttribute('data-lang', lang);
      start();
    }
    script('i18n/' + lang + '.js', ready, ready);
  }

  /* ほかのページへのリンク。?demo のときは ?demo を、日本語以外のときは ?lang=… をつけたまま移動する。
     hash はページの中の場所（'do' など） */
  function query(l) { return [demo ? 'demo' : '', l !== 'ja' ? 'lang=' + l : ''].filter(Boolean).join('&'); }
  function href(file, hash) { var q = query(lang); return file + (q ? '?' + q : '') + (hash ? '#' + hash : ''); }
  // いま開いているページを、別のことばで開きなおすためのアドレス。日本語に戻すときも ?lang=ja をつける（選んだことばをおぼえなおすため）
  function langHref(l) {
    var file = location.pathname.split('/').pop() || 'index.html';
    return file + '?' + [demo ? 'demo' : '', 'lang=' + l].filter(Boolean).join('&') + location.hash;
  }

  // 訳してから、HTMLに入れても安全な形にする（ふつうの文はこれを使う。タグを含む文だけ t を使う）
  function T(s, vars) { return esc(t(s, vars)); }
  var Site = window.Site = { demo: demo, lang: lang, langs: LANGS, t: t, T: T, missing: missing, esc: esc, load: load, href: href, langHref: langHref, views: {}, M: null };
})();
