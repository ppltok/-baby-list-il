accessibility.js:1 An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.
GetDefaultProp @ accessibility.js:1
accessibility.js:1 [IND] You are running  Windows  Operating system,  Chrome  browser, version:  142
accessibility.js:1 [IND] Version 5.0.9
accessibility.js:1 Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('https://ams.creativecdn.com') does not match the recipient window's origin ('https://www.terminalx.com').
postFrames @ accessibility.js:1
accessibility.js:1 Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('https://ams.creativecdn.com') does not match the recipient window's origin ('https://www.terminalx.com').
postFrames @ accessibility.js:1
humanz-gtm.js:1 -I-
content.js:11 🚀 Babylist API Tester - Starting...
content.js:16 📍 Current Page URL: https://www.terminalx.com/kids-and-baby/z756010027?color=2148
content.js:19 📡 Calling Babylist API...
content.js:118 🔗 Requesting API fetch from background script
content.js:23 ✅ SUCCESS! Directives received from Babylist API
content.js:24 📦 Full Response: {directives: Array(12)}
content.js:27 📋 DIRECTIVES BREAKDOWN:
content.js:28 ========================
content.js:30 
Directive 1: (10) [{…}, {…}, {…}, Array(2), Array(1), {…}, Array(3), Array(1), Array(2), {…}]
content.js:30 
Directive 2: (3) [Array(2), Array(1), {…}]
content.js:30 
Directive 3: {type: 'Chain', when: {…}, directives: Array(2)}
content.js:30 
Directive 4: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 5: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 6: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 7: [Array(1)]
content.js:30 
Directive 8: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 9: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 10: {type: 'Chain', when: {…}, directives: Array(2)}
content.js:30 
Directive 11: {type: 'Chain', when: {…}, directives: Array(1)}
content.js:30 
Directive 12: {type: 'RemoveEmptyResults', exceptedKeys: Array(4)}
content.js:32 ========================

