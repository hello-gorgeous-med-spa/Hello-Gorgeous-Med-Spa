const REQUIRED_SCOPES = [
  'MERCHANT_PROFILE_READ',    // Read merchant info for connection display
  'PAYMENTS_WRITE',           // Process payments via Terminal
  'PAYMENTS_READ',            // Fetch payment details (tips, status)
  'ORDERS_WRITE',             // Create orders for Terminal checkout
  'ORDERS_READ',              // Read order details for reconciliation
  'DEVICES_READ',             // List and manage terminal devices
  'TERMINAL_READ',            // Read terminal checkout status
  'TERMINAL_WRITE',           // Create and manage terminal checkouts
  // ----------------------------------------------------------------
  // EXPLICITLY NOT REQUESTED (PHI compliance + least privilege):
  // - CUSTOMERS_* - we don't send customer data to Square
  // - ITEMS_* - we use generic line items only
  // - INVENTORY_* - not needed for Terminal
  // ----------------------------------------------------------------
].join(' ');
