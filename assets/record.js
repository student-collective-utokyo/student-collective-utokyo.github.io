/* 「活動記録」の1件をくわしく読むページ（record.html?id=w1）。
   中身は content.js の records（id が同じもの）で決まります。topics を書いた記録だけ、このページができます。
   いちばん上：日付・題・ひとこと・当日のこと（日時・場所・人数・使ったもの）・写真の組み合わせ。
   その下：左に目次、右に当日の流れ（topics）。最後に「自分でやってみる」（steps）。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc, t = Site.t, T = Site.T;
  function svg(d, w) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var IC = {
    cal: svg('<rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'),
    pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
    ppl: svg('<circle cx="9" cy="9" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="16.5" cy="8" r="2.6"/><path d="M15.5 13.2c2.6-.3 4.6 1.4 5 4.3"/>'),
    tool: svg('<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7.5 10l3 2.5-3 2.5M12.5 15h4"/>')
  };
  var BACK = svg('<path d="M14.5 6l-6 6 6 6"/>', 2);
  var GO = svg('<path d="M9.5 6l6 6-6 6"/>', 2);
  var OUT = svg('<path d="M9 15l7-7M9.5 8H16v6.5"/>', 2);
  var COPY = svg('<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.7A2.2 2.2 0 0 0 13.3 4.5H6.7A2.2 2.2 0 0 0 4.5 6.7v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8"/>');
  var DOWN = svg('<path d="M6 9.5l6 6 6-6"/>', 2);
  var ZOOM = svg('<circle cx="10.5" cy="10.5" r="5.5"/><path d="M14.6 14.6L19 19M8.5 10.5h4M10.5 8.5v4"/>', 1.8);

  var R;   // いま開いている記録
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ── 本文の部品 ── */
  function fig(b) {
    return '<figure class="rd-fig' + (b.slide ? ' rd-slide' : ' rd-photo') + '"><button type="button" class="rd-zoomable" data-zoom="' + esc(b.img) + '" data-cap="' + esc(b.cap) + '" data-alt="' + esc(b.alt) + '" aria-label="' + zoomLabel(b.alt) + '">' +
      '<img src="' + esc(b.img) + '" alt="' + esc(b.alt) + '" loading="lazy"><span class="rd-zoom-ic">' + ZOOM + '</span></button>' +
      (b.cap ? '<figcaption>' + esc(b.cap) + '</figcaption>' : '') + '</figure>';
  }
  function zoomLabel(what) { return what ? T('画像を大きく見る：{x}', { x: what }) : T('画像を大きく見る'); }
  // コピーできる文章。長いものは途中までにして、「全文を見る」で開く
  function prompt(key) {
    var p = R.prompts[key], long = p.text.length > 260;
    return '<div class="rd-pr' + (long ? ' rd-pr-long' : '') + '"><div class="rd-pr-h"><span>' + esc(p.label) + '</span><button type="button" class="rd-copy" data-copy="' + esc(key) + '">' + COPY + T('コピー') + '</button></div>' +
      '<pre>' + esc(p.text) + '</pre>' + (long ? '<button type="button" class="rd-pr-more" aria-expanded="false"><span>' + T('全文を見る') + '</span>' + DOWN + '</button>' : '') + '</div>';
  }
  // このサイトのページ（'works.html' など）は、いまのことばのまま開く。外のアドレスはそのまま
  function href(u) { return /^https?:/i.test(u) ? u : Site.href(u); }
  function block(b) {
    if (b.p != null) return '<p>' + esc(b.p) + '</p>';
    if (b.img) return fig(b);
    if (b.prompt) return prompt(b.prompt);
    if (b.list) return '<ol class="rd-list">' + b.list.map(function (x, i) { return '<li><b><i>' + (i + 1) + '</i>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ol>';
    if (b.links) return '<div class="rd-links">' + b.links.map(function (l) {
      var ext = /^https?:/i.test(l[1]);
      return '<a class="osc-btn osc-btn-2 rd-btn" href="' + esc(href(l[1])) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l[0]) + (ext ? OUT : GO) + '</a>';
    }).join('') + '</div>';
    // 作品：押すと「作品」のページと同じ、くわしい表示が開く
    if (b.works) return '<div class="rd-works">' + b.works.map(function (id) {
      var w = Site.M.works.filter(function (x) { return x.id === id; })[0];
      if (!w) return '';
      return '<div class="rd-work" role="button" tabindex="0" data-work="' + esc(w.id) + '" aria-label="' + esc(w.title) + '">' + U.thumb(w) + U.linkPill(w) +
        '<span class="rd-work-t"><b>' + esc(w.title) + '</b><span>' + esc(w.about) + '</span><em>' + T('くわしく見る') + GO + '</em></span></div>';
    }).join('') + '</div>';
    return '';
  }

  /* ── もどる先：このサイトのどのページから来たか。わからないとき（リンクを直接開いたときなど）は「活動記録」の一覧 ── */
  var FILES = { 'index.html': 'home', 'next.html': 'next', 'records.html': 'records', 'works.html': 'works', 'studio.html': 'studio', 'members.html': 'members', 'about.html': 'about' };
  var NAMES = { next: '次回のイベント', works: '作品', records: '活動記録', studio: 'Studio Hours', members: '運営メンバー', about: 'はじめての方へ' };
  var BACK_TO;
  function backTo(M) {
    var key = '';
    try {
      var u = new URL(document.referrer);
      if (u.origin === location.origin) key = FILES[u.pathname.split('/').pop() || 'index.html'] || '';
    } catch (e) { key = ''; }
    var name = NAMES[key === 'home' ? M.home : key];
    if (!name) return { href: Site.href('records.html'), label: t('活動記録'), back: false };
    return { href: Site.href(key === 'home' ? 'index.html' : key + '.html'), label: t(name), back: true };
  }
  // 来たページがわかっているときは、ブラウザの「戻る」と同じ動きにする（もとの場所まで戻れる）
  function backAttr() { return ' href="' + esc(BACK_TO.href) + '"' + (BACK_TO.back ? ' data-back' : ''); }

  /* ── いちばん上 ── */
  function head(M) {
    var ev = M.events.filter(function (e) { return e.id === R.id; })[0];
    var d = ev && ev.date ? ev.date : R.date;
    var day = d ? (Site.lang === 'ja' ? d.y + '年' : '') + d.long : '';
    var facts = ev ? [
      ['cal', T('日時'), [ev.date ? ev.date.long : '', ev.timeText].filter(Boolean).join(' ')],
      ['pin', T('場所'), ev.place],
      ['ppl', T('参加'), ev.peopleText],
      ['tool', T('使ったもの'), ev.tool]
    ].filter(function (f) { return f[2]; }) : [];
    return '<a class="rd-back"' + backAttr() + '>' + BACK + esc(BACK_TO.label) + '</a>' +
      '<p class="rd-kick"><span>' + esc(R.label) + '</span>' + (day ? '<span>' + esc(day) + '</span>' : '') + '</p>' +
      '<h1 class="rd-h1">' + (Site.lang === 'ja' && R.titleLines.length ? U.lines(R.titleLines) : esc(R.title)) + '</h1>' +
      (R.lead ? '<p class="rd-lead">' + esc(R.lead) + '</p>' : '') +
      (facts.length ? '<dl class="rd-facts">' + facts.map(function (f) { return '<div><i class="osc-ic">' + IC[f[0]] + '</i><dt>' + f[1] + '</dt><dd>' + esc(f[2]) + '</dd></div>'; }).join('') + '</dl>' : '') +
      (R.steps.length ? '<a class="rd-jump" href="#try"><span>' + T('来られなかった人へ') + '</span><b>' + T('自分でやってみる') + '</b><small>' + T('{n}ステップ', { n: R.steps.length }) + '</small>' + DOWN + '</a>' : '') +
      recLangNote();
  }
  // 日本語以外のページでは、記録の本文は日本語のままだと知らせる
  function recLangNote() {
    if (Site.lang === 'ja') return '';
    var n = t('@活動記録は日本語だけです');
    return n && n.charAt(0) !== '@' ? '<p class="osc-langnote rd-langnote">' + esc(n) + '</p>' : '';
  }
  // 当日の写真の組み合わせ：左に1枚目（集合写真）を大きく、右に残りを3枚まで
  function collage() {
    var ph = R.photos.slice(0, 4);
    if (!ph.length) return '';
    return '<div class="rd-collage rd-n' + ph.length + '">' + ph.map(function (p, i) {
      return '<button type="button" class="rd-zoomable rd-cl rd-cl' + (i + 1) + '" data-zoom="' + esc(p.src) + '" data-cap="' + esc(p.cap) + '" aria-label="' + zoomLabel(p.cap) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.cap) + '" style="object-position:' + esc(p.focus) + '"' + (i ? ' loading="lazy"' : '') + '>' +
        (p.cap ? '<span class="rd-cl-cap">' + esc(p.cap) + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function steps() {
    if (!R.steps.length) return '';
    return '<section class="rd-try" id="try"><p class="rd-try-k">' + T('来られなかった人へ') + '</p><h2>' + T('自分でやってみる') + '<small>' + T('{n}ステップ', { n: R.steps.length }) + '</small></h2>' +
      '<p class="rd-try-l">' + T('当日と同じ流れを、ひとりでも試せるようにまとめました。文章はそのままコピーして使えます。') + '</p>' +
      '<div class="rd-steps"><ol>' + R.steps.map(function (s, i) {
        return '<li><span class="rd-st-n">' + (i + 1) + '</span><div class="rd-st-b"><h3>' + esc(s.h) + '</h3>' + (s.p ? '<p>' + esc(s.p) + '</p>' : '') +
          (s.link ? '<a class="rd-st-link" href="' + esc(s.link[1]) + '" target="_blank" rel="noopener">' + esc(s.link[0]) + OUT + '</a>' : '') +
          (s.prompt ? prompt(s.prompt) : '') + '</div></li>';
      }).join('') + '</ol></div></section>';
  }
  function article() {
    return '<div class="rd-a"><nav class="rd-toc" aria-label="' + T('目次') + '"><p>' + T('目次') + '</p><ol>' + R.topics.map(function (tp, i) {
        return '<li><a href="#' + esc(tp.id) + '"><i>' + pad(i + 1) + '</i>' + esc(tp.h) + '</a></li>';
      }).join('') + (R.steps.length ? '<li class="rd-toc-try"><a href="#try"><i>+</i>' + T('自分でやってみる') + '</a></li>' : '') + '</ol></nav>' +
      '<article class="rd-art">' + R.topics.map(function (tp, i) {
        return '<section class="rd-sec" id="' + esc(tp.id) + '"><p class="rd-no">' + pad(i + 1) + '</p><h2>' + esc(tp.h) + '</h2>' + tp.body.map(block).join('') + '</section>';
      }).join('') + steps() +
      '<div class="rd-end"><a class="osc-btn osc-btn-2"' + backAttr() + '>' + BACK + T('{x}にもどる', { x: BACK_TO.label }) + '</a></div></article></div>';
  }

  /* ── 画像を大きく見る、コピー、全文、もどる ── */
  function wire(root) {
    root.addEventListener('click', function (e) {
      var bk = e.target.closest('[data-back]');
      if (bk && history.length > 1 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault(); history.back();
        var fb = setTimeout(function () { location.replace(BACK_TO.href); }, 1000);
        window.addEventListener('pagehide', function () { clearTimeout(fb); }, { once: true });
        return;
      }
      var z = e.target.closest('[data-zoom]');
      if (z) {
        var cap = z.getAttribute('data-cap'), alt = z.getAttribute('data-alt') || cap;
        U.openSheet('<div class="rd-zoom"><img src="' + esc(z.getAttribute('data-zoom')) + '" alt="' + esc(alt || '') + '">' + (cap ? '<p>' + esc(cap) + '</p>' : '') + '</div>', alt || t('画像'));
        return;
      }
      var c = e.target.closest('[data-copy]');
      if (c) { copy(R.prompts[c.getAttribute('data-copy')].text, c); return; }
      var m = e.target.closest('.rd-pr-more');
      if (m) {
        var box = m.closest('.rd-pr'), open = box.classList.toggle('rd-pr-open');
        m.setAttribute('aria-expanded', open ? 'true' : 'false');
        m.querySelector('span').textContent = open ? t('たたむ') : t('全文を見る');
        if (!open) box.scrollIntoView({ block: 'nearest' });
      }
    });
    // いま読んでいる見出しを、目次で示す
    var links = [].slice.call(root.querySelectorAll('.rd-toc a')), secs = links.map(function (a) { return document.getElementById(decodeURIComponent(a.hash.slice(1))); });
    function spy() {
      var cur = 0;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 140) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }
  function copy(text, btn) {
    function done() {
      U.toast(t('コピーしました。そのまま貼りつけて使えます。'));
      btn.classList.add('rd-copied');
      setTimeout(function () { btn.classList.remove('rd-copied'); }, 1600);
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      if (ok) done(); else U.toast(t('コピーできませんでした。文章を長押しして選んでください。'));
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  Site.views.record = function (M, root) {
    var id = new URLSearchParams(location.search).get('id') || '';
    R = M.records.filter(function (r) { return r.page && r.id === id; })[0];
    BACK_TO = backTo(M);
    if (!R) {
      // id がないか、まちがっているとき
      root.innerHTML = '<div class="rd-wrap"><a class="rd-back"' + backAttr() + '>' + BACK + esc(BACK_TO.label) + '</a>' +
        '<div class="osc-gh rd-none"><p>' + T('この記録は見つかりませんでした。') + '<small>' + T('「活動記録」のページから、もう一度選んでください。') + '</small></p></div>' +
        '<div class="rd-end">' + S.go('records', 'osc-btn osc-btn-2', T('活動記録を見る') + GO) + '</div><footer id="ft"></footer></div>';
      S.mount('records');
      return;
    }
    document.title = R.title + t('｜') + t('活動記録') + t('｜') + t('OpenAI Student Collective at UTokyo｜東京大学 学生運営');
    root.innerHTML = '<div class="rd-wrap">' + head(M) + collage() + article() + '<footer id="ft"></footer></div>';
    S.mount('records');
    wire(root);
  };
})();
