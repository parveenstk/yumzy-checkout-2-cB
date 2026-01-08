import { getOrderDetails } from "./common";

export async function useOrderDataLayer(eventType: string) {
    if (!import.meta.client) return

    const {
        productCart,
        orderId,
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        tax,
        shipping,
        subTotal,
        cartTotal
    } = await getOrderDetails();

    if (!productCart) return

    const subTotalDefault = subTotal ?? (Array.isArray(productCart) ? productCart.reduce((acc: number, item: any) => {
        return acc + (Number(item.productPrice) ?? Number(item.price) ?? 0);
    }, 0) : 0);

    const cartTotalDefault = cartTotal ?? (Number(subTotalDefault) || 0) + (Number(shipping) || 0);

    window.dataLayer = window.dataLayer || [];

    // RESET PREVIOUS STATE
    resetDataLayerState();

    window.dataLayer.push(
        {
            event: eventType,
            currency: 'USD',
            subTotal: subTotalDefault,
            shipping: shipping,
            tax,
            total: cartTotalDefault,
            items: productCart,

            ...(eventType === 'Purchase' && {
                customerfname: firstName,
                customerlname: lastName,
                customeremail: emailAddress,
                customerphone: phoneNumber,
                orderid: orderId
            })
        }
    );

    // console.log('[GTM order]', dataLayerObj)
}

export function useUpsellsDataLayer(dataLayerObj: any) {
    if (!import.meta.client) return

    window.dataLayer = window.dataLayer || []

    // RESET EVERYTHING FIRST
    resetDataLayerState();

    window.dataLayer.push({
        ...JSON.parse(JSON.stringify(dataLayerObj))
    });

    // console.log('[GTM upsell]', dataLayerObj)
}

function resetDataLayerState() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        // ❌ NO `event` HERE
        currency: undefined,
        subTotal: undefined,
        shipping: undefined,
        tax: undefined,
        total: undefined,
        items: undefined,
        customerfname: undefined,
        customerlname: undefined,
        customeremail: undefined,
        customerphone: undefined,
        orderid: undefined,
        ItemName: undefined,
        ItemPrice: undefined,
        ItemQty: undefined,
        value: undefined
    });
}