content.js:35 📄 Full Response as JSON:
content.js:36 {
  "directives": [
    [
      {
        "type": "Chain",
        "when": {
          "a": {
            "ref": "jsonLdProduct"
          },
          "operator": "falsy"
        },
        "directives": [
          {
            "type": "JsonLdProduct",
            "assign": {
              "ref": "jsonLdProduct"
            }
          }
        ]
      },
      {
        "type": "Chain",
        "when": {
          "a": {
            "ref": "jsonLdProduct"
          },
          "operator": "truthy"
        },
        "directives": [
          {
            "type": "Dig",
            "pathString": "offers",
            "object": {
              "ref": "jsonLdProduct"
            },
            "assign": {
              "ref": "offers"
            }
          },
          {
            "type": "Chain",
            "when": {
              "a": {
                "ref": "offers"
              },
              "operator": "truthy"
            },
            "directives": [
              {
                "type": "Chain",
                "when": {
                  "a": {
                    "ref": "variantId"
                  },
                  "operator": "truthy"
                },
                "directives": [
                  {
                    "type": "Find",
                    "array": {
                      "ref": "offers"
                    },
                    "operator": "includes",
                    "a": [
                      {
                        "type": "Dig",
                        "pathString": "url",
                        "object": {
                          "ref": "_value"
                        }
                      }
                    ],
                    "b": [
                      {
                        "type": "Define",
                        "value": {
                          "ref": "variantId"
                        }
                      }
                    ]
                  },
                  {
                    "type": "Define",
                    "when": {
                      "a": {
                        "ref": "_prev"
                      },
                      "operator": "present"
                    },
                    "value": {
                      "ref": "_prev"
                    },
                    "assign": {
                      "ref": "offer"
                    }
                  }
                ]
              },
              {
                "type": "Chain",
                "when": {
                  "a": {
                    "ref": "variantId"
                  },
                  "operator": "falsy"
                },
                "directives": [
                  {
                    "type": "Dig",
                    "pathString": "1",
                    "object": {
                      "ref": "offers"
                    }
                  },
                  {
                    "type": "Dig",
                    "when": {
                      "a": {
                        "ref": "_prev"
                      },
                      "operator": "falsy"
                    },
                    "pathString": "0",
                    "object": {
                      "ref": "offers"
                    }
                  },
                  {
                    "type": "Define",
                    "when": {
                      "a": {
                        "ref": "_prev"
                      },
                      "operator": "present"
                    },
                    "value": {
                      "ref": "_prev"
                    },
                    "assign": {
                      "ref": "offer"
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "Chain",
        "when": {
          "a": {
            "ref": "jsonLdProduct"
          },
          "operator": "truthy"
        },
        "directives": [
          {
            "type": "Chain",
            "when": {
              "a": {
                "result": "title"
              },
              "operator": "falsy"
            },
            "directives": [
              {
                "type": "Dig",
                "pathString": "title",
                "object": {
                  "ref": "jsonLdProduct"
                }
              },
              {
                "type": "Define",
                "value": {
                  "ref": "_prev"
                },
                "assign": {
                  "result": "title"
                },
                "when": {
                  "a": {
                    "ref": "_prev"
                  },
                  "operator": "truthy"
                }
              }
            ]
          }
        ]
      },
      [
        [
          {
            "type": "Chain",
            "when": {
              "a": {
                "result": "pric
content.js:40 📊 Directive Analysis: {platform: 'Shopify', fields: Array(7), chainCount: 12, hasJsonLd: true, hasShopify: true, …}
content.js:186 🔍 Searching for product data on page...
content.js:191 Found 2 JSON-LD script(s)
content.js:196 JSON-LD 1: {@context: 'https://schema.org', @type: 'WebSite', url: 'https://www.terminalx.com/', potentialAction: {…}}
content.js:196 JSON-LD 2: {@context: 'https://schema.org', @type: 'סניקרס', image: 'https://media.terminalx.com/pub/media/catalog/prod…717492140.jpg?image_type_mobile=webp_jpeg_like_70', name: 'סניקרס קנבאס Chuck Taylor All Star Classic / בייבי בנים', description: 'נעלי סניקרס מבית Converse מדגם Chuck Taylor All St… סולייה שטוחה והדפסי לוגו על הלשונית ומאחור.\n<br>', …}
content.js:515 🔍 Trying Shopify meta tags...
content.js:525 ✅ Found product data in meta tags!
content.js:63 🎁 ACTUAL PRODUCT DATA EXTRACTED FROM PAGE:
content.js:64 ==========================================
content.js:65 Product Name: כחול נייבי - סניקרס קנבאס Chuck Taylor All Star Classic / בייבי בנים - CONVERSE - TERMINAL X
content.js:66 Price: 137.94 ILS
content.js:67 Availability: in stock
content.js:68 Brand: N/A
content.js:69 SKU: N/A
content.js:70 Category: N/A
content.js:71 Image URL: https://media.terminalx.com/pub/media/catalog/product/cache/f112238e8de94b6d480bd02e7a9501b8/z/7/z756010027-11717492140.jpg?image_type_mobile=webp_jpeg_like_70
content.js:72 Full product data: {@type: 'Product', name: 'כחול נייבי - סניקרס קנבאס Chuck Taylor All Star Classic / בייבי בנים - CONVERSE - TERMINAL X', offers: {…}, image: 'https://media.terminalx.com/pub/media/catalog/prod…717492140.jpg?image_type_mobile=webp_jpeg_like_70'}
content.js:73 ==========================================




background.js:10 🎯 Extension icon clicked!
background.js:11 📍 Current tab URL: https://www.terminalx.com/kids-and-baby/z756010027?color=2148
background.js:35 📨 Message received in background: Object
background.js:43 🔗 Fetching API from background: https://www.babylist.com/api/v3/scraper_directives?url=https%3A%2F%2Fwww.terminalx.com%2Fkids-and-baby%2Fz756010027%3Fcolor%3D2148
background.js:60 ✅ API response received: Object
background.js:27 ✅ Content script injected successfully
