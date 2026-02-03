export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    if (document.getElementById('google-places')) return

    const script = document.createElement('script')
    script.id = 'google-places'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googlePlacesKey}&libraries=places`
    script.async = true
    script.defer = true

    document.head.appendChild(script)
})

// export default defineNuxtPlugin(() => {
//     console.log('🚀 Google Places plugin started')

//     const config = useRuntimeConfig()

//     if (document.getElementById('google-places')) {
//         console.log('✅ Google script already exists')
//         return
//     }

//     const script = document.createElement('script')
//     script.id = 'google-places'
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googlePlacesKey}&libraries=places`
//     script.async = true
//     script.defer = true

//     script.onload = () => {
//         console.log('✅ Google Places script loaded')
//         console.log('window.google:', (window as any).google)
//     }

//     script.onerror = () => {
//         console.error('❌ Failed to load Google script')
//     }

//     document.head.appendChild(script)
// })
