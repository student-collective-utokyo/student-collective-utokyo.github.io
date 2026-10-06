/* 「運営メンバー」のページ。東京大学のCampus Leadを紹介します。
   ひとりずつの内容は content.js の members から、文章は membersPage から入ります。「つくったもの」は works から自動で入ります。 */
(function () {
  'use strict';
  var Site = window.Site, U = Site.ui, S = Site.shell, esc = Site.esc;

  var MAIL = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="15" height="11" rx="2"/><path d="M3 6l7 5 7-5"/></svg>';

  // ひとり分のカード。書いてある項目だけを出す
  function card(M, m) {
    var made = M.works.filter(function (w) { return w.maker === m.name; });
    var wait = M.pending.filter(function (p) { return p.maker === m.name; });
    var face = m.image ? '<img class="mb-face" src="' + esc(m.image) + '" alt="">' : U.mono(m.name);
    var mail = m.email ? '<p class="mb-mail"><a class="ab-link" href="mailto:' + esc(m.email) + '">' + MAIL + esc(m.email) + '</a></p>' : '';
    return '<article class="mb-card"><div class="mb-top">' + face + '<div><h2>' + esc(m.name) + (m.kana ? '<small>' + esc(m.kana) + '</small>' : '') + '</h2>' +
      '<p class="mb-role">' + [m.role, m.note].filter(Boolean).map(esc).join(' ・ ') + '</p></div></div>' +
      (m.intro ? '<p class="mb-intro">' + esc(m.intro) + '</p>' : '') +
      (m.like ? '<dl class="mb-like"><dt>お気に入りの使い方</dt><dd>' + esc(m.like) + '</dd></dl>' : '') +
      (made.length || wait.length ? '<h3>つくったもの</h3><div class="mb-works">' + made.map(S.card).join('') +
        wait.map(function () { return '<div class="osc-ghc"><div class="osc-gh sq"><p>準備中</p></div></div>'; }).join('') + '</div>' : '') +
      mail + '</article>';
  }

  Site.views.members = function (M, root) {
    var P = M.membersPage;
    root.innerHTML = '<div class="mb-wrap">' +
      '<section class="mb-hero"><div class="mb-head"><p class="mb-eyebrow">運営メンバー</p>' +
      '<h1 class="mb-h1">東京大学の<br>Campus Lead</h1></div>' + S.badge('mb-badge') +
      '<p class="mb-lead">東京大学での活動は、' + M.members.length + '人のCampus Leadが企画・運営しています。' + esc(P.lead) + '</p></section>' +
      '<section class="mb-cards">' + M.members.map(function (m) { return card(M, m); }).join('') + '</section>' +
      (P.about.length ? '<section class="mb-sec"><h2>Campus Leadとは</h2><div class="mb-text">' + P.about.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
        '<p class="mb-links">' + S.go('about', 'ab-link', 'OpenAI Student Collectiveについて' + U.CHEV) +
        (M.about.officialUrl ? '<a class="ab-link" href="' + esc(M.about.officialUrl) + '" target="_blank" rel="noopener">OpenAIの公式ページ' + S.ARROW + '</a>' : '') + '</p></div></section>' : '') +
      (P.contact ? '<section class="mb-sec"><h2>質問・相談</h2><div class="mb-text"><p>' + esc(P.contact) + '</p>' +
        '<p class="mb-links">' + S.go('next', 'ab-link', '次回のイベントを見る' + U.CHEV) + '</p></div></section>' : '') +
      '<footer id="ft"></footer></div>';
    S.mount('members');
  };
})();
