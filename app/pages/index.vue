<script setup lang="ts">
import { cardExpiryMonths, getCardExpiryYears, gummyBagsSelector, gymmyTypeData, slides } from '~/assets/data/checkout';
import GiftItemsSkeleton from '~/components/skeleton/GiftItemsSkeleton.vue';
import { checkSteps } from '~/composables/checkSteps';
import { fbCAPI } from '~/composables/common';
import { useOrderDataLayer } from '~/composables/useGtm.client';
import { importClick, queryCampaign } from '~/composables/useKonnectiveApi';
import { Faq, Footer, GiftItems, Header, Reviews, Tabs } from '~/utils';
import { useCheckoutStore, useFormStore } from '../../stores/index';

// checking which checkout 
definePageMeta({
    middleware: 'default-params',
})

// Config env
const config = env();

// form store data 
const formStore = useFormStore();
const { formFields, formSubmit, errors, validateField, handleBillSame } = formStore;

// checkout Store
const checkoutStore = useCheckoutStore();
checkoutStore.setPageType('checkoutPage');

// meta tag details
useHead({
    title: "Secure Checkout | Yumzy",
    meta: [
        { name: 'description', content: "Complete your Yumzy order securely." },
    ],
})

// Use computed to sync with store's paymentMethod
const paymentMethod = computed({
    get: () => formStore.paymentMethod,
    set: (value: 'creditCard' | 'payPal') => {
        formStore.paymentMethod = value
    }
});

// Gummy bags
const selectedBag = ref(3);

// track screen size
const isMobile = ref(false)

// placeholder based on screen size
const phonePlaceholder = computed(() =>
    isMobile.value
        ? 'Phone for order tracking'
        : 'Phone number for tracking information'
)

// carousel slider
const activeSlide = ref(0)
const currentSlide = computed(() => slides[activeSlide.value])

const next = () => {
    activeSlide.value = (activeSlide.value + 1) % slides.length
}

const prev = () => {
    activeSlide.value = (activeSlide.value - 1 + slides.length) % slides.length
}

const goTo = (index: number) => {
    activeSlide.value = index
}

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const cardExpiryYears = ref(getCardExpiryYears());

// Watch for expiryMonth changes
watch(() => formFields.expiryMonth, (selectedMonth) => {
    if (!selectedMonth) {
        cardExpiryYears.value = getCardExpiryYears(currentYear);
        return;
    }

    const selectedMonthNum = parseInt(selectedMonth, 10);

    if (selectedMonthNum < currentMonth) {
        cardExpiryYears.value = getCardExpiryYears(currentYear + 1);
    } else {
        cardExpiryYears.value = getCardExpiryYears(currentYear);
    }

    // Clear previously selected year if it no longer exists
    if (!cardExpiryYears.value.find(y => y.value === formFields.expiryYear)) {
        formFields.expiryYear = '';
    }
});

// timer funtionality
const minutes = ref(10)
const seconds = ref(0)

let countdownInterval: ReturnType<typeof setInterval> | null = null

function startCountdown() {
    countdownInterval = setInterval(() => {
        if (seconds.value === 0) {
            if (minutes.value === 0) {
                if (countdownInterval) clearInterval(countdownInterval)
                return
            }
            minutes.value--
            seconds.value = 59
        } else {
            seconds.value--
        }
    }, 1000)
}

// Add data in Cart
const addProductData = (id: number) => {
    const sub = getFromStorage('sub', 'session'); // check subscription status
    selectedBag.value = id;
    saveToStorage("selectedGummyType", checkoutStore.selectedGummyType, 'session');
    const variantId = sub ? config[`${checkoutStore.selectedGummyType as 'ogBags' | 'sourBags'}Sub`][selectedBag.value - 1] : config[checkoutStore.selectedGummyType as 'ogBags' | 'sourBags'][selectedBag.value - 1];
    if (!variantId) return;

    checkoutStore.selectedQuantity = variantId;
    checkoutStore.addGummyProduct();
};

// Calculate total compareAt price
const calculateComparePrice = () => {
    const subtotal = checkoutStore.cartData.reduce((a, p, i) => {
        return a += +p.compareAtPrice!
    }, 0)

    let shipping = 0;
    if (checkoutStore.shipProfiles.length > 0) {
        const shipProfile = checkoutStore.shipProfiles.filter(shipping => shipping.shipProfileId === +formStore.formFields.shipProfile);
        if (shipProfile.length < 1) return;
        shipping = shipProfile[0]?.shipPrice || 0;
    } else return (0).toFixed(2);

    // console.log('subtotal:', subtotal);
    // console.log('shipping:', shipping);

    return (subtotal + Number(shipping)).toFixed(2);
};

// Switch Gummy Type
const switchGummyType = (type: string) => {
    const sub = getFromStorage('sub', 'session'); // check subscription status
    checkoutStore.selectedGummyType = type;
    saveToStorage("selectedGummyType", type, 'session');
    const bagQty = selectedBag.value;
    saveToStorage("selectedGummyBag", bagQty, 'session');
    const activeBag = gummyBagsSelector.find(bag => bag.id === bagQty)!;
    if (!activeBag) return;

    const variantId = sub ? config[`${type as 'ogBags' | 'sourBags'}Sub`][selectedBag.value - 1] : config[type as 'ogBags' | 'sourBags'][selectedBag.value - 1];

    if (!variantId) return;

    checkoutStore.selectedQuantity = variantId;
    checkoutStore.addGummyProduct();
};

