import axios, { type AxiosRequestConfig, type Method } from "axios";
import { compareAtPrice } from "~/assets/data/checkout";
import { getFromStorage, saveToStorage } from "~/utils/storage";
import { useCheckoutStore, useFormStore } from "../../stores/index";
import { mapToProductCart, params } from "./common";

const api = axios.create({
    baseURL: 'api/konnective', // change this to your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
})

type ApiResponse<T = any> = {
    encrypted?: boolean
    data: T | string
};

export const request = async <T = any>(
    route: string,
    payload: Record<string, any> = {},
    encrypt = false,
    method: Method = 'POST',
): Promise<T> => {
    try {
        const config: AxiosRequestConfig = {
            url: route,
            method,
            ...(method === 'GET' ? { params: payload } : { data: { payload } }),
            headers: {
                ...(encrypt ? { 'X-Encrypt': '1' } : {}),
            },
        }
        // console.log("config:", config)

        const response = await api.request<ApiResponse<T>>(config)

        if (response.data.encrypted) {
            const decoded = atob(response.data.data as string)
            return JSON.parse(decoded)
        }

        return response.data.data as T
    } catch (error: any) {
        console.error('API Error:', error)
        throw new Error(error?.response?.data?.error || 'API request failed')
    }
};

// Fetch Query Campaign
export const queryCampaign = async () => {
    const formStore = useFormStore();
    const checkoutStore = useCheckoutStore();
    const config = env();
    const response = await request('/queryCampaign', { campaignId: config.campaignId, campaignProductId: `${config.gummyId}, ${config.WarrantyId}, ${config.giftItems.join(',')}, ${config.subBags.join(',')}` });

    // show error if "response isn't available"
    if (!response) {
        formStore.apiErrorAlert = { status: true, message: "Something went wrong" }
        return;
    };

    // show if "response.result isn't success"
    if (response.result !== 'SUCCESS') formStore.apiErrorAlert = { status: true, message: response.message };

    // processing data
    const data = response.message.data[config.campaignId];
    const products: CampaignProducts[] = data.products;
    const shipProfiles: ShipProfile[] = data.shipProfiles;
    const countries: Country[] = data.countries;
    checkoutStore.availableCountires = [...countries];

    const structuredProducts: StructuredProducts[] = []; // For Products
    const simplifiedRules: SimplifiedRule[] = []; // For ShipProfiles

    // ship profiles
    shipProfiles.forEach((profile) => {
        if (profile.rules && profile.rules.length > 0) {
            profile.rules.forEach((rule) => {
                simplifiedRules.push({
                    profileName: profile.profileName,
                    productTypeSelect: rule.productTypeSelect,
                    shipPrice: rule.shipPrice,
                    shipProfileId: profile.shipProfileId
                });
            });
        }
    });
    checkoutStore.shipProfiles = [...simplifiedRules]
    // console.log("Simplified rules:", checkoutStore.shipProfiles);

    // All products
    products.forEach((product: CampaignProducts) => {
        if (product.hasVariants) {
            const variants = product.variants;
            variants.forEach((variant) => {
                structuredProducts.push({
                    productId: variant.variantDetailId,
                    productName: variant.title,
                    productImage: variant.imageUrl,
                    productPrice: variant.price,
                    ProductVariantName: variant.variantOptionName1,
                    BagsQty: variant.variantOptionName2 ?? product.productName.split(' - ')[1],
                    compareAtPrice: compareAtPrice[variant.variantOptionName2 ?? product.productName.split(' - ')[1]]?.price,
                    percentageOff: compareAtPrice[variant.variantOptionName2 ?? product.productName.split(' - ')[1]]?.discount,
                    subscriptionName: compareAtPrice[variant.variantOptionName2 ?? product.productName.split(' - ')[1]]?.subscriptionName,
                });
            });
        } else {
            structuredProducts.push({
                productId: product.campaignProductId,
                productName: product.productName,
                productImage: product.imageUrl,
                productPrice: product.price,
                productType: product.productType,
                compareAtPrice: compareAtPrice[product.productName]?.price,
            });
        }
    });

    // Gift Products
    const giftProducts = structuredProducts.filter(product => config.giftItems.includes(product.productId));
    // Subscription Products
    const subProducts = structuredProducts.filter(product => config.subBags.includes(product.productId));

    // Save both to the store (you'll need to update the store method)
    checkoutStore.saveProducts(structuredProducts, giftProducts, subProducts);
};

