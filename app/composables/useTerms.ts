import { useCheckoutStore } from '~~/stores'

export const useTerms = () => {
    const checkoutStore = useCheckoutStore()

    const termsHtml = computed(() => {
        const price = checkoutStore.calculateTotalPrice.toFixed(2)
        const terms = getTermsHtml(price)

        return checkoutStore.activeTab === 'subscribe'
            ? terms.subscribe
            : terms.onetime
    })

    return {
        termsHtml
    }
}