export interface ProductData {
    id: number;
    img: { [key: string]: string };
    title: { [key: string]: string };
    bagQty: number;
    compareAtPrice: number;
    price: number;
    percentageOff: number;
}

export interface FormFields {

    // Basic fields
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;

    // Shipping fields
    shipFirstName: string;
    shipLastName: string;
    shipStreetAddress: string;
    shipApptsAddress: string;
    shipCity: string;
    shipCounty: string;
    shipState: string;
    shipPostalCode: string;

    // Credit card fields
    creditCardNumber: string;
    cardCVV: string;
    expiryMonth: string;
    expiryYear: string;

    // Billing fields
    billingFirstName: string;
    billingLastName: string;
    billingStreetAddress: string;
    billingApptsAddress: string;
    billingCity: string;
    billingCounty: string;
    billingState: string;
    billingPostalCode: string;

    // Shipping Profile
    shipProfile: string;
};

export interface CampaignProducts {
    campaignProductId: number;
    productName: string;
    price: string;
    productQty: number;
    imageUrl: string;
    hasVariants: boolean;
    variants: CampaignVariant[];
    productType: string
}

export interface CampaignVariant {
    imageUrl: string;
    isOutOfStock: number; // or `boolean` if converted
    price: string;
    productSku: string;
    title: string;
    variantDetailId: number;
    variantName1: string;
    productQty: number;
    variantOptionName1: string;
    variantOptionName2: string;
}

export interface StructuredProducts {
    productId: number,
    productName: string,
    productImage: string,
    productPrice: string,
    ProductVariantName?: string;
    BagsQty?: string;
    compareAtPrice?: number;
    percentageOff?: number;
    productType?: string,
    subscriptionName?: string
}

export interface GummyBagOption {
    id: number;
    header: string;
    title: string;
    price: number;
    shipping: string;
};

export interface ShipProfile {
    profileName: string;
    shipProfileId: number;
    rules: SimplifiedRule[];
}

export interface SimplifiedRule {
    profileName: string;
    productTypeSelect: string;
    shipPrice: number;
    shipProfileId: number;
}

export interface Country {
    countryCode: string;
    countryName: string;
}

export interface AllCountries extends Country {
    stateCode: string;
    stateName: string;
}

export interface IpAddress {
    ip: string
}

export interface SavedOrderDetails {
    profileName: string;
    shipProfileId: number;
    totalAmount: string;
    shipTotal: string;
    items: OrderDetail[];
}

export interface OrderDetail {
    name: string
    price: string;
    title: string;
}

export interface ApiResponse {
    result: string
    message: string
};

// Product Reciept interface
export interface ProductReceipt {
    variantDetailId: string;
    title: string;
    qty: string;
    price: string;
    name: string;
    productId: string;
};

export interface ProductReceiptSessionItems {
    product_id: string;
    title: string;
    price: string;
    product_qty: string;
    variant_id: string;
    variant_title: string;
};