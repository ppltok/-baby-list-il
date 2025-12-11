/**
 * Content Script - Runs on the product page and tests the Babylist API
 *
 * This script:
 * 1. Gets the current page URL
 * 2. Calls Babylist's scraper directives API
 * 3. Displays the results in the browser console and as an alert
 */

(async function() {
  console.log('🚀 Babylist API Tester - Starting...');

  try {
    // STEP 1: Get the current page URL
    const currentPageUrl = window.location.href;
    console.log('📍 Current Page URL:', currentPageUrl);

    // STEP 2: Call the Babylist API to get scraping directives
    console.log('📡 Calling Babylist API...');
    const directives = await fetchBabylistDirectives(currentPageUrl);

    // STEP 3: Display results
    console.log('✅ SUCCESS! Directives received from Babylist API');
    console.log('📦 Full Response:', directives);

    // Log directives in a more readable format
    console.log('📋 DIRECTIVES BREAKDOWN:');
    console.log('========================');
    directives.directives.forEach((directive, index) => {
      console.log(`\nDirective ${index + 1}:`, directive);
    });
    console.log('========================\n');

    // Also log as pretty JSON string
    console.log('📄 Full Response as JSON:');
    console.log(JSON.stringify(directives, null, 2));

    // Analyze what the directives will extract
    const analysis = analyzeDirectives(directives);
    console.log('📊 Directive Analysis:', analysis);

    // EXTRACT ACTUAL PRODUCT DATA from the page
    const productData = extractJsonLdData();

    if (productData) {
      // Extract all data with proper fallbacks
      const name = productData.name || 'N/A';
      const price = productData.offers?.price || productData.offers?.lowPrice || 'N/A';
      const currency = productData.offers?.priceCurrency || '';
      const availability = productData.offers?.availability || 'N/A';
      const brand = productData.brand?.name || productData.brand || 'N/A';
      const sku = productData.sku || 'N/A';
      const category = productData.category || 'N/A';

      // Handle image - could be string or array
      let image = 'N/A';
      if (Array.isArray(productData.image)) {
        image = productData.image[0];
      } else if (typeof productData.image === 'string') {
        image = productData.image;
      }

      console.log('🎁 ACTUAL PRODUCT DATA EXTRACTED FROM PAGE:');
      console.log('==========================================');
      console.log('Product Name:', name);
      console.log('Price:', price, currency);
      console.log('Availability:', availability);
      console.log('Brand:', brand);
      console.log('SKU:', sku);
      console.log('Category:', category);
      console.log('Image URL:', image);
      console.log('Full product data:', productData);
      console.log('==========================================\n');

      // Show a user-friendly alert with ACTUAL DATA
      alert(
        '✅ Product Data Extracted!\n\n' +
        `Product: ${name}\n` +
        `Price: ${currency} ${price}\n` +
        `Brand: ${brand}\n` +
        `SKU: ${sku}\n` +
        `Category: ${category}\n` +
        `Availability: ${availability}\n` +
        `Image: ${image}\n\n` +
        '--- Babylist API Info ---\n' +
        `Platform: ${analysis.platform}\n` +
        `Fields API can extract: ${analysis.fields.join(', ')}\n\n` +
        'Check console (F12) for full details!'
      );
    } else {
      // Show directive info if no product data found
      alert(
        '✅ Babylist API Test Successful!\n\n' +
        `Platform: ${analysis.platform}\n` +
        `Fields to extract: ${analysis.fields.join(', ')}\n` +
        `Directive chains: ${analysis.chainCount}\n\n` +
        `Has JSON-LD: ${analysis.hasJsonLd}\n` +
        `Has Shopify: ${analysis.hasShopify}\n` +
        `Has Fallback: ${analysis.hasFallback}\n\n` +
        'Check the browser console (F12) for full directive details!'
      );
    }

  } catch (error) {
    // If something goes wrong, log the error
    console.error('❌ Error testing Babylist API:', error);
    alert(`❌ Error: ${error.message}\n\nCheck console (F12) for details.`);
  }
})();

