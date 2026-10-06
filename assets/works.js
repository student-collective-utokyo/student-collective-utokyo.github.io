/* 「作品」のページ。作品を大きく並べて、右上の小さなカードで次回のイベントを知らせます。
   何が出るかは content.js の内容で決まります（イベントでできた作品がまだないあいだは、運営メンバーの作品と「ここに並びます」の枠）。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc;

  /* いちばん上の大きな見出し。
     {n} と書いたところには作品の数が入り、そこに色の線を引く。{n} がなければ、最後の行に線を引く。 */
  function headline(lines, n) {
    if (!lines.length) return '<h1 class="ws-h1">作品</h1>';
    var hasN = lines.some(function (l) { return l.indexOf('{n}') >= 0; });
    return '<h1 class="ws-h1">' + lines.map(function (l, i) {
      var t = esc(l);
      if (hasN) t = t.replace('{n}', '<span class="ws-mk ws-n">' + n + '</span>');
      else if (i === lines.length - 1) t = '<span class="ws-mk">' + t + '</span>';
      return '<span class="ws-ln">' + t + '</span>';
    }).join('') + '</h1>';
  }

  // 右上の「次回」の小さなカード。押すと「次回」のページへ移る
  function nextCard(M) {
    var ev = M.next, main, btn = '', soon = '';
    if (!ev) {
      main = '<span class="ws-nx-lbl">次回</span><span class="ws-nx-when"><b class="ws-nx-tx">準備中</b></span>' +
        '<span class="ws-nx-ttl">次回のイベントは、決まり次第お知らせします。</span>';
    } else {
      var when = ev.date
        ? '<b>' + esc(ev.date.md) + '</b><span>(' + ev.date.dow + ')</span>' + (ev.timeText ? '<i>' + esc(ev.timeText) + '</i>' : '')
        : '<b class="ws-nx-tx">日程調整中</b>';
      var meta = [ev.place, ev.tool].filter(Boolean).map(esc).join(' ・ ');
      main = '<span class="ws-nx-lbl">次回 ・ ' + esc(ev.name) + '</span><span class="ws-nx-when">' + when + '</span>' +
        (ev.title ? '<span class="ws-nx-ttl">' + esc(ev.title) + '</span>' : '') +
        (meta ? '<span class="ws-nx-meta">' + meta + '</span>' : '');
      var label = '<span class="ws-l">Lumaで申し込む</span><span class="ws-s">申し込む</span>' + S.ARROW;
      if (ev.date && M.demo) btn = '<button type="button" class="osc-btn osc-btn-1 ws-nx-btn" data-toast="サンプルのため、Lumaのページには移動しません。">' + label + '</button>';
      else if (ev.date && ev.applyUrl) btn = '<a class="osc-btn osc-btn-1 ws-nx-btn" href="' + esc(ev.applyUrl) + '" target="_blank" rel="noopener">' + label + '</a>';
      else soon = '<p class="ws-nx-soon">申し込みは準備中です。' + (ev.date ? '準備ができ次第' : '日程が決まり次第') + '、ここから申し込めます。</p>';
    }
    return '<aside class="ws-nx" aria-label="次回のイベント"><div class="ws-nx-in">' + S.go('next', 'ws-nx-main', main) + soon +
      '<div class="ws-nx-foot">' + btn + S.go('next', 'ws-nx-more', '<span>くわしく見る</span>' + U.CHEV, 'aria-label="次回のイベントをくわしく見る"') + '</div></div></aside>';
  }

  /* 作品のカード。
     plain が true のときは、「つくった回」を出さない（運営メンバーの作品だけを並べるとき）。
     それ以外の小さなカードでは、「つくった回 ・ 使ったもの」を名前の下の行に出す（横に並べると入りきらないことがあるため）。
     big が true のときは、2列ぶんの大きなカードにして「ピックアップ」の印をつける。 */
  function tile(w, plain, big) {
    var tag = [plain ? '' : w.fromShort, w.tool].filter(Boolean).map(esc).join(' ・ ');
    return '<div class="ws-tile' + (big ? ' ws-big' : '') + '" role="button" tabindex="0" data-work="' + esc(w.id) + '" aria-label="' + esc(w.title) + '">' + U.thumb(w) +
      '<span class="ws-tx">' + (big ? '<span class="ws-pk">ピックアップ</span>' : '') + '<span class="ws-tt">' + esc(w.title) + '</span>' + (w.about ? '<span class="ws-ds">' + esc(w.about) + '</span>' : '') +
      '<span class="ws-by' + (plain || big ? '' : ' ws-by2') + '">' + U.mono(w.maker) + '<span class="ws-nm">' + esc(w.maker) + '</span>' +
      (w.makerNote ? '<span class="ws-af">' + esc(w.makerNote) + '</span>' : '') + (tag ? '<span class="ws-tg">' + tag + '</span>' : '') + '</span></span></div>';
  }
  // 準備中の作品の枠
  function waitTile(p) {
    return '<div class="ws-tile ws-wait"><div class="osc-gh sq"><p>準備中</p></div><span class="ws-tx"><span class="ws-tt">' + esc(p.maker) + 'の作品</span>' +
      (p.makerNote ? '<span class="ws-by"><span class="ws-af">' + esc(p.makerNote) + '</span></span>' : '') + '</span></div>';
  }

  // 絞り込みのボタンを並べる順。ここにない分類は、そのうしろに出る
  var CATS = ['ウェブサイト', 'ダッシュボード', 'リサーチ', 'アシスタント', 'ゲーム', 'カレンダー', '地図'];
  // いまの画面の幅で、作品が横にいくつ並ぶか（works.css の区切りと同じ）
  function cols() { return window.matchMedia('(max-width:720px)').matches ? 2 : window.matchMedia('(max-width:1100px)').matches ? 3 : 4; }

  /* イベントでできた作品があるときの壁。分類と、つくった回で絞り込める。
     最初は数段ぶんだけ出して、残りは「もっと見る」で12件ずつ出す。
     絞り込んでいないときは、ピックアップの作品（content.js で pick: true と書いたもの）を1つ大きく出す。 */
  function setupWall(M, box) {
    var st = { cat: '', from: '', more: 0 };   // '' ＝ 絞り込まない
    var cats = [];
    M.works.forEach(function (w) { if (w.category && cats.indexOf(w.category) < 0) cats.push(w.category); });
    cats = CATS.filter(function (c) { return cats.indexOf(c) >= 0; }).concat(cats.filter(function (c) { return CATS.indexOf(c) < 0; }));
    function any(from) { return M.works.some(function (w) { return w.from === from; }); }
    var froms = [];   // 新しい回を先に
    if (any('studio')) froms.push(['studio', 'Studio Hours']);
    M.events.slice().reverse().forEach(function (e) { if (e.id && any(e.id)) froms.push([e.id, (e.short || e.name) + (e.date ? '（' + e.date.md + '）' : '')]); });
    if (any('lead')) froms.push(['lead', '運営メンバー']);

    var sel = froms.length > 1
      ? '<label class="ws-sel"><span>つくった回</span><select aria-label="つくった回で絞り込む"><option value="">すべての回</option>' +
        froms.map(function (f) { return '<option value="' + esc(f[0]) + '">' + esc(f[1]) + '</option>'; }).join('') + '</select></label>'
      : '';
    var flt = sel || cats.length > 1;
    box.innerHTML = (flt ? '<div class="ws-flt">' + sel + '<div class="ws-chips" role="group" aria-label="分類で絞り込む"></div></div>' : '') +
      '<div class="ws-wall' + (flt ? '' : ' ws-top') + '"></div><div class="ws-more"><button type="button"></button></div>';
    var chips = box.querySelector('.ws-chips'), grid = box.querySelector('.ws-wall'), more = box.querySelector('.ws-more button'), pick = box.querySelector('select');

    function render() {
      var base = M.works.filter(function (w) { return !st.from || w.from === st.from; });
      if (chips && cats.length > 1) {
        var focused = document.activeElement && document.activeElement.parentNode === chips ? document.activeElement.getAttribute('data-cat') : null;
        chips.innerHTML = [''].concat(cats).map(function (c) {
          var n = c ? base.filter(function (w) { return w.category === c; }).length : base.length;
          return '<button type="button" class="ws-chip' + (st.cat === c ? ' on' : '') + '" data-cat="' + esc(c) + '" aria-pressed="' + (st.cat === c) + '"' + (n ? '' : ' disabled') + '>' + esc(c || 'すべて') + '<small>' + n + '</small></button>';
        }).join('');
        // 押したボタンにキーボードの位置を戻す
        if (focused !== null) [].forEach.call(chips.children, function (b) { if (b.getAttribute('data-cat') === focused) b.focus(); });
      }
      var list = base.filter(function (w) { return !st.cat || w.category === st.cat; });
      var c = cols(), feat = !st.cat && !st.from && list.length >= 5 && list[0].pick;
      // 大きなカードは小さなカード4つぶん（スマホでは2つぶん）の場所を使うので、最後の段がそろう数にする
      var n = 12 + (feat && c !== 3 ? 1 : 0) + st.more * 12;
      grid.innerHTML = list.slice(0, n).map(function (w, i) { return tile(w, false, feat && i === 0); }).join('');
      var rest = list.length - n;
      more.parentNode.style.display = rest > 0 ? '' : 'none';
      more.textContent = 'もっと見る（残り' + Math.max(rest, 0) + '件）';
    }
    if (chips) chips.addEventListener('click', function (e) {
      var b = e.target.closest('.ws-chip');
      if (!b || b.disabled) return;
      st.cat = b.getAttribute('data-cat'); st.more = 0; render();
    });
    if (pick) pick.addEventListener('change', function () {
      st.from = pick.value; st.more = 0;
      // 選んだ回に、いまの分類の作品がなければ、分類を「すべて」に戻す
      if (st.cat && !M.works.some(function (w) { return w.from === st.from && w.category === st.cat; })) st.cat = '';
      render();
    });
    more.addEventListener('click', function () { st.more++; render(); });
    // 画面の幅が変わって列の数が変わったら、並べなおす
    ['(max-width:720px)', '(max-width:1100px)'].forEach(function (q) {
      var m = window.matchMedia(q);
      if (m.addEventListener) m.addEventListener('change', render); else if (m.addListener) m.addListener(render);
    });
    render();
  }

  // イベントでできた作品がまだないときの壁：運営メンバーの作品と、これから並ぶ場所を出す
  function wall(M) {
    var first = M.events.filter(function (e) { return e.kind === 'workshop' && e.state !== 'done'; })[0];
    var lead = M.works.length || M.pending.length
      ? '<h2 class="ws-grp">運営メンバーの作品<small>Campus Leadが自分でつくって、使っているもの</small></h2>' +
        '<div class="ws-wall">' + M.works.map(function (w) { return tile(w, true); }).join('') + M.pending.map(waitTile).join('') + '</div>'
      : '';
    // 作品の例があるときは、「ここに並びます」の枠のかわりに例を並べる。ひとつずつ、名前の前に「例」の印をつける
    if (M.examples.length) {
      return lead + '<h2 class="ws-grp' + (lead ? ' ws-gap' : '') + '">こんなものがつくれます<small>作品の例です。' + esc(first && first.short ? first.short : 'ワークショップ') + 'の作品ができたら、ここに並べます。</small></h2>' +
        '<div class="ws-wall">' + M.examples.map(function (w) {
          return '<div class="ws-tile ws-ex" role="button" tabindex="0" data-example="' + esc(w.id) + '" aria-label="' + esc(w.title) + '（例）">' +
            U.thumb(w) +
            '<span class="ws-tx"><span class="ws-tt"><em class="ws-ex-tag">例</em>' + esc(w.title) + '</span>' + (w.about ? '<span class="ws-ds">' + esc(w.about) + '</span>' : '') +
            (w.tool ? '<span class="ws-by"><span class="ws-ex-tool">' + esc(w.tool) + 'でつくる例</span></span>' : '') + '</span></div>';
        }).join('') + '</div>';
    }
    return lead +
      '<h2 class="ws-grp' + (lead ? ' ws-gap' : '') + '">' + esc(first ? first.name : 'ワークショップ') + 'の作品</h2>' +
      '<div class="ws-soon"><i></i><i></i><i></i><i></i><p>' + esc(first && first.short ? first.short : 'ワークショップ') + 'の作品はここに並びます。</p></div>';
  }

  Site.views.works = function (M, root) {
    var P = M.worksPage, has = M.eventWorks.length > 0, lead = has ? P.lead : P.openLead;
    root.innerHTML = '<div class="ws-wrap">' +
      '<section class="ws-hero"><div class="ws-hero-l">' + headline(has ? P.title : P.openTitle, M.works.length) +
      (lead ? '<p class="ws-lead">' + esc(lead) + '</p>' : '') + '</div>' + nextCard(M) + '</section>' +
      '<section class="ws-walls">' + (has ? '' : wall(M)) + '</section>' +
      '<section class="ws-term"><div class="osc-sh"><h2>今学期の予定<small>' + esc(M.term.label) + '</small></h2></div>' + S.plan(M) + '</section>' +
      '<footer id="ft"></footer></div>';
    if (has) setupWall(M, root.querySelector('.ws-walls'));
    S.mount('works');
  };
})();
