// Google Analytics, loaded by every page on lowenth.al (including GDS-Lens,
// which pulls it from /js/analytics.js). Visit any page with ?notrack once to
// opt this browser out, ?notrack=0 to opt back in.
(function () {
  var id = 'G-CH8JDMBF77';
  var params = new URLSearchParams(location.search);
  try {
    if (params.has('notrack')) {
      if (params.get('notrack') === '0') localStorage.removeItem('notrack');
      else localStorage.setItem('notrack', '1');
      params.delete('notrack');
      var qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
    if (localStorage.getItem('notrack')) return;
  } catch (e) {}
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname)) return;

  // Report the path plus campaign tags only. Pages take other query
  // parameters (GDS-Lens's ?src= is a link to someone's layout) that have no
  // business in Google's logs.
  var utm = new URLSearchParams();
  params.forEach(function (value, key) {
    if (key.indexOf('utm_') === 0) utm.append(key, value);
  });
  var tags = utm.toString();

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id, {
    page_location: location.origin + location.pathname + (tags ? '?' + tags : ''),
  });
})();
