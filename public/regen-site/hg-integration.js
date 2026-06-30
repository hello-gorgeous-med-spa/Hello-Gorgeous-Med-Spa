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

  // Extract cart items from the DOM or prototype state
  function extractCartItems() {
    const items = [];
    
    // Try to get from the prototype's internal state
    // The prototype uses a class component with state.cart
    try {
      // Look for cart items in the drawer
      const cartDrawer = document.querySelector('.rgx-drawer');
      if (cartDrawer) {
        // Find all cart item rows
        const itemRows = cartDrawer.querySelectorAll('[style*="border-bottom"], .cart-item');
        itemRows.forEach((row) => {
          // Try multiple selectors to find product info
          const nameEl = row.querySelector('h4, strong, [style*="font-weight"]');
          const priceEl = row.querySelector('[style*="font-size:14px"], .price');
          const qtyInput = row.querySelector('input[type="number"]');
          
          if (nameEl) {
            const name = nameEl.textContent?.trim() || '';
            const priceText = priceEl?.textContent || '';
            const priceMatch = priceText.match(/\$?([\d,]+(?:\.\d{2})?)/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
            const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            
            if (name && price > 0) {
              items.push({
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: name,
                price: price,
                quantity: qty
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn('[HG] Could not extract cart from DOM:', err);
    }

    // Fallback: try to read from exposed state
    if (items.length === 0 && window.__REGEN_CART__) {
      return window.__REGEN_CART__;
    }

    return items;
  }

  // Wire checkout to go through intake flow
  function wireCheckout() {
    document.addEventListener('click', async (e) => {
      const target = e.target;
      
      // Detect checkout/continue buttons in the cart drawer
      const isCheckoutBtn = (
        target.closest('.rgx-drawer') && 
        (target.tagName === 'BUTTON' || target.closest('button')) &&
        (target.textContent?.toLowerCase().includes('checkout') ||
         target.textContent?.toLowerCase().includes('continue') ||
         target.textContent?.toLowerCase().includes('proceed'))
      );

      // Also detect "Add to cart" → "Buy now" single-item purchase
      const isBuyNowBtn = (
        target.textContent?.toLowerCase().includes('buy now') ||
        target.textContent?.toLowerCase().includes('get started') ||
        target.textContent?.toLowerCase().includes('start intake')
      );

      if (isCheckoutBtn || isBuyNowBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = target.closest('button') || target;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Loading...';

        try {
          const cartItems = extractCartItems();
          
          if (cartItems.length === 0) {
            // No cart items - maybe it's a "Get Started" button for a specific product
            // Check if we can get product info from the current view
            const productCard = target.closest('[data-product-id]') || 
                               document.querySelector('.rgx-hero-in, .product-detail');
            
            if (productCard) {
              const productName = productCard.querySelector('h1, h2, h3')?.textContent?.trim();
              const priceEl = productCard.querySelector('[class*="price"], .price');
              const priceMatch = priceEl?.textContent?.match(/\$?([\d,]+(?:\.\d{2})?)/);
              
              if (productName) {
                cartItems.push({
                  id: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  name: productName,
                  price: priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0,
                  quantity: 1
                });
              }
            }
          }

          if (cartItems.length === 0) {
            alert('Please add items to your cart first.');
            btn.disabled = false;
            btn.textContent = originalText;
            return;
          }

          // Get the intake route for these products
          const routeRes = await fetch(HG_INTAKE_ROUTE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems }),
          });

          const routeData = await routeRes.json();
          
          if (routeData.success && routeData.intakeUrl) {
            // Redirect to intake form (which will handle payment after)
            window.top.location.href = routeData.intakeUrl;
          } else {
            throw new Error(routeData.error || 'Could not determine intake form');
          }
        } catch (err) {
          console.error('[HG] Checkout error:', err);
          alert('Something went wrong. Please try again or call us at 630-636-6193.');
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    }, true);

    console.log('[HG] Checkout wired to intake flow');
  }

  // Wire "Start" / "Begin Intake" buttons on category pages
  function wireStartIntake() {
    document.addEventListener('click', async (e) => {
      const target = e.target;
      
      // Match buttons that indicate starting an intake
      const isStartBtn = (
        target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')
      ) && (
        target.textContent?.toLowerCase().includes('start') ||
        target.textContent?.toLowerCase().includes('begin') ||
        target.textContent?.toLowerCase().includes('get started') ||
        target.textContent?.toLowerCase().includes('take quiz')
      );

      // Check if it's inside a category section
      const categorySection = target.closest('[data-category]');
      if (!isStartBtn || !categorySection) return;

      e.preventDefault();
      e.stopPropagation();

      const categoryId = categorySection.dataset.category;
      if (!categoryId) return;

      try {
        // Get intake route for this category
        const routeRes = await fetch(HG_INTAKE_ROUTE_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productId: categoryId,
            productName: categoryId.replace(/-/g, ' ')
          }),
        });

        const routeData = await routeRes.json();
        
        if (routeData.success && routeData.intakeUrl) {
          window.top.location.href = routeData.intakeUrl;
        }
      } catch (err) {
        console.error('[HG] Start intake error:', err);
      }
    }, true);
  }

  // Monitor cart state for debugging
  function monitorCartState() {
    const observer = new MutationObserver(() => {
      const cartItems = extractCartItems();
      if (cartItems.length > 0) {
        window.__REGEN_CART__ = cartItems;
        console.log('[HG] Cart updated:', cartItems);
      }
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
    wireStartIntake();
    monitorCartState();
    console.log('[HG] RE GEN integration loaded — checkout routes to intake forms');
  });

})();