/**
 * Fetch scraping directives from Babylist API via background script
 *
 * @param {string} productUrl - The URL of the product page
 * @returns {Promise<Object>} - The API response containing directives
 */
async function fetchBabylistDirectives(productUrl) {
  console.log('🔗 Requesting API fetch from background script');

  // Send a message to the background script to make the API call
  // This bypasses CORS restrictions since background scripts have host_permissions
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'fetchBabylistAPI', url: productUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      }
    );
  });
}

/**
 * Analyze the directives to understand what will be scraped
 *
 * @param {Object} response - The API response
 * @returns {Object} - Analysis summary
 */
function analyzeDirectives(response) {
  // Convert directives to string for searching
  const jsonString = JSON.stringify(response.directives || {});

  // Detect platform
  let platform = 'Generic';
  if (jsonString.includes('ShopifyAnalytics')) {
    platform = 'Shopify';
  } else if (jsonString.includes('JsonLdProduct')) {
    platform = 'JSON-LD Compatible';
  }

  // Detect which fields will be extracted
  const fields = [];
  if (jsonString.includes('"title"')) fields.push('title');
  if (jsonString.includes('"price"')) fields.push('price');
  if (jsonString.includes('image_urls')) fields.push('images');
  if (jsonString.includes('"brand"')) fields.push('brand');
  if (jsonString.includes('"sku"')) fields.push('sku');
  if (jsonString.includes('"category"')) fields.push('category');
  if (jsonString.includes('"availability"')) fields.push('availability');

  // Count directive chains
  const chainCount = Array.isArray(response.directives) ? response.directives.length : 0;

  return {
    platform,
    fields,
    chainCount,
    hasJsonLd: jsonString.includes('JsonLdProduct'),
    hasShopify: jsonString.includes('ShopifyAnalytics'),
    hasFallback: jsonString.includes('fallback')
  };
}

/**
 * Extract product data from the page using multiple methods
 */
