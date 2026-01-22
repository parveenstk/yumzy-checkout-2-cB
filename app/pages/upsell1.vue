<script setup lang="ts">
import { fbCAPI } from '~/composables/common';
import { upsellUrls } from '~/composables/data';
import { useOrderDataLayer } from '~/composables/useGtm.client';
import { useCheckoutStore } from '~~/stores';

// meta tag details
useHead({
    title: "Upsell-1 | Yumzy",
    meta: [
        { name: 'description', content: "Grab limited time offer." },
    ],
})

// checkout Store
const checkoutStore = useCheckoutStore();
checkoutStore.setPageType('upsellPage1');
const router = useRouter();
const checkPixel = router.options.history.state

const productDetails: any = ref({
    productId: env().offer1,
    productQty: 1,
    productPrice: "9.99",
    variantDetailId: "",
    pageTo: "/upsell2",
    event: "Upsell1cv"
});

onMounted(() => {

    // check stetps affter successfull order
    checkSteps();

    if (checkPixel.from && checkPixel.from == 'importorder') {
        fbCAPI("Purchase");
        fbCAPIAPI("Purchase");
        useOrderDataLayer("Purchase");
        window.history.replaceState({}, '', window.location.pathname + window.location.search)
    }

    // Import Click
    importClick();
})

// Upsell / Downsell pop-Up
const isUpsellOpen = ref(false)
</script>

