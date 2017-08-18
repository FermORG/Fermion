$(document).ready(function() {
  var $submenu, $gotop, submenuOffset, gotopOffset;
  var data = [];
  var loadingTimeout = 0;


  /**
   * PJAX configuration
   */

  $(document).pjax('a[data-pjax]', '#page-content', {
    fragment: '#page-content',
    timeout: 1200
  });

  $(document).on('pjax:click', function () {
    togglePjaxLoading(true);
    toggleResponsiveMenu(false);
  });

  $(document).on('pjax:beforeReplace', function () {
    togglePjaxLoading(false);
  });

  $(document).on('pjax:end', function () {
    sidebarToggle();
    initialize();
  });

  /**
   * Initialize page
   */

  initialize();

  $.getJSON('https://api.github.com/repos/reactide/reactide', function(data) {
    $(".social .stat").text(data.stargazers_count);
  });


  $(document).on('click', '.go-top', function(ev) {
    scrollToId('#top');
    return false;
  });

  $(document).on('click', '.menu-trigger', function(ev) {
    toggleResponsiveMenu();
    return false;
  });

  $(document).on('focus', '[placeholder]', function () {
    var $input = $(this);
    if ($input.val() == $input.attr('placeholder')) {
      $input.val('').removeClass("placeholder");
    }
  });


  /**
   * Contextual helpers
   * Depends on globally context variable values
   */

  function toggleFixedNavigation(ev) {
    $submenu.toggleClass('fixed', submenuOffset && submenuOffset.top < $(window).scrollTop());
    $gotop.toggleClass('fixed', gotopOffset && gotopOffset.top < $(window).scrollTop());
  }

  function initialize() {
    // reset containers
    $submenu = $('.sub-menu nav');
    $gotop = $('.go-top');
    submenuOffset = $submenu.offset();
    gotopOffset = $gotop.offset();
  }

  function sidebarToggle() {
    var $menu = $('#menu');
    var pathname = window.location.pathname;
    var base = '/' + pathname.split('/')[1];

    // reset active menu
    $menu.find('li.active').removeClass('active');

    // set current active menu
    $menu.find('a[href="' + base + '"]').parent('li').addClass('active');
  }

  function toggleResponsiveMenu(open) {
    $("html").toggleClass("is-menu", open);
    $(".content, .top-site").toggleClass('blured', open);
    $('.menu-trigger').toggleClass("is-active", open).next().toggleClass("is-active", open);
  }

  function togglePjaxLoading(toggle) {
    // do not add pjax-loading flag twice
    // wait for it to resolve or be canceled
    if (toggle && loadingTimeout) {
      return;
    }

    // cancel timer if toggle false
    // and remove pjax-loading flag
    if (!toggle) {
      clearTimeout(loadingTimeout);
      $('body').toggleClass('pjax-loading', false);
      return;
    }

    // save timeout timer and await to add
    // pjax-loading flag
    loadingTimeout = setTimeout(function () {
      $('body').toggleClass('pjax-loading', true);
    }, 300);
  }

  function scrollToId(id) {
    var scroll = $(id).offset().top - 30;
    $('html, body').animate({ scrollTop: scroll }, 500);
  }

});