function extractJsonLdData() {
  console.log('🔍 Searching for product data on page...');

  // METHOD 1: Look for all JSON-LD script tags
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');

  console.log(`Found ${jsonLdScripts.length} JSON-LD script(s)`);

  for (let i = 0; i < jsonLdScripts.length; i++) {
    try {
      const data = JSON.parse(jsonLdScripts[i].textContent);
      console.log(`JSON-LD ${i + 1}:`, data);

      // Check if it's a Product or ProductGroup
      let productData = null;

      // List of non-product types to skip
      const nonProductTypes = ['WebSite', 'Organization', 'BreadcrumbList', 'WebPage', 'SearchAction'];

      // Check if it's a product-like object (has name and offers, and isn't a known non-product type)
      const isProductLike = data.name && data.offers && !nonProductTypes.includes(data['@type']);

      if (data['@type'] === 'Product' || (isProductLike && data['@type'] !== 'ProductGroup')) {
        console.log('Found Product, extracting data...');

        // Extract image URLs (handle both string and array)
        const imageUrls = [];
        if (data.image) {
          if (Array.isArray(data.image)) {
            imageUrls.push(...data.image);
          } else {
            imageUrls.push(data.image);
          }
        }
        const uniqueImageUrls = [...new Set(imageUrls)];

        // Extract price with multiple fallbacks
        let price = 'N/A';
        let priceCurrency = 'N/A';

        if (data.offers) {
          // Handle array of offers
          const offer = Array.isArray(data.offers) ? data.offers[0] : data.offers;
          price = offer?.price || offer?.lowPrice || offer?.highPrice || 'N/A';
          priceCurrency = offer?.priceCurrency || 'N/A';
        }

        // Create simplified product data
        const simplifiedProduct = {
          name: data.name || 'N/A',
          category: data.category || 'N/A',
          price: price,
          priceCurrency: priceCurrency,
          brand: data.brand?.name || data.brand || 'N/A',
          imageUrls: uniqueImageUrls
        };

        console.log('========== SIMPLIFIED PRODUCT DATA ==========');
        console.log(JSON.stringify(simplifiedProduct, null, 2));
        console.log('========== END SIMPLIFIED DATA ==========\n');

        // *** ENHANCED MODAL UI (Phase 1) ***
        // Prepare modal state
        modalState.images = uniqueImageUrls.length > 0 ? uniqueImageUrls : [];
        modalState.currentImageIndex = 0;
        modalState.formData = {
          title: simplifiedProduct.name || '',
          price: simplifiedProduct.price || '',
          quantity: 1,
          category: simplifiedProduct.category || 'General',
          notes: '',
          brand: simplifiedProduct.brand || '',
          description: ''
        };
        modalState.scrapingMetadata = {
          method: 'json_ld_product',
          source_url: window.location.href,
          scraped_at: new Date().toISOString()
        };

        // Create enhanced modal with all data
        const { backdrop, modal, images } = createModalUI({
          name: simplifiedProduct.name,
          price: simplifiedProduct.price,
          priceCurrency: simplifiedProduct.priceCurrency,
          brand: simplifiedProduct.brand
        }, modalState.images);

        // Setup image carousel navigation
        setupImageCarousel(modal, images, modalState);

        // Setup all event handlers
        setupEventHandlers(modal, backdrop, modalState);

        productData = data;
      } else if (data['@type'] === 'ProductGroup') {
        // ProductGroup contains product variants
        console.log('Found ProductGroup, extracting data...');

        // Get the first variant offer or default offer
        const offers = data.hasVariant || data.offers;

        // Prefer in-stock variants over out-of-stock ones
        let firstOffer;
        if (Array.isArray(offers)) {
          // Find first in-stock variant
          const inStockOffer = offers.find(offer =>
            offer?.offers?.availability?.includes('InStock')
          );
          // Use in-stock if available, otherwise use first variant
          firstOffer = inStockOffer || offers[0];
        } else {
          firstOffer = offers;
        }

        // Collect all unique image URLs from all variants
        const imageUrls = [];
        if (Array.isArray(data.hasVariant)) {
          data.hasVariant.forEach(variant => {
            if (variant.image) {
              // Handle both string and array images
              if (Array.isArray(variant.image)) {
                imageUrls.push(...variant.image);
              } else {
                imageUrls.push(variant.image);
              }
            }
          });
        }
        // Remove duplicates
        const uniqueImageUrls = [...new Set(imageUrls)];

        // Extract offers data from first variant for price
        const variantOffers = firstOffer?.offers;

        // Create simplified product data with only requested fields
        const simplifiedProduct = {
          name: data.name || 'N/A',
          category: data.category || 'N/A',
          price: variantOffers?.price || 'N/A',
          priceCurrency: variantOffers?.priceCurrency || 'N/A',
          brand: data.brand?.name || data.brand || 'N/A',
          imageUrls: uniqueImageUrls
        };

        console.log('========== SIMPLIFIED PRODUCT DATA ==========');
        console.log(JSON.stringify(simplifiedProduct, null, 2));
        console.log('========== END SIMPLIFIED DATA ==========\n');

        // Create debug data object (keep for reference)
        const debugData = {
          fullProductGroup: data,
          offers: offers,
          firstOffer: firstOffer
        };

        // *** ENHANCED MODAL UI (Phase 1) ***
        // Prepare modal state
        modalState.images = uniqueImageUrls.length > 0 ? uniqueImageUrls : [];
        modalState.currentImageIndex = 0;
        modalState.formData = {
          title: simplifiedProduct.name || '',
          price: simplifiedProduct.price || '',
          quantity: 1,
          category: simplifiedProduct.category || 'General',
          notes: '',
          brand: simplifiedProduct.brand || '',
          description: ''
        };
        modalState.scrapingMetadata = {
          method: 'json_ld_product_group',
          source_url: window.location.href,
          scraped_at: new Date().toISOString()
        };

        // Create enhanced modal with all data
        const { backdrop, modal, images } = createModalUI({
          name: simplifiedProduct.name,
          price: simplifiedProduct.price,
          priceCurrency: simplifiedProduct.priceCurrency,
          brand: simplifiedProduct.brand
        }, modalState.images);

        // Setup image carousel navigation
        setupImageCarousel(modal, images, modalState);

        // Setup all event handlers
        setupEventHandlers(modal, backdrop, modalState);

        // Extract image from first variant
        let image = firstOffer?.image || data.image;
        if (Array.isArray(image)) {
          image = image[0];
        }

        productData = {
          '@type': 'Product',
          name: data.name,
          brand: data.brand,
          category: data.category,
          description: data.description,
          image: image,
          sku: firstOffer?.sku,
          url: data.url,
          productGroupID: data.productGroupID,
          offers: {
            price: variantOffers?.price,
            priceCurrency: variantOffers?.priceCurrency,
            availability: variantOffers?.availability,
            url: variantOffers?.url
          },
          // Include all variants for reference
          variants: data.hasVariant
        };

        console.log('========== EXTRACTED PRODUCT DATA ==========');
        console.log(JSON.stringify(productData, null, 2));
        console.log('========== END EXTRACTED DATA ==========\n');
      } else if (data['@graph']) {
        // Check if product is in @graph array
        const foundProduct = data['@graph'].find(item =>
          item['@type'] === 'Product' || item['@type'] === 'ProductGroup'
        );

        if (foundProduct) {
          console.log('Found Product in @graph, extracting data...');

          // Extract image URLs (handle both string and array)
          const imageUrls = [];
          if (foundProduct.image) {
            if (Array.isArray(foundProduct.image)) {
              imageUrls.push(...foundProduct.image);
            } else {
              imageUrls.push(foundProduct.image);
            }
          }
          const uniqueImageUrls = [...new Set(imageUrls)];

          // Handle both Product and ProductGroup in @graph
          let price = 'N/A';
          let priceCurrency = 'N/A';

          if (foundProduct['@type'] === 'ProductGroup') {
            const offers = foundProduct.hasVariant || foundProduct.offers;
            const firstOffer = Array.isArray(offers) ? offers[0] : offers;
            price = firstOffer?.offers?.price || firstOffer?.price || 'N/A';
            priceCurrency = firstOffer?.offers?.priceCurrency || firstOffer?.priceCurrency || 'N/A';
          } else {
            price = foundProduct.offers?.price || 'N/A';
            priceCurrency = foundProduct.offers?.priceCurrency || 'N/A';
          }

          // Create simplified product data
          const simplifiedProduct = {
            name: foundProduct.name || 'N/A',
            category: foundProduct.category || 'N/A',
            price: price,
            priceCurrency: priceCurrency,
            brand: foundProduct.brand?.name || foundProduct.brand || 'N/A',
            imageUrls: uniqueImageUrls
          };

          console.log('========== SIMPLIFIED PRODUCT DATA (@graph) ==========');
          console.log(JSON.stringify(simplifiedProduct, null, 2));
          console.log('========== END SIMPLIFIED DATA ==========\n');

          // *** ENHANCED MODAL UI (Phase 1) ***
          // Prepare modal state
          modalState.images = uniqueImageUrls.length > 0 ? uniqueImageUrls : [];
          modalState.currentImageIndex = 0;
          modalState.formData = {
            title: simplifiedProduct.name || '',
            price: simplifiedProduct.price || '',
            quantity: 1,
            category: simplifiedProduct.category || 'General',
            notes: '',
            brand: simplifiedProduct.brand || '',
            description: ''
          };
          modalState.scrapingMetadata = {
            method: 'json_ld_graph',
            source_url: window.location.href,
            scraped_at: new Date().toISOString()
          };

          // Create enhanced modal with all data
          const { backdrop, modal, images } = createModalUI({
            name: simplifiedProduct.name,
            price: simplifiedProduct.price,
            priceCurrency: simplifiedProduct.priceCurrency,
            brand: simplifiedProduct.brand
          }, modalState.images);

          // Setup image carousel navigation
          setupImageCarousel(modal, images, modalState);

          // Setup all event handlers
          setupEventHandlers(modal, backdrop, modalState);

          // Set productData for return
          productData = foundProduct;
        }
      }

      if (productData) {
        console.log('✅ Found Product data in JSON-LD:', productData);
        return productData;
      }
    } catch (error) {
      console.warn(`⚠️ Failed to parse JSON-LD ${i + 1}:`, error);
    }
  }

  // METHOD 2: Try Shopify's meta tags
  console.log('🔍 Trying Shopify meta tags...');
  const productMeta = {
    name: document.querySelector('meta[property="og:title"]')?.content,
    price: document.querySelector('meta[property="product:price:amount"]')?.content,
    priceCurrency: document.querySelector('meta[property="product:price:currency"]')?.content,
    image: document.querySelector('meta[property="og:image"]')?.content,
    availability: document.querySelector('meta[property="product:availability"]')?.content
  };

  if (productMeta.name) {
    console.log('✅ Found product data in meta tags!');
    return {
      '@type': 'Product',
      name: productMeta.name,
      offers: {
        price: productMeta.price,
        priceCurrency: productMeta.priceCurrency,
        availability: productMeta.availability
      },
      image: productMeta.image
    };
  }

  // METHOD 3: Try ShopifyAnalytics (if available)
  console.log('🔍 Trying ShopifyAnalytics...');
  if (window.ShopifyAnalytics?.meta?.product) {
    const shopifyProduct = window.ShopifyAnalytics.meta.product;
    console.log('✅ Found ShopifyAnalytics data!');
    return {
      '@type': 'Product',
      name: shopifyProduct.name,
      offers: {
        price: shopifyProduct.price,
        priceCurrency: window.ShopifyAnalytics.meta.currency
      },
      sku: shopifyProduct.sku,
      brand: { name: shopifyProduct.vendor }
    };
  }

  console.log('❌ No product data found on page');
  return null;
}

