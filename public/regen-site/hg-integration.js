/**
 * Hello Gorgeous RE GEN Integration
 * Wires the Claude prototype to real backend systems:
 * - Login → /portal/login (magic link auth)
 * - Cart checkout → /api/regen/checkout (Square)
 */

(function() {
  'use strict';

  const HG_LOGIN_URL = '/portal/login?redirect=/rx';
  const HG_CHECKOUT_API = '/api/regen/checkout';
  const HG_SUCCESS_URL = '/rx/checkout/success';

  // Wait for the prototype to fully load
  function waitForApp(callback) {
    const check = setInterval(() => {
      // Look for the login button or cart elements
      const loginBtn = document.querySelector('.rgx-login');
      if (loginBtn) {
        clearInterval(check);
        callback();
      }
    }, 100);
    // Timeout after 10s
    setTimeout(() => clearInterval(check), 10000);
  }

  // Override the login button to go to our portal
  function wireLogin() {
    // Find login buttons and override their click behavior
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

  // Intercept checkout and send to Square
  function wireCheckout() {
    // Override the checkout function if it exists on the page's app instance
    // The prototype stores cart in component state, we need to intercept the checkout action
    
    // Listen for clicks on checkout-related buttons
    document.addEventListener('click', async (e) => {
      const target = e.target;
      
      // Look for checkout/pay buttons in the cart drawer
      if (target.matches('.rgx-drawer button') && 
          (target.textContent.includes('Checkout') || 
           target.textContent.includes('Pay') ||
           target.textContent.includes('Continue'))) {
        
        e.preventDefault();
        e.stopPropagation();
        
        // Try to get cart data from the page
        const cartItems = extractCartItems();
        if (cartItems.length === 0) {
          alert('Your cart is empty');
          return;
        }

        target.disabled = true;
        target.textContent = 'Processing...';

        try {
          const response = await fetch(HG_CHECKOUT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems }),
          });

          const data = await response.json();
          
          if (data.success && data.checkoutUrl) {
            // Redirect to Square checkout
            window.top.location.href = data.checkoutUrl;
          } else {
            throw new Error(data.error || 'Checkout failed');
          }
        } catch (err) {
          console.error('[HG] Checkout error:', err);
          alert('Checkout failed: ' + err.message);
          target.disabled = false;
          target.textContent = 'Checkout';
        }
      }
    }, true);

    console.log('[HG] Checkout wired to', HG_CHECKOUT_API);
  }

  // Extract cart items from the DOM
  function extractCartItems() {
    const items = [];
    
    // Look for cart item elements in the drawer
    const cartItemEls = document.querySelectorAll('.rgx-drawer .rgx-cart-item, .rgx-drawer [style*="border-bottom"]');
    
    cartItemEls.forEach((el) => {
      // Try to extract product info from the element
      const nameEl = el.querySelector('h4, strong, .item-name');
      const priceEl = el.querySelector('[class*="price"], .item-price');
      const qtyEl = el.querySelector('input[type="number"], .qty, .quantity');
      
      if (nameEl) {
        const name = nameEl.textContent.trim();
        const priceText = priceEl?.textContent || '$0';
        const priceMatch = priceText.match(/\$?([\d,]+(?:\.\d{2})?)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
        const qty = qtyEl?.value ? parseInt(qtyEl.value, 10) : 1;
        
        if (name && price > 0) {
          items.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            priceUsd: price,
            quantity: qty,
            category: 'rx',
            rx: true
          });
        }
      }
    });

    // Fallback: try to read from any exposed state
    if (items.length === 0 && window.__REGEN_CART__) {
      return window.__REGEN_CART__;
    }

    return items;
  }

  // Make cart accessible to the integration
  function exposeCartState() {
    // Create a mutation observer to watch for cart updates
    const observer = new MutationObserver(() => {
      const cartItems = extractCartItems();
      window.__REGEN_CART__ = cartItems;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize
  waitForApp(() => {
    wireLogin();
    wireCheckout();
    exposeCartState();
    console.log('[HG] RE GEN integration loaded');
  });

})();
