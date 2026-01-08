import type { ProductReceipt, ProductReceiptSessionItems } from "~/utils/interface";
import { useCheckoutStore, useFormStore } from "~~/stores";

declare global {
    interface Window {
        dataLayer?: any[];
        fbq?: any;
    }
}

export const params = (type: string = "lead") => {

    // Config
    const config = env();

    // FormStore
    const formStore = useFormStore();
    const formFields = formStore.formFields

    // CheckoutStore
    const checkoutStore = useCheckoutStore();

    const productPrice = computed(() => {
        return checkoutStore.cartData[0]?.productPrice?.toString() ?? '0';
    });

    if (formStore.paymentMethod === 'creditCard' && type === 'lead') {
        if (!formFields.billingFirstName || !formFields.billingLastName || !formFields.email) return;
    }

    const param: { [key: string]: string | number } = {
        sessionId: getFromStorage('sessionId', "session")!,
        firstName: formStore.paymentMethod === 'creditCard' ? formFields.billingFirstName : formFields.firstName,
        lastName: formStore.paymentMethod === 'creditCard' ? formFields.billingLastName : formFields.lastName,
        emailAddress: formFields.email,
        phoneNumber: formFields.phoneNumber,
        address1: formFields.billingStreetAddress,
        address2: formFields.billingApptsAddress,
        postalCode: formFields.billingPostalCode,
        city: formFields.billingCity,
        state: formFields.billingState,
        country: formFields.billingCounty,
        shipFirstName: formFields.shipFirstName,
        shipLastName: formFields.shipLastName,
        shipAddress1: formFields.shipStreetAddress,
        shipAddress2: formFields.shipApptsAddress,
        shipPostalCode: formFields.shipPostalCode,
        shipCity: formFields.shipCity,
        shipState: formFields.shipState,
        shipCountry: formFields.shipCounty,
        emailOptIn: '1',
        salesUrl: window.location.href,
        pageType: 'checkout',
        ipAddress: checkoutStore.ipAddress,
        campaignId: config.campaignId
    }

    // Product details
    const cart = [...checkoutStore.cartData];

    // Sticker item details
    const stickerItem = giftItemsData[0];

    // Create sticker product object
    const stickerPrd = {
        productId: Number(config.giftItems[0]),
        productName: stickerItem!.name,
        productImage: stickerItem!.img,
        productPrice: '0',
    };

    // Ensure sticker is valid in the cart by checking OG Bags or Sour Bags 1 Bag
    const stickerValid = cart.find(product => product.productId === config.ogBags[0]) || cart.find(product => product.ProductVariantName === config.sourBags[0]);
    if (!stickerValid) cart.push(stickerPrd); // Add sticker to cart if valid

    // Map through cart and add product details to param
    cart.forEach((product, index) => {
        if (product.ProductVariantName) {
            param[`product${index + 1}_id`] = config.gummyId.toString();
            param[`product${index + 1}_qty`] = '1';
            if (checkoutStore.activeTab === 'onetime') param[`product${index + 1}_price`] = checkoutStore.calculateBagPrice(product.BagsQty!, productPrice.value).toString();
            param[`variant${index + 1}_id`] = product.productId.toString();
        } else {
            param[`product${index + 1}_id`] = product.productId.toString();
            param[`product${index + 1}_qty`] = '1';
        }
    });

    if (type === 'order') {
        param.shipProfileId = formFields.shipProfile;
        param.paySource = formStore.paymentMethod?.toUpperCase()!;
        param.cardNumber = formFields.creditCardNumber;
        param.cardMonth = formFields.expiryMonth;
        param.cardSecurityCode = formFields.cardCVV;
        param.cardYear = formFields.expiryYear;
        param.orderId = checkoutStore.orderId;
        if (formStore.paymentMethod?.toUpperCase() === 'PAYPAL') param.paypalBillerId = 78;
    }

    return param
};