/**
 * ENHANCED MODAL UI - Phase 1 Implementation
 * =========================================
 */

/**
 * Global state management for modal
 */
const modalState = {
  images: [],
  currentImageIndex: 0,
  formData: {
    title: '',
    price: '',
    quantity: 1,
    category: 'General',
    notes: '',
    brand: '',
    description: ''
  },
  scrapingMetadata: {}
};

/**
 * Create enhanced modal UI with image carousel and editable form
 * @param {Object} productData - Product data extracted from page
 * @param {Array} images - Array of image URLs
 * @returns {Object} - { backdrop, modal, images }
 */
function createModalUI(productData, images = []) {
  // Ensure we have at least one image (use placeholder if needed)
  const imageList = images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'];

  // Format price with currency
  const formattedPrice = productData.priceCurrency && productData.price
    ? `${productData.priceCurrency} ${productData.price}`
    : productData.price || '';

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'product-scraper-backdrop';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.6); z-index: 2147483646;
    display: flex; align-items: center; justify-content: center;
  `;

  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'product-scraper-modal';
  modal.style.cssText = `
    background: white; border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    max-width: 900px; width: 90vw; max-height: 90vh;
    overflow-y: auto; z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    direction: rtl;
  `;

  modal.innerHTML = `
    <!-- Header -->
    <div style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="margin: 0; font-size: 20px; color: #111827;">הוספה לרשימה</h2>
      <button id="close-modal" style="border: none; background: none; font-size: 28px; cursor: pointer; color: #6b7280; line-height: 1;">&times;</button>
    </div>

    <!-- Error Banner (hidden by default) -->
    <div id="error-banner" style="display: none; background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; margin: 16px; border-radius: 6px; color: #92400e;"></div>

    <!-- Main Content: Two-column layout -->
    <div style="display: grid; grid-template-columns: 400px 1fr; gap: 24px; padding: 24px;">

      <!-- Right Column: Image Gallery (RTL - appears on right) -->
      <div>
        <div id="image-gallery" style="position: relative; width: 400px; height: 400px; background: #f3f4f6; border-radius: 8px; overflow: hidden;">
          <img id="current-image" src="${imageList[0]}" style="width: 100%; height: 100%; object-fit: contain;" alt="Product" />
          ${imageList.length > 1 ? `
            <button class="nav-btn next-btn" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">&gt;</button>
            <button class="nav-btn prev-btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">&lt;</button>
          ` : ''}
        </div>
        ${imageList.length > 1 ? `
          <div id="image-pagination" style="display: flex; gap: 8px; justify-content: center; margin-top: 12px;">
            ${imageList.map((_, i) => `<span class="pagination-dot ${i === 0 ? 'active' : ''}" data-index="${i}" style="width: 10px; height: 10px; border-radius: 50%; background: ${i === 0 ? '#7B3987' : '#d1d5db'}; cursor: pointer; transition: background 0.2s;"></span>`).join('')}
          </div>
        ` : ''}
        <div style="margin-top: 8px; text-align: center; color: #6b7280; font-size: 14px;">
          תמונה נבחרת
        </div>
      </div>

      <!-- Left Column: Form Fields (RTL - appears on left) -->
      <div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 14px;">כותרת</label>
          <input type="text" id="product-title" value="${productData.name || ''}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div class="form-group">
            <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 14px;">מחיר</label>
            <input type="text" id="product-price" value="${formattedPrice}" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
          </div>
          <div class="form-group">
            <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 14px;">כמות</label>
            <input type="number" id="product-quantity" value="1" min="1" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 14px;">קטגוריה</label>
          <select id="product-category" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            <option value="General">כללי</option>
            <option value="Nursery">חדר ילדים</option>
            <option value="Feeding">האכלה</option>
            <option value="Diapering">החתלה</option>
            <option value="Clothing">ביגוד</option>
            <option value="Toys">צעצועים</option>
            <option value="Health & Safety">בריאות ובטיחות</option>
            <option value="Bath">אמבטיה</option>
            <option value="Gear">ציוד</option>
            <option value="Other">אחר</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 600; margin-bottom: 4px; color: #374151; font-size: 14px;">הערה לחברים ומשפחה</label>
          <textarea id="product-notes" maxlength="500" placeholder="הערות אופציונליות..." style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; min-height: 100px; resize: vertical; box-sizing: border-box;"></textarea>
          <div style="text-align: left; font-size: 12px; color: #6b7280; margin-top: 4px;">
            <span id="notes-counter">0</span>/500 תווים
          </div>
        </div>
      </div>
    </div>

    <!-- Footer: Buttons -->
    <div style="display: flex; justify-content: space-between; padding: 20px 24px; border-top: 1px solid #e5e7eb;">
      <button id="export-btn" style="padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; background: #7B3987; color: white; border: none;">ייצא JSON</button>
      <button id="cancel-btn" style="padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; background: white; color: #374151; border: 1px solid #d1d5db;">ביטול</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  return { backdrop, modal, images: imageList };
}