// showing the dynatotal price 
const termsHtml = computed(() => {
    const price = checkoutStore.calculateTotalPrice.toFixed(2)
    const terms = termsAndCondition(price)

    return checkoutStore.activeTab !== 'subscribe'
        ? terms[1]
        : terms[0]
})

// On Mount
onMounted(async () => {

    // Config env
    const config = env();

    // check stetps affter successfull order
    checkSteps()
    await confirmPaypal();

    // Query Campaign
    await queryCampaign();

    // Getting all countries
    await countries();

    // Set default country as US
    formStore.handleCountry('US', 'ship')

    // Getting API
    await fetchIpInfo();

    // Initialize selected gummy and quanity on load
    checkoutStore.selectedGummyType = "ogBags";
    checkoutStore.selectedQuantity = config.ogBagsSub[2] || 6791; // 3 Bags of Sub Gummies
    checkoutStore.addGummyProduct(); // add product in cart afterwards

    // Updating the screen size
    const update = () => { isMobile.value = window.innerWidth < 768 }
    update()
    window.addEventListener('resize', update)

    startCountdown() // timer runs

    // Import Click
    await importClick();

    // Add insaurance 
    checkoutStore.addExtraProduct();
    // console.log("checkoutStore.cartData", checkoutStore.cartData);

    // Facebook CAPI & GTM DataLayer - InitiateCheckout event
    setTimeout(() => {
        fbCAPI("InitiateCheckout");
        fbCAPIAPI("InitiateCheckout");
        useOrderDataLayer("InitiateCheckout");
    }, 1000);

})

watch(paymentMethod, (newValue) => {
    console.log('selected payment method:', newValue);
});

watch(checkoutStore.cartData, (newCartData) => {
    // console.log('newCartData:', newCartData)
})

</script>

