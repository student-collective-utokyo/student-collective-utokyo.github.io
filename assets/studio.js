/* 「Studio Hours」のページ。毎週の共同作業の時間の紹介です。
   曜日・時間・場所は content.js の studio から、文章は studioPage と about の studio から入ります。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc;

  function svg(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; }
  var IC = [
    svg('<rect x="5" y="5.5" width="14" height="9.5" rx="1.8"/><path d="M3 18.5h18"/>'),
    svg('<path d="M5 6.5h9a2 2 0 0 1 2 2V19H7a2 2 0 0 1-2-2z"/><path d="M16 9h1.5A1.5 1.5 0 0 1 19 10.5V19h-3M8.5 10.5h4M8.5 14h4"/>'),
    svg('<path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v8a1.5 1.5 0 0 1-1.5 1.5H11l-4 3.5V16h-.5A1.5 1.5 0 0 1 5 14.5z"/><path d="M12 8.6v3M12 13.7v.1"/>')
  ];
  var DOWN = svg('<path d="M6 9.5l6 6 6-6"/>');
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';

  // 右上の「いつ・どこで」のカード
  function whenCard(st) {
    var info = [st.time, st.place].filter(Boolean);
    return '<aside class="st-when" aria-label="いつ・どこで"><div class="st-when-in"><p class="st-when-lbl">いつ・どこで</p>' +
      '<p class="st-when-big">' + esc(st.when || '毎週') + '</p>' +
      (info.length ? info.map(function (t) { return '<p class="st-when-ln">' + esc(t) + '</p>'; }).join('')
        : (st.note ? '<p class="st-when-note">' + esc(st.note) + '</p>' : '')) + '</div></aside>';
  }

  Site.views.studio = function (M, root) {
    var P = M.studioPage, st = M.studio;
    var made = M.works.filter(function (w) { return w.from === 'studio'; });
    var lines = P.catchLines.length ? P.catchLines : ['Studio Hours'];
    root.innerHTML = '<div class="st-wrap">' +
      '<section class="st-hero"><div class="st-hero-l"><p class="st-eyebrow">Studio Hours</p>' +
      '<h1 class="st-h1">' + lines.map(function (l) { return '<span>' + esc(l) + '</span>'; }).join('') + '</h1>' +
      (M.about.studio ? '<p class="st-lead">' + esc(M.about.studio) + '</p>' : '') +
      '<div class="st-acts">' + S.go('next', 'osc-btn osc-btn-1', '次回のイベントを見る' + ARROW) + (P.steps.length ? '<a class="osc-btn osc-btn-2" href="#flow">どんな時間？</a>' : '') + '</div></div>' +
      whenCard(st) + '</section>' +

      (P.steps.length ? '<section class="st-sec" id="flow"><h2>1回の流れ</h2><ol class="ab-steps st-steps">' +
        P.steps.map(function (x) { return '<li class="ab-step"><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></li>'; }).join('') + '</ol></section>' : '') +

      (P.bring.length ? '<section class="st-sec"><h2>持ってくるもの</h2><ul class="st-bring">' +
        P.bring.map(function (x, i) { return '<li><i class="osc-ic">' + IC[i % IC.length] + '</i><div><b>' + esc(x[0]) + '</b><p>' + esc(x[1]) + '</p></div></li>'; }).join('') + '</ul></section>' : '') +

      '<section class="st-sec"><div class="osc-sh"><h2>Studio&nbsp;Hoursで<wbr>できた作品' + (made.length ? '<small>' + made.length + '件</small>' : '') + '</h2>' + S.go('works', 'osc-lnk', '作品を見る' + U.CHEV) + '</div>' +
      (made.length ? '<div class="st-made">' + made.slice(0, 6).map(S.card).join('') + '</div>'
        : '<div class="osc-gh st-empty"><p>Studio Hoursでできた作品は、ここに並びます。</p></div>') + '</section>' +

      (P.faq.length ? '<section class="st-sec"><h2>よくある質問</h2><div class="ab-faq">' +
        P.faq.map(function (f) { return '<details><summary>' + esc(f.q) + DOWN + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div></section>' : '') +

      '<footer id="ft"></footer></div>';
    S.mount('studio');
  };
})();
