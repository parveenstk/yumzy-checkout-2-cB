export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        if (window.fbq) {
            window.fbq('track', 'PageView')
        }
    })
})
