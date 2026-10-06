/* 「活動記録」のページ。イベントの記録を、新しい順に並べます。
   何が出るかは content.js の内容で決まります（記録がまだなければ、「ここに載ります」の枠と今学期の予定）。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc, t = Site.t, T = Site.T;
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  // いちばん上の題字。右側に、これまでの回数と作品の数を出す
  function plate(M) {
    var done = M.events.filter(function (e) { return e.kind === 'workshop' && e.state === 'done'; }).length;
    var nums = [];
    // 数字のところだけ太く出す（<em> は見た目のためのタグ）
    if (done) nums.push(t('ワークショップ <em>{n}回</em>', { n: done }));
    if (M.records.length) nums.push(t('記録 <em>{n}件</em>', { n: M.records.length }));
    if (M.eventWorks.length) nums.push(t('作品 <em>{n}件</em>', { n: M.works.length }));
    return '<div class="rc-plate"><h1>' + T('活動記録') + '</h1><p class="rc-meta">' + (M.term.label ? '<b>' + esc(M.term.label) + '</b>' : '') +
      (nums.length ? '<br>' + nums.join(t(' ／ ')) : '') + '</p></div>';
  }

  // 次回のイベントのお知らせ（1行）。押すと「次回」のページへ移る
  function notice(M) {
    var ev = M.next;
    if (!ev) return '';
    var when = ev.date ? ev.date.long + (ev.timeText ? ' ' + esc(ev.timeText) : '') : T('日程調整中');
    return S.go('next', 'rc-notice', '<span class="rc-tag">' + T('次回') + '</span><span class="rc-when">' + when + '</span>' +
      '<span class="rc-what"><b>' + esc(ev.name) + '</b>' + esc(ev.title || ev.sub) + '</span>' +
      '<span class="rc-go">' + T('くわしく見る') + ARROW + '</span>', 'aria-label="' + T('次回のイベントをくわしく見る') + '"');
  }

  function stamp(r) {
    return [r.label, r.date ? r.date.long : ''].filter(Boolean).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
  }
  // いちばん新しい記録：写真を大きく出す
  function lead(r) {
    return '<article class="rc-lead">' +
      (r.image ? '<figure><img src="' + esc(r.image) + '" alt="" style="object-position:' + esc(r.focus) + '"></figure>' : '') +
      '<p class="rc-kick">' + stamp(r) + '</p><h2>' + esc(r.title) + '</h2></article>';
  }
  // それより前の記録：1行ずつ
  function item(r) {
    return '<div class="rc-it"><div><p class="rc-dt">' + stamp(r) + '</p><p class="rc-tt">' + esc(r.title) + '</p></div>' +
      (r.image ? '<img src="' + esc(r.image) + '" alt="" loading="lazy" style="object-position:' + esc(r.focus) + '">' : '') + '</div>';
  }

  Site.views.records = function (M, root) {
    var R = M.records, main;
    if (R.length) {
      main = '<div class="rc-main' + (R.length > 1 ? '' : ' rc-solo') + '">' + lead(R[0]) +
        (R.length > 1 ? '<aside class="rc-side" aria-label="' + T('これまでの記録') + '"><h3>' + T('これまでの記録') + '</h3>' + R.slice(1).map(item).join('') + '</aside>' : '') + '</div>';
    } else {
      // まだ記録がないとき
      var first = M.events.filter(function (e) { return e.state !== 'done'; })[0];
      main = '<div class="osc-gh rc-empty"><p>' + T('{x}の記録はここに載ります。', { x: first && first.short ? first.short : t('イベント') }) + '<small>' + T('当日の様子と、できた作品をまとめます。') + '</small></p></div>';
    }
    root.innerHTML = '<div class="rc-wrap">' + plate(M) + notice(M) + main +
      '<section class="rc-term"><div class="osc-sh"><h2>' + T('今学期の予定') + '<small>' + esc(M.term.label) + '</small></h2></div>' + S.plan(M) + '</section>' +
      '<footer id="ft"></footer></div>';
    S.mount('records');
  };
})();
