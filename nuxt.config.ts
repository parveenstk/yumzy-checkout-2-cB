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
      access_token: "EAARsmWv5SHcBQc51itc624zpCVwke9jjtjmIfVeyKnVBOtaqyYOU2yCWsZBdVaINYHtSxWdQLuZAaZBrSOZBShpkaAy9JsZBXBryog2gbpIDMVlESQkXCLy7HZCFRKgvFYqJZAte2o8DAExm0S4382F36jJZBQlJhawf5BLgdvrVStZCqQDqsHnKY1YPpJQANDgQ7IQZDZD",
      GTM_id: "W7MPKBF2",
      checkout: {
        lp1: {
          campaignId: 406,
          gummyId: 9413,
          WarrantyId: 9412,
          giftItems: [9414, 9415, 9416, 9417],
          subBags: [9425, 9426, 9427, 9428],
          shipProfiles: [71, 72],
          offer1: 9419,
          offer1_1: 9420,
          offer2: 9421,
          offer2_1: 9422,
        },
        lp2: {
          campaignId: 407,
          gummyId: 9430,
          WarrantyId: 9429,
          giftItems: [9431, 9432, 9433, 9434],
          subBags: [9440, 9441, 9442, 9443],
          shipProfiles: [73, 74],
          offer1: 9436,
          offer1_1: 9437,
          offer2: 9438,
          offer2_1: 9439,
        },
        lp3: {
          campaignId: 408,
          gummyId: 9445,
          WarrantyId: 9444,
          giftItems: [9446, 9447, 9448, 9449],
          subBags: [9455, 9456, 9457, 9458],
          shipProfiles: [75, 76],
          offer1: 9451,
          offer1_1: 9452,
          offer2: 9453,
          offer2_1: 9454,
        },
        default: {
          campaignId: 386,
          gummyId: 9377,
          WarrantyId: 9196,
          giftItems: [9202, 9204, 9206, 9208],
          shipProfiles: [36, 38],
          subBags: [9387, 9392, 9393, 9394],
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
      ogBagsSub: [6787, 6789, 6791, 6793],

      // sourBags: [6762, 6764, 6766],
      sourBags: [6779, 6780, 6781, 6782],
      sourBagsSub: [6788, 6790, 6792, 6794],

      // upsell2VariantIds: [6769, 6770, 6771],
      upsell2VariantIds: [6784, 6785, 6786],

      countries: ["US", "CA"],
      oneTimePrice: 64, // one time price $64
      paypalBillerId: 79,
    }
  }
})
