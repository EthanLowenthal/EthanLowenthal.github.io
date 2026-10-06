// Google Analytics, loaded by every page on lowenth.al (including GDS-Lens,
// which pulls it from /js/analytics.js). Visit any page with ?notrack once to
// opt this browser out, ?notrack=0 to opt back in.
(function () {
  var id = 'G-CH8JDMBF77';
  var params = new URLSearchParams(location.search);
  // Decided from the URL first, so ?notrack holds for this load even when
  // storage is blocked and the choice cannot be remembered.
  var optOut = null;
  if (params.has('notrack')) {
    optOut = !/^(0|false|off|no)$/i.test(params.get('notrack'));
    params.delete('notrack');
    var qs = params.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
  try {
    if (optOut === true) localStorage.setItem('notrack', '1');
    else if (optOut === false) localStorage.removeItem('notrack');
    else optOut = !!localStorage.getItem('notrack');
  } catch (e) {}
  if (optOut) return showOptedOut();
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname)) return;

  // Report the path plus campaign tags only. Pages take other query
  // parameters (GDS-Lens's ?src= is a link to someone's layout) that have no
  // business in Google's logs, and that includes the referrer, which carries
  // the previous page's full URL when it was one of ours.
  var utm = new URLSearchParams();
  params.forEach(function (value, key) {
    if (key.indexOf('utm_') === 0) utm.append(key, value);
  });
  var tags = utm.toString();
  var referrer = document.referrer.split(/[?#]/)[0];

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id, {
    page_location: location.origin + location.pathname + (tags ? '?' + tags : ''),
    page_referrer: referrer,
  });

  // A faint dot in the bottom-left corner, so an opted-out browser can tell
  // at a glance. Hover it for the reason.
  function showOptedOut() {
    console.info('Analytics off on this browser (?notrack=0 to turn back on)');
    function add() {
      var dot = document.createElement('div');
      dot.title = 'Analytics off on this browser';
      dot.style.cssText = 'position:fixed;left:6px;bottom:6px;width:5px;height:5px;' +
        'border-radius:50%;background:rgba(128,128,128,.45);z-index:2147483647;';
      document.body.appendChild(dot);
    }
    if (document.body) add();
    else document.addEventListener('DOMContentLoaded', add);
  }
})();
