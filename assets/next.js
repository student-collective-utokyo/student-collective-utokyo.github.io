/* 「次回」のページ。次回のイベントを大きく出して、その下に作品と活動記録を少しずつ出します。
   何が出るかは content.js の内容で決まります（日付が空なら「日程調整中」、作品がまだなら「ここに並びます」）。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc;

  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11l6-6M5.5 5H11v5.5"/></svg>';
  var CLOCK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.5"/><path d="M10 5.8V10l2.8 1.8"/></svg>';

  function svg(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var IC = {
    pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
    tool: svg('<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7.5 10l3 2.5-3 2.5M12.5 15h4"/>'),
    laptop: svg('<rect x="5" y="5.5" width="14" height="9.5" rx="1.8"/><path d="M3 18.5h18"/>'),
    ticket: svg('<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v2a2 2 0 0 0 0 3.9v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.4v-2a2 2 0 0 0 0-3.9z"/><path d="M14.5 7.6v9.8" stroke-dasharray="1.6 2.3"/>')
  };

  function two(n) { return (n < 10 ? '0' : '') + n; }

  // Googleカレンダーに予定を追加するページのアドレスを作る
  function calendarUrl(ev) {
    var d = ev.date, day = '' + d.y + two(d.m) + two(d.d), dates;
    if (ev.start) {
      // 終わる時刻が書いてないときは、1時間の予定にする
      var endMin = ev.end ? ev.end.h * 60 + ev.end.min : Math.min(ev.start.h * 60 + ev.start.min + 60, 23 * 60 + 59);
      dates = day + 'T' + two(ev.start.h) + two(ev.start.min) + '00/' + day + 'T' + two(Math.floor(endMin / 60)) + two(endMin % 60) + '00';
    } else {
      var t = new Date(Date.UTC(d.y, d.m - 1, d.d + 1));
      dates = day + '/' + t.getUTCFullYear() + two(t.getUTCMonth() + 1) + two(t.getUTCDate());
    }
    var details = [ev.title, ev.applyUrl].filter(Boolean).join('\n');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(ev.name + '｜OpenAI Student Collective at UTokyo') +
      '&dates=' + dates + '&ctz=Asia%2FTokyo' +
      (ev.place ? '&location=' + encodeURIComponent(ev.place) : '') +
      (details ? '&details=' + encodeURIComponent(details) : '');
  }

  // 大きな見出し。bigTitle があればその行のとおりに、なければ title をそのまま出す
  function headline(ev) {
    if (ev.bigTitle.length) return '<h1 class="nx-h1">' + ev.bigTitle.map(esc).join('<br>') + '</h1>';
    // 題が決まっていない回は、回の名前を見出しにする
    var t = ev.title || ev.name;
    return t ? '<h1 class="nx-h1 nx-auto">' + esc(t) + '</h1>' : '';
  }

  // 左側の大きな文字
  function hero(M) {
    var ev = M.next;
    if (!ev) {
      return '<p class="nx-lbl"><span>次回</span>イベント</p>' +
        '<div class="nx-date"><b class="nx-tx">準備中</b></div>' +
        '<h1 class="nx-h1">次回のイベントは、<br>決まり次第お知らせします。</h1>';
    }
    var noTitle = !ev.title && !ev.bigTitle.length;   // 題がない回は、回の名前が大きな見出しになるので、上の小さな行には種類だけを出す
    var wait = function (text) { return '<p class="nx-wait">' + CLOCK + '<span>' + text + '</span></p>'; };
    if (!ev.date) {
      // 日程が決まっていないとき：「第1回」を大きく出す
      var m = /^第(\d+)回$/.exec(ev.short);
      var big = m ? '<b><small>第</small>' + m[1] + '<small>回</small></b>' : (ev.when ? '<b class="nx-tx">' + esc(ev.when) + '</b>' : '');
      return '<p class="nx-lbl"><span>次回</span>' + esc(m || noTitle ? ev.kindLabel : ev.name) + '</p>' +
        '<div class="nx-date">' + big + '<div class="nx-side"><span class="nx-tbd">日程調整中</span>' + (ev.timeText ? '<span class="nx-time">' + esc(ev.timeText) + '</span>' : '') + '</div></div>' +
        headline(ev) +
        wait('申し込みは準備中です。日程が決まり次第、このページから申し込めるようになります。');
    }
    // 日程が決まっているとき：日付を大きく出す
    var apply = M.demo
      ? '<button type="button" class="nx-cta" data-hero-cta data-toast="サンプルのため、Lumaのページには移動しません。">Lumaで申し込む' + ARROW + '</button>'
      : (ev.applyUrl ? '<a class="nx-cta" data-hero-cta href="' + esc(ev.applyUrl) + '" target="_blank" rel="noopener">Lumaで申し込む' + ARROW + '</a>' : '');
    var cal = M.demo
      ? '<button type="button" class="nx-sec" data-toast="サンプルのため、カレンダーには追加されません。">カレンダーに追加</button>'
      : '<a class="nx-sec" href="' + esc(calendarUrl(ev)) + '" target="_blank" rel="noopener">カレンダーに追加</a>';
    return '<p class="nx-lbl"><span>次回</span>' + esc(noTitle ? ev.kindLabel : ev.name) + '</p>' +
      '<div class="nx-date"><b>' + esc(ev.date.md) + '</b><div class="nx-side"><span class="nx-dow">' + ev.date.dow + '</span>' + (ev.timeText ? '<span class="nx-time">' + esc(ev.timeText) + '</span>' : '') + '</div></div>' +
      headline(ev) +
      '<div class="nx-act">' + apply + cal + '</div>' +
      (apply ? '' : wait('申し込みは準備中です。準備ができ次第、このページから申し込めるようになります。'));
  }

  // 今学期の予定
  function board(M) {
    function row(o) {
      var inner = '<span class="nx-d' + (o.num ? '' : ' nx-tx') + '">' + esc(o.d) + (o.num ? '<small>' + o.dow + '</small>' : '') + '</span>' +
        '<span><span class="nx-n">' + esc(o.name) + '</span>' + (o.sub ? '<br><span class="nx-s">' + esc(o.sub) + '</span>' : '') + '</span>';
      if (o.to) return S.go(o.to, 'nx-row' + (o.done ? ' nx-done' : ''), inner + '<span class="nx-r">' + esc(o.right || '') + U.CHEV + '</span>');
      if (o.next) return '<div class="nx-row nx-next">' + inner + '<span class="nx-r">次回</span></div>';
      return '<div class="nx-row' + (o.done ? ' nx-done' : '') + '">' + inner + '<span class="nx-r"></span></div>';
    }
    var rows = M.events.map(function (e) {
      return {
        kind: e.kind, num: !!e.date, d: e.date ? e.date.md : (e.when || '調整中'), dow: e.date ? e.date.dow : '',
        name: e.name, sub: e.sub, done: e.state === 'done', next: e.state === 'next',
        to: e.state === 'done' ? 'records' : '', right: e.people ? e.people + '人' : ''
      };
    });
    // Studio Hours の行は、ショーケースの前（なければ最後）に入れる
    var st = M.studio, stInfo = [st.time, st.place].filter(Boolean).join(' ・ ');
    if (st.when || stInfo || st.note) {
      var at = rows.map(function (r) { return r.kind; }).indexOf('showcase');
      rows.splice(at < 0 ? rows.length : at, 0, { num: false, d: st.when || '調整中', name: 'Studio Hours', sub: stInfo || st.note, to: 'studio' });
    }
    return '<h2>今学期の予定<small>' + esc(M.term.label) + '</small></h2>' + rows.map(row).join('') +
      (M.term.note ? '<p class="nx-note">' + esc(M.term.note) + '</p>' : '');
  }

  // 次回のくわしい内容（場所・使うもの・持ち物・参加費）
  function facts(M) {
    var ev = M.next;
    if (!ev) return '';
    var cells = [['pin', '場所', ev.place, ev.placeNote], ['tool', '使うもの', ev.tool, ev.toolNote], ['laptop', '持ち物', ev.bring, ev.bringNote], ['ticket', '参加費', ev.fee, ev.feeNote]];
    if (!cells.some(function (c) { return c[2]; })) return '';
    return '<dl class="nx-facts">' + cells.map(function (c) {
      return '<div class="nx-fact"><i class="osc-ic">' + IC[c[0]] + '</i><dt>' + c[1] + '</dt><dd>' + esc(c[2] || '調整中') + (c[3] ? '<small>' + esc(c[3]) + '</small>' : '') + '</dd></div>';
    }).join('') + '</dl>';
  }

  // 作品
  function works(M) {
    if (M.eventWorks.length) {
      // イベントでできた作品があるとき：最初の6つを出す
      return '<div class="osc-sh"><h2>これまでにできた作品<small>' + M.works.length + '件</small></h2>' + S.go('works', 'osc-lnk', 'すべて見る' + U.CHEV) + '</div>' +
        '<div class="nx-strip">' + M.works.slice(0, 6).map(S.card).join('') + '</div>';
    }
    // まだないとき：運営メンバーの作品と、これから並ぶ場所を出す
    var first = M.events.filter(function (e) { return e.kind === 'workshop' && e.state !== 'done'; })[0];
    var used = (M.works.length + M.pending.length) % 6;
    return '<div class="osc-sh"><h2>作品' + (M.works.length ? '<small>運営メンバーの作品から</small>' : '') + '</h2></div>' +
      '<div class="nx-strip">' + M.works.map(S.card).join('') + M.pending.map(S.pendingCard).join('') +
      '<div class="osc-gh nx-wide" style="--nx-span:' + Math.max(2, 6 - used) + '"><p>' + esc(first && first.short ? first.short : 'ワークショップ') + 'の作品はここに並びます。<small>ワークショップでできた作品を、ここに載せていきます。</small></p></div></div>';
  }

  // 活動記録
  function records(M) {
    if (M.records.length) {
      return '<div class="osc-sh"><h2>活動記録<small>' + M.records.length + '件</small></h2>' + S.go('records', 'osc-lnk', 'すべて見る' + U.CHEV) + '</div>' +
        '<div class="nx-recs">' + M.records.slice(0, 3).map(function (r) {
          return S.go('records', 'nx-rec', (r.image ? '<img src="' + esc(r.image) + '" alt="" loading="lazy" style="object-position:' + esc(r.focus) + '">' : '') +
            '<span class="nx-rec-dt">' + (r.date ? '<span>' + r.date.long + '</span>' : '') + '<span>' + esc(r.label) + '</span></span><span class="nx-rec-tt">' + esc(r.title) + '</span>');
        }).join('') + '</div>';
    }
    var first = M.events.filter(function (e) { return e.state !== 'done'; })[0];
    return '<div class="osc-sh"><h2>活動記録</h2></div>' +
      '<div class="nx-recs"><div class="osc-gh"><p>' + esc(first && first.short ? first.short : 'イベント') + 'の記録はここに載ります。<small>当日の様子と、できた作品をまとめます。</small></p></div></div>';
  }

  Site.views.next = function (M, root) {
    var b = board(M), f = facts(M);
    root.innerHTML =
      '<div class="nx-top osc-grain' + (f ? '' : ' nx-nofacts') + '"><div class="nx-wrap">' +
      '<section class="nx-hero"><div>' + hero(M) + '</div><aside class="nx-board" aria-label="今学期の予定">' + b + '</aside></section></div></div>' +
      '<div class="nx-wrap">' + f +
      '<aside class="nx-board nx-m" aria-label="今学期の予定">' + b + '</aside>' +
      '<section class="nx-peek">' + works(M) + '</section>' +
      '<section class="nx-peek">' + records(M) + '</section>' +
      '<footer id="ft"></footer></div>';
    S.mount('next');
    S.cta(M.next);
  };
})();
