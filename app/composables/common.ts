import CryptoJS from "crypto-js";
import type { ProductReceipt, ProductReceiptSessionItems } from "~/utils/interface";
import { useCheckoutStore, useFormStore } from "~~/stores";

declare global {
    interface Window {
        dataLayer?: any[];
        fbq?: any;
    }
}

export const params = async (type: string = "lead") => {

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
        if (!formFields.shipFirstName || !formFields.shipLastName || !formFields.email) return;
    }

    const param: { [key: string]: string | number } = {
        sessionId: getFromStorage('sessionId', "session")!,
        firstName: formStore.paymentMethod === 'creditCard' ? formFields.billingFirstName : formFields.shipFirstName,
        lastName: formStore.paymentMethod === 'creditCard' ? formFields.billingLastName : formFields.shipLastName,
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
        shipCountry: formFields.shipCountry,
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
    const stickerValid = cart.find(product => product.productId === config.ogBags[0] || product.productId === config.ogBagsSub[0] || product.productId === config.sourBags[0] || product.productId === config.sourBagsSub[0]);
    if (!stickerValid) cart.push(stickerPrd); // Add sticker to cart if valid

    const sub = getFromStorage('sub', 'session'); // check subscription status

    // Map through cart and add product details to param
    for (let index = 0; index < cart.length; index++) {
        const product = cart[index]!;

        if (product.ProductVariantName) {
            const prId = await findProductId(product.productId);
            if (sub && (prId == null)) {
                formStore.apiErrorAlert = { status: true, message: "Something went wrong" };
                return
            };
            param[`product${index + 1}_id`] = sub && prId ? prId : config.gummyId.toString();
            param[`product${index + 1}_qty`] = '1';

            if (checkoutStore.activeTab === 'onetime') {
                param[`product${index + 1}_price`] =
                    checkoutStore
                        .calculateBagPrice(
                            product.BagsQty!,
                            productPrice.value
                        )
                        .toString();
            }

            param[`variant${index + 1}_id`] =
                product.productId.toString();
        } else {
            param[`product${index + 1}_id`] =
                product.productId.toString();

            param[`product${index + 1}_qty`] = '1';
        }
    }

    if (type === 'order') {
        param.shipProfileId = formFields.shipProfile;
        param.paySource = formStore.paymentMethod?.toUpperCase()!;
        param.cardNumber = formFields.creditCardNumber;
        param.cardMonth = formFields.expiryMonth;
        param.cardSecurityCode = formFields.cardCVV;
        param.cardYear = formFields.expiryYear;
        param.orderId = checkoutStore.orderId;
        if (formStore.paymentMethod?.toUpperCase() === 'PAYPAL') param.paypalBillerId = config.paypalBillerId;
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

    if (eventType !== 'InitiateCheckout') {
        customData.order_id = order.orderId
    }

    const standardEvents = ['PageView', 'AddToCart', 'InitiateCheckout', 'Purchase']

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

// Find Product Id based on variantId
const findProductId = async (variantId: number): Promise<number | null> => {
    const { ogBagsSub, sourBagsSub, subBags } = env();

    const ogIndex = ogBagsSub.indexOf(variantId);
    if (ogIndex !== -1) {
        return subBags[ogIndex] ?? null;
    }

    const sourIndex = sourBagsSub.indexOf(variantId);
    if (sourIndex !== -1) {
        return subBags[sourIndex] ?? null;
    }

    return null;
};
export const fbCAPIAPI = async (eventType: string) => {
    const config = env();
    const fbPixelId = config.pixel_id;
    const fbaccess_token = config.access_token;
    if (!fbPixelId || !fbaccess_token) return;
    const hashedEmail = SHA256('testemail@email.com');
    const hashedPhoneNumber = SHA256(12345679890);
    const getOrderDetail = await getOrderDetails();
    const user_data = {
        client_ip_address: getOrderDetail.ipAddress,
        client_user_agent: navigator.userAgent,
        em: hashedEmail,
        ph: hashedPhoneNumber,
        // Additional hashed fields if `Purchase` event
        ...eventType !== "InitiateCheckout" && {
            fn: await SHA256(getOrderDetail.firstName),
            ln: await SHA256(getOrderDetail.lastName),
            ct: await SHA256(getOrderDetail.city),
            st: await SHA256(getOrderDetail.state),
            zp: await SHA256(getOrderDetail.postalCode),
            country: await SHA256(getOrderDetail.country),
            fbc: getCookie("_fbc") || createFBCID(),
            fbp: getCookie("_fbp")
        }
    };
    const custom_data = {
        currency: "USD",
        value: getOrderDetail.cartTotal,
        item: getOrderDetail.productCart,
        ...(eventType !== "InitiateCheckout" && {
            orderid: getOrderDetail.orderId
        })
    };

    const params = [
        {
            event_name: eventType,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventType != "Purchase" ? 1 : getOrderDetail.orderId,
            event_source_url: window.location.href,
            action_source: "website",
            user_data: user_data,
            custom_data: custom_data,
        },
    ];
    await request('facebookApi', params, false, 'post');
}
export const UpsellsfbCAPIAPI = async (datalayerobj: any) => {
    const config = env();
    const fbPixelId = config.pixel_id;
    const fbaccess_token = config.access_token;
    if (!fbPixelId || !fbaccess_token) return;
    const getOrderDetail = await getOrderDetails();
    const user_data = {
        client_ip_address: getOrderDetail.ipAddress,
        client_user_agent: navigator.userAgent,
        // Additional hashed fields if `Purchase` event
    };
    const custom_data = {
        currency: "USD",
        value: datalayerobj.value,
        ItemPrice: datalayerobj.ItemPrice,
        ItemQty: datalayerobj.ItemQty,
        ItemName: datalayerobj.ItemName,
        orderid: datalayerobj.orderid

    };

    const params = [
        {
            event_name: datalayerobj.event,
            event_time: Math.floor(new Date().getTime() / 1000),
            event_id: datalayerobj.orderid,
            event_source_url: window.location.href,
            action_source: "website",
            user_data: user_data,
            custom_data: custom_data,
        },
    ];
    await request('facebookApi', params, false, 'post');
}
export const SHA256 = (data: any) => {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}
// Function to get the fbclid from URL parameters
export function getFbclid() {
    const urlParameterString = new URLSearchParams(window.location.search);
    return urlParameterString.get("fbclid");
}

// Function to create the fbc ID
export function createFBCID() {
    const subdomainIndex = getSubdomainIndex();
    const creationTime = getCreationTime();
    const fbclid = getFbclid();

    if (fbclid) {
        return `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
    }

    return "Click ID is not present in the URL parameters";
}
// fbc and fbp
export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const part = parts.pop();
        if (part !== undefined) {
            return part.split(";").shift();
        }
    }
}
// Function to get the subdomain index
export function getSubdomainIndex() {
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];
    return Math.abs(hashCode(subdomain!));
}

// Function to get the creation time (first page view timestamp)
export function getCreationTime() {
    const creationTimeKey = "creation_time";
    let creationTime: any = localStorage.getItem(creationTimeKey);
    if (!creationTime) {
        creationTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
        localStorage.setItem(creationTimeKey, creationTime);
    }
    return creationTime;
}
//  Helper function to generate a consistent hash code for a string
export function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}