export const giftItemsData = [
    {
        id: 9202,
        img: "/images/gift1.jpg",
        name: "YOMZ Collectible Sticker",
        oldPrice: "$4.99",
    },

    {
        id: 9204,
        img: "/images/gift2.jpg",
        name: "Yumzy Interactive E-book",
        oldPrice: "$9.99",
    },

    {
        id: 9206,
        img: "/images/gift3.jpg",
        name: "$20 Yumzy Gift Card",
        oldPrice: "$20.00",
    },

    {
        id: 9208,
        img: "/images/gift4.jpg",
        name: "Chance for Order Refund",
        oldPrice: "$239.97",
    },
];

export const updatedShipProfile = (actvieTab: string, bagQty: string, shipProfiles: number[]) => {
    if (actvieTab === 'onetime') {
        return shipProfiles[0]?.toString() ?? '0'
    }

    if (bagQty === '1 Bag') {
        return shipProfiles[0]?.toString() ?? '0'
    }

    return shipProfiles[1]?.toString() ?? '0'
}

// meta data
export const metaData = (title: string, content: string) => {
    useHead({
        title: title,
        meta: [
            { name: "description", content: content }
        ]
    })
}

// set step for security
export const updatePage = () => saveToStorage('stepCompleted', 2, 'local');

// Retive order details for DataLayer
export const getOrderDetails = async () => {
    const ipAddress = getFromStorage('ipAddress', "session");
    const cartTotal = getFromStorage('cartTotal', "session");
    const productCart = getFromStorage('productCart', "session");
    const orderId = getFromStorage('orderId', "session");
    const firstName = getFromStorage('firstName', "session");
    const lastName = getFromStorage('lastName', "session");
    const emailAddress = getFromStorage('emailAddress', "session");
    const phoneNumber = getFromStorage('phoneNumber', "session");
    const city = getFromStorage('city', "session");
    const state = getFromStorage('state', "session");
    const postalCode = getFromStorage('postalCode', "session");
    const country = getFromStorage('country', "session");
    const subTotal = getFromStorage('subTotal', "session");
    const shipping = getFromStorage('shipping', "session");
    const tax = getFromStorage('tax', "session");
    return { subTotal, shipping, tax, ipAddress, productCart, cartTotal, orderId, firstName, lastName, emailAddress, phoneNumber, city, state, postalCode, country }
}

// Destruct Items for DataLayer and CAPI:
export const mapToProductCart = (items: ProductReceipt[]): ProductReceiptSessionItems[] => (
    items.map((obj) => ({
        product_id: obj.productId,
        title: obj.name,
        price: obj.price,
        product_qty: obj.qty,
        variant_id: obj.variantDetailId,
        variant_title: obj.title
    }))
);

export const fbCAPI = async (eventType: string) => {
    // console.log('fbCAPI Event Triggered:', eventType)

    if (!import.meta.client) return

    const { $metaPixelReady } = useNuxtApp()
    await $metaPixelReady

    if (!window.fbq) return
    // console.log('fbq is available')

    const config = useRuntimeConfig().public
    const fbPixelId = config.pixel_id
    if (!fbPixelId) return

    const order = await getOrderDetails()

    const customData: Record<string, any> = {
        currency: 'USD',
        value: order.cartTotal,
        items: order.productCart
    }

    if (eventType !== 'Checkout') {
        customData.order_id = order.orderId
    }

    const standardEvents = ['PageView', 'AddToCart', 'Checkout', 'Purchase']

    if (standardEvents.includes(eventType)) {
        // console.log('Standard Event Tracked:', eventType)
        window.fbq('track', eventType, customData)
    } else {
        window.fbq('trackCustom', eventType, customData)
    }
};

export const UpsellsfbCAPI = async (datalayerobj: any) => {
    if (!import.meta.client || !window.fbq) return

    const config = useRuntimeConfig().public
    const fbPixelId = config.pixel_id
    if (!fbPixelId) return

    const customData = {
        currency: 'USD',
        value: datalayerobj.value,
        item_price: datalayerobj.ItemPrice,
        item_qty: datalayerobj.ItemQty,
        item_name: datalayerobj.ItemName,
        order_id: datalayerobj.orderid,
    }

    // Upsells are usually custom events
    window.fbq('trackCustom', datalayerobj.event, customData)
};
