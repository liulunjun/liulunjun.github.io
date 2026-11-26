/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

function setGreedyNavOpen(open) {
  open = !!open && !$btn.hasClass('hidden') && $hlinks.children().length > 0;
  $hlinks.toggleClass('hidden', !open);
  $btn.toggleClass('close', open).attr('aria-expanded', String(open));
  return open;
}

function closeGreedyNav() {
  setGreedyNavOpen(false);
  if (!$btn.hasClass('hidden')) {
    $btn.focus();
  }
}

function updateNav() {
  if (!$nav.length) return;

  var focused = document.activeElement;
  var hadNavFocus = focused && $nav.has(focused).length;
  var wasOpen = !$hlinks.hasClass('hidden');

  // Re-measure all links at the current width (including CSS breakpoints).
  $hlinks.children().appendTo($vlinks);
  var availableSpace = $nav.width();
  if ($vlinks.width() > availableSpace) {
    $btn.removeClass('hidden');
    availableSpace -= $btn.width() + 30;
    while ($vlinks.children().length && $vlinks.width() > availableSpace) {
      $vlinks.children().last().prependTo($hlinks);
    }
  }

  var count = $hlinks.children().length;
  $btn.toggleClass('hidden', !count).attr('count', count);
  setGreedyNavOpen(wasOpen);

  // Moving a link or hiding the button can otherwise drop keyboard focus.
  if (hadNavFocus) {
    if ($(focused).is(':visible')) {
      if (document.activeElement !== focused) focused.focus();
    } else if (count) {
      $btn.focus();
    } else {
      $vlinks.find('a:visible').last().focus();
    }
  }
}

// Window listeners
$(window).resize(updateNav);

$btn.on('click', function () {
  if (setGreedyNavOpen($hlinks.hasClass('hidden'))) {
    // The button precedes the visible links in the DOM; enter the opened list.
    $hlinks.find('a:visible').first().focus();
  } else {
    closeGreedyNav();
  }
});

$nav.on('keydown', function (event) {
  if ((event.key === 'Escape' || event.which === 27) && !$hlinks.hasClass('hidden')) {
    event.preventDefault();
    event.stopPropagation();
    closeGreedyNav();
  }
});

$nav.on('click', '.hidden-links a', function () {
  // Do not prevent the native fragment navigation or external link action.
  closeGreedyNav();
});

updateNav();