// Fetch Import Click 
export const importClick = async () => {
    const formStore = useFormStore();
    const checkoutStore = useCheckoutStore();
    const pageType = checkoutStore.pageType;
    const config = env();
    const response = await request('/importClick', {
        pageType: pageType,
        requestUri: window.location.href,
        sessionId: getFromStorage('sessionId', 'local') || '',
        campaignId: config.campaignId
    });

    if (response.result !== 'SUCCESS') formStore.apiErrorAlert = { status: true, message: response.message };

    saveToStorage('sessionId', response.message.sessionId, 'local');
    saveToStorage('sessionId', response.message.sessionId, 'session');

    console.log("sessionId-local:", getFromStorage('sessionId', 'local'));
    console.log("sessionId-session:", getFromStorage('sessionId', 'session'));
};

// Fetch Import Lead
export const importLead = async () => {
    const formStore = useFormStore();

    // checkoutStore
    console.log("importLead called");
    const checkoutStore = useCheckoutStore();

    const payload = await params();
    console.log("importLead → payload:", payload);
    if (!payload) return;

    const response = await request('/importLead', payload);
    // console.log("importLead → response:", response);
    if (response.result !== 'SUCCESS') {
        formStore.apiErrorAlert = { status: true, message: response.message }
        return;
    };

    saveToStorage("orderId", response.message.orderId, "local");
    checkoutStore.orderId = response.message.orderId;
    console.log('orderId:', getFromStorage('orderId', 'local'));
};

// Import Order
export const importOrder = async () => {
    const formStore = useFormStore();
    const checkoutStore = useCheckoutStore();
    const router = useRouter()
    const payload = await params('order');
    if (!payload) return;
    const response = await request('/importOrder', payload);
    console.log('importOrder response:', response);

    // saving response in variable
    if (response.result !== 'SUCCESS') {
        formStore.apiErrorAlert = { status: true, message: response.message };
        return;
    };
    // console.log('formStore.apiErrorAlert:', formStore.apiErrorAlert);

    const mapppedData = mapToProductCart(response.message.items);

    // add puchased items in session to use on thankyou page
    saveToStorage('productReceipt', { subTotal: response.message.subTotal, shipping: response.message.shipTotal, tax: response.message.taxTotal, total: response.message.totalAmount, items: mapppedData }, "session");

    // Important for DataLayer and CAPI
    saveToStorage('productCart', mapppedData, "session");
    saveToStorage('subTotal', response.message.subTotal, "session");
    saveToStorage('shipping', response.message.shipTotal, "session");
    saveToStorage('tax', response.message.taxTotal, "session");
    saveToStorage('cartTotal', response.message.amountPaid, "session");
    saveToStorage('orderId', response.message.orderId, "session");

    const message = response.message;

    // Construct the object with the required fields
    const savedOrderDetails: SavedOrderDetails = {
        profileName: message.profileName,
        shipProfileId: message.shipProfileId,
        totalAmount: message.totalAmount,
        items: message.items,
        shipTotal: message.shipTotal
    };

    // Save to session storage
    saveToStorage('savedOrderDetails', savedOrderDetails, 'session');
    console.log('savedOrder:', savedOrderDetails);

    if (response.message.paypalUrl) {
        window.location.href = response.message.paypalUrl;
        return;
    }

    saveToStorage('stepCompleted', 1, 'local')
    router.push({ path: '/upsell1', state: { from: 'importorder' } });

};

// Upsell Import
export const importUpsell = async ({ productId, productQty, productPrice, variantDetailId, pageTo, event }: { productId: string, productQty: number, productPrice: string, variantDetailId: string, pageTo: string, event: string }) => {

    // formStore
    const formStore = useFormStore();
    const alert = formStore.apiErrorAlert;

    // checkoutStore
    const checkoutStore = useCheckoutStore();
    checkoutStore.setTransactionStatus(true);

    const orderId = await getFromStorage('orderId', "local");
    const params = {
        orderId,
        productId,
        productQty,
        productPrice: "",
        variantDetailId,
    }

    if (+productPrice > 0) params.productPrice = productPrice;

    const response: any = await request('importUpsell', params)
    console.log("response", response)

    const router = useRouter();
    if (response.result === 'SUCCESS') {
        checkoutStore.setTransactionStatus(false);

        // Important for DataLayer and CAPI
        const mapppedData = mapToProductCart(response.message.items);
        saveToStorage('productCart', mapppedData, "session");
        saveToStorage('subTotal', response.message.subTotal, "session");
        saveToStorage('shipping', response.message.shipTotal);
        saveToStorage('tax', response.message.taxTotal, "session");
        saveToStorage('cartTotal', response.message.amountPaid, "session");
        saveToStorage('orderId', response.message.orderId, "session");
        saveToStorage('productReceipt', { subTotal: response.message.subTotal, shipping: response.message.shipTotal, tax: response.message.taxTotal, total: response.message.totalAmount, items: mapppedData }, "session");

        // when user goes from upsell1 to upsell2 
        if (pageTo === '/upsell2') {
            saveToStorage('stepCompleted', 2, 'local');
        }

        const purchasedProduct = mapppedData.find((item: any) => +item.product_id === +productId);
        const datalayerobj = {
            event: event,
            currency: "USD",
            ItemName: purchasedProduct?.title,
            ItemPrice: purchasedProduct?.price,
            value: purchasedProduct?.price,
            ItemQty: productQty,
            orderid: response.message.orderId,
        };

        router.push({ path: pageTo, state: { from: 'importupsell', datalayerobj: datalayerobj } });
    }
    else {
        alert.status = true;
        alert.message = response.message;
        checkoutStore.setTransactionStatus(false);
        router.push({ path: pageTo });
    }
}

