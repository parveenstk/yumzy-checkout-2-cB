import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    baseURL: "/checkout-2-cB",
    head: {
      htmlAttrs: {
        lang: 'en'
      },
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@pinia/nuxt'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },
  plugins: [
    '~/plugins/gtm-page-events.client',
    '~/plugins/meta-pixel.client',
    '~/plugins/meta-pixel-pageview.client',
  ],

  runtimeConfig: {
    konnective: {
      loginId: "gsteamapiu",
      password: "nZtvxxULEvJiqKiNpDF4",
    },
    public: {
      encryptResponses: true, // Optional public flag
      pixel_id: "2090427268412378",
      GTM_id: "W7MPKBF2",
      checkout: {
        lp1: {
          campaignId: 391,
          gummyId: 9225,
          WarrantyId: 9224,
          giftItems: [9226, 9227, 9228, 9229],
          shipProfiles: [43, 44],
          offer1: 9326,
          offer1_1: 9338,
          offer2: 9351,
          offer2_1: 9364,
        },
        lp2: {
          campaignId: 395,
          gummyId: 9253,
          WarrantyId: 9252,
          giftItems: [9254, 9255, 9256, 9257],
          shipProfiles: [51, 52],
          offer1: 9330,
          offer1_1: 9342,
          offer2: 9355,
          offer2_1: 9368,
        },
        lp3: {
          campaignId: 399,
          gummyId: 9281,
          WarrantyId: 9280,
          giftItems: [9282, 9283, 9284, 9285],
          shipProfiles: [59, 60],
          offer1: 9334,
          offer1_1: 9346,
          offer2: 9359,
          offer2_1: 9372,
        },
        default: {
          campaignId: 386,
          gummyId: 9377,
          WarrantyId: 9196,
          giftItems: [9202, 9204, 9206, 9208],
          shipProfiles: [36, 38],
          offer1: 9322,
          offer1_1: 9323,
          offer2: 9348,
          offer2_1: 9361,
        }
      },

      // variantIds: [6702, 6704],
      variantIds: [6773, 6774],

      // ogBags: [6750, 6752, 6754],
      ogBags: [6775, 6776, 6777, 6778],

      // sourBags: [6762, 6764, 6766],
      sourBags: [6779, 6780, 6781, 6782],

      // upsell2VariantIds: [6769, 6770, 6771],
      upsell2VariantIds: [6784, 6785, 6786],

      countries: ["US", "CA"],
      oneTimePrice: 64, // one time price $64
    }
  }
})
