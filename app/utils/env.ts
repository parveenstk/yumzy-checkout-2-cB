export const env = () => {
    const config = useRuntimeConfig().public;
    const param = getFromStorage<"lp1" | "lp2" | "lp3" | "default">("lpParam", "session") || "default";
    const lp = config.checkout[param];
    return {
        campaignId: lp.campaignId,
        pixel_id: config.pixel_id,
        access_token: config.access_token,
        gummyId: lp.gummyId,
        WarrantyId: lp.WarrantyId,
        giftItems: lp.giftItems,
        shipProfiles: lp.shipProfiles,
        variantIds: config.variantIds,
        ogBags: config.ogBags,
        ogBagsSub: config.ogBagsSub,
        sourBags: config.sourBags,
        sourBagsSub: config.sourBagsSub,
        oneTimePrice: config.oneTimePrice,
        offer1: lp.offer1,
        offer1_1: lp.offer1_1,
        offer2: lp.offer2,
        offer2_1: lp.offer2_1,
        upsell2VariantIds: config.upsell2VariantIds,
        GTM_id: config.GTM_id,
        paypalBillerId: config.paypalBillerId,
        subBags: lp.subBags,
    };
}