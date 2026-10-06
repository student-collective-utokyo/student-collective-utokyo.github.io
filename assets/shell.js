/* 全ページ共通の枠：サンプル表示中の帯、上に固定されるメニュー、フッター、スマホの下の申し込みの帯、作品の小さなカード、まだ内容がない場所の枠、学期の予定。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, esc = Site.esc, t = Site.t, T = Site.T;

  /* サイトのページ一覧。メニューはこの順に並びます。
     ready が false のページは、まだ作っていません。そのあいだは alt に書いた場所（[ページ, その中の場所]）へ移ります。
     alt もなければ、押すと「準備中です」と出ます。
     wide が true のページは、パソコンの幅のときだけメニューに出ます（スマホのメニューは5つまで）。 */
  var PAGES = [
    { key: 'next', label: '次回', file: 'next.html', ready: true },
    { key: 'works', label: '作品', file: 'works.html', ready: true },
    { key: 'records', label: '活動記録', file: 'records.html', ready: true },
    { key: 'studio', label: 'Studio Hours', file: 'studio.html', ready: true, alt: ['about', 'do'] },
    { key: 'members', label: '運営メンバー', file: 'members.html', ready: true, alt: ['about', 'who'], wide: true },
    { key: 'about', label: 'はじめての方へ', file: 'about.html', ready: true }
  ];
  // Campus Leadのバッジ（OpenAIから支給された画像）。色や形を変えたり、回したり、切り抜いたりしないでください
  var BADGE = 'img/campus-lead-badge.webp';
  /* OpenAIのマーク（Blossom）。OpenAIから支給されたファイルを、そのまま使っています。
     きまり：黒か白だけ。色や形を変えない。回さない。影などの効果をつけない。まわりに余白をあける。
     かならず「OpenAI Student Collective」の名前のとなりに置く。マークだけを単独で使わない。 */
  var MARK = '<span class="osc-mark"><img class="osc-mark-b" src="img/blossom-black.svg" width="716" height="716" alt=""><img class="osc-mark-w" src="img/blossom-white.svg" width="716" height="716" alt=""></span>';
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11l6-6M5.5 5H11v5.5"/></svg>';

  /* ことばの切りかえ。地球のマークと、いまのことばの短い名前を出す。押すと、3つのことばが下に出る。
     場所をとらないように小さくしてある（横に3つ並べると、パソコンの幅でサイト名が押されて折り返すため）。 */
  var LANG_NAMES = { ja: '日本語', zh: '中文', en: 'English' }, LANG_SHORT = { ja: 'JA', zh: '中文', en: 'EN' };
  var GLOBE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.4"/><path d="M2.6 10h14.8M10 2.6c2.5 2.6 2.5 12.2 0 14.8M10 2.6c-2.5 2.6-2.5 12.2 0 14.8"/></svg>';
  function langSwitch() {
    return '<details class="osc-lang"><summary aria-label="Language / 言語 / 语言">' + GLOBE + '<span>' + LANG_SHORT[Site.lang] + '</span></summary><div class="osc-lang-menu">' + Site.langs.map(function (l) {
      return '<a href="' + esc(Site.langHref(l)) + '" lang="' + (l === 'zh' ? 'zh-Hans' : l) + '"' + (l === Site.lang ? ' class="on" aria-current="true"' : '') + '>' + LANG_NAMES[l] + '</a>';
    }).join('') + '</div></details>';
  }
  // 日本語以外のページに出す注意書き（イベントは日本語で行うこと）。訳のファイルに書いてあるときだけ出る
  function langNote() {
    if (Site.lang === 'ja') return '';
    var n = t('@イベントで使うことば');
    return n && n.charAt(0) !== '@' ? '<p class="osc-langnote">' + esc(n) + '</p>' : '';
  }
  function page(key) { return PAGES.filter(function (p) { return p.key === key; })[0]; }
  function soon(key) { return t('「{x}」のページは準備中です。', { x: t(page(key).label) }); }
  // ホームに選ばれているページは index.html として開く
  function fileOf(key, hash) { return Site.href(Site.M.home === key ? 'index.html' : page(key).file, hash); }
  // そのページがもう作ってあるか
  function has(key) { return page(key).ready; }

  /* ほかのページへ移るリンクやボタンを作る。
     まだ作っていないページのときは、かわりの場所（alt）へのリンクにする。
     かわりの場所もなければ、押すと「準備中です」と出るボタンにする。 */
  function go(key, cls, inner, extra) {
    var c = cls ? ' class="' + cls + '"' : '', x = extra ? ' ' + extra : '', p = page(key);
    var to = p.ready ? fileOf(key) : p.alt ? fileOf(p.alt[0], p.alt[1]) : '';
    return to
      ? '<a' + c + x + ' href="' + esc(to) + '">' + inner + '</a>'
      : '<button type="button"' + c + x + ' data-toast="' + esc(soon(key)) + '">' + inner + '</button>';
  }
  // Campus Leadのバッジの画像
  function badge(cls) {
    return '<img class="' + cls + '" src="' + BADGE + '" width="480" height="480" alt="' + T('OpenAI Student Collective Campus Lead 2026のバッジ') + '">';
  }

  function mount(view) {
    var M = Site.M, app = document.getElementById('app');
    // サンプル表示中の帯（?demo のときだけ）
    if (M.demo) {
      var smp = document.createElement('div');
      smp.className = 'osc-smp';
      smp.innerHTML = T('サンプル表示中') + '<span>' + T('作品名・参加者名・日付は架空のものです（運営メンバーは実名です）。') + '</span><i>' + T('架空のデータです') + '</i><a href="' + esc((location.pathname.split('/').pop() || 'index.html') + (Site.lang !== 'ja' ? '?lang=' + Site.lang : '')) + '">' + T('実際のページを見る') + '</a>';
      document.body.insertBefore(smp, app);
    }
    // 上に固定されるメニュー
    var hd = document.createElement('header');
    hd.className = 'osc-head';
    hd.innerHTML = '<a class="osc-brand" href="' + esc(Site.href('index.html')) + '">' + MARK + '<span class="osc-name"><b>OpenAI Student Collective</b><span>at UTokyo</span></span><span class="osc-chips"><em>' + T('東京大学 学生運営') + '</em></span></a>' + langSwitch() +
      '<nav class="osc-nav" aria-label="' + T('メニュー') + '">' + PAGES.map(function (p) {
        var cls = [p.key === view ? 'on' : '', p.wide ? 'osc-wide' : '', page(view).wide && p.key === 'about' ? 'osc-on-m' : ''].filter(Boolean).join(' ');
        return go(p.key, cls, T(p.label), p.key === view ? 'aria-current="page"' : '');
      }).join('') + '</nav>';
    document.body.insertBefore(hd, app);
    // フッター
    var ft = document.getElementById('ft');
    ft.className = 'osc-ft';
    ft.innerHTML = badge('osc-ft-badge') + '<p>' + T('OpenAI Student Collectiveは、OpenAIの公式プログラムです。東京大学での活動は、Campus Lead（学生）が運営しています。') +
      (M.demo ? '<br>' + T('サンプル表示中です。作品名と参加者名は架空のもので（運営メンバーは実名です）、写真のかわりに絵を置いています。') : '') + '</p>';

    // スクロールしたら、メニューを上に残して色を変える
    var nav = hd.querySelector('.osc-nav'), brand = hd.querySelector('.osc-brand');
    function onScroll() {
      var smpEl = document.querySelector('.osc-smp'), top = smpEl ? smpEl.offsetHeight : 0;
      var twoRows = getComputedStyle(hd).display === 'contents', el = twoRows ? nav : hd;
      document.documentElement.style.setProperty('--osc-top', top + 'px');
      document.documentElement.style.setProperty('--osc-headh', (twoRows ? brand.offsetHeight + nav.offsetHeight : hd.offsetHeight) + 'px');
      document.body.classList.toggle('osc-stuck', window.scrollY > 6 && el.getBoundingClientRect().top <= top + 0.5);
      var cta = document.querySelector('[data-hero-cta]');
      if (cta) document.body.classList.toggle('osc-cta-on', cta.getBoundingClientRect().bottom < top + 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    // 文字のフォントを読みこむと高さが変わることがあるので、読みこみが終わったらもう一度はかる
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);
    U.phrase(document.body);
    // ことばの切りかえ：外側を押したときと、Escキーで閉じる
    var lg = hd.querySelector('.osc-lang');
    // （iPhoneでは、押せないところを押しても click が来ないことがあるので、pointerdown でも受ける）
    ['click', 'pointerdown'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (lg.open && !lg.contains(e.target)) lg.open = false; }); });
    // ブラウザの「戻る」でこのページに戻ってきたとき、開いたままにしない
    window.addEventListener('pageshow', function () { lg.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lg.open) { lg.open = false; lg.querySelector('summary').focus(); } });
  }

  /* スマホの下に出る申し込みの帯。日程が決まっていて、申し込みができるときだけ作る。
     ページの上のほうにある申し込みボタン（data-hero-cta がついたもの）が画面の外に出ると、下から出てくる。 */
  function cta(ev) {
    var M = Site.M;
    if (!ev || !ev.date || !(M.demo || ev.applyUrl) || !document.querySelector('[data-hero-cta]')) return;
    var bar = document.createElement('div');
    bar.className = 'osc-cta';
    bar.innerHTML = '<span><b>' + ev.date.long + (ev.start ? ' ' + ev.start.text : '') + '</b><small>' + esc(ev.name) + '</small></span>' +
      (M.demo ? '<button type="button" class="osc-btn osc-btn-1" data-toast="' + T('サンプルのため、Lumaのページには移動しません。') + '">' + T('申し込む') + ARROW + '</button>'
        : '<a class="osc-btn osc-btn-1" href="' + esc(ev.applyUrl) + '" target="_blank" rel="noopener">' + T('申し込む') + ARROW + '</a>');
    document.body.appendChild(bar);
    window.dispatchEvent(new Event('scroll'));
  }

  // 作品の小さなカード
  function card(w) {
    return '<div class="osc-wkc" role="button" tabindex="0" data-work="' + esc(w.id) + '" aria-label="' + esc(w.title) + '">' + U.thumb(w) + '<b>' + esc(w.title) + '</b><span>' + esc(w.maker) + '</span></div>';
  }
  // 準備中の作品の枠
  function pendingCard(p) {
    return '<div class="osc-ghc"><div class="osc-gh sq"><p>' + T('準備中') + '</p></div><b>' + T('{x}の作品', { x: p.maker }) + '</b><span>' + esc(p.makerNote) + '</span></div>';
  }

  // 今学期の予定を横に3つ並べたもの（ワークショップ・Studio Hours・ショーケース）。中身は content.js から自動で入る
  function plan(M) {
    var ws = M.events.filter(function (e) { return e.kind === 'workshop'; });
    var done = ws.filter(function (e) { return e.state === 'done'; }).length;
    var nextWs = ws.filter(function (e) { return e.state !== 'done'; })[0];
    var show = M.events.filter(function (e) { return e.kind === 'showcase'; })[0];
    var st = M.studio;
    var wsNote = !ws.length ? t('日程調整中です') : nextWs
      ? (done ? t('{n}回終了', { n: done }) + t(' ・ ') : '') + (nextWs.date ? t('次回は{d}です', { d: nextWs.date.long }) : t('{x}は日程調整中です', { x: nextWs.short || t('次回') }))
      : t('今学期の回は終了しました');
    var cells = [
      [t('ワークショップ'), t('全{n}回', { n: M.term.workshops || ws.length }), wsNote],
      ['Studio Hours', st.when || t('毎週'), [st.time, st.place].filter(Boolean).join(t(' ・ ')) || st.note]
    ];
    if (show) cells.push([t('ショーケース'), show.date ? show.date.long : (show.when || t('調整中')), show.sub]);
    return '<dl class="osc-plan">' + cells.map(function (c) {
      return '<div><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + (c[2] ? '<small>' + esc(c[2]) + '</small>' : '') + '</dd></div>';
    }).join('') + '</dl>';
  }

  Site.shell = { mount: mount, go: go, has: has, badge: badge, soon: soon, langNote: langNote, cta: cta, card: card, pendingCard: pendingCard, plan: plan, ARROW: ARROW };
})();
