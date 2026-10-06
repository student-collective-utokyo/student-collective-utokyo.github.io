/* ページを組み立てる入口。
   index.html はホーム（content.js の home で選んだページ）を、ほかのファイルは自分のページを出します。 */
(function () {
  'use strict';
  var Site = window.Site;
  var TITLES = { next: '次回のイベント', works: '作品', records: '活動記録', studio: 'Studio Hours', members: '運営メンバー', about: 'はじめての方へ' };
  var BASE = 'OpenAI Student Collective at UTokyo｜東京大学 学生運営';

  Site.load(function (M) {
    var page = document.body.getAttribute('data-page');
    var view = page === 'home' ? M.home : page;
    if (!Site.views[view]) view = 'next';
    document.body.setAttribute('data-view', view);
    document.title = (page === 'home' ? '' : Site.t(TITLES[view]) + Site.t('｜')) + Site.t(BASE);
    Site.views[view](M, document.getElementById('app'));
    // アドレスに #do のような場所がついているときは、ページができてからそこへ移動する
    if (location.hash) {
      var id = location.hash.slice(1), touched = false;
      ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { touched = true; }, { once: true, passive: true }); });
      Site.ui.jumpTo(id, false);
      // 文字のフォントを読みこむと高さが少し変わるので、読みこみが終わったらもう一度合わせる（そのあいだに自分で動かした人はそのまま）
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!touched) Site.ui.jumpTo(id, false); });
    }
  });
})();
