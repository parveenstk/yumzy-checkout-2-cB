import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { useFormStore } from "./formStore";

export const useCheckoutStore = defineStore('checkoutStore', () => {

    // Config
    const config = env();

    // FormStore
    const formStore = useFormStore();

    const allProducts: Ref<StructuredProducts[]> = ref([]);
    const gummyProducts: Ref<StructuredProducts[]> = ref([]);
    const giftsProducts: Ref<StructuredProducts[]> = ref([]);
    const subProducts: Ref<StructuredProducts[]> = ref([]);
    let cartData: Ref<StructuredProducts[]> = ref([]);
    let giftCartData: Ref<StructuredProducts[]> = ref([]);
    const selectedGummyType: Ref<string> = ref("ogBags");
    const selectedQuantity: Ref<number> = ref(2);
    const shipProfiles: Ref<SimplifiedRule[]> = ref([]);
    const pageType: Ref<string> = ref("");
    const transactionStatus: Ref<boolean> = ref(false);

    // OderId
    const orderId: Ref<string> = ref(getFromStorage('orderId', "session") || '');

    // Expedited Shipping
    const expeditedShipping = ref(false)

    // Ip Address
    const ipAddress: Ref<string> = ref("");

    // Step-3 Tabs
    const activeTab = ref('subscribe')

    // Countries
    const availableCountires: Country[] = [];
    const allCountries: AllCountries[] = [];
    const selectedStates: AllCountries[] = [];
    const selectedStatesBill: AllCountries[] = [];

    // Add PageType
    const setPageType = (type: string) => {
        pageType.value = type;
    }

    const setTransactionStatus = (status: boolean) => {
        transactionStatus.value = status;
    };

    // to add save products in 'allProducts'
    const saveProducts = (
        products: StructuredProducts[],
        filteredGiftsProducts: StructuredProducts[],
        filteredSubProducts: StructuredProducts[],
    ) => {
        allProducts.value = [...products];
        // console.log("allProducts.value:", allProducts.value);

        giftsProducts.value = [...filteredGiftsProducts];
        // console.log('giftsProducts.value:', giftsProducts.value);

        subProducts.value = [...filteredSubProducts];
    };

    // Add Product in Cart
    const addGummyProduct = (): void => {
        const selectedProduct = allProducts.value.find(
            (product) => product.productId === selectedQuantity.value
        );

        if (!selectedProduct) {
            console.warn('Product not found');
            return;
        }

        // logic: replace the first item in cartData with the selected product
        cartData.value[0] = { ...selectedProduct };

        // Set Shipping Based on the conditions
        if (selectedQuantity.value === config.ogBags[0] || selectedQuantity.value === config.sourBags[0] || selectedQuantity.value === config.ogBagsSub[0] || selectedQuantity.value === config.sourBagsSub[0]) {
            formStore.formFields.shipProfile = config.shipProfiles[0]?.toString()!;
        } else if (activeTab.value === 'onetime') {
            formStore.formFields.shipProfile = config.shipProfiles[0]?.toString()!;
        } else {
            formStore.formFields.shipProfile = config.shipProfiles[1]?.toString()!;
        }

        // console.log("On Product Change:", formStore.formFields.shipProfile);
        saveToStorage('productCart', cartData.value, "session");
    };

    // add extra product
    const addExtraProduct = () => {
        if (cartData.value && cartData.value.length > 1) {
            cartData.value.pop();
        } else {
            const selectedProduct = allProducts.value.find(
                (product) => product.productId === config.WarrantyId
            );

            expeditedShipping.value = true;

            if (!selectedProduct) {
                console.warn('Product not found');
                return;
            }

            cartData.value[1] = { ...selectedProduct };
        }
        saveToStorage('productCart', cartData.value, "session");
    }

    // Add GiftProducts in cart
    const addGiftProducts = (giftProducts: number[]) => {
        giftCartData.value = allProducts.value.filter(
            (product) => giftProducts.includes(product.productId)
        )

        // console.log("giftCartData", giftCartData.value);
    };

    // Total of giftProducts
    const totalGiftProducts = () => {
        const giftProducts = giftCartData.value || []

        let totalValue = giftProducts
            .slice(0, 3)
            .reduce((total, item) => total + (Number(item.compareAtPrice) || 0), 0)

        // If NOT these productIds, add extraPrice
        if (cartData.value[0]?.productId !== config.ogBags[0] && cartData.value[0]?.productId !== config.sourBags[0]) {
            totalValue += 500
        }

        const finalTotal = +totalValue.toFixed(2)
        // console.log("Total Price Of GiftItems:", finalTotal)
        return finalTotal
    }

    // Calculate subTotal price for all products in cart
    const calculateSubtotalPrice = (type: 'productPrice' | 'compareAtPrice', all: boolean) => {
        const rawItems = all ? cartData.value : [cartData.value[0]];

        // Ensure we only pass defined StructuredProducts to the price logic
        const items = (Array.isArray(rawItems) ? rawItems : []).filter((it): it is StructuredProducts => !!it);
        if (items.length === 0) return 0;
        const subtotal = items.reduce((a, p) => {
            const oneTimePrice = oneTimeBagPrice(p, type);
            const price = activeTab.value === 'subscribe' ? Number((p as any)[type]) : oneTimePrice;
            return a + price;
        }, 0);

        return subtotal;
    };

    // Calculate Total price for all products in cart
    const calculateTotalPrice = computed(() => {
        const subtotal = calculateSubtotalPrice('productPrice', true);

        let shipping = 0;
        if (shipProfiles.value.length > 0) {
            const shipProfile = shipProfiles.value.filter(
                s => s.shipProfileId === +formStore.formFields.shipProfile
            );
            if (shipProfile.length < 1) return 0;
            shipping = shipProfile[0]?.shipPrice || 0;
        }

        saveToStorage('cartTotal', subtotal + Number(shipping), 'session')
        return (subtotal + Number(shipping));
    });

    // compareAt total using compareAtPrice
    const calculateComparePrice = computed(() => {
        const subtotal = cartData.value.reduce((acc, p) => acc + Number(p?.compareAtPrice || 0), 0)

        let shipping = 0
        if (shipProfiles.value.length > 0) {
            const shipProfile = shipProfiles.value.find(
                s => Number(s.shipProfileId) === Number(formStore.formFields.shipProfile)
            )
            shipping = shipProfile?.shipPrice ? Number(shipProfile.shipPrice) : 0
        }

        return (subtotal + shipping).toFixed(2)
    })

    // Calculate pricing based on bags
    const oneTimeBagPrice = (p: StructuredProducts, type: 'productPrice' | 'compareAtPrice'): number => {
        if (activeTab.value !== 'onetime') return Number(p[type] ?? 0);

        const qtyString = p.BagsQty;
        const productPrice = p.productPrice;
        if (qtyString) return calculateBagPrice(qtyString, productPrice);

        // fallback to productPrice or 0 to ensure we always return a number
        return Number(p[type] ?? 0);
    }

    // To calculate one time price based on selected bag
    const calculateBagPrice = (bagQty: string, productPrice: string) => {
        if (bagQty === "4 Bags") return Number(productPrice) + 20;
        else if (bagQty === "3 Bags") return Number(productPrice) + 20;
        else if (bagQty === "2 Bags") return Number(productPrice) + 15;
        else if (bagQty === "1 Bag") return Number(productPrice) + 10;
        else return 0;
    }

    // To calculate one-time purchase percentageOff
    const oneTimePercentageOff = (compareAtPrice: number, productPrice: string) => {
        const adjustedPrice = calculateBagPrice(cartData.value[0]?.BagsQty!, productPrice)
        const difference = compareAtPrice - adjustedPrice

        if (difference <= 0) return 0 // ensures no negative percentage
        const percentageOff = (difference / compareAtPrice) * 100
        return Math.ceil(percentageOff)
    }

    return {
        allProducts,
        saveProducts,
        gummyProducts,
        giftsProducts,
        selectedGummyType,
        selectedQuantity,
        addGummyProduct,
        cartData,
        addExtraProduct,
        addGiftProducts,
        shipProfiles,
        orderId,
        availableCountires,
        allCountries,
        selectedStates,
        selectedStatesBill,
        ipAddress,
        expeditedShipping,
        calculateTotalPrice,
        calculateComparePrice,
        activeTab,
        oneTimeBagPrice,
        calculateSubtotalPrice,
        calculateBagPrice,
        oneTimePercentageOff,
        giftCartData,
        totalGiftProducts,
        pageType,
        setPageType,
        transactionStatus,
        setTransactionStatus,
    }
});