/**
 * Setup image carousel navigation
 * @param {HTMLElement} modal - Modal element
 * @param {Array} images - Array of image URLs
 * @param {Object} state - Modal state object
 */
function setupImageCarousel(modal, images, state) {
  if (images.length <= 1) return;

  const currentImage = modal.querySelector('#current-image');
  const dots = modal.querySelectorAll('.pagination-dot');

  function updateImage(index) {
    state.currentImageIndex = index;
    currentImage.src = images[index];
    dots.forEach((dot, i) => {
      dot.style.background = i === index ? '#7B3987' : '#d1d5db';
      dot.classList.toggle('active', i === index);
    });
  }

  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (state.currentImageIndex - 1 + images.length) % images.length;
      updateImage(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (state.currentImageIndex + 1) % images.length;
      updateImage(newIndex);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      updateImage(parseInt(dot.dataset.index));
    });
  });
}

/**
 * Setup event handlers for modal form and buttons
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLElement} backdrop - Backdrop element
 * @param {Object} state - Modal state object
 */
function setupEventHandlers(modal, backdrop, state) {
  // Close handlers
  modal.querySelector('#close-modal').addEventListener('click', () => backdrop.remove());
  modal.querySelector('#cancel-btn').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.remove();
  });

  // Form field handlers
  modal.querySelector('#product-title').addEventListener('input', (e) => {
    state.formData.title = e.target.value;
  });

  modal.querySelector('#product-price').addEventListener('input', (e) => {
    state.formData.price = e.target.value;
  });

  modal.querySelector('#product-quantity').addEventListener('input', (e) => {
    state.formData.quantity = parseInt(e.target.value) || 1;
  });

  modal.querySelector('#product-category').addEventListener('change', (e) => {
    state.formData.category = e.target.value;
  });

  const notesField = modal.querySelector('#product-notes');
  const notesCounter = modal.querySelector('#notes-counter');

  notesField.addEventListener('input', (e) => {
    state.formData.notes = e.target.value;
    notesCounter.textContent = e.target.value.length;
  });

  // Export button handler (with validation - Phase 2)
  modal.querySelector('#export-btn').addEventListener('click', () => {
    console.log('📤 Export clicked - Current state:', state);

    // Validate form data before export
    const errors = validateFormData(state.formData, state.images);
    if (showValidationErrors(errors, modal)) {
      console.log('❌ Validation failed:', errors);
      return; // Has errors, don't proceed
    }

    // TODO: Export functionality in Phase 3
    console.log('✅ Validation passed!');
    alert('Validation successful!\n\nExport functionality coming in Phase 3!\n\nCurrent data:\n' + JSON.stringify(state.formData, null, 2));
  });
}

