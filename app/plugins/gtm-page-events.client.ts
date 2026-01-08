export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', async () => {
        // await useOrderDataLayer('PageView')
    })
})
