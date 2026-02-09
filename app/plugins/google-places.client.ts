export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    if (document.getElementById('google-places')) return

    const script = document.createElement('script')
    script.id = 'google-places'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googlePlacesKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true

    document.head.appendChild(script)
})