<template>
    <!-- Alert -->
    <Alert />

    <!-- Header Section -->
    <Header />

    <main>
        <section class="w-full pt-3 p-2">
            <div class="max-w-[1200px] bg-white mx-auto grid grid-cols-1 md:grid-cols-[45%_55%] gap-8 items-center  
            lg:p-6 p-3 px-3 md:px-3 lg:px-8 border-[3px] lg:border-dashed border-solid border-[#000]">

                <!-- Left: Image & Reasons -->
                <div class="flex flex-col items-center md:items-start text-center md:text-left">
                    <div x-data="carousel()" class="w-full max-w-4xl space-y-4">

                        <!-- Main Image -->
                        <div class="relative overflow-hidden rounded-xl shadow-lg">
                            <NuxtImg :src="currentSlide" width="509" height="auto" alt="Carousel Image"
                                class="w-full object-cover transition duration-500 md:max-h-[477px]" />

                            <!-- Prev Button -->
                            <button @click="prev"
                                class="absolute text-4xl w-15 h-15 top-1/2 left-3 -translate-y-1/2 p-2 rounded-full shadow ">
                                &#10094;
                            </button>

                            <!-- Next Button -->
                            <button @click="next"
                                class="absolute w-15 text-4xl h-15 top-1/2 right-3 -translate-y-1/2 p-2 rounded-full shadow ">
                                &#10095;
                            </button>
                        </div>

                        <!-- Thumbnails -->
                        <div class="flex justify-center space-x-2">
                            <template v-for="(slide, index) in slides" :key="index">
                                <NuxtImg width="72" height="72" :src="slide" @click="goTo(index)" :class="activeSlide === index
                                    ? 'ring-2 ring-blue-500 opacity-100'
                                    : 'opacity-60 hover:opacity-100'"
                                    class="w-12 h-12 lg:w-20 lg:h-20 object-cover rounded cursor-pointer transition p-1 overflow-hidden"
                                    alt="carousel-thumbails" />
                            </template>
                        </div>
                    </div>

                </div>

                <!-- Right: Text Content -->
                <div class="space-y-4  md:pr-[2.3rem] lg:pr-0">
                    <h2 class="text-4xl extrablod text-gray-900 leading-snug text-center md:text-left hidden lg:block">
                        18 Superfoods So Good, They'll Think It's Candy.
                    </h2>
                    <h2
                        class="text-[calc(7vw-0px)] sm:text-[calc(6vw-0px)] md:text-2xl extrablod text-gray-900 leading-snug text-center md:text-left lg:hidden">
                        18 Superfoods So Good, <br>They'll Think It's Candy.
                    </h2>

                    <!-- Points -->
                    <div class="space-y-4 text-left">
                        <div v-for="point in keyPoints" class="flex items-start">
                            <NuxtImg src="/images/rightarrow.svg" alt="rightarrow.svg-Img"
                                class="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                            <p class="text-gray-700">{{ point }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Timer -->
        <section class="w-full lg:py-5 lg:p-2 py-2 p-0">
            <div
                class="max-w-[1200px] flex bg-yellow-200 border border-yellow-300 rounded-md lg:px-4 px-2  py-2 lg:py-6 items-center justify-center text-sm sm:text-base text-gray-800 font-medium mx-2 lg:mx-auto">

                <!-- Fire Icon -->
                <NuxtImg src="/images/fire.svg" alt="Fire" class="w-8 h-8 sm:w-8 sm:h-8 mr-2 flex-shrink-0" />

                <!-- Text -->
                <p class="text-center text-lg extrablod">Hurry. We currently have your order reserved. But Yumzy is
                    selling like hotcakes, and we anticipate selling out soon.
                </p>
            </div>
        </section>

        <div class="max-w-[1200px] mx-auto px-0 py-2 grid grid-cols-1 md:grid-cols-2 gap-1 lg:gap-8">

            <!-- Left Column -->
            <div class="lg:p-0 p-2 ">
                <div class="bg-white p-3 rounded-lg shadow">

                    <div class="flex items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <!-- Left Icon -->
                        <DiscountBadge />

                        <!-- Right Text -->
                        <div class="text-center sm:text-center space-y-1">
                            <p class="text-700 text-[#C91F3F] extrablod text-xl">Your Discount Is Applied</p>
                            <p class="text-gray-700">Your Order Today Qualifies for a <span class="extrablod">Bulk
                                    Discount</span></p>
                        </div>
                    </div>

                    <!-- STEP 1: Select Gummy Style -->
                    <h2 class="text-lg font-bold mt-3 border-b border-[#e7e7e7] pb-4 py-4 mb-4 uppercase">
                        STEP 1: Select Gummy Style
                    </h2>

                    <div v-if="checkoutStore.allProducts.length < 1">
                        <SkeletonProductSelector />
                    </div>

                    <!-- Gummies Selectors -->
                    <div v-else
                        class="flex flex-wrap flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 lg:space-x-6 mb-8">
                        <div v-for="value in gymmyTypeData" :key="value.id"
                            class="flex items-center space-x-1 cursor-pointer relative select-none mb-4 lg:mb-0 last:mb-0"
                            @click="() => switchGummyType(value.id)">
                            <div class="w-6 h-6 border-2 shrink-0 rounded-full flex items-center justify-center ml-3 border-[#172969]"
                                :class="{ 'bg-[#172969]': checkoutStore.selectedGummyType === value.id }">
                                <NuxtImg v-if="checkoutStore.selectedGummyType === value.id" src="/images/whiteTick.svg"
                                    alt="white-tick" />
                            </div>

                            <NuxtImg :src="value.img" width="64" height="64" :alt="value.alt" />
                            <span class="text-gray text-lg leading-5 font-extrabold">
                                {{ value.name }}
                            </span>
                        </div>
                    </div>

                    <!-- STEP 2: Select Order Quantity -->
                    <h2 class="text-lg font-bold mt-3 border-b border-[#e7e7e7] pb-4 py-4 mb-4 uppercase">
                        STEP 2: Select Order Quantity
                    </h2>

                    <div v-for="value in gummyBagsSelector" :key="value.id" @click="addProductData(value.id)" :class="[
                        'flex items-center justify-between cursor-pointer transition relative select-none py-2.5 pr-2.5',
                        value.id === 3 ? 'bg-yellow-400/90' : 'bg-white']">

                        <div class="flex items-center space-x-3">

                            <!-- Selected Bag Indicator -->
                            <div class="min-w-6 w-6 h-6 rounded-full flex items-center justify-center ml-3 border-2 border-[#172969]"
                                :class="{ 'bg-[#172969]': selectedBag === value.id, 'border-[#172969]': selectedBag !== value.id }">
                                <NuxtImg v-if="selectedBag === value.id" src="/images/whiteTick.svg"
                                    alt="whiteTick.svg" />
                            </div>

                            <!-- Header and Bag Qty -->
                            <p class="flex flex-col" :class="{ 'font-bold': value.id === 3 }">
                                <span>{{ value.header }}</span>
                                <span class="text-gray-800 w-fit">{{ value.title }}</span>
                            </p>
                        </div>

                        <!-- Shipping & Each Bag Price -->
                        <div :class="[
                            'text-right text-sm text-gray-900', value.id === 3 ? 'font-bold' : '']">
                            <p> ${{ value.price.toFixed(2) }} {{ value.id === 1 ? 'each' : 'ea.' }} </p>
                            <p>
                                {{ value.id === 1 ?
                                    `$${checkoutStore.shipProfiles.length > 0 ? checkoutStore.shipProfiles[0]?.shipPrice :
                                        value.shipping} Shipping` : `${value.shipping} Shipping` }}
                            </p>

                        </div>

                        <!-- Red Arrow -->
                        <NuxtImg v-if="value.id === 3" src="/images/redarrow.svg"
                            class="w-8 lg:w-12 absolute lg:-left-10 -left-5" alt="Best Seller Arrow" />
                    </div>

                    <!-- GiftItems Ist -->
                    <div v-if="checkoutStore.allProducts.length < 1">
                        <GiftItemsSkeleton />
                    </div>
                    <div v-else>
                        <GiftItems :selectedBag="selectedBag" version="first" />
                    </div>
                </div>

            </div>

            <!-- Right Column -->
            <div>

                <!-- STEP 3: SELECT SUBSCRIPTION STATUS -->
                <div class="bg-white pt-4 lg:py-0 lg:pt-4 rounded-lg shadow lg:m-0 m-2">
                    <h2 class="px-4 text-lg font-bold border-b border-[#e7e7e7] pb-4 uppercase">
                        STEP 3: SELECT SUBSCRIPTION STATUS
                    </h2>
                    <Tabs />
                </div>

                <!-- STEP 4: PAYMENT METHOD -->
                <!-- <div class="bg-white px-4 py-4 lg:py-0 lg:pt-4 rounded-lg shadow lg:m-0 m-2 hidden"> -->
                <div class="bg-white px-4 py-4 lg:py-0 lg:pt-4 rounded-lg shadow lg:m-0 m-2">
                    <h2 class="text-lg font-bold border-b border-[#e7e7e7] pb-4 uppercase">
                        STEP 4: PAYMENT METHOD
                    </h2>

                    <!-- PayPal Method -->
                    <label
                        class="flex items-center justify-between pl-0 pt-4 pr-4 pb-4 lg:pt-6 lg:pr-6 lg:pb-6 border-b border-[#e7e7e7] cursor-pointer">
                        <div class="flex items-center space-x-3">
                            <input type="radio" name="paymentMethod" value="payPal" v-model="paymentMethod"
                                class="hidden" />
                            <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center border-[#172969] ml-3"
                                :class="{ 'bg-[#172969]': paymentMethod === 'payPal', 'bg-white': paymentMethod !== 'payPal' }">
                                <NuxtImg v-if="paymentMethod === 'payPal'" src="/images/whiteTick.svg" />
                            </div>
                            <NuxtImg src="/images/paypal.png" alt="PayPal" class="lg:h-8 h-6" />
                        </div>
                    </label>

                    <!-- Credit Card Method -->
                    <label
                        class="flex items-center justify-between pl-0 pt-4 pr-4 pb-4 lg:pt-6 lg:pr-6 lg:pb-6 cursor-pointer select-none">
                        <div class="flex items-center space-x-3">
                            <input type="radio" name="paymentMethod" value="creditCard" v-model="paymentMethod"
                                class="hidden" />
                            <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center border-[#172969] ml-3"
                                :class="{ 'bg-[#172969]': paymentMethod === 'creditCard', 'bg-white': paymentMethod !== 'creditCard' }">
                                <NuxtImg v-if="paymentMethod === 'creditCard'" src="/images/whiteTick.svg" />
                            </div>
                            <span class="text-gray-800 text-lg font-semibold">Credit Card</span>
                        </div>

                        <!-- Card Logos -->
                        <div class="flex lg:space-x-2 space-x-0">
                            <NuxtImg src="/images/payicons.svg" alt="cards-merchandise-icons" class="lg:h-10 h-6" />
                        </div>
                    </label>
                </div>

                <section v-if="paymentMethod === 'creditCard' || paymentMethod === 'payPal'" class="lg:m-0 m-2">

                    <form @submit.prevent="() => formSubmit()">

                        <!-- STEP 5: CONTACT INFORMATION -->
                        <!-- <div class="bg-white p-4 rounded-lg shadow mt-3 hidden"> -->
                        <div class="bg-white p-4 rounded-lg shadow mt-3">
                            <h2 class="text-lg font-bold border-b border-[#e7e7e7] pb-4 mb-1 uppercase">
                                STEP 5: CONTACT INFORMATION
                            </h2>

                            <div class="bg-white pt-4">
                                <div class="space-y-4">

                                    <!-- First Name -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input v-model="formFields.shipFirstName" name="shipFirstName" type="text"
                                                @input="validateField('shipFirstName', ($event.target as HTMLInputElement).value)"
                                                placeholder="First Name" :class="[
                                                    'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.shipFirstName ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500'
                                                ]" maxlength="16" />
                                            <p v-if="errors.shipFirstName" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.shipFirstName }}
                                            </p>
                                        </div>

                                        <!-- Last Name -->
                                        <div>
                                            <input v-model="formFields.shipLastName" name="shipLastName" type="text"
                                                @input="validateField('shipLastName', ($event.target as HTMLInputElement).value)"
                                                placeholder="Last Name" :class="[
                                                    'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.shipLastName ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500'
                                                ]" maxlength="16" />
                                            <p v-if="errors.shipLastName" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.shipLastName }}
                                            </p>
                                        </div>

                                    </div>

                                    <!-- Email -->
                                    <input v-model="formFields.email" name="email-address" type="email"
                                        placeholder="E-mail for order confirmation"
                                        @input="validateField('email', ($event.target as HTMLInputElement).value)"
                                        :class="[
                                            'w-full mb-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                            errors.email ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']"
                                        maxlength="70" />
                                    <p v-if="errors.email" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.email }}
                                    </p>

                                    <!-- Phone -->
                                    <div class="flex items-center justify-center gap-2 lg:gap-4 w-full mt-4 m-0">
                                        <div
                                            class="flex justify-center items-center gap-1 bg-white shadow-md lg:px-4 px-3 rounded-md h-[58px]">
                                            <NuxtImg src="/images/flag.png" alt="US Flag" class="lg:h-5 h-4 w-auto" />
                                            <p class="text-gray font-bold">+1</p>
                                        </div>

                                        <input v-model="formFields.phoneNumber" name="phoneNumber" type="tel"
                                            @input="validateField('phoneNumber', ($event.target as HTMLInputElement).value)"
                                            :placeholder="phonePlaceholder"
                                            :class="[
                                                'w-full mb-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                errors.phoneNumber ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']" maxlength="16" />
                                    </div>
                                    <p v-if="errors.phoneNumber" class="ml-22 md:ml-25 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.phoneNumber }}
                                    </p>

                                </div>
                            </div>
                        </div>

                        <!-- STEP 6: SHIPPING ADDRESS -->
                        <div v-if="paymentMethod === 'creditCard'" class="bg-white p-4 rounded-lg shadow mt-3">

                            <h2 class="text-lg font-bold border-b border-[#e7e7e7] pb-4 mb-4 uppercase">
                                STEP 6: SHIPPING ADDRESS
                            </h2>

                            <div class="space-y-4">

                                <!-- Shipping - Street Address -->
                                <input v-model="formFields.shipStreetAddress" name="shipStreetAddress" type="text"
                                    @input="validateField('shipStreetAddress', ($event.target as HTMLInputElement).value)"
                                    placeholder="Street Address"
                                    :class="[
                                        'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                        errors.shipStreetAddress ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']"
                                    maxlength="51" />
                                <p v-if="errors.shipStreetAddress" class="ml-2 mt-1 mb-0 text-sm text-[#e6193c]">
                                    {{ errors.shipStreetAddress }}
                                </p>

                                <!-- Shipping -  Apartment or Suite (Optional) -->
                                <input v-model="formFields.shipApptsAddress" name="shipApptsAddress" type="text"
                                    placeholder="Apartment or Suite (Optional)"
                                    :class="[
                                        'w-full mb-4 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                        errors.shipApptsAddress ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']" maxlength="51" />
                                <p v-if="errors.shipApptsAddress" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                    {{ errors.shipApptsAddress }}
                                </p>

                                <!-- Shipping - City -->
                                <input v-model="formFields.shipCity" name="shipCity" type="text" placeholder="City"
                                    @input="validateField('shipCity', ($event.target as HTMLInputElement).value)"
                                    :class="[
                                        'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                        errors.shipCity ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']"
                                    maxlength="16" />
                                <p v-if="errors.shipCity" class="ml-2 mt-1 mb-0 text-sm text-[#e6193c]">
                                    {{ errors.shipCity }}
                                </p>

                                <!-- Shipping - Country -->
                                <select v-model="formFields.shipCounty" name="shipCounty" @change="
                                    formStore.handleCountry(($event.target as HTMLInputElement).value, 'ship');
                                formStore.validateField('shipCounty', ($event.target as HTMLInputElement).value);"
                                    :class="['w-full mb-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                        errors.shipCounty ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                    <option value="">-- Choose Country --</option>
                                    <option v-for="country in checkoutStore.availableCountires"
                                        :value="country.countryCode">
                                        {{ country.countryName }}</option>
                                </select>
                                <p v-if="errors.shipCounty" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                    {{ errors.shipCounty }}
                                </p>

                                <!-- Shipping - States -->
                                <div class="mb-0 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <select v-model="formFields.shipState" name="shipState"
                                            @input="validateField('shipState', ($event.target as HTMLInputElement).value)"
                                            :class="[
                                                'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                errors.shipState ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <option value="">-- Choose State --</option>
                                            <option v-for="state in checkoutStore.selectedStates" :key="state.stateCode"
                                                :value="state.stateCode">
                                                {{ state.stateName }}
                                            </option>
                                        </select>
                                        <p v-if="errors.shipState" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                            {{ errors.shipState }}
                                        </p>
                                    </div>

                                    <!--  Shipping - Postal Code -->
                                    <div>
                                        <input v-model="formFields.shipPostalCode" name="shipPostalCode" type="text"
                                            @input="validateField('shipPostalCode', ($event.target as HTMLInputElement).value)"
                                            placeholder="Postal Code"
                                            :class="[
                                                'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                errors.shipPostalCode ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']"
                                            maxlength="11" />
                                        <p v-if="errors.shipPostalCode" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                            {{ errors.shipPostalCode }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Credit Card Number -->
                                <input v-model="formFields.creditCardNumber" name="creditCardNumber" type="text"
                                    @input="validateField('creditCardNumber', ($event.target as HTMLInputElement).value)"
                                    placeholder="Credit Card Number"
                                    :class="[
                                        'w-full m-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                        errors.creditCardNumber ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']" maxlength="16">
                                <p v-if="errors.creditCardNumber" class="ml-2 mt-1 mb-0 text-sm text-[#e6193c]">
                                    {{ errors.creditCardNumber }}
                                </p>

                                <!-- Security Code (3-4 Digits) -->
                                <input v-model="formFields.cardCVV" name="cardCVV" type="text"
                                    @input="validateField('cardCVV', ($event.target as HTMLInputElement).value)"
                                    placeholder="Security Code (3-4 Digits)"
                                    :class="[
                                        'w-full m-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',

                                        errors.cardCVV ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']" maxlength="4" />
                                <p v-if="errors.cardCVV" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                    {{ errors.cardCVV }}
                                </p>

                                <!-- Card Expiry Month -->
                                <div class="mb-0 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <select v-model="formFields.expiryMonth" name="expiryMonth"
                                            @input="validateField('expiryMonth', ($event.target as HTMLInputElement).value)"
                                            :class="[
                                                'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                errors.expiryMonth ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <option value="">Card Month</option>
                                            <option v-for="month in cardExpiryMonths" :key=month.code :value=month.code>
                                                {{ month.name }}
                                            </option>
                                        </select>
                                        <p v-if="errors.expiryMonth" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                            {{ errors.expiryMonth }}
                                        </p>
                                    </div>

                                    <!-- Card Expiry Year -->
                                    <div>
                                        <select v-model="formFields.expiryYear" name="expiryYear"
                                            @input="validateField('expiryYear', ($event.target as HTMLInputElement).value)"
                                            :class="[
                                                'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                errors.expiryYear ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <option value="">Expiry Year</option>
                                            <option v-for="year in cardExpiryYears" :key="year.value" :value=year.value>
                                                {{ year.name }}
                                            </option>
                                        </select>
                                        <p v-if="errors.expiryYear" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                            {{ errors.expiryYear }}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- STEP 7: BILLING ADDRESS -->
                        <div v-if="paymentMethod === 'creditCard'" class="bg-white p-4 rounded-lg shadow mt-3">
                            <h2 class="d-block text-[18px] font-bold border-b border-[#e7e7e7] pb-4 mb-3 uppercase">
                                STEP 7: BILLING ADDRESS
                            </h2>

                            <!-- Option: Same as shipping address -->
                            <div class="flex items-center justify-between pb-4 ">
                                <div class="flex items-center space-x-3">
                                    <div @click="() => handleBillSame(true)"
                                        class="w-6 h-6 border-2 rounded-full flex items-center justify-center border-[#172969] cursor-pointer"
                                        :class="{ 'bg-[#172969]': formStore.sameBilling }">
                                        <NuxtImg v-if="formStore.sameBilling" src="/images/whiteTick.svg"
                                            alt="white-tick" />
                                    </div>
                                    <span class="cursor-pointer select-none" @click="() => handleBillSame(true)">
                                        Same as shipping address</span>
                                </div>
                            </div>

                            <!-- Option: Use a different billing address -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div @click="() => handleBillSame(false)"
                                        class="w-6 h-6 border-2 rounded-full flex items-center justify-center border-[#172969] cursor-pointer"
                                        :class="{ 'bg-[#172969]': !formStore.sameBilling }">
                                        <NuxtImg v-if="!formStore.sameBilling" src="/images/whiteTick.svg"
                                            alt="white-tick" />
                                    </div>
                                    <span @click="() => handleBillSame(false)" class="cursor-pointer select-none">
                                        Use a different billing address</span>
                                </div>
                            </div>

                            <Transition name="sameName">
                                <div v-if="!formStore.sameBilling" class="space-y-4 mt-5">
                                    <!-- Billing - First Name -->
                                    <div class="mb-0 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <input v-model="formFields.billingFirstName" name="billingFirstName"
                                                type="text"
                                                @input="validateField('billingFirstName', ($event.target as HTMLInputElement).value)"
                                                placeholder="First Name" maxlength="12"
                                                :class="[
                                                    'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.billingFirstName ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <span v-if="errors.billingFirstName"
                                                class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.billingFirstName }}
                                            </span>
                                        </div>

                                        <!-- Billing - Last Name -->
                                        <div>
                                            <input v-model="formFields.billingLastName" name="billingLastName"
                                                type="text"
                                                @input="validateField('billingLastName', ($event.target as HTMLInputElement).value)"
                                                placeholder="Last Name" maxlength="12"
                                                :class="[
                                                    'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.billingLastName ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <span v-if="errors.billingLastName"
                                                class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.billingLastName }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Billing - Street Address -->
                                    <input v-model="formFields.billingStreetAddress" name="billingStreetAddress"
                                        type="text"
                                        @input="validateField('billingStreetAddress', ($event.target as HTMLInputElement).value)"
                                        placeholder="Street Address" maxlength="50"
                                        :class="[
                                            'w-full mb-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                            errors.billingStreetAddress ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                    <span v-if="errors.billingStreetAddress" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.billingStreetAddress }}
                                    </span>

                                    <!-- Billing - Apartment or Suite (Optional) -->
                                    <input v-model="formFields.billingApptsAddress" name="billingApptsAddress"
                                        type="text" placeholder="Apartment or Suite (Optional)" maxlength="50"
                                        :class="[
                                            'w-full mb-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                            errors.billingApptsAddress ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                    <span v-if="errors.billingApptsAddress" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.billingApptsAddress }}
                                    </span>

                                    <!-- Billing - City -->
                                    <input v-model="formFields.billingCity" name="billingCity" type="text"
                                        @input="validateField('billingCity', ($event.target as HTMLInputElement).value)"
                                        placeholder="City" maxlength="20"
                                        :class="[
                                            'w-full mb-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                            errors.billingCity ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                    <span v-if="errors.billingCity" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.billingCity }}
                                    </span>

                                    <!-- Billing - Country -->
                                    <select v-model="formFields.billingCounty" name="billingCounty"
                                        @input="formStore.handleCountry(($event.target as HTMLInputElement).value, 'bill')"
                                        :class="[
                                            'w-full mb-0 mt-4 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                            errors.billingCounty ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                        <option value="">-- Choose Country --</option>
                                        <option v-for="country in checkoutStore.availableCountires"
                                            :value="country.countryCode">{{ country.countryName }}</option>
                                    </select>
                                    <span v-if="errors.billingCounty" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                        {{ errors.billingCounty }}
                                    </span>

                                    <!-- Billing - States -->
                                    <div class="mb-0 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <select v-model="formFields.billingState" name="billingState"
                                                @input="validateField('billingState', ($event.target as HTMLInputElement).value)"
                                                :class="[
                                                    'w-full p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.billingState ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                                <option value="">-- Choose State --</option>
                                                <option v-for="state in checkoutStore.selectedStatesBill"
                                                    :key="state.stateCode" :value="state.stateCode">
                                                    {{ state.stateName }}
                                                </option>
                                            </select>
                                            <span v-if="errors.billingState" class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.billingState }}
                                            </span>
                                        </div>

                                        <!-- Billing - Postal Code -->
                                        <div>
                                            <input v-model="formFields.billingPostalCode" name="billingPostalCode"
                                                @input="validateField('billingPostalCode', ($event.target as HTMLInputElement).value)"
                                                type="text" placeholder="Postal Code" maxlength="9"
                                                :class="[
                                                    'w-full m-0 p-3 rounded-md h-[60px] bg-gray-100 focus:outline-none focus:ring-2',
                                                    errors.billingPostalCode ? 'border border-red-500 ring-[#e6193c]' : 'focus:ring-blue-500']">
                                            <span v-if="errors.billingPostalCode"
                                                class="ml-2 mt-1 text-sm text-[#e6193c]">
                                                {{ errors.billingPostalCode }}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- ORDER SUMMARY -->
                        <div class="bg-white p-4 rounded-lg shadow mt-3">
                            <h2 class="text-lg font-bold mt-0 border-b border-[#e7e7e7] pb-4 mb-4 uppercase">
                                {{ paymentMethod === 'payPal' ? 'STEP 6' : 'STEP 8' }}: ORDER SUMMARY
                            </h2>

                            <!-- Yumzy Order Protection -->
                            <div @click="checkoutStore.addExtraProduct"
                                class="bg-[#f5f5f5] border border-[#e0e0e0] rounded-lg shadow-sm p-2 space-y-2 lg:pb-2 pb-2  text-center hover:border-[#323232]  transition-all duration-[400ms] cursor-pointer select-none">

                                <!-- Icon at top -->
                                <div class="flex justify-center">
                                    <NuxtImg src="/images/safety.png" class="h-10 lg:h-14" alt="safety.png-Img" />
                                </div>

                                <div class="flex flex-col items-center w-full">
                                    <p class="font-bold text-gray-900 text-sm lg:text-lg text-center">
                                        Yumzy Order Protection
                                    </p>

                                    <div class="flex items-center cursor-pointer w-fit mt-1">
                                        <!-- Circle with tick -->
                                        <div :class="['w-4 h-4 md:w-6 md:h-6 border-2 border-[#172969] shrink-0 rounded-full flex items-center justify-center',
                                            checkoutStore.cartData.length > 1 ? 'bg-[#172969]' : 'bg-transparent']">
                                            <NuxtImg v-if="checkoutStore.cartData.length > 1"
                                                src="/images/whiteTick.svg" alt="white-tick" />
                                        </div>
                                        <span class="font-semibold py-1 rounded-lg lg:text-base text-xs lg:ms-2 ms-1">
                                            Yes, I want shipping insurance for $2.89
                                        </span>
                                    </div>
                                </div>

                                <!-- Description -->
                                <p class="text-gray-700 text-xs lg:text-sm">
                                    <span class="block"> If anything happens to your order, we'll</span>
                                    immediately ship another at no extra cost.
                                </p>
                            </div>

                            <!-- Product Section -->
                            <div class="w-full pt-6 space-y-6">
                                <!-- Main Product Section -->
                                <div name="product-details">
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="flex items-center space-x-2">
                                            <p class="text-800 text-lg font-bold">Product</p>
                                        </div>
                                        <p class="text-gray-800 text-lg font-bold">Price</p>
                                    </div>

                                    <div v-if="checkoutStore.cartData.length < 1">
                                        <SkeletonCartItemsPreview />
                                    </div>

                                    <!-- Display up to 2 cart items -->
                                    <div v-else v-for="(item, index) in checkoutStore.cartData.slice(0, 2)"
                                        :key="item.productId"
                                        class="flex justify-between items-start mb-2 pt-2 first:pt-0">

                                        <div class="flex items-start space-x-4">
                                            <NuxtImg
                                                :src="index === 1 ? '/images/order-protection.png' : item.productImage"
                                                alt="Product Image"
                                                class="lg:w-18 lg:h-18 w-15 h-15 object-contain border rounded" />
                                            <div>
                                                <h3 class="font-semibold text-gray-900">{{ index === 0 ?
                                                    item.ProductVariantName
                                                    : item.productName }}</h3>
                                                <span v-if="index === 0"
                                                    class="inline-block mt-1 text-sm px-2 py-0.5 rounded-full font-semibold"
                                                    :class="index === 0 ? 'bg-gray-700 text-white' : ''">
                                                    {{ item.BagsQty }}
                                                </span>
                                            </div>
                                        </div>

                                        <div v-if="index === 0" class="text-right">
                                            <div class="flex gap-1.5 lg:gap-3 items-baseline">
                                                <p class="text-sm text-red-500 line-through font-bold">
                                                    ${{ item.compareAtPrice }}
                                                </p>
                                                <p class="text-gray-900 font-bold"> ${{
                                                    (checkoutStore.oneTimeBagPrice(item, 'productPrice')).toFixed(2) }}
                                                </p>
                                            </div>

                                            <p class="text-green-600 font-bold mt-1">
                                                {{ checkoutStore.activeTab === 'subscribe' ? item.percentageOff :
                                                    checkoutStore.oneTimePercentageOff(checkoutStore.cartData[0]?.compareAtPrice!,
                                                        checkoutStore.cartData[0]?.productPrice!) }}% off</p>
                                        </div>

                                        <div v-else>
                                            <p class="text-gray-900 font-bold">${{ item.productPrice }}</p>
                                        </div>
                                    </div>

                                    <!-- Shipping Section -->
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="flex items-center space-x-2">
                                            <p class="text-lg font-semibold text-gray-800">Shipping Price</p>
                                        </div>
                                        <div v-if="checkoutStore.allProducts.length > 1">
                                            <div v-if="selectedBag === 1 || checkoutStore.activeTab === 'onetime'">
                                                <span class="text-md font-bold">
                                                    ${{ checkoutStore.shipProfiles[0]?.shipPrice }}
                                                </span>
                                            </div>
                                            <div v-else class="flex gap-1">
                                                <span class="text-md font-semibold line-through text-red-500">
                                                    ${{ checkoutStore.shipProfiles[0]?.shipPrice }}
                                                </span>
                                                <span class="text-md font-semibold text-green-600">{{
                                                    checkoutStore.shipProfiles[1]?.profileName.split(" ")[0] }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- GiftItems II -->
                                    <div v-if="checkoutStore.allProducts.length < 1">
                                        <GiftItemsSkeleton />
                                    </div>
                                    <div v-else>
                                        <GiftItems :selectedBag="selectedBag" version="second" />
                                    </div>

                                    <!-- Total Section -->
                                    <div
                                        class="bg-gray-100 px-4 py-3 rounded-lg flex justify-between items-center mb-2 mt-2">
                                        <div>
                                            <p class="text-gray font-bold">Total:
                                                <span class="text-sm">Before Taxes</span>
                                            </p>
                                        </div>

                                        <div class="flex gap-3 items-baseline font-bold">
                                            <!-- final price -->
                                            <span class="font-bold text-gray-900 text-lg">
                                                ${{ checkoutStore.calculateTotalPrice.toFixed(2) }}
                                            </span>

                                            <!-- CompareAt price -->
                                            <span v-if="selectedBag !== 1"
                                                class="text-md font-bold text-white line-through bg-[#c91f3f] px-2 py-1 rounded-2xl">
                                                ${{ calculateComparePrice() }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Terms and condition -->
                                    <p class="text-center text-[0.9rem] font-medium mt-3" v-html="termsHtml" />

                                </div>

                                <!-- Checkout Button -->
                                <button type="submit" v-if="!formStore.transactionStatus"
                                    :class="['w-full mb-1 flex justify-center items-center py-4 rounded-lg cursor-pointer text-pixel', paymentMethod === 'payPal' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-[#1ab22c] hover:bg-[#169924] text-white text-2xl']">
                                    {{ paymentMethod === 'payPal' ? 'CHECKOUT WITH' : 'COMPLETE PURCHASE' }}
                                    <NuxtImg v-if="paymentMethod === 'payPal'"
                                        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png"
                                        alt="PayPal" class="h-6 ml-2" />
                                </button>

                                <!-- Loader -->
                                <div name="loader" v-if="formStore.transactionStatus"
                                    :class="['w-full flex justify-center items-center rounded-lg cursor-pointer text-pixel', paymentMethod === 'creditCard' ? 'bg-[#1ab22c] hover:bg-[#169924]' : 'bg-yellow-500 hover:bg-yellow-600']">
                                    <NuxtImg class="w-12 h-12 my-1" src="/images/loader.svg" alt="loader.svg" />
                                </div>

                                <p v-if="formStore.hasEmptyFields && formStore.hasAttemptedSubmit"
                                    class="ml-2 mb-0 text-red-600 font-semibold text-center">
                                    Please fill in the required fields above
                                </p>

                                <!-- Guarantee Section -->
                                <div class="mt-4 lg:mt-6 mb-4 flex flex-col sm:flex-row items-center lg:justify-center">
                                    <NuxtImg src="/images/guarantee.png" alt="guarantee.png" width="98" height="100"
                                        class="mb-3 sm:mb-0 sm:mr-3 flex-shrink-0 mt-1" />

                                    <p class="text-gray-700 leading-[1.2] text-center sm:text-left">
                                        <span v-for="(item, index) in guaranteeData" :key=index class="block lg:inline"
                                            v-html="item"></span>
                                    </p>
                                </div>

                                <!-- Reviews - Desktop Screen -->
                                <Reviews v-if="!isMobile" />
                            </div>
                        </div>
                    </form>
                    <!-- Reviews - Mobile Screen -->
                    <Reviews v-if="isMobile" class="bg-white p-3 rounded-lg shadow mt-3" />
                </section>

            </div>
        </div>

        <!-- FAQs section -->
        <Faq />
    </main>

    <!-- Footer section -->
    <Footer />
</template>