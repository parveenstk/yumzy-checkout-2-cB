<script setup lang="ts">
import { ref } from 'vue';
import { UpsellsfbCAPI } from '~/composables/common';
import { upsellUrls } from '~/composables/data';
import { useUpsellsDataLayer } from '~/composables/useGtm.client';
import { useCheckoutStore } from '~~/stores';

// Meta tag details (for SEO/metadata)
metaData("Upsell-2 | Yumzy", "Grab limited time offer.");

// checkout Store
const checkoutStore = useCheckoutStore();
checkoutStore.setPageType('upsellPage2');
const config = env();
const router = useRouter();
const checkPixel = router.options.history.state;

onMounted(() => {

    // check stetps affter successfull order
    checkSteps();

    if (checkPixel.from && checkPixel.from == 'importupsell') {
        UpsellsfbCAPI(checkPixel.datalayerobj);
        // UpsellsfbCAPIAPI(checkPixel.datalayerobj);
        useUpsellsDataLayer(checkPixel.datalayerobj);
        window.history.replaceState({}, '', window.location.pathname + window.location.search)
    }

    // Import Click
    importClick();
})

// Upsell/Downsell pop-up
const isUpsellOpen = ref(false);
const selectedVariantId = ref(config.upsell2VariantIds[1]); // Default to 2 bags option

const productDetails: any = ref({
    productId: env().offer2,
    productQty: 1,
    productPrice: "",
    variantDetailId: selectedVariantId.value,
    pageTo: "/thankyou",
    event: "Upsell2cv"
});

const callImportUpsell = () => {
    productDetails.value.productId = env().offer2;
    productDetails.value.variantDetailId = selectedVariantId.value;
    return importUpsell(productDetails.value);
};

</script>

<template>
    <section class="upsell bg-[#ffeef1] py-2 px-3 lg:p-4">
        <div class="container max-w-[1120px] mx-auto lg:px-3">
            <div
                class="border shadow-[0px_2px_10px_rgb(204,204,204)] rounded-[10px] border-gray-300 bg-white lg:py-[3rem] py-3 lg:px-[7.5rem] md:px-5 px-1">
                <div class="mx-auto text-center relative">
                    <NuxtImg src="/images/logo.png" alt="logo.png-Img"
                        class="lg:mb-3 mb-2 mx-auto lg:w-[200px] w-[20%]" />
                    <h2
                        class="bg-[#d92730] text-white mx-auto lg:w-[60%] w-[100%] py-1 lg:my-4 text-[calc(4vw-0px)] lg:text-[20px] lg:leading-[28px] font-bold text-center">
                        WAIT - DON'T GO YET!
                    </h2>

                    <h1
                        class="mt-2 lg:mt-4 text-[calc(6.5vw-0px)] md:text-[calc(5vw-0px)] lg:text-[42px] leading-[calc(.9em+1vw)] md:leading-[calc(.9em+1vw)] lg:leading-[46px] extrablod">
                        <span>Take advantage of</span>
                        <br>
                        <span>the SPECIAL OFFER below!</span>
                    </h1>

                    <!-- Video Content -->
                    <UpsellVideoContent :desktopUrl="upsellUrls.upsell2.deskotp"
                        :mobileUrl="upsellUrls.upsell2.mobile" />

                    <div class="px-[10px] mb-5">
                        <select v-model="selectedVariantId"
                            class="block w-full lg:max-w-[400px] mx-auto font-extrabold rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 text-lg shadow-sm focus:border-[#1EB9F0] focus:ring focus:ring-[#1EB9F0]/30 focus:outline-none transition">
                            <option :value="config.upsell2VariantIds[0]">1 bag — $34</option>
                            <option :value="config.upsell2VariantIds[1]">2 bags — $31 Each</option>
                            <option :value="config.upsell2VariantIds[2]">3 bags — $29 Each</option>
                        </select>

                    </div>
                    <div>
                        <div @click="() => callImportUpsell()" v-if="!checkoutStore.transactionStatus"
                            class="relative inline-block mx-auto lg:w-fit w-[80%] rounded-full bg-[#1EB9F0] anim_btn cursor-pointer">
                            <span
                                class="relative block text-[#1EB9F0] bg-white border-1 border-[#1EB9F0] rounded-full py-[12px] lg:px-[40px] px-[20px] text-[calc(5vw-0px)] md:text-[calc(3vw-0px)] lg:text-2xl leading-[calc(1em+1vw)] extrablod translate-x-[-4px] translate-y-[-4px] transition-transform duration-250 hover:translate-x-[-7px] hover:translate-y-[-6px]">
                                Yes, Send This Deal
                            </span>
                        </div>

                        <!-- Loader -->
                        <div name="loader" v-if="checkoutStore.transactionStatus"
                            class="lg:mt-5 mt-6.5 bg-[#1EB9F0] py-[12px] px-[40px] md:w-[70%] lg:w-[40%] w-[80%] mx-auto flex justify-center items-center rounded-full cursor-pointer text-pixel">
                            <NuxtImg
                                class="w-12 h-[calc(5vw-0px)] md:h-[calc(3.5vw-0px)] lg:h-[calc(3.5vw-0px)] xl:h-[calc(2.65vw-0px)]"
                                src="/images/loader.svg" alt="loader.svg" />
                        </div>
                    </div>

                    <button @click="isUpsellOpen = true"
                        class="text-black text-md font-bold underline mt-2 cursor-pointer">
                        No thanks, I don't want this exclusive 1-time offer.
                    </button>

                    <div class="logo max-w-[200px] mx-auto mt-8">
                        <NuxtImg src="/images/ssl.webp" alt="ssl.webp-Img" />
                    </div>
                </div>

                <!-- Upsell PopUp2 -->
                <UpsellPopUp2 v-if="isUpsellOpen" @close="isUpsellOpen = false" />
            </div>

            <footer class="mx-auto text-center mt-10 pb-10">
                <p class="text-[12px] text-black font-bold">Copyright 2025 - Yumzy - All Rights Reserved</p>
                <NuxtImg src="/images/dmca-badge.png" alt="dmca-badge.png-Img"
                    class="mx-auto lg:mb-3 mt-2 lg:max-w-[200px] w-1/3 md:w-1/4" />
            </footer>
        </div>
    </section>
    <Alert />
</template>

<style scoped>
.anim_btn {
    animation: pulsse 1s ease infinite;
}

@keyframes pulsse {

    0%,
    100% {
        transform: scale(.9);
    }

    50% {
        transform: scale(1);
    }
}
</style>