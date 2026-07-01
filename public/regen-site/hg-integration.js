/**
 * Hello Gorgeous RE GEN Integration
 * Wires the Claude prototype to real backend systems:
 * - Login → /portal/login (magic link auth)
 * - Cart checkout → Intake form → Payment → RX Command Center
 */

(function() {
  'use strict';

  const HG_LOGIN_URL = '/portal/login?redirect=/rx';
  const HG_INTAKE_ROUTE_API = '/api/regen/intake-route';
  const HG_CHECKOUT_API = '/api/regen/checkout';

  // Wait for the prototype to fully load
  function waitForApp(callback) {
    const check = setInterval(() => {
      const loginBtn = document.querySelector('.rgx-login');
      if (loginBtn) {
        clearInterval(check);
        callback();
      }
    }, 100);
    setTimeout(() => clearInterval(check), 10000);
  }

  // Override the login button to go to our portal
  function wireLogin() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.rgx-login');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        window.top.location.href = HG_LOGIN_URL;
      }
    }, true);
    console.log('[HG] Login wired to', HG_LOGIN_URL);
  }

  // Initialize - only login wiring needed now, prototype handles everything else
  waitForApp(() => {
    wireLogin();
    console.log('[HG] RE GEN integration loaded — login wired, checkout handled by prototype');
  });

})();
