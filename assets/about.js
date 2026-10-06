/* 「はじめての方へ」のページ。このコミュニティの紹介です。
   文章は content.js の about に書いてあります。回数・日程・運営メンバーは、content.js のほかの項目から自動で入ります。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc, t = Site.t, T = Site.T;

  function svg(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var IC = {
    laptop: svg('<rect x="5" y="5.5" width="14" height="9.5" rx="1.8"/><path d="M3 18.5h18"/>'),
    people: svg('<circle cx="9" cy="9" r="3"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5"/><circle cx="17" cy="10" r="2.3"/><path d="M16.6 14.6c2.1.3 3.5 1.7 4 4.4"/>'),
    screen: svg('<rect x="3.5" y="4.5" width="17" height="11" rx="1.8"/><path d="M12 15.5V20M8.5 20h7"/>'),
    down: svg('<path d="M6 9.5l6 6 6-6"/>')
  };
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  function head(no, title) { return '<div class="ab-hd"><span class="ab-no">' + no + '</span><h2>' + title + '</h2></div>'; }
  function paras(list) { return list.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); }

  Site.views.about = function (M, root) {
    var A = M.about, ev = M.next, st = M.studio;
    var ws = M.events.filter(function (e) { return e.kind === 'workshop'; });
    var nextWs = ws.filter(function (e) { return e.state !== 'done'; })[0];
    var show = M.events.filter(function (e) { return e.kind === 'showcase'; })[0];
    var wsNote = !ws.length ? t('日程調整中です') : nextWs ? (nextWs.date ? t('次回は{d}です', { d: nextWs.date.long }) : t('{x}は日程調整中です', { x: nextWs.short || t('次回') })) : t('今学期の回は終了しました');
    var stNote = [st.time, st.place].filter(Boolean).join(t(' ・ ')) || st.note;
    var open = ev && ev.date && (M.demo || ev.applyUrl);   // 申し込みのボタンは、日付とリンクの両方があるときに出る（「次回」のページと同じ）
    var bring = ev && ev.bring ? ev.bring : t('ノートPC'), bringNote = ev && ev.bring ? ev.bringNote : t('充電器もあると安心です');
    var toNext = S.go('next', 'osc-btn osc-btn-1', T('次回のイベントを見る') + ARROW);

    root.innerHTML = '<div class="ab-page">' +
      '<section class="ab-hero"><p class="ab-eyebrow">' + T('はじめての方へ') + '</p>' +
      '<h1 class="ab-h1">' + U.lines(A.catchLines) + '</h1>' +
      (A.lead ? '<p class="ab-lead">' + esc(A.lead) + '</p>' : '') +
      '<div class="ab-acts">' + toNext + '<a class="osc-btn osc-btn-2" href="#do">' + T('どんなことをするの？') + '</a></div></section>' +

      '<section class="ab-sec ab-c1" id="what">' + head('01', t('OpenAI Student Collectiveとは')) + '<div class="ab-body">' + paras(A.what) +
      (A.stats.length ? '<ul class="ab-stats">' + A.stats.map(function (x) { return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>' : '') +
      (A.quote ? '<figure class="ab-quote"><blockquote>' + esc(A.quote) + '</blockquote><figcaption>' + esc(A.quoteFrom) +
        (A.officialUrl ? t('　') + '<a class="ab-link" href="' + esc(A.officialUrl) + '" target="_blank" rel="noopener">' + T('公式ページを見る') + S.ARROW + '</a>' : '') + '</figcaption></figure>' : '') +
      '</div></section>' +

      '<section class="ab-sec ab-c2" id="why">' + head('02', t('なぜ「つくる」のか')) + '<div class="ab-body">' + paras(A.why) +
      (M.works.length ? '<div class="ab-works">' + M.works.slice(0, 2).map(S.card).join('') + '</div><p class="ab-cap">' + (M.eventWorks.length ? T('これまでにできた作品から') : T('運営メンバーが自分でつくって、使っているもの')) + t('　') + S.go('works', 'ab-link', T('作品を見る') + U.CHEV) + '</p>' : '') +
      '</div></section>' +

      '<section class="ab-sec ab-c3" id="do">' + head('03', t('今学期に<wbr>やること')) + '<div class="ab-body"><div class="ab-acts3">' +
      '<div class="ab-act"><i class="osc-ic">' + IC.laptop + '</i><h3>' + T('ワークショップ') + '</h3><b>' + T('全{n}回', { n: M.term.workshops || ws.length }) + '</b><p>' + esc(A.workshop) + '</p><small>' + esc(wsNote) + '</small></div>' +
      '<div class="ab-act"><i class="osc-ic">' + IC.people + '</i><h3>Studio Hours</h3><b>' + esc(st.when || t('毎週')) + '</b><p>' + esc(A.studio) + '</p>' + (stNote ? '<small>' + esc(stNote) + '</small>' : '') +
      (S.has('studio') ? '<span class="ab-more">' + S.go('studio', 'ab-link', T('くわしく見る') + U.CHEV) + '</span>' : '') + '</div>' +
      (show ? '<div class="ab-act"><i class="osc-ic">' + IC.screen + '</i><h3>' + T('ショーケース') + '</h3><b>' + esc(show.date ? show.date.long : (show.when || t('調整中'))) + '</b><p>' + esc(A.showcase) + '</p>' + (show.sub ? '<small>' + esc(show.sub) + '</small>' : '') + '</div>' : '') +
      '</div></div></section>' +

      '<section class="ab-sec ab-c4" id="who">' + head('04', T('運営メンバー')) +
      '<div class="ab-body"><p>' + T('東京大学での活動は、{n}人のCampus Leadが企画・運営しています。', { n: M.members.length }) + esc(M.membersPage.lead) + '</p><div class="ab-who-row"><div class="ab-who">' +
      M.members.map(function (m) { return '<p>' + U.mono(m.name) + '<span>' + esc(m.name) + '<small>' + esc(m.role) + '</small></span></p>'; }).join('') +
      '</div>' + S.badge('ab-badge') + '</div>' +
      (S.has('members') ? '<p class="ab-cap">' + S.go('members', 'ab-link', T('運営メンバーのページへ') + U.CHEV) + '</p>' : '') + '</div></section>' +

      '<section class="ab-sec ab-c5" id="join">' + head('05', T('参加するには')) + '<div class="ab-body"><ol class="ab-steps">' +
      '<li class="ab-step"><h3>' + T('次回の日程をチェックする') + '</h3><p>' + (ev && ev.date ? T('次回は{d}です。', { d: ev.date.long }) : T('日程は、決まり次第このサイトに載せます。')) + '</p></li>' +
      '<li class="ab-step"><h3>' + T('Lumaで申し込む') + '</h3><p>' + (open ? T('次回のページから申し込めます。') : T('申し込みは準備中です。日程が決まり次第、申し込めるようになります。')) + '</p></li>' +
      '<li class="ab-step"><h3>' + T('{x}を持って、会場へ', { x: bring }) + '</h3><p>' + (bringNote ? esc(bringNote) + ((Site.lang === 'ja' ? /[。！？]$/ : /[。！？.!?]$/).test(bringNote) ? '' : T('。')) : '') + '</p></li></ol>' + S.langNote() +
      (A.faq.length ? '<h3 class="ab-faq-h">' + T('よくある質問') + '</h3><div class="ab-faq">' + A.faq.map(function (f) { return '<details><summary>' + esc(f.q) + IC.down + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div>' : '') +
      '</div></section>' +

      '<section class="ab-final">' + (A.closing ? '<h2>' + esc(A.closing) + '</h2>' : '') + toNext + '</section>' +
      '<footer id="ft"></footer></div>';
    S.mount('about');
  };
})();