// Confirm PayPal --------> THIS IS WORKING
export const confirmPaypal = async () => {
    const router = useRouter();
    const route = useRoute();
    // const paypalAccept = route.query.paypalAccept; // Not in use for now
    const token = route.query.token;
    const ba_token = route.query.ba_token;
    const payerID = route.query.PayerID;
    if (!payerID && !ba_token) return;
    // const checkoutStore = useCheckoutStore();
    const config = env();
    const sessionId = await getFromStorage('sessionId', "session");
    const vipOptIn = await getFromStorage('sub', 'session'); // need to track this
    const paypalBillerId = config.paypalBillerId;
    const params: any = { sessionId, paypalBillerId };
    params.campaignId = config.campaignId;
    // Need to confogure shipping correctly
    params.shipProfileId = config.shipProfiles[0];
    if (vipOptIn) {
        params.shipProfileId = config.shipProfiles[1];
    }
    params.token = token;
    params.payerId = payerID;
    params.baToken = ba_token;
    params.custom1 = "Yumzy Store";
    params.custom2 = "Checkout-2-c";
    params.custom3 = "LP1-CH3";
    params.custom5 = "API-Checkout";

    const productReceipt: any = await getFromStorage('productReceipt', 'session');
    const productCart: any = productReceipt ? productReceipt.items : [];
    if (productCart && productCart.length > 0) {
        productCart.map((el: any, index: any) => {

            if (el.variant_title) {
                params[`product${index + 1}_id`] = el.product_id;
                params[`product${index + 1}_qty`] = el.product_qty;
                params[`product${index + 1}_price`] = el.price;
                params[`variant${index + 1}_id`] = el.variant_id;
            } else {
                params[`product${index + 1}_id`] = el.product_id;
                params[`product${index + 1}_qty`] = el.product_qty;
                params[`product${index + 1}_price`] = el.price;
            }
        });
    }

    const response = await request('/confirmPayPal', params);
    if (response.result === "SUCCESS") {
        // Important for DataLayer and CAPI
        const mapppedData = mapToProductCart(response.message.items);
        saveToStorage('productCart', mapppedData, 'session');
        saveToStorage('subTotal', response.message.subTotal, 'session');
        saveToStorage('shipping', response.message.shipTotal, 'session');
        saveToStorage('tax', response.message.taxTotal, 'session');
        saveToStorage('cartTotal', response.message.totalAmount, 'session');
        saveToStorage('orderId', response.message.orderId, 'session');

        // add puchased items in session to use on thankyou page
        saveToStorage('productReceipt', { subTotal: response.message.subTotal, shipping: response.message.shipTotal, tax: response.message.taxTotal, total: response.message.totalAmount, items: mapppedData }, 'session');
        
        // checkoutStore.setStepCompleted(1);
        // checkoutStore.updateConfirmPaypalLoading(false);
        await router.push({ path: '/upsell1', state: { from: 'importorder' } });
        return true;
    }
    if (response.result === "ERROR") {
        const formStore = useFormStore();
        formStore.apiErrorAlert = { status: true, message: response.message };
        // checkoutStore.updateAlert(true, response.message);
        // checkoutStore.updateConfirmPaypalLoading(false);
        return false;
    }
}

// Countries
export const countries = async () => {
    const checkoutStore = useCheckoutStore();
    const response = await request('/countires', {}, false, "GET");
    checkoutStore.allCountries = response;
    // console.log('countries:', checkoutStore.allCountries); // debug
};

// Ip Address 
export const fetchIpInfo = async () => {
    try {
        const requestOptions: RequestInit = {
            method: "GET",
            redirect: "follow",
        };
        // await fetch("https://ipinfo.io/json", requestOptions)
        const checkoutStore = useCheckoutStore();
        const response = await fetch("https://ipinfo.io/json", requestOptions);
        const data = await response.json();
        const ip = data.ip; // getting ip address

        checkoutStore.ipAddress = ip;
        // console.log('checkoutStore.ipAddress:', checkoutStore.ipAddress);

        return { data, ip };
    } catch (error) {
        // throw new Error;
        console.error("Error fetching IP address:", error);
        return error;
    }
};