export default defineNuxtPlugin(() => {
    if (!import.meta.client || window.fbq) return

    const nuxtApp = useNuxtApp()

    nuxtApp.provide('metaPixelReady', new Promise<void>((resolve) => {
        !(function (f: any, b, e, v, n?, t?, s?) {
            if (f.fbq) return
            n = f.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments)
            }
            if (!f._fbq) f._fbq = n
            n.push = n
            n.loaded = true
            n.version = '2.0'
            n.queue = []
            t = b.createElement(e)
            t.async = true
            t.src = v
            t.onload = () => resolve()
            s = b.getElementsByTagName(e)[0]
            s.parentNode.insertBefore(t, s)
        })(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
        )

        const config = useRuntimeConfig()
        window.fbq('init', config.public.pixel_id)
    }))
})
