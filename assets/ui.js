/* 全ページ共通の小さな部品：お知らせの帯、重ねて出すパネル、作品の絵、作品のくわしい表示、ページ内の移動。 */
(function () {
  'use strict';
  var Site = window.Site, esc = Site.esc, t = Site.t, T = Site.T;

  // ── お知らせの帯（画面の下に少しのあいだ出る） ──
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'osc-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 4000);
  }

  // ── 重ねて出すパネル ──
  var scrim, sheet, lastFocus;
  // 閉じるボタン。訳のファイルを読みこんだあとで作るので、使うときに組み立てる
  function X() { return '<button class="osc-x" data-close aria-label="' + T('閉じる') + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg></button>'; }
  function openSheet(html, label) {
    if (!scrim) {
      scrim = document.createElement('div'); scrim.className = 'osc-scrim';
      sheet = document.createElement('div'); sheet.className = 'osc-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
      document.body.appendChild(scrim); document.body.appendChild(sheet);
      scrim.addEventListener('click', closeSheet);
      sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
      // 開いているあいだ、Tabキーでの移動をパネルの中だけにする
      sheet.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = sheet.querySelectorAll('a[href],button'), first = f[0], last = f[f.length - 1];
        if (!first) return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }
    sheet.setAttribute('aria-label', label || t('くわしい表示'));
    sheet.innerHTML = X() + html;
    phrase(sheet);
    sheet.scrollTop = 0;
    // 開く前にいた場所をおぼえておき、閉じたらそこへ戻す
    lastFocus = document.activeElement;
    requestAnimationFrame(function () { scrim.classList.add('on'); sheet.classList.add('on'); sheet.querySelector('[data-close]').focus(); });
    document.documentElement.style.overflow = 'hidden';
  }
  function closeSheet() {
    if (!sheet || !sheet.classList.contains('on')) return;
    scrim.classList.remove('on'); sheet.classList.remove('on');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  // ── 作品の絵 ──
  // スクリーンショットがあればそれを出す。ないあいだは、コードで描いた仮の絵を出す。
  // 色の組み合わせ：[背景, 文字, 主な色, うすい色]
  var PAL = [
    ['#FFFFFF', '#14151A', '#5B5BD6', '#E6E6FA'],
    ['#FFF9EE', '#2B2118', '#E5722A', '#FBE3CB'],
    ['#F3FAF5', '#10281B', '#1E9E5A', '#D2EEDC'],
    ['#12151F', '#F2F4FA', '#7AA7FF', '#262D44'],
    ['#FFF5F6', '#2A1418', '#D8456B', '#FAD6DF'],
    ['#F2F8FE', '#0E2238', '#0A84FF', '#D3E7FC'],
    ['#FBFAF2', '#23240F', '#9A9712', '#ECECBE'],
    ['#F6F3FB', '#1D1630', '#7C5CCB', '#E1D8F5']
  ];
  function rnd(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function rep(n, fn) { var o = ''; for (var i = 0; i < n; i++) o += fn(i); return o; }

  var TPL = {
    site: function (w) {
      return '<div class="s-row"><div><div class="th-t">' + esc(w.title) + '</div><div class="th-l" style="width:84%"></div><div class="th-l" style="width:58%"></div><div class="s-btn"></div></div><div class="s-img"><i></i><i></i></div></div><div class="s-cards"><i></i><i></i><i></i></div>';
    },
    map: function (w) {
      var r = rnd(w.seed);
      return '<div class="m-map">' + rep(6, function (i) { return '<b' + (i === 2 ? ' class="h"' : '') + ' style="left:' + (50 + r() * 42).toFixed(0) + '%;top:' + (10 + r() * 72).toFixed(0) + '%"></b>'; }) + '</div><div class="m-list"><div class="th-t sm">' + esc(w.title) + '</div><p></p><p></p><p></p></div>';
    },
    dash: function (w) {
      var r = rnd(w.seed), n = w.num || [(40 + r() * 50).toFixed(1), '%'], hi = Math.floor(r() * 8);
      return '<div class="th-t sm">' + esc(w.title) + '</div><div class="d-num">' + esc(n[0]) + '<small>' + T(n[1]) + '</small></div><div class="d-bars">' + rep(9, function (i) { return '<i' + (i === hi || i === 8 ? ' class="on"' : '') + ' style="height:' + (22 + r() * 76).toFixed(0) + '%"></i>'; }) + '</div>';
    },
    game: function (w) {
      var r = rnd(w.seed);
      return '<div class="g-top"><div class="th-t sm">' + esc(w.title) + '</div><div class="g-score"><b>' + (8 + Math.floor(r() * 9)) + '</b><span>:</span><b>' + (3 + Math.floor(r() * 9)) + '</b></div></div><div class="g-grid">' + rep(12, function () { var v = r(); return '<i' + (v > .72 ? ' class="a"' : v > .42 ? ' class="b"' : '') + '></i>'; }) + '</div><div class="g-timer"><i style="width:' + (35 + r() * 50).toFixed(0) + '%"></i></div>';
    },
    cal: function (w) {
      var r = rnd(w.seed), days = t('月火水木金').split('');
      return '<div class="th-t sm">' + esc(w.title) + '</div><div class="c-grid">' + days.map(function (d) {
        return '<div class="c-col"><em>' + d + '</em>' + rep(4, function () { var v = r(); return '<i class="' + (v > .7 ? 'on' : v > .34 ? '' : 'gap') + '" style="flex:' + (1 + Math.floor(r() * 3)) + '"></i>'; }) + '</div>';
      }).join('') + '</div>';
    },
    asst: function (w) {
      return '<div class="th-t sm">' + esc(w.title) + '</div><div class="a-chat"><div class="a-u"><p></p></div><div class="a-b"><p class="hl"></p><p></p><p></p></div><div class="a-u" style="width:34%"><p></p></div><div class="a-b"><p></p><p></p></div></div>';
    },
    res: function (w) {
      return '<div class="th-t sm">' + esc(w.title) + '</div><div class="r-tbl"><div class="r-h"><i></i><i></i><i></i></div>' + rep(5, function (i) { return '<div><i class="' + (i % 2 ? '' : 'k') + '"></i><i></i><i style="width:' + (50 + (i * 17) % 40) + '%"></i></div>'; }) + '</div>';
    }
  };
  function thumb(w) {
    if (w.image) return '<div class="th th-shot"><img src="' + esc(w.image) + '" alt="" loading="lazy"></div>';
    var p = PAL[w.color % PAL.length];
    return '<div class="th th-' + w.look + '" style="--bg:' + p[0] + ';--ink:' + p[1] + ';--ac:' + p[2] + ';--soft:' + p[3] + '"><div class="th-bar"><i></i><i></i><i></i><span></span></div><div class="th-body">' + TPL[w.look](w) + '</div></div>';
  }

  // 人の小さな丸。運営メンバーで写真があるときは写真を、ないときは名前の最初の1文字を入れる
  var MONO = ['#E3DAF6', '#D5F0DF', '#F3EFB5', '#D6E9FD', '#FBD9E1', '#FCE6CF'];
  var PERSON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/></svg>';
  function mono(name) {
    if (name === '参加者') return '<span class="osc-mono osc-mono-p">' + PERSON + '</span>';
    var who = ((Site.M && Site.M.members) || []).filter(function (m) { return m.name === name && m.image; })[0];
    if (who) return '<img class="osc-mono" src="' + esc(who.image) + '" alt="">';
    var first = Array.from(name)[0] || '';   // 「𠮷」のような字も1文字として取り出す
    return '<span class="osc-mono" style="background:' + MONO[(name.charCodeAt(0) || 0) % MONO.length] + '">' + esc(first) + '</span>';
  }

  // ── 記録のページのアドレス（record.html?id=w1#t-show のように）。?demo や ?lang=… はそのまま引きつぐ ──
  function recHref(id, hash) {
    var h = Site.href('record.html'), q = 'id=' + encodeURIComponent(id);
    return (h.indexOf('?') < 0 ? h + '?' + q : h.replace('?', '?' + q + '&')) + (hash ? '#' + hash : '');
  }

  // ── 作品に外のリンクがあるときだけ出す、小さな印。ないときは何も出さない ──
  var OUT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 10l5-5M6.5 5H11v4.5"/></svg>';
  var CHAIN = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2.2-2.2a2.6 2.6 0 0 0-3.7-3.7l-.9.9"/><path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0L3.3 9a2.6 2.6 0 0 0 3.7 3.7l.9-.9"/></svg>';
  function linkPill(w) { return w.url ? '<span class="osc-lk">' + CHAIN + T('リンクあり') + '</span>' : ''; }

  /* ── 画像を横に並べて、指でずらしたり、自動で送ったりする帯（スライド） ──
     list：画像のアドレスか {src, cap, focus} の並び。
     o.cls：外側に足すクラス　o.auto：false で自動で送らない
     組み立てたあとで wireSlides(入れた場所) を呼ぶと動き出す */
  var CL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>';
  var CR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>';
  function slides(list, o) {
    o = o || {};
    if (!list || !list.length) return '';
    var many = list.length > 1;
    return '<div class="osc-sl' + (o.cls ? ' ' + o.cls : '') + (many ? '' : ' osc-sl-one') + '" data-sl' + (o.auto === false ? '' : ' data-auto') + ' tabindex="-1" aria-roledescription="carousel">' +
      '<div class="osc-sl-vp"><div class="osc-sl-tr">' + list.map(function (x, i) {
        var src = typeof x === 'string' ? x : x.src, cap = typeof x === 'string' ? '' : (x.cap || ''), focus = typeof x === 'string' ? '' : (x.focus || '');
        return '<figure class="osc-sl-i"><img src="' + esc(src) + '" alt="' + esc(cap) + '" draggable="false"' + (i ? ' loading="lazy"' : '') + (focus ? ' style="object-position:' + esc(focus) + '"' : '') + '>' +
          (cap ? '<figcaption>' + esc(cap) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div></div>' +
      (many ? '<button type="button" class="osc-sl-btn osc-sl-prev" aria-label="' + T('前の画像') + '">' + CL + '</button>' +
        '<button type="button" class="osc-sl-btn osc-sl-next" aria-label="' + T('次の画像') + '">' + CR + '</button>' +
        '<div class="osc-sl-dots">' + list.map(function (x, i) { return '<button type="button" aria-label="' + T('{n}枚目', { n: i + 1 }) + '"' + (i ? '' : ' class="on" aria-current="true"') + '><i></i></button>'; }).join('') + '</div>' : '') +
      '</div>';
  }
  var SL_MS = 4500;   // 自動で次へ送るまでの時間
  function wireSlides(root) {
    [].forEach.call((root || document).querySelectorAll('[data-sl]:not([data-sl-on])'), function (el) {
      el.setAttribute('data-sl-on', '');
      var vp = el.querySelector('.osc-sl-vp'), tr = el.querySelector('.osc-sl-tr'), n = tr.children.length;
      if (n < 2) return;
      var dots = el.querySelectorAll('.osc-sl-dots button'), i = 0, timer = null, hover = false, dragging = false, moved = false, x0 = 0, y0 = 0, dx = 0;
      var auto = el.hasAttribute('data-auto') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (auto) el.classList.add('osc-sl-auto');
      function go(k) {
        i = (k + n) % n;
        tr.style.transform = 'translateX(' + (-i * 100) + '%)';
        [].forEach.call(dots, function (d, j) {
          d.classList.toggle('on', j === i);
          if (j === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        });
      }
      function start() {
        clearInterval(timer); timer = null;
        if (!auto) return;
        // 押したときは、そこから数えなおす（点の中の線も、はじめから）
        el.classList.remove('osc-sl-run'); void el.offsetWidth; el.classList.add('osc-sl-run');
        timer = setInterval(function () {
          if (!el.isConnected || (el.closest('.osc-sheet') && !el.closest('.osc-sheet.on'))) { clearInterval(timer); return; }   // 消えた・閉じたパネルの中なら止める〔評審P2〕
          if (hover || dragging || document.hidden) return;
          go(i + 1); el.classList.remove('osc-sl-run'); void el.offsetWidth; el.classList.add('osc-sl-run');
        }, SL_MS);
      }
      // マウスをのせているあいだ、キーボードで中を選んでいるあいだは止める。離れたら、そこから数えなおす〔評審P2〕
      var inside = { mouse: false, focus: false };
      function pause(k, on) {
        inside[k] = on; var was = hover; hover = inside.mouse || inside.focus;
        el.classList.toggle('osc-sl-hold', hover);
        if (was && !hover) start();
      }
      el.addEventListener('click', function (e) {
        var b = e.target.closest('.osc-sl-prev,.osc-sl-next,.osc-sl-dots button');
        if (!b) return;
        if (b.classList.contains('osc-sl-prev')) go(i - 1);
        else if (b.classList.contains('osc-sl-next')) go(i + 1);
        else go([].indexOf.call(dots, b));
        start();
      });
      el.addEventListener('mouseenter', function () { pause('mouse', true); });
      el.addEventListener('mouseleave', function () { pause('mouse', false); });
      el.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) pause('focus', true); });   // キーボードで入ったときだけ（マウスで押しただけでは止めない）
      el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) pause('focus', false); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { go(i - 1); start(); }
        else if (e.key === 'ArrowRight') { go(i + 1); start(); }
      });
      // 指（またはマウス）でずらす。縦に動かしたときは、ページのスクロールにまかせる
      vp.addEventListener('pointerdown', function (e) {
        if (e.button) return;
        dragging = true; moved = false; x0 = e.clientX; y0 = e.clientY; dx = 0;
        tr.style.transition = 'none';
        if (e.pointerType === 'mouse' && vp.setPointerCapture) try { vp.setPointerCapture(e.pointerId); } catch (err) {}
      });
      vp.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        dx = e.clientX - x0;
        if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - y0)) { moved = true; if (vp.setPointerCapture) try { vp.setPointerCapture(e.pointerId); } catch (err) {} }
        if (moved) tr.style.transform = 'translateX(calc(' + (-i * 100) + '% + ' + dx + 'px))';
      });
      function end() {
        if (!dragging) return;
        dragging = false; tr.style.transition = '';
        if (moved && Math.abs(dx) > Math.min(60, vp.clientWidth * .15)) go(dx < 0 ? i + 1 : i - 1); else go(i);
        start();
      }
      vp.addEventListener('pointerup', end);
      vp.addEventListener('pointercancel', end);
      vp.addEventListener('lostpointercapture', function () {
        end();
        // 押したまま枠の外で離すと「マウスが離れた」が来ないので、つかみ終わったあとで、マウスがいまどこにあるかを見なおす
        setTimeout(function () { if (inside.mouse && !el.matches(':hover')) pause('mouse', false); }, 0);
      });
      // ずらしたあとに続けて来る click（画像を大きくする、など）は止める
      vp.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      start();
    });
  }

  // ── 作品のくわしい表示 ──
  function openWork(id) {
    var M = Site.M, w = M.works.filter(function (x) { return x.id === String(id); })[0];
    if (!w) return;
    var acts = '';
    if (M.demo) acts += '<button class="osc-wk-go" data-toast="' + T('サンプルのため、作品のリンクはありません。') + '">' + T('作品を開く') + '</button>';
    else if (w.url) acts += '<a class="osc-wk-go" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + T('作品を開く') + OUT + '</a>';
    // この作品を紹介している記録があれば、その見出しへ。なければ、イベントの作品は「活動記録」の一覧へ
    var rec = null, sec = null;
    M.records.forEach(function (r) {
      if (rec || !r.page) return;
      var hit = r.topics.filter(function (tp) { return tp.body.some(function (b) { return b.works && b.works.indexOf(w.id) >= 0; }); })[0];
      if (hit || (w.byEvent && r.id === w.from)) { rec = r; sec = hit; }
    });
    if (rec) acts += '<a class="osc-wk-sub" href="' + esc(recHref(rec.id, sec ? sec.id : '')) + '">' + T('{x}の記録を見る', { x: rec.label || rec.title }) + '</a>';
    else if (w.byEvent && M.records.length) acts += Site.shell.go('records', 'osc-wk-sub', T('活動記録を見る'));
    var pics = w.shots && w.shots.length ? slides(w.shots, { cls: 'osc-wk-sl' }) : thumb(w);
    openSheet('<div class="osc-wk">' + pics + '<h3>' + esc(w.title) + '</h3><p class="osc-wk-desc">' + esc(w.detail || w.about) + '</p><dl>' +
      '<dt>' + T('つくった人') + '</dt><dd>' + (w.makerNote ? T('{a}（{b}）', { a: w.makerText || w.maker, b: w.makerNote }) : esc(w.makerText || w.maker)) + '</dd>' +
      (w.byEvent && w.fromLabel ? '<dt>' + T('つくった回') + '</dt><dd>' + esc(w.fromLabel) + '</dd>' : '') +
      (w.tool ? '<dt>' + T('使ったもの') + '</dt><dd>' + esc(w.tool) + '</dd>' : '') +
      '</dl>' + (acts ? '<div class="osc-wk-acts">' + acts + '</div>' : '') + '</div>', w.title);
    wireSlides(sheet);
  }

  // ── 作品の例のくわしい表示。実際の作品ではないことを、はっきり書く ──
  function openExample(id) {
    var w = Site.M.examples.filter(function (x) { return x.id === String(id); })[0];
    if (!w) return;
    openSheet('<div class="osc-wk">' + thumb(w) + '<p class="osc-wk-note"><b>' + T('これは例です。') + '</b>' + T('実際の作品ではありません。ワークショップでは、こういうものをつくれます。') + '</p>' +
      '<h3>' + esc(w.title) + '</h3><p class="osc-wk-desc">' + esc(w.about) + '</p><dl>' +
      (w.category ? '<dt>' + T('種類') + '</dt><dd>' + T(w.category) + '</dd>' : '') +
      (w.tool ? '<dt>' + T('使うもの') + '</dt><dd>' + esc(w.tool) + '</dd>' : '') + '</dl></div>', t('{x}（例）', { x: w.title }));
  }

  /* 見出しの折り返しの手伝い。
     文節で折り返す機能（word-break:auto-phrase）がないブラウザのために、見出しの句読点のうしろと、かっこの前に <wbr>（ここで折り返してよい印）を入れる。
     その機能があるブラウザでは何もしない。 */
  var AUTO_PHRASE = !!(window.CSS && CSS.supports && CSS.supports('word-break', 'auto-phrase'));
  var AFTER = '、。！？：', BEFORE = '「『（', NOHEAD = '」』）)…ー・';
  function phrase(root) {
    if (AUTO_PHRASE) return;
    [].forEach.call(root.querySelectorAll('h1,h2,h3'), function (h) {
      var walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (t) {
        var s = t.nodeValue, parts = [], cur = '';
        for (var i = 0; i < s.length; i++) {
          cur += s[i];
          var a = s[i], b = s[i + 1];
          // 行のはじめに来てはいけない字の前と、時刻の「18：45」のような数字の前では切らない
          if (b && ((AFTER.indexOf(a) >= 0 && AFTER.indexOf(b) < 0 && NOHEAD.indexOf(b) < 0 && !(a === '：' && /[0-9０-９]/.test(b))) || (BEFORE.indexOf(b) >= 0 && BEFORE.indexOf(a) < 0))) { parts.push(cur); cur = ''; }
        }
        parts.push(cur);
        if (parts.length < 2) return;
        var f = document.createDocumentFragment();
        parts.forEach(function (p, i) { if (i) f.appendChild(document.createElement('wbr')); f.appendChild(document.createTextNode(p)); });
        t.parentNode.replaceChild(f, t);
      });
    });
  }

  /* 1行ずつ書いた見出しを並べる。
     日本語は <br> で区切る。中国語と英語は、1行が長くて折り返すことがあるので、行ごとに箱にして、折り返したときに長さがそろうようにする。 */
  function lines(list) {
    if (Site.lang === 'ja') return list.map(esc).join('<br>');
    return list.map(function (l) { return '<span class="osc-ln">' + esc(l) + '</span>'; }).join('');
  }

  var CHEV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>';

  // ── ページの中の場所（id）へ移動する。上に固定されたメニューと「サンプル表示中」の帯の分だけ空ける ──
  function jumpTo(id, smooth) {
    var el = document.getElementById(id), smp = document.querySelector('.osc-smp');
    if (!el && !smooth) return;
    window.scrollTo({ top: el ? el.getBoundingClientRect().top + window.scrollY - 76 - (smp ? smp.offsetHeight : 0) : 0, behavior: smooth ? 'smooth' : 'auto' });
  }

  // ── クリックをまとめて受ける ──
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-toast]');
    if (t) toast(t.getAttribute('data-toast'));
    var wk = e.target.closest('[data-work]');
    if (wk) openWork(wk.getAttribute('data-work'));
    var ex = e.target.closest('[data-example]');
    if (ex) openExample(ex.getAttribute('data-example'));
    // ページ内のリンク（#do や、いま開いているページの about.html#do など）：上に固定されたメニューの分だけ空けて、なめらかに移動する
    var jump = e.target.closest('a[href*="#"]');
    if (jump && jump.hash && jump.origin === location.origin && jump.pathname === location.pathname && jump.search === location.search && jump.target !== '_blank') {
      e.preventDefault();
      if (jump.closest('.osc-sheet')) closeSheet();
      var to = jump.hash.slice(1);
      try { to = decodeURIComponent(to); } catch (err) { /* そのまま使う */ }
      jumpTo(to, true);
    }
  });
  // div で作ったボタンを、キーボードでも押せるようにする
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"]')) { e.preventDefault(); e.target.click(); }
  });

  Site.ui = { toast: toast, openSheet: openSheet, closeSheet: closeSheet, thumb: thumb, mono: mono, openWork: openWork, recHref: recHref, linkPill: linkPill, slides: slides, wireSlides: wireSlides, jumpTo: jumpTo, phrase: phrase, lines: lines, CHEV: CHEV };
})();