/**
 * FORM VALIDATION - Phase 2 Implementation
 * ==========================================
 */

/**
 * Validate form data before export
 * @param {Object} formData - Form data to validate
 * @param {Array} images - Array of image URLs
 * @returns {Array} - Array of error messages (empty if valid)
 */
function validateFormData(formData, images) {
  const errors = [];

  // Validate title (required)
  if (!formData.title || formData.title.trim() === '') {
    errors.push('כותרת היא שדה חובה');
  }

  // Validate price (required and must be valid)
  if (!formData.price || formData.price.trim() === '') {
    errors.push('מחיר הוא שדה חובה');
  } else if (!isPriceValid(formData.price)) {
    errors.push('נא להזין מחיר תקין (לדוגמה: ₪19.99, USD 19.99, או 19.99)');
  }

  // Validate images (at least one required)
  if (!images || images.length === 0) {
    errors.push('נדרשת לפחות תמונה אחת של המוצר');
  }

  // Validate quantity (must be at least 1)
  if (!formData.quantity || formData.quantity < 1) {
    errors.push('הכמות חייבת להיות לפחות 1');
  }

  return errors;
}

/**
 * Check if price string is valid
 * @param {string} price - Price string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isPriceValid(price) {
  if (!price || typeof price !== 'string') {
    return false;
  }

  // Remove currency symbols and common text
  const cleaned = price.replace(/[^0-9.,]/g, '');

  // Must have some digits
  if (cleaned.length === 0) {
    return false;
  }

  // Try to parse as number
  const normalized = cleaned.replace(',', '.');
  const num = parseFloat(normalized);

  // Must be a valid positive number
  return !isNaN(num) && num > 0;
}

/**
 * Display validation errors in the modal
 * @param {Array} errors - Array of error messages
 * @param {HTMLElement} modal - Modal element
 * @returns {boolean} - True if there are errors, false if valid
 */
function showValidationErrors(errors, modal) {
  const errorBanner = modal.querySelector('#error-banner');

  if (errors.length > 0) {
    // Show error banner with all errors
    errorBanner.innerHTML = `
      <strong>⚠️ נא לתקן את השגיאות הבאות:</strong>
      <ul style="margin: 8px 0 0 0; padding-right: 20px; text-align: right;">
        ${errors.map(err => `<li>${err}</li>`).join('')}
      </ul>
    `;
    errorBanner.style.display = 'block';

    // Scroll to top so user sees the errors
    modal.scrollTop = 0;

    return true; // Has errors
  } else {
    // Hide error banner
    errorBanner.style.display = 'none';
    return false; // No errors
  }
}
