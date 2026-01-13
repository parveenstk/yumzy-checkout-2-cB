export const gummyBagsSelector: GummyBagOption[] = [

    {
        id: 3,
        header: 'Best Seller 60% off',
        title: "3 bags",
        price: 32,
        shipping: "FREE"
    },

    {
        id: 2,
        header: 'Great Value 51% off',
        title: "2 bags",
        price: 39,
        shipping: "FREE"
    },

    {
        id: 4,
        header: 'Limited Time 63% off',
        title: "4 bags",
        price: 29,
        shipping: "FREE"
    },

    {
        id: 1,
        header: 'Good Choice 40% off',
        title: "1 bag",
        price: 48,
        shipping: "4.99"
    }
];

export const gymmyTypeData = [
    {
        id: 'ogBags',
        img: '/images/og-bag.png',
        name: 'OG Gummies',
        alt: 'og-bag'
    },

    {
        id: 'sourBags',
        img: '/images/sour-bag.png',
        name: 'Sour Gummies',
        alt: 'sours-bag'
    }
];

export const productData: ProductData[] = [
    {
        id: 1,
        img: {
            ogBags: '/images/og-bag.png',
            sourBags: '/images/sour-bag.png'
        },
        title: {
            ogBags: 'OG Gummies',
            sourBags: 'Sours Gummies'
        },
        bagQty: 2,
        compareAtPrice: 159.98,
        price: 78,
        percentageOff: 51

    },

    {
        id: 2,
        img: {
            ogBags: '/images/og-bag.png',
            sourBags: '/images/sour-bag.png'
        },
        title: {
            ogBags: 'OG Gummies',
            sourBags: 'Sours Gummies'
        },
        bagQty: 3,
        compareAtPrice: 239.97,
        price: 96,
        percentageOff: 60
    },

    {
        id: 3,
        img: {
            ogBags: '/images/og-bag.png',
            sourBags: '/images/sour-bag.png'
        },
        title: {
            ogBags: 'OG Gummies',
            sourBags: 'Sours Gummies'
        },
        bagQty: 1,
        compareAtPrice: 79.99,
        price: 48,
        percentageOff: 40
    },

    {
        id: 4, // Extra product
        img: {
            sourBags: '/images/og-bag.png',
            ogBags: '/images/sour-bag.png'
        },
        title: {
            sourBags: 'OG Gummies - Extra',
            ogBags: 'Sours Gummies - Extra'
        },
        bagQty: 1,
        compareAtPrice: 79.99,
        price: 48,
        percentageOff: 40
    }
];

export const slides = [
    '/images/carausel_images/image-1.jpg',
    '/images/carausel_images/image-2.jpg',
    '/images/carausel_images/image-3.jpg',
    '/images/carausel_images/image-4.jpg',
    '/images/carausel_images/image-5.jpg',
    '/images/carausel_images/image-6.jpg',
    '/images/carausel_images/image-7.jpg',
];

export const cardExpiryMonths = [
    { code: "01", name: "01 - January" },
    { code: "02", name: "02 - February" },
    { code: "03", name: "03 - March" },
    { code: "04", name: "04 - April" },
    { code: "05", name: "05 - May" },
    { code: "06", name: "06 - June" },
    { code: "07", name: "07 - July" },
    { code: "08", name: "08 - August" },
    { code: "09", name: "09 - September" },
    { code: "10", name: "10 - October" },
    { code: "11", name: "11 - November" },
    { code: "12", name: "12 - December" }
];

export const getCardExpiryYears =
    (startYear = new Date().getFullYear(), numYears = 10): { value: string; name: string }[] =>
        Array.from({ length: numYears }, (_, i) => {
            const year = startYear + i;
            return { value: String(year), name: String(year) };
        });

export const compareAtPrice: { [key: string]: { price: number, discount: number, subscriptionName?: string } } = {
    "1 Bag": { price: 79.99, discount: 40, subscriptionName: '1-bag subscription' },
    "2 Bags": { price: 159.98, discount: 51, subscriptionName: '2-bag subscription' },
    "3 Bags": { price: 239.97, discount: 60, subscriptionName: '3-bag subscription' },
    "4 Bags": { price: 319.96, discount: 63, subscriptionName: '4-bag subscription' },
    "Mystery Gift": { price: 4.99, discount: 0 },
    "Yumzy Interactive E-book": { price: 9.99, discount: 0 },
    "Yumzy $20 Gift Card": { price: 20.00, discount: 0 },
    "Chance for Order Refund": { price: 239.97, discount: 0 },
    "Yumzy Order Protection": { price: 2.89, discount: 0 },
}
