// Copyright (c) 2019-2026 Five Squared Interactive
// SPDX-License-Identifier: MIT

// The return page of a sign-in (src/scene/planet/signIn.ts): the issuer sends
// the visitor here with a code and the state. Opened as a popup, it hands both
// to the tab that opened it, on this page's own origin only, then closes. A
// sign-in made in place (the world's page went to the issuer itself) left the
// page to come back to in this tab's session: this keeps what came back for
// that page and goes back to it, again only on this origin. The code is worth
// nothing without the verifier that tab kept.
(function () {
  var q = new URLSearchParams(window.location.search);
  var message = { type: 'sign-in:return', code: q.get('code'), state: q.get('state'), error: q.get('error') };
  if (window.opener) {
    window.opener.postMessage(message, window.location.origin);
    window.close();
    return;
  }
  var session = null;
  try {
    session = window.sessionStorage;
  } catch (e) {
    session = null;
  }
  var back = session ? session.getItem('webverse:sign-in-return-to') : null;
  var sameOrigin = false;
  try {
    sameOrigin = !!back && new URL(back, window.location.origin).origin === window.location.origin;
  } catch (e) {
    sameOrigin = false;
  }
  if (session && back && sameOrigin) {
    session.removeItem('webverse:sign-in-return-to');
    session.setItem('webverse:sign-in-returned', JSON.stringify(message));
    window.location.replace(back);
    return;
  }
  document.body.textContent = 'This sign-in was not opened from WebVerse. You can close this window.';
})();