<template>
    <section class="upsell bg-[#ffeef1] py-2 px-3 lg:p-4">
        <div class="container max-w-[1120px] mx-auto px-3">
            <div
                class="border shadow-[0px_2px_10px_rgb(204,204,204)] rounded-[10px] border-gray-300 bg-white lg:py-[3rem] py-3 lg:px-[7.5rem] md:px-5 px-1">
                <div class="mx-auto text-center relative">
                    <NuxtImg src="/images/logo.png" alt="logo.png-Img"
                        class="lg:mb-3 mb-2 mx-auto lg:w-[200px] w-[20%]" />
                    <h2
                        class="bg-[#d92730] text-white mx-auto lg:w-[60%] w-[100%] py-1 lg:my-4 text-[calc(4vw-0px)] lg:text-[20px] lg:leading-[28px] font-bold text-center">

                        DON’T GO - SPECIAL OFFER BELOW!
                    </h2>
                    <h1
                        class="mt-2 lg:mt-4 text-[calc(7vw-0px)] md:text-[calc(5vw-0px)] lg:text-[42px] leading-[calc(.9em+1vw)] md:leading-[calc(.7em+1vw)] lg:leading-[46px] extrablod">
                        Get EXPEDITED Shipping
                    </h1>

                    <h2
                        class="mt-2 lg:text-[calc(1.5vw-0px)] text-[calc(4vw-0px)] md:text-[calc(3vw-0px)] leading-[calc(.9em+1vw)] lg:leading-[calc(.5em+1vw)] text-black font-extrabold">
                        Guarantees your shipment <br> arrives in 2 days or less for only $9.99! </h2>

                    <!-- Video Content -->
                    <UpsellVideoContent :thumbnailDesktop="upsellUrls.upsell1.thumbnailDesktop"
                        :desktopUrl="upsellUrls.upsell1.deskotp" :thumbnailMobile="upsellUrls.upsell1.thumbnailMobile"
                        :mobileUrl="upsellUrls.upsell1.mobile" />

                    <div class="arrow relative">
                        <NuxtImg src="/images/blue-arrow.png" alt="blue-arrow.png-Img"
                            class="absolute right-5 md:right-20 top-0 translate-y-[-75%] max-h-[100px] md:max-h-[150px] z-10" />
                    </div>

                    <!-- Desktop -->
                    <div @click="() => importUpsell(productDetails)" v-if="!checkoutStore.transactionStatus"
                        class="relative md:inline-block hidden lg:mt-5 mx-auto w-fit rounded-full bg-[#1EB9F0]">
                        <span
                            class="cursor-pointer relative block text-[#1EB9F0] bg-white border-1 border-[#1EB9F0] rounded-full py-[12px] px-[40px] text-[calc(5vw-0px)] md:text-[calc(3vw-0px)] lg:text-[calc(1.5vw-0px)] lg:leading-[calc(1em+1vw)] leading-[calc(1.5em+1vw)] extrablod translate-x-[-4px] translate-y-[-4px] transition-transform duration-250 hover:translate-x-[-7px] hover:translate-y-[-6px]">
                            Yes, Expedite My Order
                        </span>
                    </div>

                    <!-- Mobile -->
                    <div @click="() => importUpsell(productDetails)" v-if="!checkoutStore.transactionStatus"
                        class="md:hidden relative inline-block lg:mt-5 mx-auto lg:w-fit md:w-[60%] w-[80%] rounded-full bg-[#1EB9F0]">
                        <span
                            class="relative block text-[#1EB9F0] bg-white border-1 border-[#1EB9F0] rounded-full py-[12px] lg:px-[40px] px-[20px] text-[calc(6.5vw-0px)] md:text-[calc(5vw-0px)] leading-[calc(1em+1vw)] extrablod translate-x-[-4px] translate-y-[-4px] transition-transform duration-250 hover:translate-x-[-7px] hover:translate-y-[-6px]">
                            Yes, Expedite <br /> My Order
                        </span>
                    </div>

                    <!-- Loader -->
                    <div name="loader" v-if="checkoutStore.transactionStatus"
                        class="lg:mt-9 mt-6.5 bg-[#1EB9F0] py-[12px] px-[40px] md:w-[50%] lg:w-[40%] w-[80%] mx-auto flex justify-center items-center rounded-full cursor-pointer text-pixel">
                        <NuxtImg
                            class="w-12 h-[calc(15vw-0px)] md:h-[calc(5.5vw-0px)] lg:h-[calc(3.5vw-0px)] xl:h-[calc(3.15vw-0px)]"
                            src="/images/loader.svg" alt="loader.svg" />
                    </div>

                    <button @click="isUpsellOpen = true"
                        class="popup text-black text-lg font-bold underline mt-2 cursor-pointer">
                        No thanks, I don't want expedited shipping or shipping insurance.
                    </button>

                    <footer class="mt-12">
                        <NuxtImg src="/images/ssl.webp" alt="ssl.webp-Img"
                            class="w-[70%] lg:w-[30%] mb-[10px] mx-auto" />
                        <div class="safety flex justify-center flex-wrap lg:flex-nowrap">
                            <NuxtImg src="/images/guarantee.png" class="w-25 h-25 mx-auto lg:mr-5" />
                            <div class="cont text-[12px] font-bold">
                                <p class="hidden lg:block">
                                    Expedited shipping and shipping insurance for contiguous U.S. only. <br>
                                    Yumzy 90-day PICKY MOMZ 200% HAPPINESS GUARANTEE:
                                </p>

                                <p class="block lg:hidden">
                                    Expedited shipping and shipping insurance <br>
                                    for contiguous U.S. only. <br>
                                    Yumzy 90-day PICKY MOMZ <br>
                                    200% HAPPINESS GUARANTEE: <br>
                                </p>

                                <p>
                                    If you’re not absolutely thrilled with Yumzy, just contact us within 90 days of
                                    receipt of your order. We'll refund double what you paid. For more details,
                                    contact
                                    Yumzy Customer Experience Team at the email below. Isn't it time your family
                                    leveled
                                    up its nutrition and wellness?
                                </p>
                                <p class="mt-3 text-[12px] font-bold">Copyright 2025 © support@Yumzy.com</p>
                            </div>
                        </div>
                    </footer>
                </div>

                <!-- Upsell PopUp -->
                <UpsellPopUp v-if="isUpsellOpen" @close="isUpsellOpen = false" />
            </div>
        </div>
    </section>
    <Alert />
</template>