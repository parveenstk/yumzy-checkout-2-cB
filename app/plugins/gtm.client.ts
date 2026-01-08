export default defineNuxtPlugin(() => {
    window.dataLayer = window.dataLayer || []

    if (document.getElementById('gtm-script')) return

    const config = env();
    useHead({
        script: [{
            src: `https://www.googletagmanager.com/gtm.js?id=GTM-${config.GTM_id}`,
            async: true
        }]
    });
})
